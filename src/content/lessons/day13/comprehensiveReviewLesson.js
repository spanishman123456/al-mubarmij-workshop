export const comprehensiveReviewLesson = {
  id: "comprehensive-review",
  titleAr: "مراجعة شاملة لمحاور المقرر",
  pdfRefs: [
    { pdfPageIndex: 449, topic: "مراجعة الثنائي والمنطق" },
    { pdfPageIndex: 450, topic: "مراجعة بايثون والخوارزميات" },
  ],
  vocabularyAr: [
    { term: "Review Loop", def: "دورة مراجعة منتظمة (فهم → تطبيق → تقييم)." },
    { term: "Weak Area", def: "مهارة تحتاج دعمًا إضافيًا." },
  ],
  learningObjectives: [
    "تحديد نقاط القوة والضعف في التعلم السابق.",
    "إعادة حل أمثلة محورية من الأيام السابقة.",
    "بناء خطة مراجعة مركزة قبل التقويم البعدي.",
  ],
  whyLearn: "المراجعة المنظمة ترفع الثقة وتقلل الأخطاء قبل الاختبار والمشروع النهائي.",
  prerequisites: ["all-days-1-12"],
  conceptSimple: "بدل إعادة كل شيء، ركّز على المهارات الأعلى أثرًا.",
  deepSections: [
    { id: "s1", titleAr: "خريطة المهارات", bodyAr: "قسّم المقرر إلى محاور: أعداد، منطق، بايثون، خوارزميات." },
    { id: "s2", titleAr: "أولوية المراجعة", bodyAr: "ابدأ بالموضوعات التي تظهر فيها أخطاء متكررة." },
  ],
  stepsDetailed: [
    { titleAr: "1) اجمع نتائجك السابقة", bodyAr: "من التمارين والاختبارات." },
    { titleAr: "2) احسب متوسط كل محور", bodyAr: "لتحديد الأولويات." },
    { titleAr: "3) نفّذ مراجعة نشطة", bodyAr: "حل سريع + تفسير منطقي." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "متوسط درجات محور", steps: ["60,70,80"], result: "70", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "مراجعة سلبية", bodyAr: "القراءة دون حل فعلي لا تكفي." }],
  guidedPractice: [
    { id: "g1", promptAr: "متوسط [50,70,90]؟", answer: "70" },
    { id: "g2", promptAr: "هل المراجعة الأسبوعية مهمة؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "حدّد محورًا ضعيفًا لديك", answer: "بايثون" },
    { id: "i2", promptAr: "اكتب إجراءًا واحدًا لتحسينه", answer: "حل تمارين إضافية" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل المراجعة الفعالة تعتمد على بيانات الأداء؟", answer: "نعم" }] },
  challengeAr: "أنشئ خطة مراجعة من 3 أيام بوقت محدد لكل محور.",
  summary: "المراجعة الذكية تعتمد على الأولوية والقياس، لا على الكم فقط.",
  linkedActivity: "/lessons/comprehensive-review#lab",
};
