import { getPublishedDaysCount, getUnlockPolicy } from "../config/publication.js";
import { isLessonIdPublished, isPathPublished } from "../../src/config/publicationPolicy.js";
import { LESSON_ID_TO_DAY } from "../../src/config/publicationPolicy.js";
import { DAY_LOCKED_MESSAGE_AR } from "../../src/lib/dayUnlockPolicy.js";
import { isLessonDayUnlockedForStudent } from "../progress/dayUnlockService.js";

export function rejectUnpublishedLessonProgress(req, res, next) {
  if (req.auth?.role === "teacher") return next();
  const lessonId = req.body?.lessonId;
  if (!lessonId) return next();
  const publishedDays = getPublishedDaysCount();
  if (!isLessonIdPublished(lessonId, publishedDays)) {
    return res.status(403).json({ ok: false, error: "content_not_published" });
  }
  const day = LESSON_ID_TO_DAY[lessonId];
  if (day != null && getUnlockPolicy() === "sequential" && !isLessonDayUnlockedForStudent(req.auth.userId, day)) {
    return res.status(403).json({ ok: false, error: "day_locked", messageAr: DAY_LOCKED_MESSAGE_AR });
  }
  return next();
}

export function requirePublishedTeacherDay(dayNumber) {
  return (req, res, next) => {
    if (req.auth?.role === "teacher") return next();
    const path = `/teacher/day-${String(dayNumber).padStart(2, "0")}-answers`;
    if (!isPathPublished(path, getPublishedDaysCount(), req.auth?.role || "teacher")) {
      return res.status(404).json({ ok: false, error: "not_found" });
    }
    return next();
  };
}
