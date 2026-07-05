process.env.PLATFORM_DB_PATH = new URL("./data/auth.security.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, loginTeacher, authFetch } from "./testHelpers.js";

const TEST_DB = fileURLToPath(new URL("./data/auth.security.test.db", import.meta.url));
const STUDENT_A = "stu-1165814631";
const STUDENT_B = "stu-1167676921";

describe("server auth / IDOR protection", () => {
  let baseUrl;
  let server;
  let authA;
  let authB;
  let authTeacher;

  beforeAll(async () => {
    for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
    resetDatabaseForTests();
    const app = createApp();
    await prepareApp(app);
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;

    authA = await loginStudent(baseUrl, "1165814631");
    authB = await loginStudent(baseUrl, "1167676921");
    authTeacher = await loginTeacher(baseUrl, "2297033843", "babamama");
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    resetDatabaseForTests();
    delete process.env.PLATFORM_DB_PATH;
  });

  it("student A cannot read progress of student B (403)", async () => {
    const res = await authFetch(baseUrl, `/api/progress/${STUDENT_B}`, { cookie: authA.cookie });
    expect(res.status).toBe(403);
  });

  it("student cannot forge studentId in progress sync (uses session only)", async () => {
    await authFetch(baseUrl, "/api/lesson/progress", {
      cookie: authA.cookie,
      csrf: authA.csrf,
      method: "POST",
      body: JSON.stringify({
        studentId: STUDENT_B,
        lessonId: "idor-test",
        sectionId: "main",
        progress: { forged: true },
        completed: false,
      }),
    });

    const dataB = await (await authFetch(baseUrl, `/api/progress/${STUDENT_B}`, { cookie: authB.cookie })).json();
    expect(dataB.lessons?.find((l) => l.lessonId === "idor-test")).toBeUndefined();

    const dataA = await (await authFetch(baseUrl, `/api/progress/${STUDENT_A}`, { cookie: authA.cookie })).json();
    expect(dataA.lessons?.find((l) => l.lessonId === "idor-test")?.progress?.forged).toBe(true);
  });

  it("student cannot call teacher lesson summary (403)", async () => {
    const res = await authFetch(baseUrl, "/api/lesson/summary", { cookie: authA.cookie, csrf: authA.csrf });
    expect(res.status).toBe(403);
  });

  it("unauthenticated user cannot save progress (401)", async () => {
    const res = await authFetch(baseUrl, "/api/progress/sync", {
      method: "POST",
      body: JSON.stringify({ progress: {} }),
    });
    expect(res.status).toBe(401);
  });

  it("teacher cannot access unknown student id (403)", async () => {
    const res = await authFetch(baseUrl, "/api/progress/stu-0000000000", { cookie: authTeacher.cookie });
    expect(res.status).toBe(403);
  });
});
