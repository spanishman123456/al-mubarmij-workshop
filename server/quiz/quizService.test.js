import { describe, expect, it } from "vitest";
import {
  getPublicQuizPayload,
  gradeAttempt,
  gradeQuestion,
  sanitizeQuestion,
} from "./quizService.js";

describe("quizService", () => {
  it("strips answer keys from public payload", () => {
    const payload = getPublicQuizPayload("quiz-pre");
    expect(payload).toBeTruthy();
    const flat = payload.sections.flatMap((s) => s.questions);
    expect(flat.length).toBe(103);
    for (const q of flat) {
      expect(q.correctAnswer).toBeUndefined();
      expect(q.correctIndex).toBeUndefined();
      expect(q.correctPairs).toBeUndefined();
      expect(q.explainAr).toBeUndefined();
    }
  });

  it("grades match question pre-19", () => {
    const payload = getPublicQuizPayload("quiz-pre");
    const q19 = payload.sections.flatMap((s) => s.questions).find((q) => q.id === "pre-19");
    expect(q19?.type).toBe("match");

    const graded = gradeAttempt("quiz-pre", {
      "pre-19": JSON.stringify({ 0: 0, 1: 1, 2: 2, 3: 3 }),
    });
    const item = graded.items.find((i) => i.questionId === "pre-19");
    expect(item?.correct).toBe(true);
  });

  it("marks essay as pending teacher review", () => {
    const result = gradeQuestion({ type: "essay", id: "x" }, "some answer");
    expect(result.gradingStatus).toBe("pending_teacher_review");
    expect(result.autoGraded).toBe(false);
  });

  it("sanitize adds instruction for essay", () => {
    const s = sanitizeQuestion({ type: "essay", questionAr: "test" });
    expect(s.instructionAr).toContain("داخل المنصة");
  });
});
