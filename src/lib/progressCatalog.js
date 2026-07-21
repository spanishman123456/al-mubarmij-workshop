/**
 * كatalog العناصر الإلزامية المنشورة + فحص الإكمال — مشترك بين الخادم والعميل.
 */

import { LESSON_ID_TO_DAY } from "../config/publicationPolicy.js";
import { curriculumDays } from "../data/curriculum15Days.js";
import { DOC_TYPES } from "../content/onboarding/onboardingPolicy.js";
import { lessonLabelAr } from "./lessonLabelsAr.js";

export const PROGRESS_VERSION = "v2";

const BINGO_LABEL = "BINGO";
const AGREEMENT_LABELS = {
  honor_code: "مدونة الشرف",
  acceptable_use: "الاستخدام المقبول",
  honor_agreement: "اتفاقية الشرف",
  tech_contract: "العقد التقني",
};

/** @returns {import('./progressTypes.js').ProgressCatalogItem[]} */
export function buildPublishedRequiredCatalog(publishedDays) {
  const items = [];

  items.push({
    id: "onboarding-bingo",
    type: "bingo",
    category: "onboarding",
    labelAr: BINGO_LABEL,
    required: true,
    day: 0,
  });

  for (const docType of DOC_TYPES) {
    items.push({
      id: `agreement-${docType}`,
      type: "agreement",
      category: "onboarding",
      labelAr: AGREEMENT_LABELS[docType] || docType,
      required: true,
      day: 0,
      docType,
    });
  }

  for (const [lessonId, day] of Object.entries(LESSON_ID_TO_DAY)) {
    if (day <= publishedDays) {
      items.push({
        id: `lesson-${lessonId}`,
        type: "lesson",
        category: "lesson",
        labelAr: lessonLabelAr(lessonId),
        lessonId,
        required: true,
        day,
      });
    }
  }

  for (const dayRow of curriculumDays) {
    if (dayRow.dayNumber > publishedDays) continue;
    if (dayRow.worksheetId) {
      items.push({
        id: dayRow.worksheetId,
        type: "worksheet",
        category: "worksheet",
        labelAr: `ورقة عمل — ${dayRow.titleAr}`,
        required: true,
        day: dayRow.dayNumber,
      });
    }
    if (dayRow.quizId && dayRow.quizId !== "quiz-pre" && dayRow.quizId !== "quiz-post") {
      items.push({
        id: dayRow.quizId,
        type: "quiz",
        category: "quiz",
        labelAr: `اختبار — ${dayRow.titleAr}`,
        required: true,
        day: dayRow.dayNumber,
      });
    }
  }

  return items;
}

function lessonProgressMap(lessonRows = []) {
  const byLesson = {};
  for (const row of lessonRows) {
    const id = row.lessonId || row.lesson_id;
    if (!id) continue;
    if (!byLesson[id]) byLesson[id] = [];
    byLesson[id].push(row);
  }
  return byLesson;
}

export function isLessonComplete(lessonId, lessonRows, progress = {}) {
  const rows = (lessonRows || []).filter((r) => (r.lessonId || r.lesson_id) === lessonId);
  if (rows.some((r) => Boolean(r.completed))) return true;

  const blobDone = progress.lessonCompletions?.[lessonId];
  if (blobDone?.status === "completed" || blobDone?.completedAt) return true;

  const dayNum = LESSON_ID_TO_DAY[lessonId];
  if (dayNum != null && Array.isArray(progress.completedDays)) {
    const dayId = dayNum <= 9 ? `day-0${dayNum}` : `day-${dayNum}`;
    if (progress.completedDays.includes(dayId)) return true;
  }

  return false;
}

export function lessonStarted(lessonId, lessonRows, progress = {}) {
  const rows = (lessonRows || []).filter((r) => (r.lessonId || r.lesson_id) === lessonId);
  if (rows.some((r) => r.progress?.startedAt || r.progress?.status === "in_progress")) return true;
  if (progress.lessonCompletions?.[lessonId]?.startedAt) return true;
  return false;
}

