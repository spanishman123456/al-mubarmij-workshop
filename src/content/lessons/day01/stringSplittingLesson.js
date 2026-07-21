/**
 * تقسيم سلاسل الرموز — اليوم 1
 * pdfPageIndex: 40, 129
 */
export const stringSplittingLesson = {
  id: "string-splitting",
  titleAr: "تقسيم سلاسل الرموز في بايثون",
  pdfRefs: [
    { pdfPageIndex: 40, topic: "سلاسل الرموز" },
    { pdfPageIndex: 129, topic: "تبادل ASCII" },
  ],
  learningObjectives: [
    "استخدام len و indexing للوصول لحرف في string.",
    "تطبيق slicing لاستخراج جزء من النص.",
    "استخدام split و join لتقسيم ودمج سلاسل.",
    "ربط split بتحليل ASCII (أحرف منفصلة).",
  ],
  whyLearn: "PDF يربط الرموز ببايثون: 'Hello' سلسلة أحرف، كل حرف ord، وsplit يفكك النص لتحليله.",
  prerequisites: ["مقدمة بايثون", "ASCII/Unicode"],
  conceptSimple:
    "text = 'A,B,C' — split(',') → ['A','B','C']. join('-') → 'A-B-C'. text[0] أول حرف. text[1:3] من index 1 إلى 2.",
  deepSections: [
    {
      id: "index",
      titleAr: "الفهرسة",
      bodyAr: "المنازل تبدأ من 0. 'Hi' → H=0, i=1. سالب: -1 آخر حرف.",
    },
    {
      id: "slice",
      titleAr: "القطع slicing",
      bodyAr: "s[start:end] — end غير شامل. s[:3] أول 3 أحرف.",
    },
    {
      id: "split-join",
      titleAr: "split و join",
      bodyAr: "split(فاصل) قائمة. join(فاصل) string. مفيد لتحليل CSV أو رسائل.",
    },
  ],
  terms: [
    { termAr: "string", definitionAr: "سلسلة أحرف بين علامتي اقتباس." },
    { termAr: "split()", definitionAr: "تقسيم النص إلى قائمة." },
    { termAr: "join()", definitionAr: "دمج قائمة إلى نص." },
  ],
  stepsDetailed: [
    { titleAr: "1) len", bodyAr: "len('Hi') → 2" },
    { titleAr: "2) index", bodyAr: "'Hi'[0] → 'H'" },
    { titleAr: "3) slice", bodyAr: "'Hello'[1:4] → 'ell'" },
    { titleAr: "4) split", bodyAr: "'a,b,c'.split(',') → ['a','b','c']" },
    { titleAr: "5) ord لكل جزء", bodyAr: "حلل كل حرف بعد split." },
  ],
  workedExamples: [
    {
      id: "ex-split",
      titleAr: "split على فاصلة",
      code: "s = '72,105'\nparts = s.split(',')\nprint(parts)",
      steps: ["قائمة ['72','105']", "ord لكل رقم في ASCII activity"],
      result: "['72', '105']",
    },
    {
      id: "ex-join",
      titleAr: "join",
      code: "chars = ['H', 'i']\nprint(''.join(chars))",
      steps: ["''.join يدمج بدون فاصل", "Hi"],
      result: "Hi",
    },
  ],
  interactiveExample: { type: "string-lab", defaultValue: "A,B,C" },
  commonMistakes: [
    { titleAr: "split بدون حفظ", bodyAr: "parts = s.split() لا s.split() فقط." },
    { titleAr: "end شامل", bodyAr: "s[0:2] حرفان فقط — index 0 و1." },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "'abc'[1]؟", answer: "b", hintAr: "index 1" },
      { id: "q2", promptAr: "'a-b'.split('-')؟", answer: "a,b", hintAr: "قائمتان" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "len('Python')؟", answer: "6", hints: [] },
    { id: "g2", promptAr: "'Hi'[1]؟", answer: "i", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "'Hello'[1:4]؟", answer: "ell", hints: [] },
    { id: "i2", promptAr: "','.join(['a','b'])؟", answer: "a,b", hints: [] },
  ],
  summary: "split/join/slice أدوات تحليل النص — أساس معالجة الملفات والترميز.",
  linkedActivity: "/lessons/ascii-unicode",
};
