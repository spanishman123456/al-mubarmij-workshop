/**
 * النشاط العملي — مختبر الحاسب (60 دقيقة)
 * pdfPageIndex: 149–150
 */
export const day02ComputerLabLesson = {
  id: "day02-computer-lab",
  titleAr: "النشاط العملي في مختبر الحاسب — اليوم الثاني",
  pdfRefs: [{ pdfPageIndex: 149, topic: "مختبر 60 دقيقة" }],
  learningObjectives: [
    "تنفيذ خوارزمية رمي حجرين في بايثون.",
    "كتابة برنامج if للناجح/الراسب.",
    "استخدام المرجع أثناء الترمين.",
    "حفظ الملفات وتسليم المخرجات.",
  ],
  whyLearn: "PDF يخصص 60 دقيقة للتطبيق — الربط بين الخوارزمية والكود الفعلي.",
  prerequisites: ["الخوارزميات", "if", "الدليل المرجعي"],
  conceptSimple: "1) اكتب خوارزمية على ورق. 2) حوّل إلى بايثون. 3) Run. 4) صحّح. 5) احفظ.",
  stepsDetailed: [
    { titleAr: "1) رمي حجرين", bodyAr: "d1=random أو إدخال. if/elif/else." },
    { titleAr: "2) أكبر عدد", bodyAr: "a,b,c و if." },
    { titleAr: "3) ناجح/راسب", bodyAr: "score >= 50." },
    { titleAr: "4) تحويل سريع", bodyAr: "محوّل أو يدوي." },
    { titleAr: "5) مراجعة", bodyAr: "SyntaxError و IndentationError." },
  ],
  workedExamples: [
    {
      id: "lab1",
      titleAr: "مثال مختبر: حجران",
      code: "d1, d2 = 3, 5\nif d1 > d2:\n    print('P1')\nelif d1 < d2:\n    print('P2')\nelse:\n    print('tie')",
      steps: ["d1<d2", "elif → P2"],
      result: "P2",
    },
    {
      id: "lab2",
      titleAr: "مثال: درجة",
      code: "score = 55\nif score >= 50:\n    print('Pass')\nelse:\n    print('Fail')",
      steps: ["55>=50", "Pass"],
      result: "Pass",
    },
  ],
  interactiveExample: { type: "if-lab", defaultValue: "", promptAr: "أكمل نشاط PDF في المختبر." },
  commonMistakes: [
    { titleAr: "عدم حفظ الملف", bodyAr: "File → Save.", step: "lab" },
    { titleAr: "input نص", bodyAr: "int(input(...)) للأعداد.", step: "types" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "60 دقيقة — كم نشاطاً رئيسياً في PDF؟", answer: "4", hintAr: "تقريبي" }] },
  guidedPractice: [
    { id: "g1", promptAr: "d1=6,d2=6 — tie؟", answer: "نعم", hints: [] },
    { id: "g2", promptAr: "score=55 — Pass؟", answer: "نعم", hints: [">=50"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "score=49 — Fail؟", answer: "نعم", hints: [] },
    { id: "i2", promptAr: "d1=5,d2=2 — P1؟", answer: "نعم", hints: ["5>2"] },
  ],
  summary: "المختبر يطبّق خوارزميات + if — احفظ عملك على الخادم.",
  linkedActivity: "/python",
};
