/** خوارزميات اليوم 15: العرض النهائي والتقييم الختامي */

/** @param {number[]} rubricScores */
export function rubricAverage(rubricScores) {
  const nums = (rubricScores || []).map((v) => Number(v)).filter((v) => Number.isFinite(v));
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** @param {number} score @param {number} max */
export function percentage(score, max) {
  const s = Number(score);
  const m = Number(max);
  if (!Number.isFinite(s) || !Number.isFinite(m) || m <= 0) return 0;
  return (s / m) * 100;
}

export const DAY15_CHALLENGES = {
  presentation: [
    { id: "pres-1", promptAr: "إذا كانت درجات rubric [4,5,4,3] فما المتوسط؟", expected: "4" },
    { id: "pres-2", promptAr: "هل يبدأ العرض النهائي بالمشكلة قبل الحل؟ (نعم/لا)", expected: "نعم" },
  ],
  feedback: [
    { id: "feed-1", promptAr: "هل التغذية الراجعة يجب أن تكون محددة وقابلة للتنفيذ؟ (نعم/لا)", expected: "نعم" },
    { id: "feed-2", promptAr: "اكتب عنصرًا واحدًا لتحسين العرض القادم", expected: "وضوح الشرح" },
  ],
  closure: [
    { id: "close-1", promptAr: "نتيجة 42 من 50 تساوي تقريبًا كم %؟", expected: "84" },
    { id: "close-2", promptAr: "هل التقييم الختامي يساعد على تحديد الخطوة التالية؟ (نعم/لا)", expected: "نعم" },
  ],
};

/** @param {string} id @param {string|number} answer */
export function checkDay15Answer(id, answer) {
  const raw = String(answer ?? "").trim();
  const compact = raw.replace(/\s+/g, "").toLowerCase();
  const num = Number(raw);
  switch (id) {
    case "pres-1":
      return Math.abs(num - rubricAverage([4, 5, 4, 3])) < 0.2;
    case "pres-2":
      return compact === "نعم" || compact === "yes";
    case "feed-1":
      return compact === "نعم" || compact === "yes";
    case "feed-2":
      return compact.includes("وضوح") || compact.includes("شرح") || compact.includes("وقت");
    case "close-1":
      return Math.abs(num - percentage(42, 50)) < 0.5;
    case "close-2":
      return compact === "نعم" || compact === "yes";
    default:
      return false;
  }
}
