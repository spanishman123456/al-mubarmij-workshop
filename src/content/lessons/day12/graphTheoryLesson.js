export const graphTheoryLesson = {
  id: "graph-theory-basics",
  titleAr: "أساسيات نظرية المخططات وتطبيقاتها",
  pdfRefs: [
    { pdfPageIndex: 445, topic: "vertices and edges" },
    { pdfPageIndex: 446, topic: "paths and coloring" },
  ],
  vocabularyAr: [
    { term: "Vertex", def: "عقدة/رأس في الرسم البياني." },
    { term: "Edge", def: "حافة تربط رأسين." },
    { term: "Degree", def: "عدد الحواف المتصلة بالرأس." },
    { term: "Path", def: "تسلسل رؤوس متصل بحواف." },
  ],
  learningObjectives: [
    "تمثيل مشكلة بعقد وحواف.",
    "حساب درجات الرؤوس وعدد الحواف في K_n.",
    "تفسير تطبيقات المخططات في الشبكات والجدولة.",
  ],
  whyLearn: "المخططات لغة موحدة لنمذجة العلاقات في الشبكات والخرائط والمهام.",
  prerequisites: ["algorithms", "math-basics"],
  conceptSimple: "الرسم البياني = رؤوس + حواف. في الرسم الكامل K_n: الحواف = n(n-1)/2.",
  deepSections: [
    { id: "s1", titleAr: "مكونات الرسم", bodyAr: "تعريف الرأس، الحافة، الدرجة، والمسار." },
    { id: "s2", titleAr: "الرسم الكامل", bodyAr: "كل رأس متصل بكل رأس آخر مرة واحدة." },
    { id: "s3", titleAr: "تطبيقات", bodyAr: "تمثيل علاقات الصداقة أو شبكة أجهزة." },
  ],
  stepsDetailed: [
    { titleAr: "1) عرّف العناصر", bodyAr: "من هم الرؤوس؟ ما نوع العلاقة؟" },
    { titleAr: "2) ارسم الحواف", bodyAr: "اربط كل علاقة بحافة." },
    { titleAr: "3) حلّل الرسم", bodyAr: "احسب الدرجات والمسارات." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "حواف K5", steps: ["5*4/2"], result: "10 حواف", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "الخلط بين موجه/غير موجه", bodyAr: "عدد الحواف والصياغة تختلف." }],
  guidedPractice: [
    { id: "g1", promptAr: "عدد حواف K4؟", answer: "6" },
    { id: "g2", promptAr: "هل مجموع درجات رسم غير موجه عدد زوجي؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "عدد حواف K6؟", answer: "15" },
    { id: "i2", promptAr: "هل [1,1,1] متتالية درجات صحيحة؟", answer: "لا" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل K5 يملك 10 حواف؟", answer: "نعم" }] },
  challengeAr: "نمذج شبكة صفية من 6 طلاب واحسب درجة كل رأس.",
  summary: "نظرية المخططات تساعدنا على تحويل العلاقات المعقدة إلى نموذج قابل للتحليل.",
  linkedActivity: "/lessons/graph-theory-basics#lab",
};
