process.env.PLATFORM_DB_PATH = new URL("./data/auth.security.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, loginTeacher, authFetch } from "./testHelpers.js";

const TEST_DB = fileURLToPath(new URL("./data/auth.security.test.db", import.meta.url));
const STUDENT_A_NID = "1165814631";
const STUDENT_B_NID = "1167676921";
const STUDENT_A = "stu-1165814631";
const STUDENT_B = "stu-1167676921";
const TEACHER_NID = "2297033843";
const TEACHER_PASSWORD = "babamama";

describe("server auth / IDOR protection", () => {
  let baseUrl;
  let server;
  let cookieA;
  let cookieB;
  let cookieTeacher;

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

    cookieA = (await loginStudent(baseUrl, STUDENT_A_NID)).cookie;
    cookieB = (await loginStudent(baseUrl, STUDENT_B_NID)).cookie;
    cookieTeacher = (await loginTeacher(baseUrl, TEACHER_NID, TEACHER_PASSWORD)).cookie;
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    resetDatabaseForTests();
    for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
    delete process.env.PLATFORM_DB_PATH;
  });

  it("student A cannot read progress of student B (403)", async () => {
    const res = await authFetch(baseUrl, `/api/progress/${STUDENT_B}`, { cookie: cookieA });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("student cannot forge studentId in progress sync (uses session only)", async () => {
    const save = await authFetch(baseUrl, "/api/lesson/progress", {
      cookie: cookieA,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: STUDENT_B,
        lessonId: "idor-test",
        sectionId: "main",
        progress: { forged: true },
        completed: false,
      }),
    });
    expect(save.ok).toBe(true);

    const getB = await authFetch(baseUrl, `/api/progress/${STUDENT_B}`, { cookie: cookieB });
    const dataB = await getB.json();
    expect(dataB.lessons?.find((l) => l.lessonId === "idor-test")).toBeUndefined();

    const getA = await authFetch(baseUrl, `/api/progress/${STUDENT_A}`, { cookie: cookieA });
    const dataA = await getA.json();
    expect(dataA.lessons?.find((l) => l.lessonId === "idor-test")?.progress?.forged).toBe(true);
  });

  it("student cannot call teacher lesson summary (403)", async () => {
    const res = await authFetch(baseUrl, "/api/lesson/summary", { cookie: cookieA });
    expect(res.status).toBe(403);
  });

  it("unauthenticated user cannot save progress (401)", async () => {
    const res = await authFetch(baseUrl, "/api/progress/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: {} }),
    });
    expect(res.status).toBe(401);
  });

  it("unauthenticated user cannot record lesson attempt (401)", async () => {
    const res = await authFetch(baseUrl, "/api/lesson/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "x", exerciseId: "y", answer: "z", correct: false }),
    });
    expect(res.status).toBe(401);
  });

  it("teacher can access roster student progress", async () => {
    await authFetch(baseUrl, "/api/lesson/progress", {
      cookie: cookieA,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "teacher-view-test",
        sectionId: "main",
        progress: { score: 1 },
        completed: true,
      }),
    });

    const res = await authFetch(baseUrl, `/api/progress/${STUDENT_A}`, { cookie: cookieTeacher });
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.lessons?.find((l) => l.lessonId === "teacher-view-test")?.completed).toBe(true);
  });

  it("teacher cannot access unknown student id (403)", async () => {
    const res = await authFetch(baseUrl, "/api/progress/stu-0000000000", { cookie: cookieTeacher });
    expect(res.status).toBe(403);
  });

  it("teacher summary requires auth (401 without session)", async () => {
    const res = await authFetch(baseUrl, "/api/lesson/summary");
    expect(res.status).toBe(401);
  });
});
