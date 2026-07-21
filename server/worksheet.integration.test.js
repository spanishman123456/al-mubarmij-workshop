process.env.PLATFORM_DB_PATH = new URL("./data/worksheet.integration.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
process.env.PUBLISHED_DAYS = "2";
process.env.STUDENT_UNLOCK_POLICY = "sequential";

import { describe, expect, it, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, loginTeacher, authFetch, testTeacherPassword } from "./testHelpers.js";
import { saveStudentProgress } from "./repositories/progressRepository.js";

const TEST_DB = fileURLToPath(new URL("./data/worksheet.integration.test.db", import.meta.url));
const STUDENT_NID = "1165814631";
const TEACHER_NID = "2297033843";
const STUDENT_ID = `stu-${STUDENT_NID}`;

describe("worksheet API integration", () => {
  let baseUrl;
  let server;
  let authStudent;
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
    authTeacher = await loginTeacher(baseUrl, TEACHER_NID, testTeacherPassword());
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    resetDatabaseForTests();
    delete process.env.PLATFORM_DB_PATH;
  });

  it("eligible student lists day-01 and day-02 worksheets", async () => {
    saveStudentProgress(STUDENT_ID, {
      completedDays: ["day-01"],
      dayCompletionTimes: { "day-01": new Date().toISOString() },
    });
    const res = await authFetch(baseUrl, "/api/worksheets", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    const ids = body.worksheets.map((w) => w.id);
    expect(ids).toContain("ws-day-01");
    expect(ids).toContain("ws-day-02");
    expect(body.worksheets.find((w) => w.id === "ws-day-02").canOpen).toBe(true);
  });

  it("locked student sees day-02 worksheet as locked not open", async () => {
    saveStudentProgress(STUDENT_ID, { completedDays: [], worksheetStatus: {} });
    const res = await authFetch(baseUrl, "/api/worksheets", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    const body = await res.json();
    const day2 = body.worksheets.find((w) => w.id === "ws-day-02");
    expect(day2).toBeTruthy();
    expect(day2.access).toBe("locked");
    expect(day2.canOpen).toBe(false);
  });

  it("student cannot access locked worksheet detail API", async () => {
    saveStudentProgress(STUDENT_ID, { completedDays: [], worksheetStatus: {} });
    const res = await authFetch(baseUrl, "/api/worksheets/ws-day-02/access", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    expect(res.status).toBe(403);
  });

  it("teacher lists all path worksheets including unpublished days", async () => {
    const res = await authFetch(baseUrl, "/api/worksheets", {
      cookie: authTeacher.cookie,
      csrf: authTeacher.csrf,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("teacher");
    expect(body.worksheets.length).toBeGreaterThanOrEqual(5);
    expect(body.worksheets.some((w) => w.id === "ws-day-05")).toBe(true);
  });

  it("teacher preview includes model answers", async () => {
    const res = await authFetch(baseUrl, "/api/teacher/worksheets/ws-day-02/preview", {
      cookie: authTeacher.cookie,
      csrf: authTeacher.csrf,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.mode).toBe("teacher_preview");
    expect(body.tasks.length).toBe(10);
    expect(body.modelAnswers.length).toBeGreaterThan(0);
  });

  it("student cannot access teacher worksheet preview", async () => {
    const res = await authFetch(baseUrl, "/api/teacher/worksheets/ws-day-02/preview", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    expect(res.status).toBe(403);
  });
});
