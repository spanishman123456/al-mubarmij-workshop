import {
  getDayPublicationMap,
  getPublishedDaysFromClientEnv,
  isCurriculumDayVisible,
  isLessonIdPublished,
  isPathPublished,
  LOCKED_MESSAGE_AR,
  PublicationStatus,
} from "./publicationPolicy.js";

export { LOCKED_MESSAGE_AR, PublicationStatus, getDayPublicationMap, isLessonIdPublished };

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
