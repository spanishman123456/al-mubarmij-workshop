/**
 * تلميحات تدريجية ومعايير تحقق — بدون إعطاء الحل كاملاً
 */

/** @typedef {{ id: string, check: (code: string) => boolean, messageAr: string }} CheckStep */

/**
 * @param {string} id
 * @returns {{ hints: string[], checks: CheckStep[] }}
 */
export function getExerciseGuidance(id) {
  const map = {
    "intro-print": {
      hints: [
        "ابدأ بسطر واحد يستخدم print() فقط.",
        "النص يجب أن يكون بين علامتي تنصيص \" \" أو ' '.",
        "جرّب: print(\"مرحباً بك في مقرر برمجة الحاسب!\") ثم غيّر الرسالة باسمك.",
      ],
      checks: [
        { id: "has-print", check: (c) => /\bprint\s*\(/.test(c), messageAr: "استخدم دالة print()" },
        { id: "has-string", check: (c) => /["']/.test(c), messageAr: "أضف نصاً بين علامتي تنصيص" },
      ],
    },
    hello: {
      hints: [
        "المتغير name يخزن نصاً — يمكنك تغيير قيمته.",
        "الجمع بين نصوص في بايثون: \"مرحباً، أنا \" + name",
        "تأكد أن print يطبع جملة كاملة باسمك.",
      ],
      checks: [
        { id: "var", check: (c) => /\bname\s*=/.test(c), messageAr: "عرّف متغير name" },
        { id: "print", check: (c) => /\bprint\s*\(/.test(c), messageAr: "استخدم print" },
      ],
    },
    "if-grade": {
      hints: [
        "قارن score مع 50 باستخدام >= أو <.",
        "هيكل if يحتاج نقطتين : ثم مسافة بادئة للكتلة.",
        "أضف elif للدرجات الأعلى إن أردت التحدي.",
      ],
      checks: [
        { id: "if", check: (c) => /\bif\b/.test(c), messageAr: "استخدم if" },
        { id: "else", check: (c) => /\belse\b/.test(c), messageAr: "أضف else" },
        { id: "compare", check: (c) => /score\s*>=|score\s*</.test(c), messageAr: "قارن score بدرجة النجاح" },
      ],
    },
    "loop-sum": {
      hints: [
        "for i in range(1, 11) يعطي الأعداد 1..10.",
        "ابدأ total = 0 ثم أضف i في كل تكرار.",
        "اطبع total بعد انتهاء الحلقة.",
      ],
      checks: [
        { id: "for", check: (c) => /\bfor\b/.test(c), messageAr: "استخدم حلقة for" },
        { id: "range", check: (c) => /\brange\s*\(/.test(c), messageAr: "استخدم range" },
        { id: "total", check: (c) => /\btotal\b/.test(c), messageAr: "استخدم متغير total للمجموع" },
      ],
    },
    "collatz-step": {
      hints: [
        "إذا n زوجي: n = n // 2. إذا فردي: n = 3*n + 1.",
        "كرّر في while n != 1 مع عداد للخطوات.",
        "اطبع n بعد كل خطوة لترى التسلسل.",
      ],
      checks: [
        { id: "if", check: (c) => /\bif\b/.test(c) && /%/.test(c), messageAr: "اختبر زوجية n بـ %" },
        { id: "while", check: (c) => /\bwhile\b/.test(c), messageAr: "استخدم while للتكرار" },
      ],
    },
    "linear-search": {
      hints: [
        "تمرّ على indices من 0 إلى len(nums)-1.",
        "إذا nums[i] == target اطبع الموضع واستخدم break.",
        "فكّر ماذا تطبع إذا لم تجد القيمة.",
      ],
      checks: [
        { id: "for", check: (c) => /\bfor\b/.test(c), messageAr: "استخدم حلقة للمرور على القائمة" },
        { id: "if", check: (c) => /\bif\b/.test(c), messageAr: "قارن العنصر مع target" },
      ],
    },
    "bin-convert-small": {
      hints: [
        "bin(13) يعيد نصاً يبدأ بـ 0b.",
        "للتحويل اليدوي: قسّم 13 على 2 مراراً واحفظ البواقي.",
        "اطبع العشري ثم الثنائي في سطرين.",
      ],
      checks: [
        { id: "bin", check: (c) => /\bbin\s*\(/.test(c), messageAr: "جرّب دالة bin()" },
        { id: "print", check: (c) => (c.match(/\bprint\s*\(/g) || []).length >= 1, messageAr: "اطبع النتيجة" },
      ],
    },
  };

  return (
    map[id] ?? {
      hints: [
        "اقرأ عنوان التمرين وحدد المخرجات المطلوبة قبل الكتابة.",
        "قسّم المشكلة إلى خطوات صغيرة — خوارزمية ثم كود.",
        "شغّل الكود بعد كل تعديل صغير ولاحظ المخرجات.",
      ],
      checks: [{ id: "print", check: (c) => /\bprint\s*\(/.test(c), messageAr: "جرّب استخدام print لعرض النتائج" }],
    }
  );
}
