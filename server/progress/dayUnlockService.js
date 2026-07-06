import { getPublishedDaysCount } from "../config/publication.js";
import {
  canAccessDayPath,
  dayIdFromNumber,
  dayNumberFromId,
  getDayIncompleteItems,
  getStudentDayState,
  isDayCompleted,
  isDayUnlockedForStudent,
  buildStudentDayUnlockMap,
  parseUnlockPolicy,
  DAY_LOCKED_MESSAGE_AR,
} from "../../src/lib/dayUnlockPolicy.js";
import { getOnboardingStatus } from "../repositories/onboardingRepository.js";
import { getStudentProgress, getLessonProgressAll, saveStudentProgress } from "../repositories/progressRepository.js";
import { logDayUnlockOverride } from "../repositories/dayUnlockRepository.js";

export function buildUnlockContext(studentId) {
  const publishedDays = getPublishedDaysCount();
  const progressRow = getStudentProgress(studentId);
  const progress = progressRow?.progress || {};
  const lessonRows = getLessonProgressAll(studentId);
  const onboarding = getOnboardingStatus(studentId);
  const policy = parseUnlockPolicy(process.env.STUDENT_UNLOCK_POLICY);

  return { studentId, publishedDays, progress, lessonRows, onboarding, policy };
}

export function getStudentDayUnlockStatus(studentId) {
  const ctx = buildUnlockContext(studentId);
  const dayUnlockMap = buildStudentDayUnlockMap(ctx);
  const currentDay = [...Array(ctx.publishedDays)].map((_, i) => i + 1).reduce((acc, d) => {
    const state = getStudentDayState(d, ctx);
    if (state === "completed") return Math.max(acc, d + 1);
    if (state === "in_progress" || state === "available") return Math.max(acc, d);
    return acc;
  }, 1);

  return {
    policy: ctx.policy,
    publishedDays: ctx.publishedDays,
    dayUnlockMap,
    currentDay: Math.min(Math.max(currentDay, 1), ctx.publishedDays),
    dayCompletions: progressDayCompletions(ctx),
  };
}

function progressDayCompletions(ctx) {
  const out = {};
  for (let d = 1; d <= ctx.publishedDays; d += 1) {
    const dayId = dayIdFromNumber(d);
    out[dayId] = {
      completed: isDayCompleted(d, ctx),
      state: getStudentDayState(d, ctx),
      completedAt: ctx.progress?.dayCompletionTimes?.[dayId] || null,
      incompleteItems: getDayIncompleteItems(d, ctx),
    };
  }
  return out;
}

export function assertStudentCanAccessDay(studentId, dayId) {
  const ctx = buildUnlockContext(studentId);
  if (!canAccessDayPath(dayId, ctx)) {
    const dayNumber = dayNumberFromId(dayId);
    const err = new Error(DAY_LOCKED_MESSAGE_AR);
    err.code = "day_locked";
    err.status = 403;
    err.dayNumber = dayNumber;
    throw err;
  }
  return ctx;
}

export function completeStudentDay(studentId, dayId) {
  const ctx = assertStudentCanAccessDay(studentId, dayId);
  const dayNumber = dayNumberFromId(dayId);
  if (!dayNumber) {
    const err = new Error("invalid_day");
    err.status = 400;
    throw err;
  }

  const incomplete = getDayIncompleteItems(dayNumber, ctx);
  if (incomplete.length > 0) {
    const err = new Error("day_incomplete");
    err.status = 400;
    err.incompleteItems = incomplete;
    throw err;
  }

  const now = new Date().toISOString();
  const completedDays = [...new Set([...(ctx.progress.completedDays || []), dayId])];
  const dayCompletionTimes = {
    ...(ctx.progress.dayCompletionTimes || {}),
    [dayId]: now,
  };

  const nextProgress = {
    ...ctx.progress,
    completedDays,
    dayCompletionTimes,
    updatedAt: now,
  };
  saveStudentProgress(studentId, nextProgress);

  return {
    dayId,
    completedAt: now,
    dayUnlock: getStudentDayUnlockStatus(studentId),
  };
}

export function teacherUnlockDayForStudent({ studentId, dayNumber, teacherId, reason }) {
  const ctx = buildUnlockContext(studentId);
  if (dayNumber < 1 || dayNumber > ctx.publishedDays) {
    const err = new Error("day_not_published");
    err.status = 400;
    throw err;
  }

  const overrides = [...new Set([...(ctx.progress.dayUnlockOverrides || []), dayNumber])];
  const nextProgress = {
    ...ctx.progress,
    dayUnlockOverrides: overrides,
    updatedAt: new Date().toISOString(),
  };
  saveStudentProgress(studentId, nextProgress);
  logDayUnlockOverride({ studentId, dayNumber, teacherId, reason });

  return {
    studentId,
    dayNumber,
    dayUnlock: getStudentDayUnlockStatus(studentId),
  };
}

export function syncDayCompletionsFromProgress(studentId) {
  const ctx = buildUnlockContext(studentId);
  const autoCompleted = [...(ctx.progress.completedDays || [])];

  for (let d = 1; d <= ctx.publishedDays; d += 1) {
    const dayId = dayIdFromNumber(d);
    if (isDayCompleted(d, ctx) && !autoCompleted.includes(dayId)) {
      autoCompleted.push(dayId);
    }
  }

  if (autoCompleted.length === (ctx.progress.completedDays || []).length) {
    return { changed: false, completedDays: autoCompleted };
  }

  saveStudentProgress(studentId, {
    ...ctx.progress,
    completedDays: autoCompleted,
    updatedAt: new Date().toISOString(),
  });
  return { changed: true, completedDays: autoCompleted };
}

export function isLessonDayUnlockedForStudent(studentId, lessonDay) {
  const ctx = buildUnlockContext(studentId);
  return isDayUnlockedForStudent(lessonDay, ctx);
}
