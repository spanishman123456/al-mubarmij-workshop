import { describe, expect, it } from "vitest";
import {
  DayStudentState,
  buildStudentDayUnlockMap,
  canAccessDayPath,
  dayIdFromNumber,
  getDayIncompleteItems,
  getStudentDayState,
  isDayCompleted,
  isDayUnlockedForStudent,
  isSequentialUnlockPolicy,
} from "./dayUnlockPolicy.js";

const baseCtx = {
  publishedDays: 2,
  policy: "sequential",
  onboarding: {
    bingo: { status: "submitted" },
    agreements: {
      honor_code: { status: "signed" },
      acceptable_use: { status: "signed" },
      honor_agreement: { status: "signed" },
      tech_contract: { status: "signed" },
    },
  },
  progress: { completedDays: [], worksheetStatus: {}, quizScores: {} },
  lessonRows: [],
};

describe("dayUnlockPolicy", () => {
  it("day 1 is always unlocked when published", () => {
    expect(isDayUnlockedForStudent(1, baseCtx)).toBe(true);
    expect(getStudentDayState(1, baseCtx)).toBe(DayStudentState.AVAILABLE);
  });

  it("day 2 is locked until day 1 completed", () => {
    expect(isDayUnlockedForStudent(2, baseCtx)).toBe(false);
    expect(getStudentDayState(2, baseCtx)).toBe(DayStudentState.LOCKED);
  });

  it("day 2 unlocks after day 1 marked complete", () => {
    const ctx = {
      ...baseCtx,
      progress: { ...baseCtx.progress, completedDays: [dayIdFromNumber(1)] },
    };
    expect(isDayCompleted(1, ctx)).toBe(true);
    expect(isDayUnlockedForStudent(2, ctx)).toBe(true);
    expect(getStudentDayState(2, ctx)).toBe(DayStudentState.AVAILABLE);
  });

  it("day 3 stays draft when only 2 days published", () => {
    const ctx = {
      ...baseCtx,
      progress: { ...baseCtx.progress, completedDays: [dayIdFromNumber(1), dayIdFromNumber(2)] },
    };
    expect(getStudentDayState(3, ctx)).toBe(DayStudentState.DRAFT);
    expect(canAccessDayPath("day-03", ctx)).toBe(false);
  });

  it("teacher override unlocks day without prior completion", () => {
    const ctx = {
      ...baseCtx,
      progress: { ...baseCtx.progress, dayUnlockOverrides: [2] },
    };
    expect(isDayUnlockedForStudent(2, ctx)).toBe(true);
  });

  it("open policy unlocks all published days", () => {
    const ctx = { ...baseCtx, policy: "open" };
    expect(isSequentialUnlockPolicy(ctx.policy)).toBe(false);
    expect(isDayUnlockedForStudent(2, ctx)).toBe(true);
  });

  it("buildStudentDayUnlockMap covers 15 days", () => {
    const map = buildStudentDayUnlockMap(baseCtx);
    expect(Object.keys(map)).toHaveLength(15);
    expect(map["day-01"]).toBe(DayStudentState.AVAILABLE);
    expect(map["day-02"]).toBe(DayStudentState.LOCKED);
    expect(map["day-03"]).toBe(DayStudentState.DRAFT);
  });

  it("lists incomplete items for day 1", () => {
    const missing = getDayIncompleteItems(1, baseCtx);
    expect(missing.length).toBeGreaterThan(0);
    expect(missing.some((m) => m.labelAr.includes("BINGO"))).toBe(false);
  });
});
