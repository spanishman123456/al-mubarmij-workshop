/** تخمين Collatz — اليوم 3 */
export const collatzLesson = {
  id: "collatz",
  titleAr: "تخمين Collatz",
  pdfRefs: [{ pdfPageIndex: 172, topic: "Collatz conjecture" }],
  learningObjectives: [
    "تطبيق قواعد Collatz: n زوج → n/2، فرد → 3n+1.",
    "عدّ الخطوات حتى 1.",
    "استخدام while و break.",
  ],
  whyLearn: "مسألة مشهورة — while + شروط.",
  prerequisites: ["while", "if"],
  conceptSimple: "while n!=1: if n%2==0: n//=2 else: n=3*n+1; count++",
  deepSections: [
    { id: "rules", titleAr: "القواعد", bodyAr: "زوج: ÷2. فرد: ×3+1." },
    { id: "trace", titleAr: "تتبع", bodyAr: "n=6: 6→3→10→5→16→8→4→2→1" },
  ],
  stepsDetailed: [
    { titleAr: "1) n", bodyAr: "ابدأ" },
    { titleAr: "2) while n!=1", bodyAr: "كرّر" },
    { titleAr: "3) قاعدة", bodyAr: "زوج/فرد" },
    { titleAr: "4) count", bodyAr: "خطوات" },
  ],
  workedExamples: [
    { id: "e1", titleAr: "n=6", steps: ["6→3→10→5→16→8→4→2→1", "8 steps"], result: "8" },
    { id: "e2", titleAr: "n=1", steps: ["n==1", "0 steps"], result: "0" },
  ],
  interactiveExample: { type: "if-lab", defaultValue: "n=6\nc=0\nwhile n!=1:\n    n=n//2 if n%2==0 else 3*n+1\n    c+=1\nprint(c)" },
  commonMistakes: [
    { titleAr: "infinite", bodyAr: "تأكد n→1.", step: "while" },
    { titleAr: "integer div", bodyAr: "استخدم // للزوج.", step: "divide" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "6 even → ?", answer: "3", hintAr: "÷2" }] },
  guidedPractice: [
    { id: "g1", promptAr: "n=4 next?", answer: "2", hints: ["÷2"] },
    { id: "g2", promptAr: "n=3 next?", answer: "10", hints: ["3*3+1"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "n=2 steps to 1?", answer: "1", hints: [] },
    { id: "i2", promptAr: "n=5 first step?", answer: "16", hints: ["3*5+1"] },
  ],
  summary: "Collatz: while + if زوج/فرد حتى 1.",
  linkedActivity: "/lessons/truth-tables",
};
