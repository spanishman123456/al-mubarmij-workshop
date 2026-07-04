/** break / continue / pass / else — اليوم 3 */
export const breakContinuePassLesson = {
  id: "python-break-continue",
  titleAr: "break و continue و pass و else",
  pdfRefs: [{ pdfPageIndex: 168, topic: "Loop control" }],
  learningObjectives: [
    "استخدام break للخروج من حلقة.",
    "استخدام continue لتخطي تكرار.",
    "pass كعنصر نائب.",
    "else مع for/while عند الإكمال بدون break.",
  ],
  whyLearn: "تحكم دقيق في الحلقات — ألعاب، بحث، إدخال.",
  prerequisites: ["for", "while"],
  conceptSimple: "break: اخرج. continue: التالي. pass: لا شيء. else: نفّذ إن لم break.",
  deepSections: [
    { id: "break", titleAr: "break", bodyAr: "for i in range(10):\n    if i==5: break" },
    { id: "continue", titleAr: "continue", bodyAr: "تخطي i==3." },
    { id: "pass", titleAr: "pass", bodyAr: "if x>0: pass  # لاحقاً" },
    { id: "else-loop", titleAr: "else مع الحلقة", bodyAr: "for… else: — else إن لم break." },
  ],
  stepsDetailed: [
    { titleAr: "1) break", bodyAr: "خروج فوري." },
    { titleAr: "2) continue", bodyAr: "تخطي." },
    { titleAr: "3) pass", bodyAr: "placeholder." },
    { titleAr: "4) else", bodyAr: "بعد for كامل." },
  ],
  workedExamples: [
    { id: "e1", titleAr: "break at 5", code: "for i in range(10):\n    if i==5: break\n    print(i)", steps: ["i=0..4 print", "i=5 break"], result: "0-4" },
    { id: "e2", titleAr: "continue skip even", code: "for i in range(5):\n    if i%2==0: continue\n    print(i)", steps: ["skip 0,2,4", "print 1,3"], result: "1,3" },
  ],
  interactiveExample: { type: "if-lab", defaultValue: "for i in range(5):\n    if i==2: continue\n    print(i)" },
  commonMistakes: [
    { titleAr: "break vs continue", bodyAr: "break يوقف — continue يكمل.", step: "logic" },
    { titleAr: "else with break", bodyAr: "else لا يُنفَّذ إن break.", step: "else" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "break يفعل؟", answer: "خروج", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "break عند i=0 — كم print؟", answer: "0", hints: [] },
    { id: "g2", promptAr: "pass — خطأ syntax؟", answer: "لا", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "continue i=0 — range(3) prints?", answer: "2", hints: ["1,2"] },
    { id: "i2", promptAr: "else for without break runs?", answer: "نعم", hints: [] },
  ],
  summary: "break/continue/pass/else — تحكم متقدم في الحلقات.",
  linkedActivity: "/lessons/divisors-activity",
};
