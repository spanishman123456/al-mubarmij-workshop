export const projectTestingLesson = {
  id: "project-testing-debugging",
  titleAr: "اختبار المشروع وتصحيح الأخطاء",
  pdfRefs: [
    { pdfPageIndex: 456, topic: "testing strategy" },
    { pdfPageIndex: 457, topic: "debugging workflow" },
  ],
  vocabularyAr: [
    { term: "Test Case", def: "حالة اختبار تتحقق من سلوك متوقع." },
    { term: "Bug Reproduction", def: "إعادة إظهار الخطأ بشكل ثابت قبل إصلاحه." },
  ],
  learningObjectives: [
    "بناء قائمة اختبارات أساسية للمشروع.",
    "حساب pass rate للنسخة الحالية.",
    "تطبيق دورة تصحيح منظمة.",
  ],
  whyLearn: "الاختبار الجيد يرفع الثقة في المشروع ويقلل الأعطال في العرض النهائي.",
  prerequisites: ["project-implementation-sprint"],
  conceptSimple: "اختبر ما بنيته، ثم أصلح وفق خطوات واضحة لا بالتخمين.",
  deepSections: [
    { id: "s1", titleAr: "أنواع الاختبار", bodyAr: "وظيفي، واجهة، وتكامل." },
    { id: "s2", titleAr: "خطوات التصحيح", bodyAr: "أعد الخطأ، حدده، أصلحه، ثم أعد الاختبار." },
  ],
  stepsDetailed: [
    { titleAr: "1) اكتب test cases", bodyAr: "قبل العرض النهائي." },
    { titleAr: "2) احسب pass rate", bodyAr: "pass/total." },
    { titleAr: "3) أصلح الأعطال", bodyAr: "ابدأ بالأكثر تأثيرًا." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "9 من 12 اختبار", steps: ["9/12*100"], result: "75%", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "إصلاح بلا إعادة إنتاج", bodyAr: "قد يؤدي لإصلاحات غير صحيحة." }],
  guidedPractice: [
    { id: "g1", promptAr: "9 من 12 = ؟%", answer: "75" },
    { id: "g2", promptAr: "هل إعادة إنتاج الخطأ خطوة أساسية؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اذكر خطأ واجهته اليوم", answer: "..." },
    { id: "i2", promptAr: "كيف تحققت من الإصلاح؟", answer: "..." },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل pass rate مؤشر مباشر على جاهزية الإصدار؟", answer: "نعم" }] },
  challengeAr: "صمم checklist اختبار من 10 بنود لمشروعك.",
  summary: "دورة الاختبار والتصحيح شرط أساسي قبل أي عرض أو تسليم.",
  linkedActivity: "/lessons/project-testing-debugging#lab",
};
