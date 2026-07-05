import { describe, expect, it } from "vitest";
import {
  buildOnboardingAccessStatus,
  isRequiredOnboardingComplete,
  PRE_ASSESSMENT_STATUS,
  resolvePreAssessmentStatus,
} from "./onboardingPolicy.js";

const signedAgreements = {
  honor_code: { status: "signed" },
  acceptable_use: { status: "signed" },
  honor_agreement: { status: "signed" },
  tech_contract: { status: "signed" },
};

const bingoDone = { status: "submitted" };

describe("onboardingPolicy", () => {
  it("allows day one when agreements done but pre-assessment not started", () => {
    const access = buildOnboardingAccessStatus({
      bingo: bingoDone,
      agreements: signedAgreements,
      progress: {},
    });
    expect(access.canAccessDayOne).toBe(true);
    expect(access.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.NOT_STARTED);
  });

  it("allows day one when pre-assessment deferred with partial answers", () => {
    const access = buildOnboardingAccessStatus({
      bingo: bingoDone,
      agreements: signedAgreements,
      progress: {
        preAssessment: {
          status: "deferred",
          answers: { q1: "x" },
          deferredAt: "2026-01-01T00:00:00Z",
        },
      },
    });
    expect(access.canAccessDayOne).toBe(true);
    expect(access.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.DEFERRED);
    expect(access.preAssessment.answeredCount).toBe(1);
  });

  it("allows day one after low-score submitted pre-assessment", () => {
    const access = buildOnboardingAccessStatus({
      bingo: bingoDone,
      agreements: signedAgreements,
      progress: {
        preTest: { percent: 12, score: 2, total: 16 },
        quizScores: { "quiz-pre": { percent: 12, submitted: true } },
        preAssessment: { status: "submitted" },
      },
    });
    expect(access.canAccessDayOne).toBe(true);
    expect(access.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.SUBMITTED);
  });

  it("blocks day one when agreements missing", () => {
    expect(
      isRequiredOnboardingComplete({
        bingo: bingoDone,
        agreements: { ...signedAgreements, tech_contract: { status: "not_started" } },
      }),
    ).toBe(false);
  });

  it("detects in_progress from partial answers", () => {
    const pa = resolvePreAssessmentStatus({
      preAssessment: { answers: { a: "1" } },
    });
    expect(pa.status).toBe(PRE_ASSESSMENT_STATUS.IN_PROGRESS);
  });
});
