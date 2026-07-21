export const projectIdeationLesson = {
  id: "project-ideation",
  titleAr: "صياغة فكرة المشروع النهائي",
  pdfRefs: [
    { pdfPageIndex: 451, topic: "project idea selection" },
    { pdfPageIndex: 452, topic: "problem statement" },
  ],
  vocabularyAr: [
    { term: "Problem Statement", def: "وصف واضح للمشكلة التي سيحلها المشروع." },
    { term: "Target User", def: "الشخص/الفئة التي ستستفيد من المشروع." },
  ],
  learningObjectives: [
    "اختيار فكرة مشروع قابلة للتنفيذ.",
    "صياغة مشكلة المشروع بوضوح.",
    "تحديد المستخدم المستهدف وقيمة الحل.",
  ],
  whyLearn: "الفكرة الواضحة تختصر وقت التنفيذ وتقلل إعادة العمل في الأيام الأخيرة.",
  prerequisites: ["post-assessment-readiness"],
  conceptSimple: "مشروع جيد = مشكلة حقيقية + حل واضح + مستخدم محدد.",
  deepSections: [
    { id: "s1", titleAr: "اختيار المشكلة", bodyAr: "ابدأ بمشكلة موجودة في المدرسة أو الحياة اليومية." },
    { id: "s2", titleAr: "معيار الصلاحية", bodyAr: "تأكد أن الفكرة قابلة للتنفيذ خلال الوقت المتاح." },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد المشكلة", bodyAr: "ما الذي لا يعمل جيدًا الآن؟" },
    { titleAr: "2) حدد المستخدم", bodyAr: "من سيستفيد؟" },
    { titleAr: "3) اكتب الحل المختصر", bodyAr: "3 أسطر تكفي كبداية." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "فكرة تنظيم واجبات", steps: ["مشكلة نسيان الواجب", "مستخدم: طالب", "حل: تذكير بسيط"], result: "فكرة قابلة للتنفيذ", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "فكرة عامة جدًا", bodyAr: "كلما كانت أضيق كان التنفيذ أفضل." }],
  guidedPractice: [
    { id: "g1", promptAr: "ما أول خطوة للمشروع؟", answer: "تعريف المشكلة" },
    { id: "g2", promptAr: "هل يمكن تنفيذ فكرة دون مستخدم واضح؟", answer: "لا" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اكتب مشكلة مشروعك في جملة", answer: "..." },
    { id: "i2", promptAr: "حدد المستخدم المستهدف", answer: "..." },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل المشروع الجيد يبدأ من مشكلة واقعية؟", answer: "نعم" }] },
  challengeAr: "اكتب صفحة واحدة لفكرة مشروعك (مشكلة، مستخدم، حل، أثر).",
  summary: "وضوح المشكلة والمستخدم أساس نجاح المشروع النهائي.",
  linkedActivity: "/lessons/project-ideation#lab",
};
