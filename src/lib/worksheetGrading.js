/** Auto-grading for structured worksheet questions. */

export function normalizeAnswer(value, mode = "text") {
  const s = String(value ?? "")
    .trim()
    .replace(/\s+/g, "");
  if (mode === "binary") return s.replace(/[^01]/gi, "");
  if (mode === "numeric") return s.replace(/[^\d.-]/g, "");
  if (mode === "lower") return s.toLowerCase();
  return s.toLowerCase();
}

export function gradeShortAnswer(userValue, { acceptedAnswers = [], normalize = "text" } = {}) {
  const normalized = normalizeAnswer(userValue, normalize);
  if (!normalized) return { correct: false, status: "unanswered" };
  const accepted = acceptedAnswers.map((a) => normalizeAnswer(a, normalize));
  const ok = accepted.includes(normalized);
  return { correct: ok, status: ok ? "correct" : "incorrect" };
}

export function gradeMultipleChoice(userValue, correctId) {
  if (userValue == null || userValue === "") return { correct: false, status: "unanswered" };
  const ok = String(userValue) === String(correctId);
  return { correct: ok, status: ok ? "correct" : "incorrect" };
}

export function gradeTrueFalse(userValue, correct) {
  if (userValue == null || userValue === "") return { correct: false, status: "unanswered" };
  const ok = Boolean(userValue) === Boolean(correct);
  return { correct: ok, status: ok ? "correct" : "incorrect" };
}

export function gradeWorksheetPart(part, userValue) {
  const type = part.type || "short_answer";
  if (type === "multiple_choice") return gradeMultipleChoice(userValue, part.correctAnswer);
  if (type === "true_false") return gradeTrueFalse(userValue, part.correct);
  if (type === "short_answer" || type === "numeric_answer") {
    return gradeShortAnswer(userValue, part);
  }
  return { correct: null, status: "pending" };
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
