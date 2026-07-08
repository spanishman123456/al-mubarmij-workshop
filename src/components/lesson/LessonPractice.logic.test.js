import { describe, expect, it } from "vitest";
import { areLegacyAnswersEquivalent, isLegacyAnswerCorrect } from "./LessonPractice.jsx";

describe("lesson practice legacy answer equivalence", () => {
  it("accepts yes/sahih logical equivalents", () => {
    expect(areLegacyAnswersEquivalent("صح", "نعم")).toBe(true);
    expect(areLegacyAnswersEquivalent("true", "صحيح")).toBe(true);
  });

  it("accepts arabic and latin digits", () => {
    expect(areLegacyAnswersEquivalent("١٢", "12")).toBe(true);
    expect(areLegacyAnswersEquivalent("1.67", "١٫٦٧")).toBe(true);
  });

  it("accepts configured accepted answers", () => {
    const exercise = {
      answer: "1",
      acceptedAnswers: ["1", "اللاعب 1", "player 1"],
    };
    expect(isLegacyAnswerCorrect(exercise, "اللاعب 1")).toBe(true);
    expect(isLegacyAnswerCorrect(exercise, "player 1")).toBe(true);
  });

  it("rejects unrelated answers", () => {
    expect(areLegacyAnswersEquivalent("زوجي", "فردي")).toBe(false);
  });
});
