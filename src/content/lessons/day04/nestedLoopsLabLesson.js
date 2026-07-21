/** الحلقات المتداخلة — اليوم 4 | pdfPageIndex 200–203 */
export const nestedLoopsLabLesson = {
  id: "nested-loops-lab",
  titleAr: "الحلقات المتداخلة والتطبيقات",
  pdfRefs: [
    { pdfPageIndex: 200, topic: "Nested loops program" },
    { pdfPageIndex: 202, topic: "Nested loop applications" },
  ],
  lessonKind: "lab",
  vocabularyAr: [
    { term: "حلقة خارجية", def: "for i in range(n) — تتحكم بعدد الصفوف أو التكرارات الكبرى." },
    { term: "حلقة داخلية", def: "تنفّذ كاملًا لكل تكرار من الخارجية — O(n²) غالبًا." },
    { term: "جدول ضرب", def: "نموذج كلاسيكي: صف i وعمود j." },
  ],
  learningObjectives: [
    "كتابة حلقتين for متداخلتين.",
    "رسم شبكة أو جدول بالطباعة.",
    "تقدير عدد التكرارات.",
    "ربط الحلقات برسم الأنماط.",
  ],
  whyLearn: "الحلقات المتداخلة أساس جداول الضرب، معالجة الصور، والبحث في شبكة ثنائية.",
  prerequisites: ["python-for-range", "python-multi-arrays"],
  conceptSimple: "for i in range(3):\n    for j in range(3):\n        print(i, j) — 9 مرات.",
  activityGuide: {
    goalAr: "ابنِ جدول ضرب 5×5 أو شبكة نجوم باستخدام حلقات متداخلة.",
    instructionsAr: [
      "حدد حجم الشبكة n.",
      "الحلقة الخارجية على الصفوف i.",
      "الداخلية على الأعمدة j.",
      "اطبع i*j أو '*' حسب النمط.",
    ],
    prerequisites: ["for", "range", "print"],
    estimatedMinutes: 20,
    executionSteps: ["n=3", "i=0,j=0..2", "i=1,j=0..2", "…"],
    taskAr: "أكمل شبكة 4×4 حيث الخلية (i,j) تعرض i*j.",
    successCriteria: ["16 قيمة", "صفوف متساوية الطول"],
    verificationAr: "الصف 2: 0,2,4,6",
    feedbackAr: "تأكد من المسافات بين الأعمدة للقراءة.",
    reflectionAr: "كم تكرارًا عند n=10؟ (100)",
    completionTracking: "lesson_progress API",
  },
  deepSections: [
    {
      id: "structure",
      titleAr: "البنية",
      bodyAr: "كل تكرار خارجي يبدأ حلقة داخلية من الصفر — رسمًا زمنيًا: خطوط متداخلة.",
    },
    {
      id: "complexity",
      titleAr: "عدد الخطوات",
      bodyAr: "n خارجية × m داخلية = n×m تكرارًا. انتبه للأداء عند n كبير.",
    },
    {
      id: "patterns",
      titleAr: "أنماط",
      bodyAr: "مثلث نجوم، جدول ضرب، مسح مصفوفة 2D.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) n", bodyAr: "n = 4" },
    { titleAr: "2) خارجية", bodyAr: "for i in range(n):" },
    { titleAr: "3) داخلية", bodyAr: "    for j in range(n):" },
    { titleAr: "4) جسم", bodyAr: "        print(i*j, end=' ')" },
    { titleAr: "5) سطر", bodyAr: "    print() — سطر جديد بعد كل صف" },
  ],
  workedExamples: [
    {
      id: "mult-3",
      titleAr: "جدول 3×3",
      code: "for i in range(1,4):\n  for j in range(1,4):\n    print(i*j, end=' ')\n  print()",
      steps: ["صف 1: 1 2 3", "صف 2: 2 4 6", "صف 3: 3 6 9"],
      result: "جدول ضرب",
    },
    {
      id: "stars",
      titleAr: "مثلث نجوم",
      code: "for i in range(1,5):\n  print('*' * i)",
      steps: ["i=1 → *", "i=2 → **", "…"],
      result: "4 أسطر",
    },
  ],
  interactiveExample: { type: "nested-loops-lab" },
  commonMistakes: [
    { titleAr: "نسيان print()", bodyAr: "كل الصف على سطر واحد.", step: "newline" },
    { titleAr: "خلط i,j", bodyAr: "الترتيب يغيّر النمط.", step: "order" },
  ],
  quickCheck: {
    questions: [{ id: "q1", promptAr: "range(3)×range(3) — كم تكرار؟", answer: "9", hintAr: "3×3" }],
  },
  guidedPractice: [
    { id: "g1", promptAr: "2×2 — كم خلية؟", answer: "4", hints: [] },
    { id: "g2", promptAr: "i=0,j=2 في جدول i*j — القيمة؟", answer: "0", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "5×1 — كم تكرار؟", answer: "5", hints: [] },
    { id: "i2", promptAr: "i=3,j=4 — i*j?", answer: "12", hints: [] },
  ],
  challengeAr: "اطبع مثلث بأرقام: 1 / 2 2 / 3 3 3 باستخدام حلقتين.",
  summary: "حلقة داخل حلقة = شبكة. راقب n×m واستخدم print() بين الصفوف.",
  linkedActivity: "/python?ex=loop-nested",
};
