import {
  getDayPublicationMap,
  getPublishedDaysFromClientEnv,
  isCurriculumDayVisible,
  isLessonIdPublished,
  isPathPublished,
  routeContentDay,
  LOCKED_MESSAGE_AR,
  PublicationStatus,
} from "./publicationPolicy.js";
import { DayStudentState, DAY_LOCKED_MESSAGE_AR, DAY_SCHEDULE_MESSAGE_AR } from "../lib/dayUnlockPolicy.js";

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
  return getPublishedDaysFromClientEnv();
}

export function getPublicationStatusMap() {
  return getDayPublicationMap(getPublishedDaysCount());
}

export function isLessonRoutePublished(pathname, role = "student") {
  return isPathPublished(pathname, getPublishedDaysCount(), role);
}

export function isCurriculumDayPublished(dayId) {
  return isCurriculumDayVisible(dayId, getPublishedDaysCount());
}

export function getStudentDayState(dayId, dayUnlockMap) {
  return dayUnlockMap?.[dayId] || DayStudentState.DRAFT;
}

export function isStudentDayRouteAllowed(pathname, dayUnlockMap, role = "student") {
  if (role !== "student") return isLessonRoutePublished(pathname, role);
  if (!isLessonRoutePublished(pathname, role)) return false;
  const day = routeContentDay(pathname);
  if (day == null || day === 0) return true;
  const dayId = day <= 9 ? `day-0${day}` : `day-${day}`;
  const state = getStudentDayState(dayId, dayUnlockMap);
  return state !== DayStudentState.DRAFT && state !== DayStudentState.LOCKED;
}
