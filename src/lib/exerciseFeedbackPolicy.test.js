import { describe, it, expect } from "vitest";
import {
  feedbackAfterFailedAttempt,
  AFTER_MAX_HINTS_AR,
  DEFAULT_ALLOW_REVEAL_ANSWER,
} from "./exerciseFeedbackPolicy.js";

describe("exerciseFeedbackPolicy", () => {
  it("defaults to not allowing answer reveal", () => {
    expect(DEFAULT_ALLOW_REVEAL_ANSWER).toBe(false);
  });

  it("returns progressive hints without exposing the answer", () => {
    const hints = ["ابدأ بالبطاقة الأكبر", "قارن المجموع"];
    expect(feedbackAfterFailedAttempt(1, hints)).toContain("ابدأ بالبطاقة الأكبر");
    expect(feedbackAfterFailedAttempt(2, hints)).toContain("قارن المجموع");
    expect(feedbackAfterFailedAttempt(3, hints)).not.toMatch(/الإجابة الصحيحة/);
    expect(feedbackAfterFailedAttempt(4, hints)).toBe(AFTER_MAX_HINTS_AR);
  });

  it("never includes correct answer text in late feedback", () => {
    const out = feedbackAfterFailedAttempt(10, [], "خطأ في الحساب");
    expect(out).not.toMatch(/10101|الإجابة:/);
  });
});
