import { describe, expect, it } from "vitest";
import { areEquivalentLessonAnswers, normalizeLessonAnswer } from "./lessonAnswerEquivalence";

describe("lessonAnswerEquivalence", () => {
  it("normalizes arabic numerals", () => {
    expect(normalizeLessonAnswer("١٠١٠")).toBe("1010");
  });

  it("accepts equivalent boolean answers", () => {
    expect(areEquivalentLessonAnswers("صح", "True")).toBe(true);
    expect(areEquivalentLessonAnswers("0", "False")).toBe(true);
  });

  it("rejects different values", () => {
    expect(areEquivalentLessonAnswers("1", "0")).toBe(false);
  });
});

