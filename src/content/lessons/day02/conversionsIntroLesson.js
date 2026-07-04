/**
 * النشاط التمهيدي — التحويلات + ASCII
 * pdfPageIndex: 93–98
 */
export const conversionsIntroLesson = {
  id: "conversions-intro",
  titleAr: "النشاط التمهيدي: التحويلات و ASCII",
  pdfRefs: [
    { pdfPageIndex: 93, topic: "نشاط تمهيدي" },
    { pdfPageIndex: 128, topic: "ASCII في التحويلات" },
  ],
  lessonKind: "activity",
  learningObjectives: [
    "مراجعة التحويل العشري ↔ ثنائي ↔ hex.",
    "ربط ASCII بقيم رقمية (A=65).",
    "تجهيز ذهني قبل الحساب في الأنظمة والخوارزميات.",
  ],
  whyLearn: "PDF يبدأ اليوم بمراجعة سريعة + ASCII قبل الجمع في الأنظمة.",
  prerequisites: ["/lessons/number-systems", "/lessons/ascii-unicode"],
  conceptSimple: "حوّل 3 أعداد في 10 دقائق، ثم اكتب ASCII لحرفك الأول.",
  activityGuide: {
    goalAr: "تفعيل مهارات التحويل وربط ASCII قبل دروس الحساب والخوارزميات.",
    instructionsAr: [
      "افتح محوّل الأنظمة أو حل يدوياً على ورق.",
      "أكمل 4 تحويلات من البطاقة.",
      "ابحث عن ASCII لحرف اسمك.",
    ],
    prerequisites: ["أنظمة العد", "ASCII"],
    estimatedMinutes: 15,
    executionSteps: [
      "1010₂ → عشري",
      "15₁₀ → ثنائي",
      "255₁₀ → hex",
      "A₁₆ → عشري",
      "ASCII('M') = ?",
    ],
    taskAr: "سلّم ورقة بـ 5 إجابات + تحقق عكسي لتحويل واحد.",
    successCriteria: ["5 إجابات صحيحة", "تحقق عكسي موثّق", "ASCII صحيح"],
    verificationAr: "قارن مع مفتاح الزميل أو محوّل المنصة.",
    feedbackAr: "خطأ carry في hex؟ راجع عمود الوحدات.",
    reflectionAr: "أين يلتقي ASCII بالعدد العشري؟",
    completionTracking: "lesson_progress API عند إكمال التدريب",
  },
  deepSections: [
    { id: "ascii", titleAr: "ASCII في التمهيد", bodyAr: "A=65₁₀=41₁₆=1000001₂ — حرف = رقم." },
    { id: "warmup", titleAr: "لماذا تمهيد؟", bodyAr: "تنشيط اليوم 1 قبل جمع hex و binary." },
  ],
  stepsDetailed: [
    { titleAr: "1) تحويلات", bodyAr: "4 مسائل." },
    { titleAr: "2) ASCII", bodyAr: "حرف واحد." },
    { titleAr: "3) تحقق", bodyAr: "عكسي." },
    { titleAr: "4) حفظ", bodyAr: "API." },
  ],
  workedExamples: [
    { id: "e1", titleAr: "1010₂ → 10", steps: ["8+2", "10"], result: "10" },
    { id: "e2", titleAr: "A ASCII", steps: ["65", "41 hex"], result: "65" },
  ],
  interactiveExample: { type: "number-base-converter", defaultValue: "42" },
  commonMistakes: [
    { titleAr: "بواقي معكوس", bodyAr: "from decimal.", step: "order" },
    { titleAr: "ASCII hex", bodyAr: "41 not 65 hex confusion.", step: "ascii" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "1111₂=?", answer: "15", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "1100₂→?", answer: "12", hints: [] },
    { id: "g2", promptAr: "ord('A')?", answer: "65", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "FF hex dec?", answer: "255", hints: [] },
    { id: "i2", promptAr: "7→binary?", answer: "111", hints: [] },
  ],
  summary: "تمهيد: تحويلات + ASCII — ثم base-arithmetic.",
  linkedActivity: "/lessons/base-arithmetic",
};
