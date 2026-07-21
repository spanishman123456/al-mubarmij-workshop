import { describe, expect, it } from "vitest";
import {
  buildAssessmentSummary,
  formatAssessmentCardLine,
  formatPreAssessmentDisplay,
  formatPostAssessmentDisplay,
  backfillAssessmentProgress,
  POST_ASSESSMENT_STATUS,
} from "./assessmentSummary.js";
import { PRE_ASSESSMENT_STATUS } from "../content/onboarding/onboardingPolicy.js";

describe("assessmentSummary", () => {
  it("shows submitted pre percent from quizScores when preTest missing", () => {
    const summary = buildAssessmentSummary({
      quizScores: { "quiz-pre": { percent: 24, submitted: true, at: "2026-07-01T10:00:00Z" } },
    });
    expect(summary.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.SUBMITTED);
    expect(summary.preAssessment.scorePercent).toBe(24);
    expect(formatAssessmentCardLine(summary)).toBe("24% → يفتح في نهاية المسار");
  });

  it("shows submitted pre percent from quiz attempt", () => {
    const summary = buildAssessmentSummary(
      {},
      {
        preAttempt: {
          status: "submitted",
          submittedAt: "2026-07-01T10:00:00Z",
          result: { percent: 41, autoTotal: 103 },
        },
        publishedDays: 2,
      },
    );
    expect(summary.preAssessment.scorePercent).toBe(41);
    expect(formatPreAssessmentDisplay(summary.preAssessment)).toBe("41%");
  });

  it("shows not started instead of -% for pre", () => {
    const summary = buildAssessmentSummary({});
    expect(formatPreAssessmentDisplay(summary.preAssessment)).toBe("لم يبدأ");
    expect(formatAssessmentCardLine(summary)).not.toContain("-%");
    expect(formatAssessmentCardLine(summary)).toContain("لم يبدأ");
  });

  it("shows in progress for partial pre-assessment", () => {
    const summary = buildAssessmentSummary({
      preAssessment: { status: "in_progress", answers: { q1: "x" } },
    });
    expect(summary.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.IN_PROGRESS);
    expect(formatPreAssessmentDisplay(summary.preAssessment)).toBe("قيد التنفيذ");
  });

  it("shows deferred status", () => {
    const summary = buildAssessmentSummary({
      preAssessment: { status: "deferred", deferredAt: "2026-07-01T10:00:00Z" },
    });
    expect(summary.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.DEFERRED);
    expect(formatPreAssessmentDisplay(summary.preAssessment)).toBe("مؤجل");
  });

  it("shows locked post assessment when path not complete", () => {
    const summary = buildAssessmentSummary({}, { publishedDays: 2 });
    expect(summary.postAssessment.status).toBe(POST_ASSESSMENT_STATUS.LOCKED);
    expect(formatPostAssessmentDisplay(summary.postAssessment)).toBe("يفتح في نهاية المسار");
    expect(formatAssessmentCardLine(summary)).toContain("يفتح في نهاية المسار");
  });

  it("does not mix pre and post scores", () => {
    const summary = buildAssessmentSummary({
      preTest: { percent: 24 },
      quizScores: { "quiz-pre": { percent: 24, submitted: true } },
    });
    expect(summary.preAssessment.scorePercent).toBe(24);
    expect(summary.postAssessment.scorePercent).toBeNull();
  });

  it("backfills preTest from quiz attempt", () => {
    const progress = {};
    const next = backfillAssessmentProgress(progress, {
      preAttempt: {
        status: "submitted",
        submittedAt: "2026-07-01T10:00:00Z",
        result: { percent: 12, score: 12, total: 100 },
      },
    });
    expect(next.preTest.percent).toBe(12);
    expect(next.quizScores["quiz-pre"].percent).toBe(12);
    expect(next.preAssessment.status).toBe(PRE_ASSESSMENT_STATUS.SUBMITTED);
  });
});
