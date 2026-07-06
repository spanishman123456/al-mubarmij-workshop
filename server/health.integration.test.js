process.env.PLATFORM_DB_PATH = new URL("./data/platform.integration.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
process.env.STUDENT_UNLOCK_POLICY = "open";

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp, getAppCommit } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, loginTeacher, authFetch, testTeacherPassword } from "./testHelpers.js";

const TEST_DB = fileURLToPath(new URL("./data/platform.integration.test.db", import.meta.url));
const STUDENT_A_NID = "1165814631";
const STUDENT_B_NID = "1167676921";
const STUDENT_A = "stu-1165814631";
const STUDENT_B = "stu-1167676921";

describe("API health + progress integration", () => {
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

    authA = await loginStudent(baseUrl, STUDENT_A_NID);
    authB = await loginStudent(baseUrl, STUDENT_B_NID);
    authTeacher = await loginTeacher(baseUrl, "2297033843", testTeacherPassword());
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    resetDatabaseForTests();
    delete process.env.PLATFORM_DB_PATH;
  });

  it("GET /api/health returns ok, storage, database, appCommit (dev)", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.storage).toBe("sqlite");
    expect(typeof body.appCommit).toBe("string");
    expect(body.appCommit).toBe(getAppCommit());
  });

  it("GET /api/health returns minimal payload in production", async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const app = createApp();
    await prepareApp(app);
    const prodServer = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    const res = await fetch(`http://127.0.0.1:${prodServer.address().port}/api/health`);
    expect(await res.json()).toEqual({ ok: true });
    await new Promise((resolve) => prodServer.close(resolve));
    process.env.NODE_ENV = prev;
  });

  it("saves and restores lesson progress across sessions (server session)", async () => {
    const lessonId = "base-arithmetic";
    const saveRes = await authFetch(baseUrl, "/api/lesson/progress", {
      cookie: authA.cookie,
      csrf: authA.csrf,
      method: "POST",
      body: JSON.stringify({
        lessonId,
        sectionId: "main",
        progress: { moves: 3, answer: "11000" },
        completed: false,
      }),
    });
    expect(saveRes.ok).toBe(true);

    const dataA = await (await authFetch(baseUrl, `/api/progress/${STUDENT_A}`, { cookie: authA.cookie })).json();
    expect(dataA.lessons.find((l) => l.lessonId === lessonId)?.progress?.moves).toBe(3);

    const dataB = await (await authFetch(baseUrl, `/api/progress/${STUDENT_B}`, { cookie: authB.cookie })).json();
    expect(dataB.lessons.find((l) => l.lessonId === lessonId)).toBeUndefined();
  });

  it("records lesson progress and appears in teacher summary", async () => {
    await authFetch(baseUrl, "/api/lesson/progress", {
      cookie: authA.cookie,
      csrf: authA.csrf,
      method: "POST",
      body: JSON.stringify({
        lessonId: "if-statement",
        sectionId: "main",
        progress: { score: 55 },
        completed: true,
      }),
    });

    const summary = await (
      await authFetch(baseUrl, "/api/lesson/summary", { cookie: authTeacher.cookie, csrf: authTeacher.csrf })
    ).json();
    expect(summary.summary[STUDENT_A]?.["if-statement"]?.completed).toBe(true);
  });

  it("smoke: onboarding status endpoint with session", async () => {
    const res = await authFetch(baseUrl, `/api/onboarding/status/${STUDENT_A}`, { cookie: authA.cookie });
    expect(res.ok).toBe(true);
  });

  it("GET /api/progress/me returns server-computed progress for student", async () => {
    await authFetch(baseUrl, "/api/lesson/progress", {
      cookie: authA.cookie,
      csrf: authA.csrf,
      method: "POST",
      body: JSON.stringify({
        lessonId: "number-systems",
        sectionId: "main",
        progress: { done: true },
        completed: true,
      }),
    });

    const res = await authFetch(baseUrl, "/api/progress/me", { cookie: authA.cookie });
    const body = await res.json();
    expect(res.ok).toBe(true);
    expect(body.computed.progressVersion).toBe("v2");
    expect(body.computed.availableProgressPercent).toBeGreaterThan(0);
    expect(body.computed.completedLessons).toBeGreaterThanOrEqual(1);
  });

  it("teacher roster progress matches student /me percent", async () => {
    const me = await (await authFetch(baseUrl, "/api/progress/me", { cookie: authA.cookie })).json();
    const roster = await (
      await authFetch(baseUrl, "/api/progress/teacher/roster", {
        cookie: authTeacher.cookie,
        csrf: authTeacher.csrf,
      })
    ).json();
    expect(roster.byStudent[STUDENT_A].availableProgressPercent).toBe(me.computed.availableProgressPercent);
  });

  it("student cannot read another student computed progress via teacher route", async () => {
    const res = await authFetch(baseUrl, `/api/teacher/students/${STUDENT_B}/progress`, {
      cookie: authA.cookie,
    });
    expect(res.status).toBe(403);
  });
});