/**
 * @param {import('./progressTypes.js').ProgressCatalogItem} item
 * @param {{ onboarding?: object, progress?: object, lessonRows?: object[], quizAttempts?: object[] }} ctx
 */
export function isCatalogItemComplete(item, ctx) {
  const { onboarding = {}, progress = {}, lessonRows = [] } = ctx;

  switch (item.type) {
    case "bingo":
      return onboarding?.bingo?.status === "submitted";
    case "agreement": {
      const doc = item.docType || item.id.replace("agreement-", "");
      return onboarding?.agreements?.[doc]?.status === "signed";
    }
    case "lesson":
      return isLessonComplete(item.lessonId, lessonRows, progress);
    case "worksheet":
      return progress?.worksheetStatus?.[item.id] === "completed";
    case "quiz": {
      const score = progress?.quizScores?.[item.id];
      return Boolean(score?.submitted || score?.percent != null || score?.score != null);
    }
    default:
      return false;
  }
}

export function evaluateCatalog(items, ctx) {
  const breakdown = items.map((item) => {
    const complete = isCatalogItemComplete(item, ctx);
    let status = complete ? "completed" : "not_started";
    if (!complete && item.type === "lesson" && lessonStarted(item.lessonId, ctx.lessonRows, ctx.progress)) {
      status = "in_progress";
    }
    return {
      ...item,
      status,
      complete,
    };
  });

  const required = breakdown.filter((i) => i.required);
  const completedRequired = required.filter((i) => i.complete);
  const total = required.length;
  const done = completedRequired.length;
  const availableProgressPercent =
    total === 0 ? 0 : Math.min(100, Math.max(0, Math.round((done / total) * 100)));

  const lessons = required.filter((i) => i.category === "lesson");
  const activities = required.filter((i) => i.category === "onboarding");
  const worksheets = required.filter((i) => i.category === "worksheet");
  const quizzes = required.filter((i) => i.category === "quiz");

  return {
    breakdown,
    requiredItems: total,
    completedRequiredItems: done,
    availableProgressPercent,
    completedLessons: lessons.filter((i) => i.complete).length,
    totalPublishedLessons: lessons.length,
    completedActivities: activities.filter((i) => i.complete).length,
    totalPublishedActivities: activities.length,
    completedWorksheets: worksheets.filter((i) => i.complete).length,
    totalPublishedWorksheets: worksheets.length,
    completedQuizzes: quizzes.filter((i) => i.complete).length,
    totalPublishedQuizzes: quizzes.length,
  };
}

export function computeFullPathProgress(progress = {}, publishedDays) {
  const completedDayNums = (progress.completedDays || [])
    .map((id) => {
      const m = /^day-(\d+)$/.exec(id);
      return m ? Number(m[1]) : null;
    })
    .filter((n) => n != null && n <= publishedDays);

  const fromLessons = Object.entries(LESSON_ID_TO_DAY)
    .filter(([, day]) => day <= publishedDays)
    .map(([, day]) => day);

  const currentDay = Math.max(0, ...completedDayNums, ...fromLessons.filter(Boolean));
  const effectiveDay = currentDay > 0 ? Math.min(currentDay, publishedDays) : completedDayNums.length ? Math.max(...completedDayNums) : 0;

  return {
    currentPublishedDay: effectiveDay,
    totalCurriculumDays: 15,
    publishedDays,
    pathLabelAr:
      effectiveDay > 0
        ? `اليوم ${effectiveDay} من أصل 15 يومًا (محتوى منشور: ${publishedDays} ${publishedDays === 1 ? "يوم" : "أيام"})`
        : `لم يبدأ المسار بعد — 15 يومًا في المنهج الكامل`,
  };
}

export { lessonProgressMap };
