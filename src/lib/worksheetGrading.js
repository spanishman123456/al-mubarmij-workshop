/** Auto-grading for structured worksheet questions. */

import { gradeStructuredItem, normalizeAnswer } from "./assessment/unifiedAssessment.js";

export { normalizeAnswer };

export function gradeShortAnswer(userValue, opts = {}) {
  const result = gradeStructuredItem(
    { type: "short_answer", acceptedAnswers: opts.acceptedAnswers, normalize: opts.normalize },
    userValue,
  );
  return {
    correct: result.correct,
    status:
      result.gradingStatus === "unanswered"
        ? "unanswered"
        : result.correct
          ? "correct"
          : "incorrect",
  };
}

export function gradeMultipleChoice(userValue, correctId) {
  return gradeStructuredItem(
    { type: "multiple_choice", correctAnswer: correctId, choices: [{ id: correctId }] },
    userValue,
  );
}

export function gradeTrueFalse(userValue, correct) {
  return gradeStructuredItem({ type: "true_false", correct }, userValue);
}

export function gradeWorksheetPart(part, userValue) {
  const result = gradeStructuredItem(part, userValue);
  return {
    correct: result.correct,
    status:
      result.gradingStatus === "unanswered"
        ? "unanswered"
        : result.correct
          ? "correct"
          : "incorrect",
  };
}

export function gradeWorksheetTask(task, answer) {
  if (!task?.type || task.type === "essay" || task.type === "optional_note") {
    return { graded: false, parts: [] };
  }
  if (task.type === "multi_part") {
    const parts = (task.parts || []).map((part) => {
      const userVal = typeof answer === "object" && answer ? answer[part.id] : undefined;
      return { id: part.id, ...gradeWorksheetPart(part, userVal) };
    });
    const gradable = parts.filter((p) => p.status !== "pending");
    const correct = gradable.filter((p) => p.correct).length;
    return {
      graded: gradable.length > 0,
      parts,
      correctCount: correct,
      totalGradable: gradable.length,
      allCorrect: gradable.length > 0 && correct === gradable.length,
    };
  }
  const single = gradeWorksheetPart(task, answer);
  return {
    graded: single.status !== "pending",
    parts: [{ id: "main", ...single }],
    correctCount: single.correct ? 1 : 0,
    totalGradable: single.status === "unanswered" ? 0 : 1,
    allCorrect: single.correct === true,
  };
}

export function isStructuredTask(task) {
  return Boolean(task?.type && task.type !== "essay");
}

export function taskAnswerComplete(task, answer) {
  if (!isStructuredTask(task)) {
    return typeof answer === "string" && answer.trim().length > 0;
  }
  if (task.type === "multi_part") {
    return (task.parts || []).every((part) => {
      const v = typeof answer === "object" && answer ? answer[part.id] : undefined;
      return v != null && String(v).trim() !== "";
    });
  }
  if (task.type === "binary_cards_sheet" || task.type === "binary-cards-sheet") {
    return typeof answer === "string" && answer.trim().startsWith("{");
  }
  return answer != null && String(answer).trim() !== "";
}
