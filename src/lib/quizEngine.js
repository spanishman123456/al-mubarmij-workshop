/**
 * محرك الاختبارات — خلط الأسئلة واختيار عشوائي من بنك الأسئلة
 */

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

export function isAutoGradable(question) {
  const type = question.type || "mcq";
  return type === "mcq" || type === "truefalse" || type === "fill";
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

export function normalizeAnswerText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[ًٌٍَُِّْ]/g, "");
}

export function isQuestionCorrect(question, userAnswer) {
  const type = question.type || "mcq";

  if (!isAutoGradable(question)) {
    return false;
  }

  if (type === "fill") {
    const normalized = normalizeAnswerText(userAnswer);
    if (!normalized) return false;
    const accepted = question.acceptAnswers?.length
      ? question.acceptAnswers
      : [question.correctAnswer];
    return accepted.some((a) => normalizeAnswerText(a) === normalized);
  }

  if (userAnswer === undefined || userAnswer === null || userAnswer === "") return false;
  return Number(userAnswer) === question.correctIndex;
}

export function computeQuizResult(quiz, answers) {
  const gradable = quiz.questions.filter(isAutoGradable);
  const manual = quiz.questions.filter((q) => !isAutoGradable(q));

  let correct = 0;
  for (const q of gradable) {
    if (isQuestionCorrect(q, answers[q.id])) correct += 1;
  }

  let manualAnswered = 0;
  for (const q of manual) {
    if (String(answers[q.id] ?? "").trim().length > 0) manualAnswered += 1;
  }

  const total = gradable.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  const passed = percent >= quiz.passPercent;
  return {
    correct,
    total,
    percent,
    passed,
    manualTotal: manual.length,
    manualAnswered,
    displayTotal: quiz.questions.length,
  };
}
