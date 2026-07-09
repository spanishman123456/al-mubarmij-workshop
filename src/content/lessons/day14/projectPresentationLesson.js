export const projectPresentationLesson = {
  id: "project-presentation-rehearsal",
  titleAr: "تجهيز العرض التقديمي وبروفة المشروع",
  pdfRefs: [
    { pdfPageIndex: 457, topic: "presentation structure" },
    { pdfPageIndex: 458, topic: "demo rehearsal" },
  ],
  vocabularyAr: [
    { term: "Demo", def: "عرض حي يوضح عمل المشروع." },
    { term: "Narrative", def: "تسلسل منطقي للقصة من المشكلة إلى الحل." },
  ],
  learningObjectives: [
    "ترتيب عرض المشروع بشكل منطقي.",
    "تقديم demo واضح ومختصر.",
    "الاستعداد للأسئلة المتوقعة.",
  ],
  whyLearn: "حتى مشروع ممتاز يحتاج عرضًا واضحًا ليظهر قيمته الحقيقية.",
  prerequisites: ["project-testing-debugging"],
  conceptSimple: "ابدأ بالمشكلة، ثم الحل، ثم demo، ثم النتائج والخاتمة.",
  deepSections: [
    { id: "s1", titleAr: "هيكل العرض", bodyAr: "المشكلة → الحل → demo → الأثر." },
    { id: "s2", titleAr: "بروفة فعالة", bodyAr: "تدريب زمني + تغذية راجعة." },
  ],
  stepsDetailed: [
    { titleAr: "1) جهز الشرائح", bodyAr: "نقاط مختصرة ومرئية." },
    { titleAr: "2) تدرب على demo", bodyAr: "سيريو محدد وقصير." },
    { titleAr: "3) راجع التوقيت", bodyAr: "التزم بالوقت المستهدف." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "ترتيب العرض", steps: ["مشكلة", "حل", "demo", "خلاصة"], result: "عرض واضح", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "بدء العرض بالكود مباشرة", bodyAr: "يفقد الجمهور سياق المشكلة." }],
  guidedPractice: [
    { id: "g1", promptAr: "ما أول جزء في العرض؟", answer: "المشكلة" },
    { id: "g2", promptAr: "هل يجب عرض demo قبل الخاتمة؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اكتب جملة افتتاحية لعرضك", answer: "..." },
    { id: "i2", promptAr: "ما السؤال الأصعب المتوقع من اللجنة؟", answer: "..." },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل البروفة تقلل التوتر أثناء العرض؟", answer: "نعم" }] },
  challengeAr: "قدّم بروفة 3 دقائق أمام زميل مع تسجيل ملاحظتين للتحسين.",
  summary: "التحضير الجيد للعرض يحوّل المشروع إلى قصة مقنعة وواضحة.",
  linkedActivity: "/lessons/project-presentation-rehearsal#lab",
};
