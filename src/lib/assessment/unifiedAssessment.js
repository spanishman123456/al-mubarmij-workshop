/**
 * Unified auto-grading for quizzes, worksheets, and lesson exercises.
 * Single source for: mcq, truefalse, fill, short/numeric answers, and interactive types.
 */
import {
  gradeCardFlip,
  gradeCardSheet,
  gradeFlowchart,
  gradeLogicCircuit,
  gradeMatch,
  gradeOrder,
  gradeTruthTable,
  logicCircuitModelLabel,
  truthTableModelAnswer,
} from "../quiz/grading.js";

export const QUESTION_TYPE_ALIASES = {
  multiple_choice: "mcq",
  true_false: "truefalse",
  short_answer: "fill",
  numeric_answer: "fill",
  binary_cards: "binary-cards",
  binary_cards_sheet: "binary-cards-sheet",
};

export function normalizeQuestionType(type) {
  if (!type) return "mcq";
  return QUESTION_TYPE_ALIASES[type] || type;
}

export function normalizeAnswerText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[ًٌٍَُِّْ]/g, "");
}

export function normalizeAnswer(value, mode = "text") {
  const s = String(value ?? "")
    .trim()
    .replace(/\s+/g, "");
  if (mode === "binary") return s.replace(/[^01]/gi, "");
  if (mode === "numeric") return s.replace(/[^\d.-]/g, "");
  if (mode === "lower") return s.toLowerCase();
  return normalizeAnswerText(value);
}

export function isAutoGradable(question) {
  const type = normalizeQuestionType(question?.type);
  return [
    "mcq",
    "truefalse",
    "fill",
    "match",
    "order",
    "truth-table",
    "binary-cards",
    "binary-cards-sheet",
    "flowchart",
    "logic-circuit",
  ].includes(type);
}

function hasUserAnswer(userAnswer) {
  if (userAnswer === undefined || userAnswer === null) return false;
  if (typeof userAnswer === "string") return userAnswer.trim() !== "";
  if (typeof userAnswer === "boolean") return true;
  return true;
}

/** Grade any platform question (quiz shape). */
export function gradeQuestion(question, userAnswer) {
  const type = normalizeQuestionType(question?.type);
  const manualTypes = ["essay", "code", "code-editor", "optional_note"];
  if (manualTypes.includes(type)) {
    return {
      correct: null,
      gradingStatus: hasUserAnswer(userAnswer) ? "pending_teacher_review" : "unanswered",
      autoGraded: false,
    };
  }
  if (!isAutoGradable({ type })) {
    return {
      correct: null,
      gradingStatus: hasUserAnswer(userAnswer) ? "pending_teacher_review" : "unanswered",
      autoGraded: false,
    };
  }

  let correct = false;
  if (type === "fill") {
    const mode = question.normalize || "text";
    const normalized =
      mode === "binary" || mode === "numeric" || mode === "lower"
        ? normalizeAnswer(userAnswer, mode)
        : normalizeAnswerText(userAnswer);
    if (!normalized) {
      return { correct: false, gradingStatus: "unanswered", autoGraded: true };
    }
    const accepted = question.acceptAnswers?.length
      ? question.acceptAnswers
      : question.acceptedAnswers?.length
        ? question.acceptedAnswers
        : question.correctAnswer != null
          ? [question.correctAnswer]
          : [];
    correct = accepted.some((a) => {
      const na =
        mode === "binary" || mode === "numeric" || mode === "lower"
          ? normalizeAnswer(a, mode)
          : normalizeAnswerText(a);
      return na === normalized;
    });
  } else if (type === "match") {
    correct = gradeMatch(question, userAnswer);
  } else if (type === "order") {
    correct = gradeOrder(question, userAnswer);
  } else if (type === "truth-table") {
    correct = gradeTruthTable(question, userAnswer);
  } else if (type === "binary-cards") {
    correct = gradeCardFlip(question, userAnswer);
  } else if (type === "binary-cards-sheet") {
    correct = gradeCardSheet(question, userAnswer);
  } else if (type === "flowchart") {
    correct = gradeFlowchart(question, userAnswer);
  } else if (type === "logic-circuit") {
    correct = gradeLogicCircuit(question, userAnswer);
  } else if (type === "truefalse") {
    if (!hasUserAnswer(userAnswer)) {
      return { correct: false, gradingStatus: "unanswered", autoGraded: true };
    }
    const expected =
      question.correct === true || question.correct === false
        ? question.correct
        : question.correctIndex === 0 || question.correctIndex === 1
          ? question.correctIndex === 0
          : question.optionsAr?.[question.correctIndex] === "صح" ||
            question.optionsAr?.[question.correctIndex] === "صحيح";
    correct = Boolean(userAnswer) === Boolean(expected);
  } else if (hasUserAnswer(userAnswer)) {
    if (question.correctAnswer != null && !question.optionsAr?.length) {
      correct = String(userAnswer) === String(question.correctAnswer);
    } else if (question.correctIndex != null) {
      correct = Number(userAnswer) === Number(question.correctIndex);
    }
  }

  return {
    correct,
    gradingStatus: correct ? "correct" : hasUserAnswer(userAnswer) ? "incorrect" : "unanswered",
    autoGraded: true,
  };
}

