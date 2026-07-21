process.env.PLATFORM_DB_PATH = new URL("./data/onboarding.gate.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, authFetch } from "./testHelpers.js";
import { saveAgreement, saveBingoProgress } from "./repositories/onboardingRepository.js";
import { PRE_ASSESSMENT_STATUS } from "../src/content/onboarding/onboardingPolicy.js";

const TEST_DB = fileURLToPath(new URL("./data/onboarding.gate.test.db", import.meta.url));
const STUDENT_NID = "1165814631";
const STUDENT_ID = "stu-1165814631";

function completeRequiredOnboarding(studentId) {
  saveBingoProgress(studentId, {
    cells: { c0: "x" },
    status: "submitted",
    submittedAt: new Date().toISOString(),
  });
  for (const docType of ["honor_code", "acceptable_use", "honor_agreement", "tech_contract"]) {
    saveAgreement(studentId, {
      docType,
      signatureText: "توقيع",
      version: "1.0",
    });
  }
}

describe("onboarding gate — pre-assessment not blocking", () => {
  let baseUrl;
  let server;
  let authStudent;

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
    completeRequiredOnboarding(STUDENT_ID);
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    resetDatabaseForTests();
    delete process.env.PLATFORM_DB_PATH;
  });

  it("allows day one access without pre-assessment submitted", async () => {
    const res = await authFetch(baseUrl, `/api/onboarding/status/${STUDENT_ID}`, {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
    });
    const body = await res.json();
    expect(body.canAccessDayOne).toBe(true);
    expect(body.requiredComplete).toBe(true);
    expect(body.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.NOT_STARTED);
  });

  it("saves deferred pre-assessment with partial answers", async () => {
    const saveRes = await authFetch(baseUrl, "/api/onboarding/pre-assessment", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
      method: "POST",
      body: JSON.stringify({
        answers: { q1: "answer" },
        defer: true,
        totalQuestions: 10,
      }),
    });
    expect(saveRes.status).toBe(200);
    const body = await saveRes.json();
    expect(body.canAccessDayOne).toBe(true);
    expect(body.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.DEFERRED);
    expect(body.preAssessment.answeredCount).toBe(1);
  });

  it("allows access after low-score submitted pre-assessment", async () => {
    const saveRes = await authFetch(baseUrl, "/api/onboarding/pre-assessment", {
      cookie: authStudent.cookie,
      csrf: authStudent.csrf,
      method: "POST",
      body: JSON.stringify({
        answers: { q1: "a", q2: "b" },
        status: PRE_ASSESSMENT_STATUS.SUBMITTED,
        result: { score: 1, total: 10, percent: 10, passed: true },
      }),
    });
    const body = await saveRes.json();
    expect(body.canAccessDayOne).toBe(true);
    expect(body.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.SUBMITTED);
    expect(body.preAssessment.diagnosticPercent).toBe(10);
  });
});
