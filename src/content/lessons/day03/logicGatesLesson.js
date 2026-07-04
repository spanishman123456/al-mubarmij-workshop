/** البوابات المنطقية — اليوم 3 */
export const logicGatesLesson = {
  id: "logic-gates",
  titleAr: "الدارات والبوابات المنطقية",
  pdfRefs: [{ pdfPageIndex: 175, topic: "Logic gates" }],
  learningObjectives: [
    "تمييز AND, OR, NOT, XOR.",
    "ربط البوابة بجدول الحقيقة.",
    "قراءة دارة بسيطة.",
  ],
  whyLearn: "المعالجات دوائر — البوابات أساس ALU.",
  prerequisites: ["truth-tables"],
  conceptSimple: "AND = &، OR = |، NOT = عكس، XOR = مختلفان.",
  deepSections: [
    { id: "and", titleAr: "AND", bodyAr: "1 فقط إذا كل المدخلات 1." },
    { id: "or", titleAr: "OR", bodyAr: "0 فقط إذا كل المدخلات 0." },
    { id: "not", titleAr: "NOT", bodyAr: "عكس bit واحد." },
    { id: "circuit", titleAr: "دارة", bodyAr: "بوابات متصلة — محاكاة المنصة." },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد البوابة", bodyAr: "AND/OR/NOT" },
    { titleAr: "2) المدخلات", bodyAr: "0/1" },
    { titleAr: "3) الجدول", bodyAr: "تحقق" },
    { titleAr: "4) المحاكاة", bodyAr: "/simulations#gates" },
  ],
  workedExamples: [
    { id: "e1", titleAr: "AND 1,0", steps: ["1 AND 0", "0"], result: "0" },
    { id: "e2", titleAr: "NOT 1", steps: ["NOT 1", "0"], result: "0" },
  ],
  interactiveExample: { type: "simulation", defaultValue: "logic-gates" },
  commonMistakes: [
    { titleAr: "AND vs OR", bodyAr: "لا تخلط.", step: "gate" },
    { titleAr: "NOT input", bodyAr: "NOT يأخذ مدخل واحد.", step: "not" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "1 OR 0?", answer: "1", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "NOT 0?", answer: "1", hints: [] },
    { id: "g2", promptAr: "1 AND 1?", answer: "1", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "0 OR 0?", answer: "0", hints: [] },
    { id: "i2", promptAr: "1 XOR 1?", answer: "0", hints: [] },
  ],
  summary: "بوابة = عملية bool — جدول حقيقة + محاكاة.",
  linkedActivity: "/simulations#circuit",
};
