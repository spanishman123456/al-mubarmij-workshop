process.env.PLATFORM_DB_PATH = new URL("./data/python-snippets.integration.test.db", import.meta.url).pathname.replace(
  /^\/([A-Z]:)/,
  "$1",
);

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { authFetch, loginStudent, loginTeacher, testTeacherPassword } from "./testHelpers.js";

const TEST_DB = fileURLToPath(new URL("./data/python-snippets.integration.test.db", import.meta.url));
const STUDENT_NID = "1165814631";
const STUDENT_ID = `stu-${STUDENT_NID}`;
const TEACHER_NID = "2297033843";

describe("teacher student python snippets API", () => {
  let baseUrl;
  let server;
  let authStudent;
  let authTeacher;

  beforeAll(async () => {
    for (const p of [TEST_DB, `${TEST_DB}.bak`]) {
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
    delete process.env.PLATFORM_DB_PATH;
  });

  it("returns snippet code content and supports preview/delete audit flow", async () => {
    const syncRes = await authFetch(baseUrl, "/api/progress/sync", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
      method: "POST",
      body: JSON.stringify({
        progress: {
          pythonSnippets: [
            {
              id: "py-test-1",
              title: "if demo",
              code: "a = 3\nb = 7\nif a < b:\n    print(b)",
              lessonId: "if-statement",
              activityId: "if-lab",
              at: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "py-test-2",
              title: "empty snippet",
              code: "",
              lessonId: "if-statement",
              activityId: "if-lab",
              at: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      }),
    });
    expect(syncRes.ok).toBe(true);

    const listRes = await authFetch(baseUrl, `/api/teacher/students/${STUDENT_ID}/python-snippets`, {
      cookie: authTeacher.cookie,
      csrf: authTeacher.csrf,
    });
    expect(listRes.ok).toBe(true);
    const listBody = await listRes.json();
    expect(Array.isArray(listBody.snippets)).toBe(true);
    const snippet = listBody.snippets.find((s) => s.id === "py-test-1");
    expect(snippet?.code).toContain("print(b)");

    const auditRes = await authFetch(baseUrl, "/api/teacher/python-snippets/audit", {
      cookie: authTeacher.cookie,
      csrf: authTeacher.csrf,
    });
    expect(auditRes.ok).toBe(true);
    const auditBody = await auditRes.json();
    expect(auditBody.report.totalSnippets).toBeGreaterThanOrEqual(2);
    expect(auditBody.report.snippetsWithCodeText).toBeGreaterThanOrEqual(1);
    expect(auditBody.report.emptyCodeSnippets).toBeGreaterThanOrEqual(1);

    const delRes = await authFetch(baseUrl, `/api/teacher/students/${STUDENT_ID}/python-snippets/py-test-2`, {
      cookie: authTeacher.cookie,
      csrf: authTeacher.csrf,
      method: "DELETE",
    });
    expect(delRes.ok).toBe(true);
    const delBody = await delRes.json();
    expect(delBody.totalAfter).toBe(delBody.totalBefore - 1);
  });
});

