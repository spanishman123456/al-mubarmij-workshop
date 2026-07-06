import { describe, expect, it } from "vitest";
import {
  getPublicQuizPayload,
  getTeacherPreviewQuizPayload,
  gradeAttempt,
  gradeQuestion,
  sanitizeQuestion,
} from "./quizService.js";

describe("quizService", () => {
  it("strips answer keys from public payload", () => {
    const payload = getPublicQuizPayload("quiz-pre");
    expect(payload).toBeTruthy();
    const flat = payload.sections.flatMap((s) => s.questions);
    expect(flat.length).toBe(108);
    for (const q of flat) {
      expect(q.correctAnswer).toBeUndefined();
      expect(q.correctIndex).toBeUndefined();
      expect(q.correctPairs).toBeUndefined();
      expect(q.explainAr).toBeUndefined();
      expect(q.circuitGate).toBeUndefined();
      expect(q.expectedOutputs).toBeUndefined();
    }
  });

  it("exposes logic-circuit builder hints without answer keys", () => {
    const payload = getPublicQuizPayload("quiz-pre");
    const q = payload.sections.flatMap((s) => s.questions).find((x) => x.id === "pre-logic-and");
    expect(q?.type).toBe("logic-circuit");
    expect(q?.circuitPreset).toBe("ab-out");
    expect(q?.allowedGates).toContain("AND");
    expect(q?.circuitGate).toBeUndefined();
  });

  it("grades flowchart question pre-19", () => {
    const payload = getPublicQuizPayload("quiz-pre");
    const q19 = payload.sections.flatMap((s) => s.questions).find((q) => q.id === "pre-19");
    expect(q19?.type).toBe("flowchart");

    const graded = gradeAttempt("quiz-pre", {
      "pre-19": JSON.stringify({
        oval: "start-end",
        parallelogram: "io",
        diamond: "decision",
        rectangle: "process",
      }),
    });
    const item = graded.items.find((i) => i.questionId === "pre-19");
    expect(item?.correct).toBe(true);
  });

  it("marks essay as pending teacher review", () => {
    const result = gradeQuestion({ type: "essay", id: "x" }, "some answer");
    expect(result.gradingStatus).toBe("pending_teacher_review");
    expect(result.autoGraded).toBe(false);
  });

  it("grades logic circuit question pre-logic-and", () => {
    const answer = {
      nodes: [
        { id: "in-a", type: "INPUT", x: 36, y: 72, value: false, label: "A" },
        { id: "in-b", type: "INPUT", x: 36, y: 152, value: false, label: "B" },
        { id: "g-1", type: "AND", x: 200, y: 110, inputCount: 2 },
        { id: "out-1", type: "OUTPUT", x: 400, y: 112 },
      ],
      wires: [
        { id: "w1", from: "in-a", to: "g-1", toPort: 0 },
        { id: "w2", from: "in-b", to: "g-1", toPort: 1 },
        { id: "w3", from: "g-1", to: "out-1", toPort: 0 },
      ],
    };
    const graded = gradeAttempt("quiz-pre", { "pre-logic-and": JSON.stringify(answer) });
    const item = graded.items.find((i) => i.questionId === "pre-logic-and");
    expect(item?.correct).toBe(true);
    expect(item?.autoGraded).toBe(true);
  });

  it("sanitize adds instruction for logic-circuit", () => {
    const s = sanitizeQuestion({ type: "logic-circuit", questionAr: "test" });
    expect(s.instructionAr).toContain("الدارة");
    expect(s.circuitGate).toBeUndefined();
  });

  it("sanitize adds instruction for essay", () => {
    const s = sanitizeQuestion({ type: "essay", questionAr: "test" });
    expect(s.instructionAr).toContain("داخل المنصة");
  });

  it("teacher preview uses same section order and question ids as public", () => {
    const pub = getPublicQuizPayload("quiz-pre");
    const preview = getTeacherPreviewQuizPayload("quiz-pre");
    expect(preview.sections.length).toBe(pub.sections.length);
    expect(preview.sections.map((s) => s.id)).toEqual(pub.sections.map((s) => s.id));
    expect(preview.sections.map((s) => s.titleAr)).toEqual(pub.sections.map((s) => s.titleAr));
    const pubIds = pub.sections.flatMap((s) => s.questions.map((q) => q.id));
    const previewIds = preview.sections.flatMap((s) => s.questions.map((q) => q.id));
    expect(previewIds).toEqual(pubIds);
  });

  it("teacher preview includes model answers but public does not", () => {
    const preview = getTeacherPreviewQuizPayload("quiz-pre");
    const first = preview.sections[0]?.questions[0];
    expect(first?.modelAnswer).toBeTruthy();
    expect(first?.explainAr).toBeTruthy();
    const pub = getPublicQuizPayload("quiz-pre");
    const pubFirst = pub.sections[0]?.questions[0];
    expect(pubFirst?.modelAnswer).toBeUndefined();
    expect(pubFirst?.explainAr).toBeUndefined();
  });
});
