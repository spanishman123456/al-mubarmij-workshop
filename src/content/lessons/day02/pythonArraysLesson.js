/**
 * المصفوفات والقوائم في بايثون
 * pdfPageIndex: 114–115
 */
export const pythonArraysLesson = {
  id: "python-arrays",
  titleAr: "المصفوفات والقوائم — الفهرسة من صفر",
  pdfRefs: [{ pdfPageIndex: 114, topic: "lists" }, { pdfPageIndex: 115, topic: "indexing" }],
  learningObjectives: [
    "تمييز list في بايثون عن «مصفوفة» عامة.",
    "الفهرسة zero-based: first index 0.",
    "الوصول nums[i] وتعديل nums[i]=.",
    "قوائم مختلطة الأنواع (PDF).",
    "اكتشاف IndexError.",
  ],
  whyLearn: "for و while تمر على lists — بدون فهرسة صحيحة تنهار الحلقات.",
  prerequisites: ["مقدمة بايثون", "المتغيرات"],
  conceptSimple: "nums = [10, 20, 30] — nums[0]=10، nums[1]=20. len(nums)=3. last: nums[-1]=30.",
  deepSections: [
    { id: "list", titleAr: "list", bodyAr: "Ordered, mutable. [1,'a',True] مسموح." },
    { id: "index", titleAr: "zero-based", bodyAr: "first box is box 0 — كالبطاقات." },
    { id: "access", titleAr: "وصول", bodyAr: "O(1) by index." },
    { id: "mutate", titleAr: "تعديل", bodyAr: "nums[1]=99 يغيّر القائمة." },
    { id: "errors", titleAr: "IndexError", bodyAr: "nums[10] when len=3." },
  ],
  stepsDetailed: [
    { titleAr: "1) أنشئ list", bodyAr: "[ ] أو list()." },
    { titleAr: "2) اقرأ index 0", bodyAr: "first element." },
    { titleAr: "3) len", bodyAr: "valid 0..len-1." },
    { titleAr: "4) عدّل", bodyAr: "assignment." },
  ],
  workedExamples: [
    { id: "e1", titleAr: "وصول", code: "a = [5, 10, 15]\nprint(a[0], a[2])", steps: ["5", "15"], result: "5 15" },
    { id: "e2", titleAr: "تعديل", code: "a[1] = 99\nprint(a)", steps: ["index 1 = 20", "بعد = 99", "[5,99,15]"], result: "[5, 99, 15]" },
    { id: "e3", titleAr: "خطأ", code: "a[5]", steps: ["len=3", "index 5 out of range", "IndexError"], result: "error" },
    { id: "e4", titleAr: "negative index", code: "a[-1]", steps: ["-1 = last", "a[2]=15"], result: "15" },
  ],
  interactiveExample: { type: "python-list-lab", defaultValue: "[10,20,30]" },
  commonMistakes: [
    { titleAr: "index من 1", bodyAr: "a[1] ثاني عنصر لا أول.", step: "index" },
    { titleAr: "IndexError", bodyAr: "index >= len.", step: "bounds" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "[1,2,3][0]?", answer: "1", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "['a','b'][1]?", answer: "b", hints: [] },
    { id: "g2", promptAr: "len([0,0])?", answer: "2", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "[10,20][-1]?", answer: "20", hints: [] },
    { id: "i2", promptAr: "index 3 in len 3?", answer: "خطأ", hints: ["IndexError"] },
  ],
  summary: "lists — index from 0, IndexError out of range.",
  linkedActivity: "/lessons/python-for-range",
};
