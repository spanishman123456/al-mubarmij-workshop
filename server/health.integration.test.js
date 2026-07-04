process.env.PLATFORM_DB_PATH = new URL("./data/platform.integration.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp, getGitCommit } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, loginTeacher, authFetch } from "./testHelpers.js";

const TEST_DB = fileURLToPath(new URL("./data/platform.integration.test.db", import.meta.url));
const STUDENT_A_NID = "1165814631";
const STUDENT_B_NID = "1167676921";
const STUDENT_A = "stu-1165814631";
const STUDENT_B = "stu-1167676921";
const TEACHER_PASSWORD = "babamama";

describe("API health + progress integration", () => {
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
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;

    cookieA = (await loginStudent(baseUrl, STUDENT_A_NID)).cookie;
    cookieB = (await loginStudent(baseUrl, STUDENT_B_NID)).cookie;
    cookieTeacher = (await loginTeacher(baseUrl, "2297033843", TEACHER_PASSWORD)).cookie;
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

  it("GET /api/health returns ok, storage, database, appCommit (dev)", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.storage).toBe("sqlite");
    expect(body.database?.ok).toBe(true);
    expect(typeof body.appCommit).toBe("string");
    expect(body.appCommit).toBe(getGitCommit());
  });

  it("GET /api/health returns minimal payload in production", async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const app = createApp();
    await prepareApp(app);
    const prodServer = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    const prodUrl = `http://127.0.0.1:${prodServer.address().port}`;
    const res = await fetch(`${prodUrl}/api/health`);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    await new Promise((resolve) => prodServer.close(resolve));
    process.env.NODE_ENV = prev;
  });

  it("saves and restores lesson progress across sessions (server session)", async () => {
    const lessonId = "base-arithmetic";

    const saveRes = await authFetch(baseUrl, "/api/lesson/progress", {
      cookie: cookieA,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId,
        sectionId: "main",
        progress: { moves: 3, answer: "11000" },
        completed: false,
      }),
    });
    expect(saveRes.ok).toBe(true);

    const getA = await authFetch(baseUrl, `/api/progress/${STUDENT_A}`, { cookie: cookieA });
    const dataA = await getA.json();
    const rowA = dataA.lessons.find((l) => l.lessonId === lessonId);
    expect(rowA?.progress?.moves).toBe(3);

    const getB = await authFetch(baseUrl, `/api/progress/${STUDENT_B}`, { cookie: cookieB });
    const dataB = await getB.json();
    const rowB = dataB.lessons.find((l) => l.lessonId === lessonId);
    expect(rowB).toBeUndefined();
  });

  it("records lesson progress and appears in teacher summary", async () => {
    await authFetch(baseUrl, "/api/lesson/progress", {
      cookie: cookieA,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "if-statement",
        sectionId: "main",
        progress: { score: 55 },
        completed: true,
      }),
    });

    const summaryRes = await authFetch(baseUrl, "/api/lesson/summary", { cookie: cookieTeacher });
    const summary = await summaryRes.json();
    expect(summary.ok).toBe(true);
    expect(summary.summary[STUDENT_A]?.["if-statement"]?.completed).toBe(true);
  });

  it("smoke: onboarding status endpoint with session", async () => {
    const res = await authFetch(baseUrl, `/api/onboarding/status/${STUDENT_A}`, { cookie: cookieA });
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
