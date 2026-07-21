export const postAssessmentLesson = {
  id: "post-assessment-readiness",
  titleAr: "التقويم البعدي وقراءة نتائج التعلم",
  pdfRefs: [
    { pdfPageIndex: 450, topic: "post assessment" },
    { pdfPageIndex: 451, topic: "progress analysis" },
  ],
  vocabularyAr: [
    { term: "Post-Assessment", def: "اختبار يقيس ما تحقق بعد التعلم." },
    { term: "Learning Gain", def: "نسبة التحسن بين pre/post." },
  ],
  learningObjectives: [
    "فهم هدف التقويم البعدي تربويًا.",
    "حساب نسبة التحسن بدقة.",
    "تفسير النتائج لاستخراج خطة تحسين عملية.",
  ],
  whyLearn: "القياس الصحيح للتقدم يساعدك على اتخاذ قرارات تعلم أفضل قبل المرحلة النهائية.",
  prerequisites: ["comprehensive-review"],
  conceptSimple: "ليس المهم الدرجة فقط، بل مقدار التحسن والسبب.",
  deepSections: [
    { id: "s1", titleAr: "الفرق بين Pre و Post", bodyAr: "pre للتشخيص الأولي، post لقياس الناتج بعد التدريب." },
    { id: "s2", titleAr: "قراءة النتائج", bodyAr: "حدد الأسئلة التي تحسنت وتلك التي تحتاج تقوية." },
  ],
  stepsDetailed: [
    { titleAr: "1) سجّل نتيجتي pre/post", bodyAr: "مثال 50 و 65." },
    { titleAr: "2) احسب نسبة التحسن", bodyAr: "(65-50)/50*100 = 30%." },
    { titleAr: "3) ضع إجراء تحسين", bodyAr: "مراجعة محور محدد." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "Learning Gain", steps: ["pre=50", "post=65", "gain=30%"], result: "تحسن جيد", difficulty: "متوسط" },
  ],
  commonMistakes: [{ titleAr: "الاكتفاء بالرقم", bodyAr: "لا بد من ربط النتيجة بسبب تعليمي." }],
  guidedPractice: [
    { id: "g1", promptAr: "Pre=40 Post=52 التحسن %؟", answer: "30" },
    { id: "g2", promptAr: "هل quiz-post يقيس تقدمًا بعد التعلم؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اكتب سببًا محتملًا لتحسنك", answer: "مراجعة منتظمة" },
    { id: "i2", promptAr: "هل يحتاج التحسن متابعة لاحقة؟", answer: "نعم" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل يمكن أن تكون النتيجة عالية دون فهم الأسباب؟", answer: "نعم" }] },
  challengeAr: "حلل نتيجة اختبارك البعدي في 4 أسطر مع خطة تحسين.",
  summary: "التقويم البعدي أداة قرار، لا مجرد درجة.",
  linkedActivity: "/lessons/post-assessment-readiness#lab",
};
