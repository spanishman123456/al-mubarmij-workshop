import {
  OFFICIAL_PRE_TEST_QUESTIONS,
  OFFICIAL_POST_TEST_QUESTIONS,
} from "../../src/data/officialPdfAssessments.js";
import { buildSectionGroups, getSectionsForQuiz } from "./quizSections.js";

const BANKS = {
  "quiz-pre": OFFICIAL_PRE_TEST_QUESTIONS,
  "quiz-post": OFFICIAL_POST_TEST_QUESTIONS,
};

const KEY_FIELDS = ["correctIndex", "correctAnswer", "acceptAnswers", "correctPairs", "correctOrder", "explainAr"];

export function isServerBankQuiz(quizId) {
  return quizId === "quiz-pre" || quizId === "quiz-post";
}

export function getQuizBank(quizId) {
  const bank = BANKS[quizId];
  if (!bank) return null;
  return [...bank].sort((a, b) => (a.pdfOrder ?? 0) - (b.pdfOrder ?? 0));
}

export function sanitizeQuestion(q) {
  const out = { ...q };
  for (const k of KEY_FIELDS) delete out[k];
  if (out.type === "match") {
    out.instructionAr =
      out.instructionAr || "اختر الوظيفة المناسبة لكل رمز من القائمة، ثم احفظ إجابتك.";
  }
  if (out.type === "order") {
    out.instructionAr = out.instructionAr || "رتّب الخطوات بالسحب أو باختيار الترتيب الصحيح.";
  }
  if (out.type === "essay") {
    out.instructionAr =
      out.instructionAr || "اكتب إجابتك داخل المنصة — لا حاجة لدفتر خارجي. استخدم نقاطًا مرقمة إن طُلب.";
  }
  if (out.type === "code") {
    out.instructionAr = out.instructionAr || "اكتب الكود في المحرر أدناه. يمكنك تعديل إجابتك قبل الإرسال النهائي.";
  }
  return out;
}

export function getPublicQuizPayload(quizId) {
  const bank = getQuizBank(quizId);
  if (!bank) return null;
  const questions = bank.map(sanitizeQuestion);
  const sections = buildSectionGroups(quizId, questions);
  return {
    quizId,
    titleAr: quizId === "quiz-pre" ? "الاختبار القبلي" : "الاختبار البعدي",
    passPercent: quizId === "quiz-post" ? 60 : 0,
    totalQuestions: questions.length,
    sections,
    sectionMeta: getSectionsForQuiz(quizId).map(({ id, titleAr }) => ({ id, titleAr })),
  };
}

function normalizeAnswerText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[ًٌٍَُِّْ]/g, "");
}

export function isAutoGradable(question) {
  const type = question.type || "mcq";
  return ["mcq", "truefalse", "fill", "match", "order"].includes(type);
}

function gradeMatch(question, userAnswer) {
  try {
    const parsed = typeof userAnswer === "string" ? JSON.parse(userAnswer) : userAnswer;
    const expected = question.correctPairs || {};
    const keys = Object.keys(expected);
    if (!keys.length) return false;
    return keys.every((k) => String(parsed?.[k]) === String(expected[k]));
  } catch {
    return false;
  }
}

function gradeOrder(question, userAnswer) {
  try {
    const parsed = typeof userAnswer === "string" ? JSON.parse(userAnswer) : userAnswer;
    const expected = question.correctOrder || [];
    if (!Array.isArray(parsed) || parsed.length !== expected.length) return false;
    return parsed.every((v, i) => Number(v) === Number(expected[i]));
  } catch {
    return false;
  }
}

