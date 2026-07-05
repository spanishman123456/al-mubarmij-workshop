/** Publication flags — students see `published` content only. */

export const PublicationStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

/** Day 4+ expanded lesson routes (batch 8+) — not yet for students. */
export const DRAFT_LESSON_ROUTES = new Set([
  "/lessons/karnaugh-maps",
  "/lessons/logic-equivalence",
  "/lessons/python-tuples",
  "/lessons/nested-loops-lab",
]);

/** Curriculum day pages 4–15 remain as before (generic content + sims). */
export const PUBLISHED_CURRICULUM_DAY_IDS = new Set([
  "day-01",
  "day-02",
  "day-03",
  "day-04",
  "day-05",
  "day-06",
  "day-07",
  "day-08",
  "day-09",
  "day-10",
  "day-11",
  "day-12",
  "day-13",
  "day-14",
  "day-15",
]);

export function isLessonRoutePublished(pathname) {
  const path = pathname.split("?")[0].replace(/\/$/, "") || "/";
  if (DRAFT_LESSON_ROUTES.has(path)) return false;
  return true;
}

export function isCurriculumDayPublished(dayId) {
  return PUBLISHED_CURRICULUM_DAY_IDS.has(dayId);
}
