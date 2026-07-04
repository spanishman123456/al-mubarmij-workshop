/**
 * النشاط العملي — مختبر الحاسب (60 دقيقة)
 * pdfPageIndex: 149–150
 */
export const day02ComputerLabLesson = {
  id: "day02-computer-lab",
  titleAr: "النشاط العملي في مختبر الحاسب — 60 دقيقة",
  pdfRefs: [{ pdfPageIndex: 149, topic: "مختبر" }],
  lessonKind: "lab",
  learningObjectives: [
    "تنفيذ خوارزمية → بايثون (حجران، درجة، loop).",
    "استخدام if/for/while في ملف واحد.",
    "حفظ الملف وتسليم المخرجات.",
  ],
  whyLearn: "PDF: 60 دقيقة تطبيق — الجسر بين الورق والكود.",
  prerequisites: ["/lessons/algorithms", "/lessons/if-statement", "/lessons/python-for-range"],
  conceptSimple: "4 مهام مختبر — أكمل و Run واحفظ.",
  activityGuide: {
    goalAr: "تطبيق خوارزميات و if وحلقة في مختبر بايثون خلال 60 دقيقة.",
    instructionsAr: ["افتح /python", "نفّذ المهام بالترتيب", "احفظ بعد كل مهمة"],
    prerequisites: ["if", "for", "while"],
    estimatedMinutes: 60,
    executionSteps: [
      "مهمة 1: d1,d2 if — الفائز",
      "مهمة 2: score >= 50",
      "مهمة 3: for sum 1..10",
      "مهمة 4: while countdown 5→1",
      "Run + screenshot أو copy output",
    ],
    taskAr: "4 برامج تعمل بدون SyntaxError.",
    successCriteria: ["4/4 Run", "if/elif صحيح", "for sum=55", "while 5 lines"],
    verificationAr: "IfStatementLab + PythonLab output.",
    feedbackAr: "IndentationError → أزحف 4 spaces.",
    reflectionAr: "أي مهمة كانت أقرب للخوارزمية الورقية؟",
    completionTracking: "lesson_attempts + lesson_progress",
  },
  stepsDetailed: [
    { titleAr: "1) حجران", bodyAr: "if/elif/else" },
    { titleAr: "2) درجة", bodyAr: "if/else" },
    { titleAr: "3) for", bodyAr: "sum" },
    { titleAr: "4) while", bodyAr: "countdown" },
    { titleAr: "5) حفظ", bodyAr: "File→Save" },
  ],
  workedExamples: [
    { id: "lab1", titleAr: "حجران", code: "d1,d2=3,5\n...", steps: ["P2", "elif"], result: "P2" },
    { id: "lab2", titleAr: "درجة", code: "score=55...", steps: ["Pass"], result: "Pass" },
  ],
  interactiveExample: { type: "if-lab", defaultValue: "d1,d2=4,6\nif d1>d2: print('1')\nelif d1<d2: print('2')\nelse: print('tie')" },
  commonMistakes: [
    { titleAr: "IndentationError", bodyAr: "4 spaces.", step: "indent" },
    { titleAr: "no save", bodyAr: "File→Save.", step: "save" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "sum 1..10?", answer: "55", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "d1=6,d2=6?", answer: "tie", hints: [] },
    { id: "g2", promptAr: "score=55 Pass?", answer: "نعم", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "range(1,11) sum?", answer: "55", hints: [] },
    { id: "i2", promptAr: "while 0 runs?", answer: "لا", hints: [] },
  ],
  summary: "مختبر 60 د — 4 مهام، حفظ، تسليم.",
  linkedActivity: "/python",
};
