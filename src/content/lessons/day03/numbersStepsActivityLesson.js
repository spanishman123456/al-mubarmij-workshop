/** نشاط الأرقام والخطوات — مستقل عن Collatz | pdfPageIndex ~173 */
export const numbersStepsActivityLesson = {
  id: "numbers-steps-activity",
  titleAr: "نشاط الأرقام والخطوات",
  lessonKind: "activity",
  pdfRefs: [{ pdfPageIndex: 173, topic: "Numbers and steps activity" }],
  learningObjectives: [
    "تتبّع خوارزمية عدّ خطوات تنازلية من n إلى 0.",
    "تمييز النشاط عن تخمين Collatz (3n+1).",
    "قراءة جدول خطوة بخطوة.",
    "حفظ المحاولات والتلميحات.",
  ],
  whyLearn: "تدريب على تتبّع الخوارزمية خطوة بخطوة قبل مسائل Collatz الأ сложнее.",
  prerequisites: ["for", "while", "python-break-continue"],
  conceptSimple:
    "ابدأ من n. في كل خطوة: إذا n>0 اطرح 1 وزد عداد الخطوات. توقف عند n=0. مثال n=5 → 5,4,3,2,1,0 = 5 خطوات.",
  activityGuide: {
    goalAr: "احسب عدد الخطوات من n حتى 0 بالعد التنازلي.",
    instructionsAr: [
      "اختر n موجباً.",
      "كرّر: n = n - 1 حتى n == 0.",
      "عدّ كل تكرار.",
      "قارن جدولك بالمحاكاة.",
    ],
    prerequisites: ["while", "متغير عداد"],
    estimatedMinutes: 12,
    executionSteps: ["n=5", "5→4→3→2→1→0", "5 خطوات"],
    taskAr: "n=8 — كم خطوة؟",
    successCriteria: ["8 خطوات", "جدول 9 صفوف يشمل 0"],
    verificationAr: "آخر قيمة 0 وعداد = n.",
    feedbackAr: "Collatz يغيّر n بقواعد مختلفة — هنا طرح 1 فقط.",
    reflectionAr: "متى تستخدم while بدل for؟",
    completionTracking: "lesson_progress API",
  },
  deepSections: [
    {
      id: "vs-collatz",
      titleAr: "الفرق عن Collatz",
      bodyAr: "هنا: n←n−1 دائماً. Collatz: n زوجي → n/2، فردي → 3n+1. لا تخلط القواعد.",
    },
    {
      id: "trace-table",
      titleAr: "جدول التتبّع",
      bodyAr: "الأعمدة: #، n قبل، عملية، n بعد، steps. يساعد على تصحيح الأخطاء.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) n", bodyAr: "8" },
    { titleAr: "2) steps=0", bodyAr: "عداد" },
    { titleAr: "3) while n>0", bodyAr: "n-=1; steps+=1" },
    { titleAr: "4) print(steps)", bodyAr: "8" },
  ],
  summary: "عدّ تنازلي = n خطوات للوصول من n إلى 0.",
  linkedActivity: "/lessons/collatz",
};
