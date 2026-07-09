export const projectPlanningLesson = {
  id: "project-planning",
  titleAr: "تخطيط التنفيذ وخارطة المشروع",
  pdfRefs: [
    { pdfPageIndex: 452, topic: "project planning" },
    { pdfPageIndex: 453, topic: "timeline and milestones" },
  ],
  vocabularyAr: [
    { term: "Milestone", def: "هدف مرحلي قابل للقياس في الخطة." },
    { term: "SMART Goal", def: "هدف محدد، قابل للقياس، قابل للتحقيق، واقعي، ومؤطر زمنيًا." },
  ],
  learningObjectives: [
    "بناء خطة تنفيذ مختصرة للمشروع.",
    "صياغة هدف SMART للمخرج النهائي.",
    "تقسيم المهام على جدول زمني واضح.",
  ],
  whyLearn: "التخطيط الجيد يمنع التعثر في التنفيذ ويضمن جودة المنتج النهائي.",
  prerequisites: ["project-ideation"],
  conceptSimple: "حوّل الفكرة إلى مهام أسبوعية واضحة مع مخرجات قابلة للفحص.",
  deepSections: [
    { id: "s1", titleAr: "من الفكرة إلى المهام", bodyAr: "قسّم المشروع إلى وحدات صغيرة قابلة للإنجاز." },
    { id: "s2", titleAr: "الهدف الذكي SMART", bodyAr: "اربط كل هدف بقياس زمني/رقمي." },
  ],
  stepsDetailed: [
    { titleAr: "1) اكتب مخرجات المشروع", bodyAr: "ما الذي يجب تسليمه بالضبط؟" },
    { titleAr: "2) أنشئ milestones", bodyAr: "مرحلة التصميم، ثم التنفيذ، ثم الاختبار." },
    { titleAr: "3) حدد معيار النجاح", bodyAr: "مثل دقة 80% خلال أسبوع." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "هدف SMART", steps: ["أطور النموذج", "إلى 80%", "خلال أسبوع"], result: "SMART", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "هدف بلا قياس", bodyAr: "يصعب الحكم على النجاح بدون رقم/موعد." }],
  guidedPractice: [
    { id: "g1", promptAr: "هل هدف 80% خلال أسبوع SMART؟", answer: "نعم" },
    { id: "g2", promptAr: "هل تقسيم العمل إلى مراحل مفيد؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اكتب milestone أول للمشروع", answer: "..." },
    { id: "i2", promptAr: "ما معيار النجاح لديك؟", answer: "..." },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل الزمن عنصر أساسي في SMART؟", answer: "نعم" }] },
  challengeAr: "ابنِ خطة تنفيذ من 5 خطوات مع موعد تسليم لكل خطوة.",
  summary: "الخطة الواضحة تجعل تنفيذ المشروع أكثر سرعة وجودة.",
  linkedActivity: "/lessons/project-planning#lab",
};
