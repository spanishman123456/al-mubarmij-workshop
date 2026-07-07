import {
  getDayPublicationMap,
  getPublishedDaysFromClientEnv,
  isCurriculumDayVisible,
  isLessonIdPublished,
  isPathPublished,
  parsePublishedDays,
  routeContentDay,
  LOCKED_MESSAGE_AR,
  PublicationStatus,
} from "./publicationPolicy.js";
import { DayStudentState, DAY_LOCKED_MESSAGE_AR, DAY_SCHEDULE_MESSAGE_AR } from "../lib/dayUnlockPolicy.js";
import { getCachedPublicationConfig, resolvePublishedDaysFromCache } from "../lib/publicationConfigStore.js";

export {
  LOCKED_MESSAGE_AR,
  PublicationStatus,
  getDayPublicationMap,
  isLessonIdPublished,
  DAY_LOCKED_MESSAGE_AR,
  DAY_SCHEDULE_MESSAGE_AR,
  DayStudentState,
  routeContentDay,
};

export function getPublishedDaysCount() {
  return resolvePublishedDaysFromCache(getPublishedDaysFromClientEnv());
}

/** Prefer server-published count (myStats or publication API cache). */
export function resolvePublishedDaysCount(myStats) {
  const fromServer = myStats?.publishedDays ?? myStats?.dayUnlock?.publishedDays;
  if (Number.isFinite(fromServer) && fromServer >= 1) {
    return parsePublishedDays(fromServer);
  }
  const fromCache = getCachedPublicationConfig()?.publishedDays;
  if (Number.isFinite(fromCache) && fromCache >= 1) {
    return parsePublishedDays(fromCache);
  }
  return getPublishedDaysFromClientEnv();
}

export function getPublicationStatusMap() {
  const cached = getCachedPublicationConfig()?.publicationStatus;
  if (cached && typeof cached === "object") return cached;
  return getDayPublicationMap(getPublishedDaysCount());
}

export function isLessonRoutePublished(pathname, role = "student") {
  return isPathPublished(pathname, getPublishedDaysCount(), role);
}

export function isCurriculumDayPublished(dayId, publishedDaysCount) {
  return isCurriculumDayVisible(dayId, publishedDaysCount ?? getPublishedDaysCount());
}

export function getStudentDayState(dayId, dayUnlockMap) {
  return dayUnlockMap?.[dayId] || DayStudentState.DRAFT;
}

/** Server unlock state wins over stale VITE_PUBLISHED_DAYS in the client bundle. */
export function canStudentAccessDayContent(dayId, dayUnlockMap, myStats) {
  const state = getStudentDayState(dayId, dayUnlockMap);
  if (state === DayStudentState.LOCKED) return false;
  if (
    state === DayStudentState.AVAILABLE ||
    state === DayStudentState.IN_PROGRESS ||
    state === DayStudentState.COMPLETED
  ) {
    return true;
  }
  return isCurriculumDayPublished(dayId, resolvePublishedDaysCount(myStats));
}

export function isStudentDayRouteAllowed(pathname, dayUnlockMap, role = "student", myStats = null) {
  if (role === "teacher") return true;
  const day = routeContentDay(pathname);
  if (day == null || day === 0) return true;
  const dayId = day <= 9 ? `day-0${day}` : `day-${day}`;
  return canStudentAccessDayContent(dayId, dayUnlockMap, myStats);
}

export const TEACHER_PREVIEW_BADGE_AR =
  "معاينة المعلم — هذا العرض مطابق لواجهة الطالب، مع إظهار الإجابات النموذجية للمعلم فقط.";

export function isTeacherRole(role) {
  return role === "teacher";
}

/** Days visible to students per publish policy; teachers preview all curriculum days. */
export function resolvePublishedDaysForRole(role, myStats) {
  if (isTeacherRole(role)) return 15;
  return resolvePublishedDaysCount(myStats);
}
