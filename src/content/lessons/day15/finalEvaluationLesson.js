export const finalEvaluationLesson = {
  id: "final-evaluation",
  titleAr: "التقييم الختامي وقياس الأثر",
  pdfRefs: [
    { pdfPageIndex: 461, topic: "final evaluation" },
    { pdfPageIndex: 462, topic: "outcome analysis" },
  ],
  vocabularyAr: [
    { term: "Outcome", def: "الناتج الفعلي بعد إتمام البرنامج." },
    { term: "Reflection", def: "مراجعة ذاتية لما تم تعلمه." },
  ],
  learningObjectives: [
    "حساب النتيجة النهائية بدقة.",
    "تحليل جودة المخرجات التعليمية.",
    "تحديد خطة تطوير بعد انتهاء الدورة.",
  ],
  whyLearn: "التقييم الختامي يربط بين الجهد والنتيجة ويوضح طريق التحسن القادم.",
  prerequisites: ["peer-feedback-and-refinement"],
  conceptSimple: "احسب النتيجة، حللها، ثم قرر الخطوة التالية.",
  deepSections: [
    { id: "s1", titleAr: "حساب النسب", bodyAr: "النتيجة/الإجمالي * 100." },
    { id: "s2", titleAr: "تفسير النتيجة", bodyAr: "ما الذي نجح؟ وما الذي يحتاج تطويرًا؟" },
  ],
  stepsDetailed: [
    { titleAr: "1) اجمع درجات rubric", bodyAr: "لكل محور." },
    { titleAr: "2) احسب النسبة النهائية", bodyAr: "مثال 42/50=84%." },
    { titleAr: "3) اكتب reflection قصير", bodyAr: "دروس مستفادة وخطة لاحقة." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "42 من 50", steps: ["42/50*100"], result: "84%", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "التركيز على الرقم فقط", bodyAr: "الأهم فهم أسباب النتيجة." }],
  guidedPractice: [
    { id: "g1", promptAr: "42/50 = ؟%", answer: "84" },
    { id: "g2", promptAr: "هل التقييم يساعد على تحديد الخطوة التالية؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اذكر إنجازًا رئيسيًا في مشروعك", answer: "..." },
    { id: "i2", promptAr: "اذكر مهارة تحتاج تطويرًا لاحقًا", answer: "..." },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل reflection جزء من التعلم العميق؟", answer: "نعم" }] },
  challengeAr: "اكتب تقييمًا ختاميًا من 6 أسطر يتضمن النتيجة وخطة تطوير شخصية.",
  summary: "التقييم الختامي الجيد هو نقطة بداية للتعلم المستمر وليس النهاية.",
  linkedActivity: "/lessons/final-evaluation#lab",
};
