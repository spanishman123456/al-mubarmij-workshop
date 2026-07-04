/**
 * نشاط فرز البطاقات — خوارزمية
 * pdfPageIndex: 109
 */
export const cardSortAlgorithmLesson = {
  id: "card-sort-algorithm",
  titleAr: "نشاط خوارزمية فرز البطاقات",
  pdfRefs: [{ pdfPageIndex: 109, topic: "Card sort unplugged" }],
  lessonKind: "activity",
  learningObjectives: [
    "تطبيق خوارزمية فرز بسيطة (selection/bubble unplugged).",
    "ترتيب خطوات المقارنة والتبديل.",
    "ربط النشاط اليدوي بالخوارزميات.",
  ],
  whyLearn: "PDF يربط فرز البطاقات قبل pseudocode — تجربة حسية للترتيب.",
  prerequisites: ["مقدمة الخوارزميات"],
  conceptSimple: "قارن بطاقتين، بدّل إن لزم، كرّر حتى مرتبة.",
  activityGuide: {
    goalAr: "فرز مجموعة أرقام على بطاقات من الأصغر للأكبر بخطوات خوارزمية واضحة.",
    instructionsAr: [
      "وزّع 5–8 بطاقات بأرقام عشوائية على الطاولة.",
      "في كل جولة: ابحث عن الأصغر في الباقي وضعه في موضعه.",
      "سجّل كل مقارنة وتبديل.",
    ],
    prerequisites: ["فهم المقارنة والتبديل"],
    estimatedMinutes: 20,
    executionSteps: [
      "رتّب البطاقات في صف — اكتب الترتيب الأولي.",
      "قارن بطاقتين — سجّل: أيهما أصغر؟",
      "بدّل إن كان الترتيب خاطئاً.",
      "كرّر حتى لا حاجة للتبديل في جولة كاملة.",
      "تحقق: هل الأرقام تصاعدية؟",
    ],
    taskAr: "فرز [7,3,9,1,5] يدوياً وسجّل 3 خطوات على الأقل.",
    successCriteria: ["الترتيب النهائي صحيح", "3+ مقارنات مسجلة", "خطوات محددة غير غامضة"],
    verificationAr: "قارن مع [1,3,5,7,9] — أو استخدم AlgorithmStepsLab.",
    feedbackAr: "إن نسيت التبديل — راجع خطوة «بدّل».",
    reflectionAr: "كيف تشبه هذه الخطوات فرز فقاعي؟",
    completionTracking: "lesson_progress + lesson_attempts API",
  },
  stepsDetailed: [
    { titleAr: "1) تهيئة", bodyAr: "بطاقات + ورقة." },
    { titleAr: "2) مقارنة", bodyAr: "ثنتان ثنتان." },
    { titleAr: "3) تبديل", bodyAr: "swap." },
    { titleAr: "4) تكرار", bodyAr: "until sorted." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "فرز [3,7,1]", steps: ["قارن 3 و7 — لا تبديل", "قارن 7 و1 — بدّل → [3,1,7]", "قارن 3 و1 — بدّل → [1,3,7]"], result: "[1,3,7]" },
  ],
  summary: "فرز البطاقات = خوارزمية ملموسة قبل الكود.",
  linkedActivity: "/lessons/algorithms",
};
