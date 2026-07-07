import { describe, expect, it } from "vitest";
import {
  gradeQuestion,
  gradeStructuredItem,
  isAutoGradable,
  normalizeQuestionType,
  computeAssessmentResult,
} from "./unifiedAssessment.js";

describe("unifiedAssessment", () => {
  it("normalizes worksheet type aliases", () => {
    expect(normalizeQuestionType("multiple_choice")).toBe("mcq");
    expect(normalizeQuestionType("true_false")).toBe("truefalse");
    expect(normalizeQuestionType("short_answer")).toBe("fill");
  });

  it("grades mcq and truefalse", () => {
    expect(
      gradeQuestion({ type: "mcq", correctIndex: 1, optionsAr: ["a", "b"] }, 1).correct,
    ).toBe(true);
    expect(gradeQuestion({ type: "true_false", correct: true }, true).correct).toBe(true);
    expect(gradeQuestion({ type: "true_false", correct: true }, false).correct).toBe(false);
  });

  it("grades fill with accepted answers and normalize", () => {
    expect(
      gradeQuestion(
        { type: "fill", acceptedAnswers: ["10110", "010110"], normalize: "binary" },
        "10110",
      ).correct,
    ).toBe(true);
  });

  it("grades worksheet-shaped multiple choice via gradeStructuredItem", () => {
    const part = {
      type: "multiple_choice",
      choices: [
        { id: "a", textAr: "10" },
        { id: "b", textAr: "10110" },
      ],
      correctAnswer: "b",
    };
    expect(gradeStructuredItem(part, "b").correct).toBe(true);
    expect(gradeStructuredItem(part, "a").correct).toBe(false);
  });

  it("marks essay as manual not auto", () => {
    expect(isAutoGradable({ type: "essay" })).toBe(false);
    expect(gradeQuestion({ type: "essay" }, "long text").autoGraded).toBe(false);
  });

  it("computeAssessmentResult matches mixed quiz", () => {
    const questions = [
      { id: "q1", type: "mcq", correctIndex: 0, optionsAr: ["x", "y"] },
      { id: "q2", type: "fill", correctAnswer: "42", acceptAnswers: ["42"] },
      { id: "q3", type: "essay" },
    ];
    const r = computeAssessmentResult(questions, { q1: 0, q2: "42", q3: "note" }, 50);
    expect(r.correct).toBe(2);
    expect(r.total).toBe(2);
    expect(r.percent).toBe(100);
    expect(r.manualTotal).toBe(1);
  });
});
