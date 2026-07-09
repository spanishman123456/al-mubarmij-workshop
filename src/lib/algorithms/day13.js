/** خوارزميات اليوم 13: مراجعة، تقويم بعدي، وتجهيز المشروع */

/** @param {number[]} scores */
export function averageScore(scores) {
  const nums = (scores || []).map((v) => Number(v)).filter((v) => Number.isFinite(v));
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** @param {number} pre @param {number} post */
export function learningGainPercent(pre, post) {
  const a = Number(pre);
  const b = Number(post);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0) return 0;
  return ((b - a) / a) * 100;
}

/** @param {string} text */
export function isSmartGoal(text) {
  const t = String(text ?? "").toLowerCase();
  const hasMeasure = /\d/.test(t) || t.includes("%") || t.includes("نسبة");
  const hasTime = t.includes("أسبوع") || t.includes("يوم") || t.includes("قبل") || t.includes("موعد");
  const hasAction = t.includes("أطور") || t.includes("أنفذ") || t.includes("build") || t.includes("create");
  return hasMeasure && hasTime && hasAction;
}

export const DAY13_CHALLENGES = {
  review: [
    { id: "rev-1", promptAr: "إذا كانت درجاتك [60, 70, 80] فالمتوسط؟", expected: "70" },
    { id: "rev-2", promptAr: "هل المتابعة الأسبوعية للتقدم جزء من المراجعة الفعالة؟ (نعم/لا)", expected: "نعم" },
  ],
  assessment: [
    { id: "assess-1", promptAr: "Pre=50 و Post=65 — نسبة التحسن % تقريبًا؟", expected: "30" },
    { id: "assess-2", promptAr: "هل quiz-post يقيس التقدم بعد التعلم؟ (نعم/لا)", expected: "نعم" },
  ],
  project: [
    { id: "proj-1", promptAr: "هل الهدف: (أبني نموذجًا بنسبة دقة 80% خلال أسبوع) SMART؟ (نعم/لا)", expected: "نعم" },
    { id: "proj-2", promptAr: "ما أول خطوة صحيحة في مشروع نهائي؟", expected: "تعريف المشكلة" },
  ],
};

/** @param {string} id @param {string|number} answer */
export function checkDay13Answer(id, answer) {
  const raw = String(answer ?? "").trim();
  const compact = raw.replace(/\s+/g, "").toLowerCase();
  const num = Number(raw);
  switch (id) {
    case "rev-1":
      return Math.abs(num - averageScore([60, 70, 80])) < 0.1;
    case "rev-2":
      return compact === "نعم" || compact === "yes";
    case "assess-1":
      return Math.abs(num - learningGainPercent(50, 65)) < 0.8;
    case "assess-2":
      return compact === "نعم" || compact === "yes";
    case "proj-1":
      return compact === "نعم" || compact === "yes";
    case "proj-2":
      return compact.includes("تعريف") || compact.includes("مشكلة");
    default:
      return false;
  }
}
