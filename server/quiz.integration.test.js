process.env.PLATFORM_DB_PATH = new URL("./data/quiz.integration.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, expect, it, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, loginTeacher, authFetch, testTeacherPassword } from "./testHelpers.js";

const TEST_DB = fileURLToPath(new URL("./data/quiz.integration.test.db", import.meta.url));
const STUDENT_NID = "1165814631";
const TEACHER_NID = "2297033843";

describe("quiz API integration", () => {
  let baseUrl;
  let server;
  let authStudent;
  let authTeacher;
  let submittedAttemptId;

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

  it("returns public quiz without answer keys", async () => {
    const res = await authFetch(baseUrl, "/api/quiz/quiz-pre/public", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalQuestions).toBe(108);
    const q = body.sections.flatMap((s) => s.questions)[0];
    expect(q.correctAnswer).toBeUndefined();
    expect(q.explainAr).toBeUndefined();
  });

  it("blocks review before submit", async () => {
    const att = await authFetch(baseUrl, "/api/quiz/quiz-pre/attempt", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    const attBody = await att.json();
    const review = await authFetch(baseUrl, `/api/quiz/review/${attBody.attempt.id}`, {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    expect(review.status).toBe(403);
  });

  it("submits and returns review with explanations", async () => {
    const att = await authFetch(baseUrl, "/api/quiz/quiz-pre/attempt", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    const attBody = await att.json();
    const attemptId = attBody.attempt.id;
    await authFetch(baseUrl, `/api/quiz/quiz-pre/attempt/${attemptId}`, {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
      method: "PATCH",
      body: JSON.stringify({
        answers: {
          "pre-01a": "101010",
          "pre-19": JSON.stringify({
            oval: "start-end",
            parallelogram: "io",
            diamond: "decision",
            rectangle: "process",
          }),
        },
      }),
    });
    const sub = await authFetch(baseUrl, `/api/quiz/quiz-pre/attempt/${attemptId}/submit`, {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
      method: "POST",
      body: JSON.stringify({}),
    });
    expect(sub.status).toBe(200);
    const review = await authFetch(baseUrl, `/api/quiz/review/${attemptId}`, {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    expect(review.status).toBe(200);
    const reviewBody = await review.json();
    expect(reviewBody.questions[0].explainAr).toBeTruthy();
    expect(reviewBody.summary.percent).toBeGreaterThanOrEqual(0);
    submittedAttemptId = attemptId;
  });

  it("locks attempt after submit", async () => {
    const patch = await authFetch(baseUrl, `/api/quiz/quiz-pre/attempt/${submittedAttemptId}`, {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
      method: "PATCH",
      body: JSON.stringify({ answers: { "pre-01a": "000000" } }),
    });
    expect(patch.status).toBe(409);
  });

  it("teacher preview returns model answers without creating attempt", async () => {
    const res = await authFetch(baseUrl, "/api/teacher/quiz/quiz-pre/preview", {
      cookie: authTeacher.cookie,
      csrf: authTeacher.csrf,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.mode).toBe("teacher_preview");
    expect(body.totalQuestions).toBe(108);
    expect(body.questions[0].modelAnswer).toBeTruthy();
    expect(body.questions[0].explainAr).toBeTruthy();
  });

  it("student cannot access teacher quiz preview", async () => {
    const res = await authFetch(baseUrl, "/api/teacher/quiz/quiz-pre/preview", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    expect(res.status).toBe(403);
  });

  it("student public quiz has no answer keys", async () => {
    const res = await authFetch(baseUrl, "/api/quiz/quiz-post/public", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    const q = body.sections.flatMap((s) => s.questions)[0];
    expect(q.correctAnswer).toBeUndefined();
    expect(q.explainAr).toBeUndefined();
  });

  it("teacher preview for post assessment is available", async () => {
    const res = await authFetch(baseUrl, "/api/teacher/quiz/quiz-post/preview", {
      cookie: authTeacher.cookie,
      csrf: authTeacher.csrf,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.quizId).toBe("quiz-post");
    expect(body.questions.length).toBeGreaterThan(0);
  });
});
