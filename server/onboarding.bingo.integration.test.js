process.env.PLATFORM_DB_PATH = new URL("./data/bingo.integration.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, loginTeacher, authFetch, testTeacherPassword } from "./testHelpers.js";
import { BINGO_EXPECTED_FILLABLE } from "../src/content/onboarding/validateBingoContent.js";

const TEST_DB = fileURLToPath(new URL("./data/bingo.integration.test.db", import.meta.url));
const STUDENT_NID = "1165814631";
const STUDENT_ID = "stu-1165814631";

describe("onboarding BINGO API", () => {
  let baseUrl;
  let server;
  let authStudent;
  let authOther;
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
    authStudent = await loginStudent(baseUrl, STUDENT_NID);
    authOther = await loginStudent(baseUrl, "1167676921");
    authTeacher = await loginTeacher(baseUrl, "2297033843", testTeacherPassword());
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    resetDatabaseForTests();
    delete process.env.PLATFORM_DB_PATH;
  });

  it("returns initial bingo state for new student", async () => {
    const res = await authFetch(baseUrl, `/api/onboarding/status/${STUDENT_ID}`, {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.bingo.status).toBe("not_started");
    expect(body.bingo.cells).toEqual({});
  });

  it("saves cell, restores after refetch, and blocks other student", async () => {
    const cells = { c0: "أحمد", c1: "سارة" };
    const saveRes = await authFetch(baseUrl, "/api/onboarding/bingo", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
      method: "POST",
      body: JSON.stringify({ cells, status: "in_progress" }),
    });
    expect(saveRes.status).toBe(200);

    const statusRes = await authFetch(baseUrl, `/api/onboarding/status/${STUDENT_ID}`, {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    const statusBody = await statusRes.json();
    expect(statusBody.bingo.cells.c0).toBe("أحمد");
    expect(statusBody.bingo.status).toBe("in_progress");

    const forbidden = await authFetch(baseUrl, `/api/onboarding/status/${STUDENT_ID}`, {
      cookie: authOther.cookie,
      csrf: authOther.csrf,
    });
    expect(forbidden.status).toBe(403);
  });

  it("submits completed bingo and appears in teacher summary", async () => {
    const cells = Object.fromEntries(
      Array.from({ length: BINGO_EXPECTED_FILLABLE }, (_, i) => [`c${i >= 12 ? i + 1 : i}`, `زميل ${i + 1}`]),
    );
    const saveRes = await authFetch(baseUrl, "/api/onboarding/bingo", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
      method: "POST",
      body: JSON.stringify({ cells, status: "submitted", submittedAt: new Date().toISOString() }),
    });
    expect(saveRes.status).toBe(200);

    const teacherRes = await authFetch(baseUrl, "/api/onboarding/all", {
      cookie: authTeacher.cookie,
      csrf: authTeacher.csrf,
    });
    const teacherBody = await teacherRes.json();
    expect(teacherBody.bingo[STUDENT_ID]?.status).toBe("submitted");
    expect(teacherBody.bingo[STUDENT_ID]?.totalCells).toBe(BINGO_EXPECTED_FILLABLE);
  });
});
