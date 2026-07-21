export const projectImplementationLesson = {
  id: "project-implementation-sprint",
  titleAr: "تنفيذ المشروع على مراحل",
  pdfRefs: [
    { pdfPageIndex: 455, topic: "implementation sprint" },
    { pdfPageIndex: 456, topic: "task tracking" },
  ],
  vocabularyAr: [
    { term: "Sprint", def: "فترة قصيرة مركزة لإنجاز مجموعة مهام." },
    { term: "Backlog", def: "قائمة المهام المطلوب إنجازها." },
  ],
  learningObjectives: [
    "تحويل خطة المشروع إلى مهام تنفيذية.",
    "قياس نسبة الإنجاز اليومية.",
    "معالجة العوائق أثناء التنفيذ.",
  ],
  whyLearn: "إدارة التنفيذ بشكل مرئي تمنع التأخير وتوضح الحالة الفعلية للمشروع.",
  prerequisites: ["project-architecture"],
  conceptSimple: "التنفيذ الفعال = مهام صغيرة + قياس تقدم + تعديل مستمر.",
  deepSections: [
    { id: "s1", titleAr: "إدارة backlog", bodyAr: "رتب المهام حسب الأولوية والقيمة." },
    { id: "s2", titleAr: "قياس التقدم", bodyAr: "نسبة الإنجاز اليومية تساعد على التصحيح المبكر." },
  ],
  stepsDetailed: [
    { titleAr: "1) جهز backlog", bodyAr: "قسم المهام إلى وحدات صغيرة." },
    { titleAr: "2) ابدأ sprint", bodyAr: "نفّذ المهام ذات الأولوية أولًا." },
    { titleAr: "3) راقب الإنجاز", bodyAr: "احسب completed/total." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "6 من 8 مهام", steps: ["6/8*100"], result: "75%", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "مهام كبيرة جدًا", bodyAr: "يصعب قياس التقدم بدقة." }],
  guidedPractice: [
    { id: "g1", promptAr: "6 من 8 = ؟%", answer: "75" },
    { id: "g2", promptAr: "هل متابعة backlog يوميًا مهمة؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اكتب 5 مهام sprint الحالية", answer: "..." },
    { id: "i2", promptAr: "ما أكبر عائق لديك الآن؟", answer: "..." },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل القياس الدوري يقلل التأخير؟", answer: "نعم" }] },
  challengeAr: "أنشئ جدول sprint من يومين مع نسبة إنجاز مستهدفة.",
  summary: "التنفيذ المرحلي المنضبط يحافظ على جودة المشروع وموعد التسليم.",
  linkedActivity: "/lessons/project-implementation-sprint#lab",
};
