/** خوارزميات اليوم 14: تنفيذ المشروع واختباره */

/** @param {number} done @param {number} total */
export function completionPercent(done, total) {
  const d = Number(done);
  const t = Number(total);
  if (!Number.isFinite(d) || !Number.isFinite(t) || t <= 0) return 0;
  return (d / t) * 100;
}

/** @param {number} totalTests @param {number} passedTests */
export function passRatePercent(totalTests, passedTests) {
  return completionPercent(passedTests, totalTests);
}

export const DAY14_CHALLENGES = {
  build: [
    { id: "build-1", promptAr: "أنجز الفريق 6 مهام من أصل 8 — نسبة الإنجاز %؟", expected: "75" },
    { id: "build-2", promptAr: "هل تقسيم المشروع إلى modules يقلل التعقيد؟ (نعم/لا)", expected: "نعم" },
  ],
  testing: [
    { id: "test-1", promptAr: "نجح 9 اختبارات من 12 — نسبة النجاح %؟", expected: "75" },
    { id: "test-2", promptAr: "هل إعادة إنتاج الخطأ أول خطوة تصحيح جيدة؟ (نعم/لا)", expected: "نعم" },
  ],
  demo: [
    { id: "demo-1", promptAr: "أول جزء في عرض المشروع النهائي هو:", expected: "المشكلة" },
    { id: "demo-2", promptAr: "هل يجب عرض تجربة حية (demo) قبل الخاتمة؟ (نعم/لا)", expected: "نعم" },
  ],
};

/** @param {string} id @param {string|number} answer */
export function checkDay14Answer(id, answer) {
  const raw = String(answer ?? "").trim();
  const compact = raw.replace(/\s+/g, "").toLowerCase();
  const num = Number(raw);
  switch (id) {
    case "build-1":
      return Math.abs(num - completionPercent(6, 8)) < 0.5;
    case "build-2":
      return compact === "نعم" || compact === "yes";
    case "test-1":
      return Math.abs(num - passRatePercent(12, 9)) < 0.5;
    case "test-2":
      return compact === "نعم" || compact === "yes";
    case "demo-1":
      return compact.includes("مشكلة") || compact.includes("problem");
    case "demo-2":
      return compact === "نعم" || compact === "yes";
    default:
      return false;
  }
}
