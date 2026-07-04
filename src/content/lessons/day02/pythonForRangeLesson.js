/**
 * for و range
 * pdfPageIndex: 118–119
 */
export const pythonForRangeLesson = {
  id: "python-for-range",
  titleAr: "حلقة for و range",
  pdfRefs: [{ pdfPageIndex: 118, topic: "for" }, { pdfPageIndex: 119, topic: "range" }],
  learningObjectives: [
    "الفرق بين for (محدد) و while (شرط).",
    "for i in range(n): 0..n-1.",
    "range(start, stop, step).",
    "المسافة البادئة في جسم الحلقة.",
    "تتبع التنفيذ دورة بدورة.",
  ],
  whyLearn: "تكرار بدون copy-paste — أساس المحاكاة والرسوم.",
  prerequisites: ["lists", "if"],
  conceptSimple: "for i in range(3): print(i) → 0,1,2. range(2,10,2) → 2,4,6,8.",
  deepSections: [
    { id: "for", titleAr: "for", bodyAr: "iterates sequence or range." },
    { id: "range", titleAr: "range", bodyAr: "lazy numbers — stop excluded." },
    { id: "indent", titleAr: "indent", bodyAr: "body indented under for." },
    { id: "trace", titleAr: "trace", bodyAr: "table: i | action." },
  ],
  stepsDetailed: [
    { titleAr: "1) for ... in", bodyAr: "" },
    { titleAr: "2) range", bodyAr: "" },
    { titleAr: "3) indent body", bodyAr: "" },
    { titleAr: "4) trace", bodyAr: "" },
  ],
  workedExamples: [
    { id: "e1", titleAr: "range(3)", code: "for i in range(3):\n    print(i)", steps: ["range yields 0,1,2", "print each"], result: "0\n1\n2" },
    { id: "e2", titleAr: "range(2,5)", code: "for i in range(2,5):\n    print(i)", steps: ["start 2 stop 5", "2,3,4"], result: "2\n3\n4" },
    { id: "e3", titleAr: "step", code: "for i in range(0,10,2):\n    print(i)", steps: ["step 2", "0,2,4,6,8"], result: "even" },
    { id: "e4", titleAr: "sum loop", code: "s=0\nfor i in range(1,4):\n    s+=i\nprint(s)", steps: ["i=1,2,3", "1+2+3=6"], result: "6" },
  ],
  interactiveExample: { type: "for-range-lab", defaultValue: "3" },
  commonMistakes: [
    { titleAr: "range from 1", bodyAr: "starts 0.", step: "range" },
    { titleAr: "stop included", bodyAr: "range(3) ends 2.", step: "stop" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "range(5) count?", answer: "5", hintAr: "0-4" }] },
  guidedPractice: [
    { id: "g1", promptAr: "range(2) last?", answer: "1", hints: [] },
    { id: "g2", promptAr: "range(1,4) sum?", answer: "6", hints: ["1+2+3"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "range(0) empty?", answer: "نعم", hints: [] },
    { id: "i2", promptAr: "range(2,8,3)?", answer: "2,5", hints: [] },
  ],
  summary: "for+range — zero-based, stop excluded.",
  linkedActivity: "/lessons/python-while",
};
