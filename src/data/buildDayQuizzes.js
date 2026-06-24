/**
 * بناء اختبارات الأيام من بنك التقويم القبلي/البعدي الرسمي + أسئلة مشتقة.
 */
import {
  OFFICIAL_PRE_TEST_QUESTIONS,
  OFFICIAL_POST_TEST_QUESTIONS,
} from "./officialPdfAssessments.js";
import { OFFICIAL_QUESTION_TOPICS, getTopicsForOfficialId } from "./officialQuestionTopics.js";
import { DERIVED_QUESTIONS_BY_TOPIC } from "./dayQuizDerived.js";
import { curriculumDays } from "./curriculum15Days.js";

/** @typedef {'pre'|'post'|'derived'} QuestionSourceBank */

/**
 * @typedef {object} DayQuizQuestion
 * @property {string} id
 * @property {string} questionAr
 * @property {string} explainAr
 * @property {string} [type]
 * @property {string[]} [optionsAr]
 * @property {number} [correctIndex]
 * @property {string} [correctAnswer]
 * @property {string[]} [acceptAnswers]
 * @property {string} [codeSnippetAr]
 * @property {string} [sourceRef]
 * @property {QuestionSourceBank} [sourceBank]
 */

/**
 * @typedef {object} DayQuizMappingEntry
 * @property {string} dayId
 * @property {number} dayNumber
 * @property {string} topicAr
 * @property {string[]} topics
 * @property {string} quizId
 * @property {Array<{ id: string, sourceBank: QuestionSourceBank, sourceRef: string, type: string }>} questions
 */

/** @type {Array<{ dayId: string, quizId: string, topics: string[], minQuestions: number, maxQuestions: number, preferPost?: boolean }>} */
const DAY_QUIZ_SPECS = [
  {
    dayId: "day-01",
    quizId: "quiz-day-01",
    topics: ["number-systems", "binary", "hex", "python-basics"],
    minQuestions: 8,
    maxQuestions: 10,
  },
  {
    dayId: "day-02",
    quizId: "quiz-day-02",
    topics: ["algorithms", "control-flow", "loops"],
    minQuestions: 7,
    maxQuestions: 9,
  },
  {
    dayId: "day-03",
    quizId: "quiz-day-03",
    topics: ["logic", "truth-tables"],
    minQuestions: 7,
    maxQuestions: 8,
  },
  {
    dayId: "day-04",
    quizId: "quiz-day-04",
    topics: ["karnaugh", "functions", "loops", "control-flow"],
    minQuestions: 7,
    maxQuestions: 9,
  },
  {
    dayId: "day-05",
    quizId: "quiz-day-05",
    topics: ["search-sort", "algorithms"],
    minQuestions: 7,
    maxQuestions: 8,
  },
  {
    dayId: "day-06",
    quizId: "quiz-day-06",
    topics: ["crypto", "memory", "scheduling", "hardware"],
    minQuestions: 8,
    maxQuestions: 10,
  },
  {
    dayId: "day-07",
    quizId: "quiz-day-07",
    topics: ["scope", "algorithms"],
    minQuestions: 6,
    maxQuestions: 8,
  },
  {
    dayId: "day-08",
    quizId: "quiz-day-08",
    topics: ["complexity", "files", "lists", "strings"],
    minQuestions: 7,
    maxQuestions: 9,
  },
  {
    dayId: "day-09",
    quizId: "quiz-day-09",
    topics: ["recursion", "loops"],
    minQuestions: 6,
    maxQuestions: 8,
  },
  {
    dayId: "day-10",
    quizId: "quiz-day-10",
    topics: ["oop", "functions", "recursion"],
    minQuestions: 6,
    maxQuestions: 8,
  },
  {
    dayId: "day-11",
    quizId: "quiz-day-11",
    topics: ["ai", "ethics"],
    minQuestions: 6,
    maxQuestions: 8,
  },
  {
    dayId: "day-12",
    quizId: "quiz-day-12",
    topics: ["fsm", "graphs", "flowchart"],
    minQuestions: 7,
    maxQuestions: 9,
  },
  {
    dayId: "day-14",
    quizId: "quiz-day-14",
    topics: ["project-review", "review"],
    minQuestions: 6,
    maxQuestions: 8,
  },
];

const AUTO_GRADABLE = new Set(["mcq", "truefalse", "fill"]);

function isAutoGradableType(type) {
  return AUTO_GRADABLE.has(type || "mcq");
}

function buildOfficialIndex() {
  /** @type {Map<string, { q: object, bank: 'pre'|'post' }>} */
  const map = new Map();
  for (const q of OFFICIAL_PRE_TEST_QUESTIONS) {
    map.set(q.id, { q, bank: "pre" });
  }
  for (const q of OFFICIAL_POST_TEST_QUESTIONS) {
    if (!map.has(q.id)) {
      map.set(q.id, { q, bank: "post" });
    }
  }
  return map;
}

function questionMatchesTopics(officialId, dayTopics) {
  const qTopics = getTopicsForOfficialId(officialId);
  return qTopics.some((t) => dayTopics.includes(t));
}

