export const finalPresentationLesson = {
  id: "final-project-presentation",
  titleAr: "العرض النهائي للمشروع",
  pdfRefs: [
    { pdfPageIndex: 459, topic: "final presentation" },
    { pdfPageIndex: 460, topic: "rubric" },
  ],
  vocabularyAr: [
    { term: "Rubric", def: "معيار تقييم واضح لبنود العرض." },
    { term: "Storyline", def: "تسلسل القصة من المشكلة للحل." },
  ],
  learningObjectives: [
    "تقديم مشروع نهائي بعرض منظم.",
    "استخدام rubric لتقييم جودة التقديم.",
    "إدارة الوقت أثناء العرض.",
  ],
  whyLearn: "العرض النهائي يثبت الفهم العملي للمشروع ويحول العمل إلى أثر قابل للمشاركة.",
  prerequisites: ["project-presentation-rehearsal"],
  conceptSimple: "عرض قوي = مشكلة واضحة + حل عملي + demo + نتائج.",
  deepSections: [
    { id: "s1", titleAr: "هيكل العرض", bodyAr: "مشكلة، حل، demo، أثر، خاتمة." },
    { id: "s2", titleAr: "استخدام rubric", bodyAr: "قيّم الوضوح، الدقة، وجودة demo." },
  ],
  stepsDetailed: [
    { titleAr: "1) افتتح بالمشكلة", bodyAr: "حدد الحاجة بوضوح." },
    { titleAr: "2) اعرض الحل", bodyAr: "أبرز الفكرة التقنية المختصرة." },
    { titleAr: "3) نفذ demo", bodyAr: "مثال حي يثبت عمل المنتج." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "rubric [4,5,4,3]", steps: ["اجمع الدرجات", "احسب المتوسط"], result: "4", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "القفز للكود مباشرة", bodyAr: "يفقد الجمهور سياق المشكلة." }],
  guidedPractice: [
    { id: "g1", promptAr: "متوسط [4,5,4,3]؟", answer: "4" },
    { id: "g2", promptAr: "هل يبدأ العرض بالمشكلة؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اكتب جملة افتتاحية لعرضك", answer: "..." },
    { id: "i2", promptAr: "اذكر مؤشر نجاح واحد للعرض", answer: "..." },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل demo عنصر أساسي في العرض النهائي؟", answer: "نعم" }] },
  challengeAr: "قدّم عرضًا نهائيًا في 4 دقائق باستخدام rubric واضح.",
  summary: "جودة العرض النهائي تعكس جودة التعلم والتنفيذ معًا.",
  linkedActivity: "/lessons/final-project-presentation#lab",
};
