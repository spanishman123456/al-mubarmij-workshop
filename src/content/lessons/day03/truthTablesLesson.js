/** جداول الحقيقة — اليوم 3 | pdfPageIndex ~160+ */
export const truthTablesLesson = {
  id: "truth-tables",
  titleAr: "جداول الحقيقة والمنطق",
  pdfRefs: [
    { pdfPageIndex: 160, topic: "Truth tables intro" },
    { pdfPageIndex: 165, topic: "Deriving truth tables" },
  ],
  learningObjectives: [
    "بناء جدول حقيقة لمتغيرين.",
    "اشتقاق جدول من تعبير AND/OR/NOT.",
    "ربط الجدول بالبوابات المنطقية.",
  ],
  whyLearn: "الدوائر والبرمجة المنطقية تعتمد على جداول الحقيقة.",
  prerequisites: ["if", "bool"],
  conceptSimple: "A,B ∈ {0,1}. AND: 1 فقط إذا كلاهما 1. OR: 0 فقط إذا كلاهما 0.",
  deepSections: [
    { id: "build", titleAr: "بناء الجدول", bodyAr: "2^n صفوف لـ n متغيرات." },
    { id: "derive", titleAr: "اشتقاق", bodyAr: "A AND B — عمود الناتج من AND لكل صف." },
    { id: "logic-lang", titleAr: "لغة المنطق", bodyAr: "∧ و ∨ و ¬ — رموز PDF." },
  ],
  stepsDetailed: [
    { titleAr: "1) المتغيرات", bodyAr: "A, B" },
    { titleAr: "2) الصفوف", bodyAr: "00,01,10,11" },
    { titleAr: "3) التعبير", bodyAr: "A AND B" },
    { titleAr: "4) الناتج", bodyAr: "0001" },
  ],
  workedExamples: [
    { id: "e1", titleAr: "A AND B", steps: ["00→0", "01→0", "10→0", "11→1"], result: "0001" },
    { id: "e2", titleAr: "A OR B", steps: ["00→0", "01→1", "10→1", "11→1"], result: "0111" },
  ],
  interactiveExample: { type: "simulation", defaultValue: "truth-table" },
  commonMistakes: [
    { titleAr: "AND vs OR", bodyAr: "AND أstrict.", step: "gate" },
    { titleAr: "صف ناقص", bodyAr: "4 صفوف لـ 2 var.", step: "rows" },
  ],
  quickCheck: {
    questions: [
      {
        id: "q1",
        promptAr: "ما ناتج العملية المنطقية التالية؟",
        expression: "1 AND 0",
        answer: "0",
        hintAr: "",
      },
    ],
  },
  guidedPractice: [
    {
      id: "g1",
      promptAr: "ما ناتج العملية المنطقية التالية؟",
      expression: "NOT 1",
      answer: "0",
      hints: [],
    },
    {
      id: "g2",
      promptAr: "ما ناتج العملية المنطقية التالية؟",
      expression: "1 OR 0",
      answer: "1",
      hints: [],
    },
  ],
  independentPractice: [
    {
      id: "i1",
      promptAr: "ما ناتج العملية المنطقية التالية؟",
      expression: "NOT 0",
      answer: "1",
      hints: [],
    },
    {
      id: "i2",
      promptAr: "ما ناتج العملية المنطقية التالية؟",
      expression: "0 AND 0",
      answer: "0",
      hints: [],
    },
  ],
  summary: "جدول حقيقة = كل تركيبات المدخلات + ناتج التعبير.",
  linkedActivity: "/simulations#truth",
};