function scoreOfficialCandidate(entry, dayTopics) {
  const qTopics = getTopicsForOfficialId(entry.q.id);
  const overlap = qTopics.filter((t) => dayTopics.includes(t)).length;
  const gradableBoost = isAutoGradableType(entry.q.type) ? 0.5 : 0;
  const order = entry.q.pdfOrder ?? 999;
  return overlap * 10 + gradableBoost - order * 0.001;
}

function cloneOfficialForDay(entry, dayNumber) {
  const prefix = `d${String(dayNumber).padStart(2, "0")}`;
  const { q, bank } = entry;
  /** @type {DayQuizQuestion} */
  const cloned = {
    ...q,
    id: `${prefix}-${q.id}`,
    sourceRef: q.id,
    sourceBank: bank,
    explainAr: q.explainAr || "من التقويم الرسمي — ملف PDF المعتمد.",
  };
  delete cloned.pdfOrder;
  return cloned;
}

function cloneDerivedForDay(q, dayNumber) {
  const prefix = `d${String(dayNumber).padStart(2, "0")}`;
  return {
    ...q,
    id: `${prefix}-${q.id}`,
    sourceRef: q.id,
    sourceBank: /** @type {const} */ ("derived"),
    explainAr: q.explainAr || "سؤال مشتق بمستوى منهج برمجة الحاسب.",
  };
}

function pickDerived(dayTopics, usedDerived, limit) {
  const picked = [];
  for (const topic of dayTopics) {
    const pool = DERIVED_QUESTIONS_BY_TOPIC[topic] || [];
    for (const q of pool) {
      if (usedDerived.has(q.id)) continue;
      picked.push(q);
      usedDerived.add(q.id);
      if (picked.length >= limit) return picked;
    }
  }
  return picked;
}

export function buildDayQuizzes() {
  const officialIndex = buildOfficialIndex();
  const usedOfficial = new Set();
  const usedDerived = new Set();
  /** @type {DayQuizMappingEntry[]} */
  const mapping = [];
  /** @type {Array<{ id: string, unitId: null, titleAr: string, descriptionAr: string, passPercent: number, shuffle: boolean, questions: DayQuizQuestion[] }>} */
  const quizzes = [];

  let statsFromPre = 0;
  let statsFromPost = 0;
  let statsDerived = 0;

  for (const spec of DAY_QUIZ_SPECS) {
    const dayMeta = curriculumDays.find((d) => d.id === spec.dayId);
    const dayNumber = dayMeta?.dayNumber ?? 0;

    const candidates = [];
    for (const [id, entry] of officialIndex) {
      if (usedOfficial.has(id)) continue;
      if (!questionMatchesTopics(id, spec.topics)) continue;
      candidates.push({ entry, score: scoreOfficialCandidate(entry, spec.topics) });
    }
    candidates.sort((a, b) => b.score - a.score);

    /** @type {DayQuizQuestion[]} */
    const questions = [];
    for (const { entry } of candidates) {
      if (questions.length >= spec.maxQuestions) break;
      questions.push(cloneOfficialForDay(entry, dayNumber));
      usedOfficial.add(entry.q.id);
      if (entry.bank === "pre") statsFromPre += 1;
      else statsFromPost += 1;
    }

    if (questions.length < spec.minQuestions) {
      let need = spec.minQuestions - questions.length;
      while (need > 0) {
        const batch = pickDerived(spec.topics, usedDerived, need);
        if (batch.length === 0) break;
        for (const dq of batch) {
          questions.push(cloneDerivedForDay(dq, dayNumber));
          statsDerived += 1;
          need -= 1;
        }
      }
    }

    mapping.push({
      dayId: spec.dayId,
      dayNumber,
      topicAr: dayMeta?.titleAr ?? spec.dayId,
      topics: [...spec.topics],
      quizId: spec.quizId,
      questions: questions.map((q) => ({
        id: q.id,
        sourceBank: q.sourceBank || "derived",
        sourceRef: q.sourceRef || q.id,
        type: q.type || "mcq",
      })),
    });

    quizzes.push({
      id: spec.quizId,
      unitId: null,
      titleAr: `اختبار اليوم ${dayNumber} — ${(dayMeta?.titleAr ?? "").replace(/^اليوم\s+\S+\s+—\s+/, "") || "مراجعة"}`,
      descriptionAr: `أسئلة مرتبطة بموضوعات ${dayMeta?.titleAr ?? `اليوم ${dayNumber}`} فقط — مُستمدة من بنك التقويم الرسمي قدر الإمكان (${questions.length} سؤالاً).`,
      passPercent: 50,
      shuffle: true,
      questions,
    });
  }

  const perDayCounts = Object.fromEntries(
    mapping.map((m) => [m.dayId, m.questions.length]),
  );

  return {
    dayQuizzes: quizzes,
    mapping,
    stats: {
      perDayCounts,
      fromPre: statsFromPre,
      fromPost: statsFromPost,
      derived: statsDerived,
      totalDayQuestions: statsFromPre + statsFromPost + statsDerived,
    },
  };
}

export const { dayQuizzes, mapping: DAY_QUIZ_QUESTION_MAPPING, stats: DAY_QUIZ_BUILD_STATS } =
  buildDayQuizzes();
