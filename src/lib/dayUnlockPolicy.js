/**
 * سياسة فتح الأيام بالتسلسل — مشتركة بين العميل والخادم.
 */
import {
  buildPublishedRequiredCatalog,
  isCatalogItemComplete,
  lessonStarted,
} from "./progressCatalog.js";

export const DayStudentState = {
  DRAFT: "draft",
  LOCKED: "locked",
  AVAILABLE: "available",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const DAY_LOCKED_MESSAGE_AR = "أكمل اليوم السابق أولًا لفتح هذا اليوم.";
export const DAY_SCHEDULE_MESSAGE_AR = "سيتم فتحه وفق الجدول التدريبي المعتمد.";

export function parseUnlockPolicy(raw) {
  const fromClient =
    typeof import.meta !== "undefined" ? import.meta.env?.VITE_STUDENT_UNLOCK_POLICY : undefined;
  const v = String(raw ?? fromClient ?? process.env.STUDENT_UNLOCK_POLICY ?? "sequential").toLowerCase();
  return v === "open" ? "open" : "sequential";
}

export function isSequentialUnlockPolicy(policy) {
  return parseUnlockPolicy(policy) === "sequential";
}

export function dayIdFromNumber(n) {
  return n <= 9 ? `day-0${n}` : `day-${n}`;
}

export function dayNumberFromId(dayId) {
  const m = /^day-(\d+)$/.exec(dayId || "");
  return m ? Number(m[1]) : null;
}

/** عناصر إلزامية لإكمال يوم معيّن (اليوم 1 يشمل التمهيد day=0). */
export function getRequiredItemsForDay(catalog, dayNumber) {
  if (dayNumber === 1) {
    return catalog.filter((i) => i.required && (i.day === 0 || i.day === 1));
  }
  return catalog.filter((i) => i.required && i.day === dayNumber);
}

export function isDayMarkedComplete(dayNumber, progress = {}) {
  const dayId = dayIdFromNumber(dayNumber);
  return Array.isArray(progress.completedDays) && progress.completedDays.includes(dayId);
}

/** هل أكمل الطالب كل العناصر الإلزامية لليوم؟ */
export function isDayCompleted(dayNumber, ctx) {
  const { publishedDays, onboarding = {}, progress = {}, lessonRows = [] } = ctx;
  if (dayNumber > publishedDays) return false;
  if (isDayMarkedComplete(dayNumber, progress)) return true;

  const catalog = buildPublishedRequiredCatalog(publishedDays);
  const items = getRequiredItemsForDay(catalog, dayNumber);
  if (!items.length) return false;

  const evalCtx = { onboarding, progress, lessonRows };
  return items.every((item) => isCatalogItemComplete(item, evalCtx));
}

export function getDayIncompleteItems(dayNumber, ctx) {
  const catalog = buildPublishedRequiredCatalog(ctx.publishedDays);
  const items = getRequiredItemsForDay(catalog, dayNumber);
  const evalCtx = {
    onboarding: ctx.onboarding,
    progress: ctx.progress,
    lessonRows: ctx.lessonRows,
  };
  return items
    .filter((item) => !isCatalogItemComplete(item, evalCtx))
    .map((item) => ({
      id: item.id,
      labelAr: item.labelAr,
      category: item.category,
      complete: false,
    }));
}

function hasTeacherOverride(dayNumber, progress = {}) {
  const overrides = progress.dayUnlockOverrides || [];
  const dayId = dayIdFromNumber(dayNumber);
  return overrides.includes(dayNumber) || overrides.includes(dayId);
}

/** هل يستطيع الطالب الوصول لهذا اليوم؟ */
export function isDayUnlockedForStudent(dayNumber, ctx) {
  const { publishedDays, progress = {}, policy } = ctx;
  if (dayNumber > publishedDays) return false;
  if (dayNumber <= 1) return true;
  if (hasTeacherOverride(dayNumber, progress)) return true;
  if (!isSequentialUnlockPolicy(policy)) return true;
  return isDayCompleted(dayNumber - 1, ctx);
}

export function hasDayInProgress(dayNumber, ctx) {
  if (isDayCompleted(dayNumber, ctx)) return false;
  const catalog = buildPublishedRequiredCatalog(ctx.publishedDays);
  const items = getRequiredItemsForDay(catalog, dayNumber);
  const evalCtx = {
    onboarding: ctx.onboarding,
    progress: ctx.progress,
    lessonRows: ctx.lessonRows,
  };
  return items.some((item) => {
    if (isCatalogItemComplete(item, evalCtx)) return false;
    if (item.type === "lesson") {
      return lessonStarted(item.lessonId, ctx.lessonRows, ctx.progress);
    }
    if (item.type === "worksheet") {
      const st = ctx.progress?.worksheetStatus?.[item.id];
      return st === "in_progress";
    }
    if (item.type === "quiz") {
      const score = ctx.progress?.quizScores?.[item.id];
      return Boolean(score?.startedAt || score?.submitted);
    }
    if (item.type === "bingo") {
      const bingo = ctx.onboarding?.bingo;
      return bingo?.status === "in_progress" || Boolean(bingo?.startedAt);
    }
    if (item.type === "agreement") {
      return false;
    }
    return false;
  });
}

export function getStudentDayState(dayNumber, ctx) {
  if (dayNumber > ctx.publishedDays) return DayStudentState.DRAFT;
  if (isDayCompleted(dayNumber, ctx)) return DayStudentState.COMPLETED;
  if (!isDayUnlockedForStudent(dayNumber, ctx)) return DayStudentState.LOCKED;
  if (hasDayInProgress(dayNumber, ctx)) return DayStudentState.IN_PROGRESS;
  return DayStudentState.AVAILABLE;
}

export function buildStudentDayUnlockMap(ctx, maxDay = 15) {
  const map = {};
  for (let d = 1; d <= maxDay; d += 1) {
    map[dayIdFromNumber(d)] = getStudentDayState(d, ctx);
  }
  return map;
}

export function getHighestUnlockedDay(ctx) {
  let highest = 0;
  for (let d = 1; d <= ctx.publishedDays; d += 1) {
    if (isDayUnlockedForStudent(d, ctx)) highest = d;
  }
  return highest;
}

export function canAccessDayPath(dayId, ctx) {
  const dayNumber = dayNumberFromId(dayId);
  if (!dayNumber) return true;
  if (dayNumber > ctx.publishedDays) return false;
  return isDayUnlockedForStudent(dayNumber, ctx);
}
