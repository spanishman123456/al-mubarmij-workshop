import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { authFetch, loginDemoStudent, loginStudent } from "./testHelpers.js";
import { DEMO_STUDENT_LOGIN_CODE, isDemoStudentId } from "../src/lib/demo/demoStudentProfile.js";

const TEST_DB = fileURLToPath(new URL("./data/demo-student.integration.test.db", import.meta.url));
const STUDENT_NID = "1165814631";

let baseUrl;
let server;

beforeAll(async () => {
  for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
    if (fs.existsSync(p)) fs.rmSync(p, { force: true });
  }
  process.env.PLATFORM_DB_PATH = TEST_DB;
  process.env.PUBLISHED_DAYS = "2";
  process.env.STUDENT_UNLOCK_POLICY = "sequential";
  process.env.TEACHER_BCRYPT_HASH = bcrypt.hashSync("teacher-test", 4);
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

describe("demo student auth and isolation", () => {
  it("logs in demo student from dedicated endpoint", async () => {
    const demo = await loginDemoStudent(baseUrl);
    expect(demo.res.status).toBe(200);
    expect(demo.body.ok).toBe(true);
    expect(demo.body.user.role).toBe("student");
    expect(demo.body.user.isDemo).toBe(true);
    expect(demo.body.user.demoAccessCode).toBe(DEMO_STUDENT_LOGIN_CODE);
    expect(isDemoStudentId(demo.body.user.id)).toBe(true);
  });

  it("prevents demo student from teacher endpoints and other student records", async () => {
    const demo = await loginDemoStudent(baseUrl);
    const real = await loginStudent(baseUrl, STUDENT_NID);

    const rosterRes = await authFetch(baseUrl, "/api/progress/teacher/roster", {
      cookie: demo.cookie,
      csrf: demo.csrf,
    });
    expect(rosterRes.status).toBe(403);

    const realId = real.body.user.id;
    const otherProgressRes = await authFetch(baseUrl, `/api/progress/${encodeURIComponent(realId)}`, {
      cookie: demo.cookie,
      csrf: demo.csrf,
    });
    expect(otherProgressRes.status).toBe(403);

    const myProgressRes = await authFetch(baseUrl, "/api/progress/me", {
      cookie: demo.cookie,
      csrf: demo.csrf,
    });
    expect(myProgressRes.status).toBe(200);
    const myProgressBody = await myProgressRes.json();
    expect(myProgressBody.ok).toBe(true);
  });
});
