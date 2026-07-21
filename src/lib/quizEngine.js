/**
 * محرك الاختبارات — خلط الأسئلة واختيار عشوائي من بنك الأسئلة
 */
import {
  computeAssessmentResult,
  gradeQuestion,
  isAutoGradable,
  normalizeAnswerText,
} from "./assessment/unifiedAssessment.js";

export { isAutoGradable, normalizeAnswerText, gradeQuestion };

function hashSeed(seed) {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function next() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleWithSeed(items, seed) {
  const arr = [...items];
  const rand = mulberry32(hashSeed(seed));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** عدد الأسئلة المعروض للمستخدم (بنك عشوائي أو قائمة ثابتة). */
export function getQuizQuestionCount(quiz) {
  if (!quiz) return 0;
  if (quiz.questionPool?.length && quiz.drawCount > 0) {
    return Math.min(quiz.drawCount, quiz.questionPool.length);
  }
  return quiz.questions?.length ?? 0;
}

export function prepareQuizForAttempt(quiz, attemptSeed = Date.now()) {
  if (!quiz) return null;
  const seed = `${quiz.id}-${attemptSeed}`;

  let questions;
  if (quiz.questionPool?.length && quiz.drawCount > 0) {
    if (quiz.shuffle === false) {
      questions = [...quiz.questionPool]
        .sort((a, b) => (a.pdfOrder ?? 0) - (b.pdfOrder ?? 0))
        .slice(0, Math.min(quiz.drawCount, quiz.questionPool.length));
    } else {
      const pool = shuffleWithSeed(quiz.questionPool, seed);
      questions = pool.slice(0, Math.min(quiz.drawCount, pool.length));
    }
  } else if (quiz.shuffle !== false && quiz.questions?.length) {
    questions = shuffleWithSeed(quiz.questions, seed);
  } else {
    questions = [...(quiz.questions || [])];
  }

  return { ...quiz, questions, _sessionSeed: seed };
}

export function isQuestionCorrect(question, userAnswer) {
  const graded = gradeQuestion(question, userAnswer);
  return graded.autoGraded && graded.correct === true;
}

export function computeQuizResult(quiz, answers) {
  const byId = Object.fromEntries(quiz.questions.map((q) => [q.id, answers[q.id]]));
  return computeAssessmentResult(quiz.questions, byId, quiz.passPercent ?? 0);
}
