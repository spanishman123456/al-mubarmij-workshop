process.env.PLATFORM_DB_PATH = new URL("./data/auth.session.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, loginTeacher, authFetch, testTeacherPassword } from "./testHelpers.js";
import { createSession, getSession, deleteSession } from "./auth/sessionRepository.js";

const TEST_DB = fileURLToPath(new URL("./data/auth.session.test.db", import.meta.url));

describe("session security", () => {
  let baseUrl;
  let server;

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
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    resetDatabaseForTests();
    delete process.env.PLATFORM_DB_PATH;
  });

  it("rejects reuse of session after logout", async () => {
    const { cookie, csrf } = await loginStudent(baseUrl, "1165814631");
    await authFetch(baseUrl, "/api/auth/logout", { cookie, csrf, method: "POST" });
    const res = await authFetch(baseUrl, "/api/progress/stu-1165814631", { cookie, csrf });
    expect(res.status).toBe(401);
  });

  it("rejects expired session token", async () => {
    const { token } = createSession("stu-1165814631", "student");
    const row = getSession(token);
    expect(row).toBeTruthy();
    deleteSession(token);
    expect(getSession(token)).toBeNull();
  });

  it("rotates session on login (fixation protection)", async () => {
    const pre = createSession("stu-1165814631", "student");
    const login = await loginStudent(baseUrl, "1165814631");
    expect(login.body.ok).toBe(true);
    expect(getSession(pre.token)).toBeNull();
  });

  it("rejects mutation without CSRF token", async () => {
    const { cookie } = await loginStudent(baseUrl, "1165814631");
    const res = await authFetch(baseUrl, "/api/lesson/progress", {
      cookie,
      method: "POST",
      body: JSON.stringify({ lessonId: "x", sectionId: "main", progress: {}, completed: false }),
    });
    expect(res.status).toBe(403);
  });

  it("rejects mutation from bad Origin in production", async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    process.env.ALLOWED_ORIGINS = "https://allowed.example.com";
    const { cookie, csrf } = await loginStudent(baseUrl, "1165814631");
    const res = await fetch(`${baseUrl}/api/lesson/progress`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
        Origin: "https://evil.example.com",
      },
      body: JSON.stringify({ lessonId: "x", sectionId: "main", progress: {}, completed: false }),
    });
    expect(res.status).toBe(403);
    process.env.NODE_ENV = prev;
    delete process.env.ALLOWED_ORIGINS;
  });

  it("student session cannot call teacher summary", async () => {
    const { cookie, csrf } = await loginStudent(baseUrl, "1165814631");
    const res = await authFetch(baseUrl, "/api/lesson/summary", { cookie, csrf });
    expect(res.status).toBe(403);
  });

  it("student cannot access teacher day-03 answers API", async () => {
    const { cookie, csrf } = await loginStudent(baseUrl, "1165814631");
    const res = await authFetch(baseUrl, "/api/teacher/day-03-answers", { cookie, csrf });
    expect(res.status).toBe(403);
  });

  it("teacher can access day-03 answers API", async () => {
    const { cookie, csrf } = await loginTeacher(baseUrl, "2297033843", testTeacherPassword());
    const res = await authFetch(baseUrl, "/api/teacher/day-03-answers", { cookie, csrf });
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.sections?.length).toBeGreaterThan(0);
  });
});

describe("login rate limiting", () => {
  let baseUrl;
  let server;

  beforeAll(async () => {
    resetDatabaseForTests();
    const app = createApp();
    await prepareApp(app);
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
  });

  it("returns 429 after repeated failed teacher logins", async () => {
    let saw429 = false;
    for (let i = 0; i < 8; i += 1) {
      const res = await fetch(`${baseUrl}/api/auth/teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nationalId: "2297033843", password: "wrong-password" }),
      });
      if (res.status === 429) saw429 = true;
    }
    expect(saw429).toBe(true);
  });
});