export function gradeQuestion(question, userAnswer) {
  const type = question.type || "mcq";
  if (!isAutoGradable(question)) {
    const hasAnswer = userAnswer !== undefined && userAnswer !== null && String(userAnswer).trim() !== "";
    return {
      correct: null,
      gradingStatus: hasAnswer ? "pending_teacher_review" : "unanswered",
      autoGraded: false,
    };
  }

  let correct = false;
  if (type === "fill") {
    const normalized = normalizeAnswerText(userAnswer);
    const accepted = question.acceptAnswers?.length ? question.acceptAnswers : [question.correctAnswer];
    correct = Boolean(normalized) && accepted.some((a) => normalizeAnswerText(a) === normalized);
  } else if (type === "match") {
    correct = gradeMatch(question, userAnswer);
  } else if (type === "order") {
    correct = gradeOrder(question, userAnswer);
  } else if (userAnswer !== undefined && userAnswer !== null && userAnswer !== "") {
    correct = Number(userAnswer) === question.correctIndex;
  }

  return { correct, gradingStatus: correct ? "correct" : "incorrect", autoGraded: true };
}

export function gradeAttempt(quizId, answers) {
  const bank = getQuizBank(quizId);
  if (!bank) return null;

  const byId = Object.fromEntries(bank.map((q) => [q.id, q]));
  const items = [];
  let autoCorrect = 0;
  let autoTotal = 0;
  let manualPending = 0;

  for (const q of bank) {
    const userAnswer = answers[q.id];
    const graded = gradeQuestion(q, userAnswer);
    if (graded.autoGraded) {
      autoTotal += 1;
      if (graded.correct) autoCorrect += 1;
    } else if (graded.gradingStatus === "pending_teacher_review") {
      manualPending += 1;
    }
    items.push({
      questionId: q.id,
      userAnswer,
      ...graded,
    });
  }

  const percent = autoTotal === 0 ? 0 : Math.round((autoCorrect / autoTotal) * 100);
  const passPercent = quizId === "quiz-post" ? 60 : 0;

  return {
    autoCorrect,
    autoTotal,
    manualPending,
    manualTotal: bank.length - autoTotal,
    percent,
    passed: quizId === "quiz-post" ? percent >= passPercent : true,
    items,
    byId,
  };
}

export function buildReviewPayload(quizId, answers, teacherNotes = {}) {
  const graded = gradeAttempt(quizId, answers);
  if (!graded) return null;

  const bank = getQuizBank(quizId);
  const questions = bank.map((q) => {
    const item = graded.items.find((i) => i.questionId === q.id);
    const review = {
      id: q.id,
      pdfOrder: q.pdfOrder,
      type: q.type || "mcq",
      questionAr: q.questionAr,
      userAnswer: answers[q.id],
      gradingStatus: item?.gradingStatus || "unanswered",
      autoGraded: item?.autoGraded ?? false,
      correct: item?.correct ?? null,
      explainAr: q.explainAr,
      instructionAr: q.instructionAr,
      lessonLink: q.lessonLink || null,
      teacherNote: teacherNotes[q.id] || null,
      optionsAr: q.optionsAr,
      matchLeft: q.matchLeft,
      matchRight: q.matchRight,
      orderItems: q.orderItems,
    };

    if (item?.autoGraded) {
      review.modelAnswer =
        q.type === "fill"
          ? q.correctAnswer
          : q.type === "match"
            ? q.matchRight
            : q.type === "order"
              ? (q.orderItems || []).map((_, i) => q.orderItems[q.correctOrder[i]])
              : q.optionsAr?.[q.correctIndex];
      review.correctPairs = q.type === "match" ? q.correctPairs : undefined;
      review.correctOrder = q.type === "order" ? q.correctOrder : undefined;
    } else if (item?.gradingStatus === "pending_teacher_review") {
      review.modelAnswer = q.modelAnswerAr || "يُراجع المعلم هذه الإجابة.";
    }

    return review;
  });

  return {
    quizId,
    diagnostic: quizId === "quiz-pre",
    summary: {
      autoCorrect: graded.autoCorrect,
      autoTotal: graded.autoTotal,
      percent: graded.percent,
      passed: graded.passed,
      manualPending: graded.manualPending,
    },
    questions,
  };
}
