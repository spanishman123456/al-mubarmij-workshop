export const peerFeedbackLesson = {
  id: "peer-feedback-and-refinement",
  titleAr: "التغذية الراجعة من الأقران وتحسين المشروع",
  pdfRefs: [
    { pdfPageIndex: 460, topic: "peer feedback" },
    { pdfPageIndex: 461, topic: "refinement loop" },
  ],
  vocabularyAr: [
    { term: "Constructive Feedback", def: "ملاحظة واضحة تهدف لتحسين العمل." },
    { term: "Refinement", def: "تحسين تدريجي بناءً على الملاحظات." },
  ],
  learningObjectives: [
    "تقديم ملاحظات بناءة وعادلة.",
    "تحويل الملاحظات إلى إجراءات تطوير.",
    "تحسين نسخة المشروع قبل الإغلاق.",
  ],
  whyLearn: "الملاحظات النوعية ترفع جودة المشروع وتساعد على اكتشاف نقاط لم ينتبه لها الفريق.",
  prerequisites: ["final-project-presentation"],
  conceptSimple: "الملاحظة المفيدة: محددة، محترمة، قابلة للتنفيذ.",
  deepSections: [
    { id: "s1", titleAr: "كيف تعطي feedback جيدًا", bodyAr: "صف الملاحظة + أثرها + اقتراح التحسين." },
    { id: "s2", titleAr: "كيف تستقبل feedback", bodyAr: "اسأل، وضّح، ثم خطط للتنفيذ." },
  ],
  stepsDetailed: [
    { titleAr: "1) راقب العرض", bodyAr: "ركز على وضوح الفكرة والdemo." },
    { titleAr: "2) اكتب ملاحظة محددة", bodyAr: "تجنب العموميات." },
    { titleAr: "3) اقترح إجراء تحسين", bodyAr: "خطوة عملية قابلة للقياس." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "ملاحظة بناءة", steps: ["الشرح سريع", "اقترح إبطاء المقدمة"], result: "تحسن الوضوح", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "نقد عام بلا حل", bodyAr: "لا يساعد الفريق على التطوير." }],
  guidedPractice: [
    { id: "g1", promptAr: "هل feedback يجب أن يكون محددًا؟", answer: "نعم" },
    { id: "g2", promptAr: "اذكر نقطة تحسين واحدة", answer: "وضوح الشرح" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اكتب feedback لفريق آخر", answer: "..." },
    { id: "i2", promptAr: "ما التعديل الذي ستنفذه في مشروعك؟", answer: "..." },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل يمكن أن تكون الملاحظة مفيدة دون اقتراح؟", answer: "لا" }] },
  challengeAr: "قدّم 3 ملاحظات peer feedback قابلة للتطبيق لفريق مختلف.",
  summary: "التغذية الراجعة الفعالة تحول المشروع من جيد إلى ممتاز.",
  linkedActivity: "/lessons/peer-feedback-and-refinement#lab",
};
