import { describe, it, expect } from "vitest";
import {
  buildPublishedRequiredCatalog,
  evaluateCatalog,
  isLessonComplete,
  lessonStarted,
  PROGRESS_VERSION,
} from "../../src/lib/progressCatalog.js";
import { PRE_ASSESSMENT_STATUS } from "../../src/content/onboarding/onboardingPolicy.js";

describe("progressCatalog", () => {
  const publishedDays = 1;

  it("counts only published day-1 items when PUBLISHED_DAYS=1", () => {
    const catalog = buildPublishedRequiredCatalog(1);
    expect(catalog.some((i) => i.id === "onboarding-bingo")).toBe(true);
    expect(catalog.some((i) => i.id === "lesson-number-systems")).toBe(true);
    expect(catalog.some((i) => i.id.startsWith("lesson-conversions"))).toBe(false);
    expect(catalog.some((i) => i.id === "ws-day-01")).toBe(true);
    expect(catalog.some((i) => i.id === "quiz-pre")).toBe(false);
  });

  it("returns 0% for student who has not started", () => {
    const catalog = buildPublishedRequiredCatalog(publishedDays);
    const result = evaluateCatalog(catalog, {
      onboarding: { bingo: { status: "not_started" }, agreements: {} },
      progress: {},
      lessonRows: [],
    });
    expect(result.availableProgressPercent).toBe(0);
    expect(result.completedRequiredItems).toBe(0);
  });

  it("increases percent when one item completes", () => {
    const catalog = buildPublishedRequiredCatalog(publishedDays);
    const empty = evaluateCatalog(catalog, {
      onboarding: { bingo: { status: "not_started" }, agreements: {} },
      progress: {},
      lessonRows: [],
    });
    const one = evaluateCatalog(catalog, {
      onboarding: { bingo: { status: "submitted" }, agreements: {} },
      progress: {},
      lessonRows: [],
    });
    expect(one.completedRequiredItems).toBe(1);
    expect(one.availableProgressPercent).toBeGreaterThan(empty.availableProgressPercent);
  });

  it("does not require pre-assessment in catalog", () => {
    const catalog = buildPublishedRequiredCatalog(publishedDays);
    expect(catalog.some((i) => i.id === "quiz-pre")).toBe(false);
  });

  it("counts lesson from lesson_progress rows", () => {
    expect(
      isLessonComplete("number-systems", [{ lessonId: "number-systems", completed: true }], {}),
    ).toBe(true);
  });

  it("counts lesson from lessonCompletions blob", () => {
    expect(
      isLessonComplete("python-intro", [], {
        lessonCompletions: { "python-intro": { status: "completed", completedAt: "2026-01-01" } },
      }),
    ).toBe(true);
  });

  it("marks lesson in_progress when started but not completed", () => {
    const catalog = buildPublishedRequiredCatalog(1);
    const result = evaluateCatalog(catalog, {
      onboarding: { bingo: { status: "not_started" }, agreements: {} },
      progress: {},
      lessonRows: [
        {
          lessonId: "binary-cards",
          completed: false,
          progress: { startedAt: "2026-01-01", status: "in_progress" },
        },
      ],
    });
    const lesson = result.breakdown.find((i) => i.lessonId === "binary-cards");
    expect(lesson?.status).toBe("in_progress");
    expect(lesson?.complete).toBe(false);
    expect(lessonStarted("binary-cards", [
      {
        lessonId: "binary-cards",
        completed: false,
        progress: { startedAt: "2026-01-01", status: "in_progress" },
      },
    ], {})).toBe(true);
  });

  it("caps percent at 100", () => {
    const catalog = buildPublishedRequiredCatalog(publishedDays);
    const allDone = evaluateCatalog(catalog, {
      onboarding: {
        bingo: { status: "submitted" },
        agreements: {
          honor_code: { status: "signed" },
          acceptable_use: { status: "signed" },
          honor_agreement: { status: "signed" },
          tech_contract: { status: "signed" },
        },
      },
      progress: {
        completedDays: ["day-01"],
        worksheetStatus: { "ws-day-01": "completed" },
        quizScores: { "quiz-day-01": { submitted: true, percent: 80 } },
      },
      lessonRows: Object.keys({
        "binary-cards": 1,
        "binary-puzzle": 1,
        "binary-matching": 1,
        "number-systems": 1,
        "python-intro": 1,
        "string-splitting": 1,
        "ascii-unicode": 1,
        "hex-puzzle": 1,
        "hex-colors": 1,
      }).map((lessonId) => ({ lessonId, completed: true })),
    });
    expect(allDone.availableProgressPercent).toBeLessThanOrEqual(100);
    expect(allDone.availableProgressPercent).toBeGreaterThan(0);
  });

  it("uses Arabic labels for published lessons", () => {
    const catalog = buildPublishedRequiredCatalog(1);
    const lesson = catalog.find((i) => i.lessonId === "python-intro");
    expect(lesson?.labelAr).toBe("مقدمة بايثون");
  });

  it("pre-assessment deferred does not block lesson items", () => {
    const catalog = buildPublishedRequiredCatalog(publishedDays);
    const result = evaluateCatalog(catalog, {
      onboarding: { bingo: { status: "submitted" }, agreements: {} },
      progress: {
        preAssessment: { status: PRE_ASSESSMENT_STATUS.DEFERRED },
      },
      lessonRows: [{ lessonId: "number-systems", completed: true }],
    });
    expect(result.completedRequiredItems).toBeGreaterThanOrEqual(2);
  });
});
