/** خوارزميات اليوم 11: الذكاء الاصطناعي، التعلم الآلي، والأخلاقيات */

/** @param {number} tp @param {number} tn @param {number} fp @param {number} fn */
export function accuracyPercent(tp, tn, fp, fn) {
  const a = Number(tp) + Number(tn);
  const b = Number(tp) + Number(tn) + Number(fp) + Number(fn);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= 0) return 0;
  return (a / b) * 100;
}

/** @param {number[]} values */
export function majorityClass(values) {
  const nums = values.map((v) => Number(v)).filter((v) => Number.isFinite(v));
  if (nums.length === 0) return null;
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);
  let best = nums[0];
  let bestCount = -1;
  for (const [key, c] of counts.entries()) {
    if (c > bestCount) {
      best = key;
      bestCount = c;
    }
  }
  return best;
}

export const DAY11_CHALLENGES = {
  ai: [
    {
      id: "ai-def",
      promptAr: "أي تعريف أدق للذكاء الاصطناعي؟",
      expected: "تعلم الأنماط من البيانات واتخاذ قرار",
    },
    {
      id: "ai-usecase",
      promptAr: "اذكر مثالًا صحيحًا لتطبيق AI في الحياة اليومية.",
      expected: "التوصيات",
    },
  ],
  ml: [
    {
      id: "ml-accuracy",
      promptAr: "TP=8, TN=6, FP=2, FN=4 — ما الدقة % تقريبًا؟",
      expected: "70",
    },
    {
      id: "ml-majority",
      promptAr: "ما الفئة الأغلبية في [1,1,0,1,0]؟",
      expected: "1",
    },
  ],
  ethics: [
    {
      id: "ethics-bias",
      promptAr: "هل انحياز البيانات خطر على عدالة النموذج؟ (نعم/لا)",
      expected: "نعم",
    },
    {
      id: "ethics-privacy",
      promptAr: "ما الخطوة الأنسب لحماية الخصوصية في مشروع AI مدرسي؟",
      expected: "إخفاء هوية البيانات",
    },
  ],
  presentation: [
    {
      id: "pres-structure",
      promptAr: "رتّب العرض: المشكلة → الحل → مثال → أثر. هل هذا الترتيب صحيح؟",
      expected: "نعم",
    },
    {
      id: "pres-slide",
      promptAr: "كم عدد النقاط الموصى بها في الشريحة الواحدة (تقريبًا)؟",
      expected: "3",
    },
  ],
};

/** @param {string} id @param {string|number} answer */
export function checkDay11Answer(id, answer) {
  const raw = String(answer ?? "").trim();
  const compact = raw.replace(/\s+/g, "").toLowerCase();
  const num = Number(raw);
  switch (id) {
    case "ai-def":
      return compact.includes("بيانات") || compact.includes("الأنماط") || compact.includes("patterns");
    case "ai-usecase":
      return compact.includes("توص") || compact.includes("recommend");
    case "ml-accuracy":
      return Math.abs(num - accuracyPercent(8, 6, 2, 4)) < 0.6;
    case "ml-majority":
      return num === majorityClass([1, 1, 0, 1, 0]);
    case "ethics-bias":
      return compact === "نعم" || compact === "yes";
    case "ethics-privacy":
      return compact.includes("هوية") || compact.includes("anonym");
    case "pres-structure":
      return compact === "نعم" || compact === "yes";
    case "pres-slide":
      return num === 3 || compact === "3-5" || compact === "3الى5";
    default:
      return false;
  }
}