/** Normalize worksheet part / lesson exercise → quiz question shape → grade. */
export function toQuizShape(item) {
  const type = normalizeQuestionType(item.type);
  if (type === "mcq" && item.choices && item.correctAnswer != null) {
    const choices = item.choices;
    const correctIndex = choices.findIndex((c) => c.id === item.correctAnswer);
    return {
      type: "mcq",
      optionsAr: choices.map((c) => c.textAr || c.text || c.label || String(c.id)),
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      acceptAnswers: item.acceptedAnswers,
      normalize: item.normalize,
    };
  }
  if (type === "truefalse") {
    const correct = item.correct ?? item.correctAnswer === true;
    return {
      type: "truefalse",
      correct,
      optionsAr: ["صح", "خطأ"],
      correctIndex: correct ? 0 : 1,
    };
  }
  if (type === "fill" || item.acceptedAnswers) {
    return {
      type: "fill",
      correctAnswer: item.correctAnswer ?? item.answer ?? item.acceptedAnswers?.[0],
      acceptAnswers: item.acceptedAnswers || (item.answer != null ? [item.answer] : []),
      normalize: item.normalize || "text",
    };
  }
  return { ...item, type };
}

export function gradeStructuredItem(item, userAnswer) {
  const type = normalizeQuestionType(item.type);
  if (type === "mcq" && item.choices?.length && item.correctAnswer != null) {
    if (!hasUserAnswer(userAnswer)) {
      return { correct: false, gradingStatus: "unanswered", autoGraded: true };
    }
    const ok = String(userAnswer) === String(item.correctAnswer);
    return {
      correct: ok,
      gradingStatus: ok ? "correct" : "incorrect",
      autoGraded: true,
    };
  }
  return gradeQuestion(toQuizShape(item), userAnswer);
}

export function computeAssessmentResult(questions, answers, passPercent = 0) {
  const gradable = questions.filter(isAutoGradable);
  const manual = questions.filter((q) => !isAutoGradable(q));
  let correct = 0;
  for (const q of gradable) {
    const g = gradeQuestion(q, answers[q.id]);
    if (g.correct) correct += 1;
  }
  let manualAnswered = 0;
  for (const q of manual) {
    if (hasUserAnswer(answers[q.id])) manualAnswered += 1;
  }
  const total = gradable.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return {
    correct,
    total,
    percent,
    passed: percent >= passPercent,
    manualTotal: manual.length,
    manualAnswered,
    displayTotal: questions.length,
  };
}

export function formatUserAnswerDisplay(question, userAnswer) {
  const type = normalizeQuestionType(question?.type);
  if (userAnswer === undefined || userAnswer === null || String(userAnswer).trim() === "") {
    return "لم تُجِب";
  }
  if (type === "truefalse" || typeof userAnswer === "boolean") {
    return userAnswer === true || userAnswer === "true" ? "صح" : "خطأ";
  }
  if (type === "fill" || type === "essay" || type === "code") {
    return String(userAnswer);
  }
  if (question.optionsAr?.length) {
    return question.optionsAr[Number(userAnswer)] ?? String(userAnswer);
  }
  if (question.choices?.length) {
    const c = question.choices.find((x) => x.id === userAnswer);
    return c?.textAr || c?.text || String(userAnswer);
  }
  return String(userAnswer);
}

export function hasAnswerValue(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "boolean") return true;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return String(value).trim() !== "";
}

export function formatModelAnswerDisplay(question) {
  const type = normalizeQuestionType(question?.type);
  if (type === "fill") return String(question.correctAnswer ?? "");
  if (type === "match") return (question.matchRight || []).join("، ");
  if (type === "order") {
    const items = question.orderItems || [];
    const order = question.correctOrder || [];
    return order.map((i) => items[i]).filter(Boolean).join(" → ");
  }
  if (type === "truth-table") return truthTableModelAnswer(question);
  if (type === "binary-cards") return `مجموع البطاقات = ${question.target}`;
  if (type === "binary-cards-sheet") return (question.targets || []).join("، ");
  if (type === "flowchart") return (question.correctFlow || "");
  if (type === "logic-circuit") return logicCircuitModelLabel(question);
  if (type === "truefalse") {
    const correct =
      question.correct === true || question.correct === false
        ? question.correct
        : question.correctIndex === 0;
    return correct ? "صح" : "خطأ";
  }
  if (question.optionsAr?.length && question.correctIndex != null) {
    return question.optionsAr[question.correctIndex];
  }
  return String(question.correctAnswer ?? "");
}
