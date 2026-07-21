/**
 * while
 * pdfPageIndex: 124
 */
export const pythonWhileLesson = {
  id: "python-while",
  titleAr: "حلقة while — تكرار بشرط",
  pdfRefs: [{ pdfPageIndex: 124, topic: "while" }],
  learningObjectives: [
    "while condition: حتى يصبح False.",
    "تحديث متغير الشرط داخل الحلقة.",
    "خطر infinite loop.",
    "تتبع iterations.",
    "الفرق عن for.",
  ],
  whyLearn: "when repetitions unknown — input validation, games.",
  prerequisites: ["for/range", "if"],
  conceptSimple: "n=3\nwhile n>0:\n    print(n)\n    n-=1 → 3,2,1.",
  deepSections: [
    { id: "cond", titleAr: "الشرط", bodyAr: "checked before each iteration." },
    { id: "update", titleAr: "update", bodyAr: "must progress toward False." },
    { id: "infinite", titleAr: "infinite", bodyAr: "while True without break — danger." },
  ],
  stepsDetailed: [
    { titleAr: "1) init", bodyAr: "" },
    { titleAr: "2) while cond", bodyAr: "" },
    { titleAr: "3) body + update", bodyAr: "" },
    { titleAr: "4) exit", bodyAr: "" },
  ],
  workedExamples: [
    { id: "e1", titleAr: "countdown", code: "n=3\nwhile n>0:\n  print(n)\n  n-=1", steps: ["n=3 print", "n=2,1 then stop"], result: "3\n2\n1" },
    { id: "e2", titleAr: "sum input", code: "s=0\ni=0\nwhile i<3:\n  s+=i\n  i+=1", steps: ["i 0,1,2", "s=0+1+2=3"], result: "3" },
    { id: "e3", titleAr: "infinite risk", code: "n=1\nwhile n>0:\n  print(n)", steps: ["n never decreases", "infinite loop"], result: "error" },
  ],
  interactiveExample: { type: "while-lab", defaultValue: "3" },
  commonMistakes: [
    { titleAr: "no update", bodyAr: "infinite loop.", step: "update" },
    { titleAr: "off-by-one", bodyAr: "while i<=n vs i<n.", step: "condition" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "while False runs?", answer: "لا", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "n=1 while n<3 prints?", answer: "1,2", hints: [] },
    { id: "g2", promptAr: "for vs while unknown count?", answer: "while", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "while 0 runs?", answer: "لا", hints: [] },
    { id: "i2", promptAr: "n=5; while n: n-=2 — iterations?", answer: "2", hints: ["5,3"] },
  ],
  summary: "while — condition first, update always, avoid infinite.",
  linkedActivity: "/lessons/if-statement",
};
