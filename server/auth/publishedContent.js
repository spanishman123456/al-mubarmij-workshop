import { getPublishedDaysCount, isLessonIdPublished, isPathPublished } from "../config/publication.js";

export function rejectUnpublishedLessonProgress(req, res, next) {
  if (req.auth?.role === "teacher") return next();
  const lessonId = req.body?.lessonId;
  if (!lessonId) return next();
  if (!isLessonIdPublished(lessonId, getPublishedDaysCount())) {
    return res.status(403).json({ ok: false, error: "content_not_published" });
  }
  return next();
}

export function requirePublishedTeacherDay(dayNumber) {
  return (req, res, next) => {
    const path = `/teacher/day-${String(dayNumber).padStart(2, "0")}-answers`;
    if (!isPathPublished(path, getPublishedDaysCount(), req.auth?.role || "teacher")) {
      return res.status(404).json({ ok: false, error: "not_found" });
    }
    return next();
  };
}
