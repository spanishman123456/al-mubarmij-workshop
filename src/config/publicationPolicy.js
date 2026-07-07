/** Publication policy — shared logic (client build + server runtime). */

export const PublicationStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const LOCKED_MESSAGE_AR =
  "سيتم فتح الدرس التالي وفق الجدول التدريبي المعتمد.";

const DAY1_LESSON_ROUTES = new Set([
  "/lessons/binary-cards",
  "/lessons/binary-puzzle",
  "/lessons/binary-matching",
  "/lessons/number-systems",
  "/lessons/python-intro",
  "/lessons/string-splitting",
  "/lessons/ascii-unicode",
  "/lessons/hex-puzzle",
  "/lessons/hex-colors",
]);

const DAY2_LESSON_ROUTES = new Set([
  "/lessons/conversions-intro",
  "/lessons/base-arithmetic",
  "/lessons/twos-complement",
  "/lessons/floating-point",
  "/lessons/radix-practice",
  "/lessons/card-sort-algorithm",
  "/lessons/algorithms",
  "/lessons/python-arrays",
  "/lessons/python-for-range",
  "/lessons/python-while",
  "/lessons/sentence-reference",
  "/lessons/if-statement",
  "/lessons/day02-computer-lab",
]);

const DAY3_LESSON_ROUTES = new Set([
  "/lessons/python-constants",
  "/lessons/python-multi-arrays",
  "/lessons/python-break-continue",
  "/lessons/divisors-activity",
  "/lessons/numbers-steps-activity",
  "/lessons/collatz",
  "/lessons/truth-tables",
  "/lessons/logic-gates",
]);

const DAY4_LESSON_ROUTES = new Set([
  "/lessons/karnaugh-maps",
  "/lessons/logic-equivalence",
  "/lessons/python-tuples",
  "/lessons/nested-loops-lab",
]);

export const DAY5_LESSON_ROUTES = new Set([
  "/lessons/linear-search",
  "/lessons/binary-search",
  "/lessons/sorting-algorithms",
  "/lessons/sieve-primes",
]);

export const DAY6_LESSON_ROUTES = new Set([
  "/lessons/caesar-cipher",
  "/lessons/memory-hierarchy",
  "/lessons/cpu-scheduling",
]);

/** @deprecated use DAY4_LESSON_ROUTES */
const DAY4_PLUS_DRAFT_ROUTES = DAY4_LESSON_ROUTES;

export const LESSON_ID_TO_DAY = {
  "binary-cards": 1,
  "binary-puzzle": 1,
  "binary-matching": 1,
  "number-systems": 1,
  "python-intro": 1,
  "string-splitting": 1,
  "ascii-unicode": 1,
  "hex-puzzle": 1,
  "hex-colors": 1,
  conversions: 2,
  "conversions-intro": 2,
  "base-arithmetic": 2,
  "twos-complement": 2,
  "floating-point": 2,
  "radix-practice": 2,
  "card-sort-algorithm": 2,
  algorithms: 2,
  "python-arrays": 2,
  "python-for-range": 2,
  "python-while": 2,
  "sentence-reference": 2,
  "if-statement": 2,
  "day02-computer-lab": 2,
  "python-constants": 3,
  "python-multi-arrays": 3,
  "python-break-continue": 3,
  "divisors-activity": 3,
  "numbers-steps-activity": 3,
  collatz: 3,
  "truth-tables": 3,
  "logic-gates": 3,
  "karnaugh-maps": 4,
  "logic-equivalence": 4,
  "python-tuples": 4,
  "nested-loops-lab": 4,
  "linear-search": 5,
  "binary-search": 5,
  "sorting-algorithms": 5,
  "sieve-primes": 5,
  "caesar-cipher": 6,
  "memory-hierarchy": 6,
  "cpu-scheduling": 6,
};

const ONBOARDING_PREFIXES = ["/onboarding", "/quizzes/run/quiz-pre"];

export function parsePublishedDays(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 15;
  return Math.min(15, Math.floor(n));
}

export function getPublishedDaysFromClientEnv() {
  return parsePublishedDays(import.meta.env.VITE_PUBLISHED_DAYS ?? import.meta.env.PUBLISHED_DAYS ?? "15");
}

export function getPublishedDaysFromServerEnv() {
  return parsePublishedDays(process.env.PUBLISHED_DAYS ?? "15");
}

export function getDayPublicationMap(publishedDaysCount) {
  const map = {};
  for (let d = 1; d <= 15; d += 1) {
    const key = d <= 9 ? `day0${d}` : `day${d}`;
    map[key] = d <= publishedDaysCount ? PublicationStatus.PUBLISHED : PublicationStatus.DRAFT;
  }
  return map;
}

function normalizePath(pathname) {
  return (pathname || "").split("?")[0].replace(/\/$/, "") || "/";
}

function curriculumDayNumber(dayId) {
  const m = /^day-(\d+)$/.exec(dayId || "");
  return m ? Number(m[1]) : null;
}

export function routeContentDay(pathname) {
  const path = normalizePath(pathname);
  if (ONBOARDING_PREFIXES.some((p) => path.startsWith(p))) return 0;
  if (DAY1_LESSON_ROUTES.has(path)) return 1;
  if (DAY2_LESSON_ROUTES.has(path)) return 2;
  if (DAY3_LESSON_ROUTES.has(path)) return 3;
  if (DAY4_LESSON_ROUTES.has(path)) return 4;
  if (DAY5_LESSON_ROUTES.has(path)) return 5;
  if (DAY6_LESSON_ROUTES.has(path)) return 6;

  let m = /^\/path\/day\/day-(\d+)$/.exec(path);
  if (m) return Number(m[1]);

  m = /^\/worksheets\/ws-day-(\d+)$/.exec(path);
  if (m) return Number(m[1]);

  m = /^\/quizzes\/run\/(quiz-day-(\d+)|quiz-pre)$/.exec(path);
  if (m) return m[2] ? Number(m[2]) : 0;

  m = /^\/teacher\/day-(\d+)-answers$/.exec(path);
  if (m) return Number(m[1]);

  return null;
}

export function isLessonIdPublished(lessonId, publishedDaysCount) {
  const day = LESSON_ID_TO_DAY[lessonId];
  if (!day) return true;
  return day <= publishedDaysCount;
}

export function isPathPublished(pathname, publishedDaysCount, role = "student") {
  const path = normalizePath(pathname);
  if (role === "teacher") {
    return true;
  }

  const day = routeContentDay(path);
  if (day === null) return true;
  if (day === 0) return true;
  return day <= publishedDaysCount;
}

export function isCurriculumDayVisible(dayId, publishedDaysCount) {
  const n = curriculumDayNumber(dayId);
  if (!n) return true;
  return n <= publishedDaysCount;
}
