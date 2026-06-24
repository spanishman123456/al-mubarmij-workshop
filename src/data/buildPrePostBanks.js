/**
 * بناء بنكي التقويم القبلي والبعدي من أسئلة الوحدات ومسار 15 يومًا والمراجعة الشاملة.
 * القبلي: أسئلة الوحدات + مكملات تأسيسية (لا تتكرر نصوصها في البعدي).
 * البعدي: أسئلة الأيام + المراجعة الشاملة + مكملات ختامية.
 */

import { PRE_LEGACY_SUPPLEMENT, POST_LEGACY_SUPPLEMENT } from "./prePostQuestionBank.js";

/** @param {import('./quizzes.js').QuizQuestion} q @param {string} prefix */
function cloneQuestion(q, prefix) {
  const type = q.type || "mcq";
  return {
    id: `${prefix}-${q.id}`,
    type,
    questionAr: q.questionAr,
    explainAr: q.explainAr,
    ...(q.optionsAr ? { optionsAr: [...q.optionsAr] } : {}),
    ...(q.correctIndex !== undefined ? { correctIndex: q.correctIndex } : {}),
    ...(q.correctAnswer != null ? { correctAnswer: q.correctAnswer } : {}),
    ...(q.acceptAnswers ? { acceptAnswers: [...q.acceptAnswers] } : {}),
  };
}

function dedupeByQuestionText(questions) {
  const seen = new Set();
  return questions.filter((q) => {
    if (seen.has(q.questionAr)) return false;
    seen.add(q.questionAr);
    return true;
  });
}

/**
 * @param {import('./quizzes.js').Quiz[]} allQuizzes quizzes before pre/post entries
 */
export function buildPrePostBanks(allQuizzes) {
  const unitQuizzes = allQuizzes.filter((q) => q.unitId != null);
  const dayQuizzes = allQuizzes.filter((q) => q.id?.startsWith("quiz-day"));
  const comprehensive = allQuizzes.find((q) => q.id === "quiz-comprehensive");

  const preFromUnits = unitQuizzes.flatMap((quiz) =>
    (quiz.questions || []).map((q) => cloneQuestion(q, "pre-u")),
  );

  const preUnitTexts = new Set(preFromUnits.map((q) => q.questionAr));
  const preLegacy = PRE_LEGACY_SUPPLEMENT.filter((q) => !preUnitTexts.has(q.questionAr));

  const PRE_TEST_QUESTION_BANK = dedupeByQuestionText([...preFromUnits, ...preLegacy]);

  const postFromDays = dayQuizzes.flatMap((quiz) =>
    (quiz.questions || []).map((q) => cloneQuestion(q, "post-d")),
  );
  const postFromComp = (comprehensive?.questions || []).map((q) => cloneQuestion(q, "post-c"));

  const postDayTexts = new Set(postFromDays.map((q) => q.questionAr));
  const postCompFiltered = postFromComp.filter((q) => !postDayTexts.has(q.questionAr));
  const postLegacy = POST_LEGACY_SUPPLEMENT.filter(
    (q) => !postDayTexts.has(q.questionAr) && !postCompFiltered.some((c) => c.questionAr === q.questionAr),
  );

  let POST_TEST_QUESTION_BANK = dedupeByQuestionText([
    ...postFromDays,
    ...postCompFiltered,
    ...postLegacy,
  ]);

  const preTexts = new Set(PRE_TEST_QUESTION_BANK.map((q) => q.questionAr));
  POST_TEST_QUESTION_BANK = POST_TEST_QUESTION_BANK.filter((q) => !preTexts.has(q.questionAr));

  return { PRE_TEST_QUESTION_BANK, POST_TEST_QUESTION_BANK };
}
