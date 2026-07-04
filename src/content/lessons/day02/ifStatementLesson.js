/**
 * جملة If الشرطية — اليوم الثاني (عمق مرجعي)
 * pdfPageIndex: 141–148
 */
export const ifStatementLesson = {
  id: "if-statement",
  titleAr: "جملة If الشرطية في بايثون",
  pdfRefs: [
    { pdfPageIndex: 141, topic: "القيم المنطقية والشروط" },
    { pdfPageIndex: 143, topic: "if و if/else" },
    { pdfPageIndex: 145, topic: "معاملات المقارنة" },
    { pdfPageIndex: 147, topic: "أخطاء الصياغة والمنطق" },
  ],
  learningObjectives: [
    "شرح معنى «الشرط» — تنفيذ كود فقط عند تحقق حالة.",
    "استخدام القيم المنطقية True و False ونتائج المقارنات.",
    "تطبيق == و != و < و > و <= و >= بشكل صحيح.",
    "كتابة if و if/else مع المسافة البادئة (indentation) الصحيحة.",
    "كتابة شروط متعددة بـ elif عند الحاجة.",
    "تمييز أخطاء الصياغة (= بدل ==) والمنطق (شرط معكوس).",
    "تشغيل برامج if في المختبر وحفظ المحاولات.",
  ],
  whyLearn:
    "معظم قرارات البرامج شرطية: إذا نجحت → رسالة، إذا فشلت → إعادة. الخوارزميات التي كتبتها بالأمس تُترجم هنا إلى if. بدون if لا يوجد ألعاب، لا درجات، لا تحقق من كلمة مرور.",
  prerequisites: [
    "درس الخوارزميات — فهم IF في pseudocode.",
    "مقدمة بايثون: print، متغيرات، أنواع.",
    "الدليل المرجعي لبناء الجمل (if/for/while).",
  ],
  conceptSimple:
    "if condition: ينفّذ الكود المزاحف فقط إذا كان condition صحيحاً (True). else: للحالة المعاكسة. مثال: if score >= 50: print('ناجح') else: print('راسب').",
  deepSections: [
    {
      id: "condition-meaning",
      titleAr: "معنى الشرط",
      bodyAr:
        "الشرط تعبير يُقيَّم إلى True أو False. if age >= 18: — إذا age=20 يُنفَّذ الجسم؛ إذا age=10 يُتخطى. بايثون لا تستخدم أقواس {} — تعتمد على المسافة البادئة.",
    },
    {
      id: "booleans",
      titleAr: "القيم المنطقية",
      bodyAr:
        "True و False (بحرف كبير). نتائج المقارنة bool: 5 > 3 → True. يمكن تخزينها: ok = (x == 10). لا تكتب if x == True — اكتب if x: بحذر (يفضل if x == 10 للوضوح).",
    },
    {
      id: "operators",
      titleAr: "معاملات المقارنة",
      bodyAr:
        "== يساوي، != لا يساوي، < > <= >=. 5 == 5 → True. 5 == '5' → False (أنواع مختلفة). = للتعيين فقط — if x = 5 خطأ SyntaxError.",
    },
    {
      id: "indent",
      titleAr: "المسافة البادئة",
      bodyAr:
        "بعد if condition: اضغط Enter ثم 4 مسافات (أو Tab). كل السطور بنفس المستوى ت belong للـ if. else: بنفس مستوى if، وجسم else مزاحف أيضاً.",
    },
    {
      id: "if-else",
      titleAr: "if / else",
      bodyAr:
        "if score >= 60:\n    print('ناجح')\nelse:\n    print('راسب')\nفرع واحد فقط يُنفَّذ — never both.",
    },
    {
      id: "elif",
      titleAr: "شروط متعددة (elif)",
      bodyAr:
        "if g >= 90: grade='A'\nelif g >= 80: grade='B'\nelif g >= 70: grade='C'\nelse: grade='F'\nيُفحص من الأعلى — أول شرط True يُنفَّذ ويتوقف.",
    },
    {
      id: "correct-wrong",
      titleAr: "أمثلة صحيحة وخاطئة",
      bodyAr:
        "✓ if x > 0:\n    print(x)\n✗ if x > 0:\nprint(x)  ← IndentationError\n✗ if x = 5:  ← SyntaxError\n✗ if x > 10:\n    print('كبير')\nprint('دائماً')  ← السطر الأخير خارج if",
    },
    {
      id: "logic-errors",
      titleAr: "أخطاء المنطق",
      bodyAr:
        "شرط معكوس: if age < 18 للبالغين. استخدام and/or بدون أقواس واضحة. مقارنة float بـ == — استخدم تقريب.",
    },
  ],
  terms: [
    { termAr: "if", definitionAr: "تنفيذ كود عند تحقق شرط." },
    { termAr: "else", definitionAr: "فرع بديل عند فشل الشرط." },
    { termAr: "elif", definitionAr: "شرط إضافي بعد if." },
    { termAr: "bool", definitionAr: "True أو False." },
    { termAr: "==", definitionAr: "مقارنة تساوي — ليس =." },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد الشرط", bodyAr: "ما الذي True/False؟" },
    { titleAr: "2) اكتب if", bodyAr: "if condition:" },
    { titleAr: "3) أزحف الجسم", bodyAr: "4 مسافات للسطر التالي." },
    { titleAr: "4) أضف else إن لزم", bodyAr: "else: بنفس مستوى if." },
    { titleAr: "5) elif للحالات المتعددة", bodyAr: "من الأصعب للأسهل أو العكس بترتيب منطقي." },
    { titleAr: "6) جرّب True و False", bodyAr: "مثالان على الأقل." },
    { titleAr: "7) اقرأ SyntaxError", bodyAr: "سطر الرقم + = vs ==" },
    { titleAr: "8) احفظ في المختبر", bodyAr: "Run — تحقق من المخرجات." },
  ],
  workedExamples: [
    {
      id: "ex-pass",
      titleAr: "مثال 1 (سهل): ناجح / راسب",
      code: "score = 75\nif score >= 50:\n    print('ناجح')\nelse:\n    print('راسب')",
      steps: ["75 >= 50 → True", "يُطبع: ناجح"],
      result: "ناجح",
    },
    {
      id: "ex-dice",
      titleAr: "مثال 2 (PDF): حجران",
      code: "d1, d2 = 4, 6\nif d1 > d2:\n    print('1')\nelif d1 < d2:\n    print('2')\nelse:\n    print('تعادل')",
      steps: ["4 < 6 → elif", "يطبع 2"],
      result: "2",
    },
    {
      id: "ex-even",
      titleAr: "مثال 3: زوجي",
      code: "n = 14\nif n % 2 == 0:\n    print('زوجي')\nelse:\n    print('فردي')",
      steps: ["14%2==0 → True", "زوجي"],
      result: "زوجي",
    },
    {
      id: "ex-grade",
      titleAr: "مثال 4: درجات elif",
      code: "g = 85\nif g >= 90:\n    print('A')\nelif g >= 80:\n    print('B')\nelse:\n    print('C')",
      steps: ["85<90", "85>=80 → B"],
      result: "B",
    },
    {
      id: "ex-wrong-eq",
      titleAr: "مثال 5 (خطأ): = بدل ==",
      code: "if x = 5:\n    print(x)",
      steps: ["SyntaxError", "استخدم =="],
      result: "خطأ",
    },
    {
      id: "ex-indent",
      titleAr: "مثال 6 (خطأ): بادئة",
      code: "if True:\nprint('hi')",
      steps: ["IndentationError", "أزحف print"],
      result: "خطأ",
    },
    {
      id: "ex-max",
      titleAr: "مثال 7: أكبر عددين",
      code: "a, b = 7, 3\nif a > b:\n    print(a)\nelse:\n    print(b)",
      steps: ["7>3 → a", "7"],
      result: "7",
    },
    {
      id: "ex-nested",
      titleAr: "مثال 8 (متقدم): if متداخل",
      code: "age = 20\nif age >= 18:\n    if age >= 65:\n        print('كبير')\n    else:\n        print('بالغ')",
      steps: [">=18", "ليس >=65", "بالغ"],
      result: "بالغ",
    },
  ],
  interactiveExample: {
    type: "if-lab",
    defaultValue: "score = 55\nif score >= 50:\n    print('ناجح')\nelse:\n    print('راسب')",
    promptAr: "عدّل score وشغّل — جرّب 40 و 90. احفظ محاولاتك.",
  },
  commonMistakes: [
    { titleAr: "= في if", bodyAr: "if x = 5 → SyntaxError. استخدم ==.", step: "syntax" },
    { titleAr: "نسيان النقطتين", bodyAr: "if x > 0  ← يلزم :", step: "syntax" },
    { titleAr: "IndentationError", bodyAr: "جسم if يجب أن يكون مزاحفاً.", step: "indent" },
    { titleAr: "elif بعد else", bodyAr: "else يجب أن يكون أخيراً.", step: "logic" },
    { titleAr: "مقارنة string مع int", bodyAr: "'5' == 5 → False", step: "types" },
  ],
  quickCheck: {
    questions: [
      { id: "qc1", promptAr: "3 > 5 → ?", answer: "False", hintAr: "bool" },
      { id: "qc2", promptAr: "== للمقارنة؟", answer: "نعم", hintAr: " = للتعيين، == للمقارنة" },
      { id: "qc3", promptAr: "else ينفّذ عند؟", answer: "فشل if", hintAr: "False" },
      { id: "qc4", promptAr: "10 >= 10 → ?", answer: "True", hintAr: ">=" },
    ],
  },
  guidedPractice: [
    { id: "gp1", promptAr: "score=40 — ناجح أم راسب (>=50)؟", answer: "راسب", hints: ["40<50"] },
    { id: "gp2", promptAr: "n=9 — زوجي أم فردي؟", answer: "فردي", hints: ["9%2=1"] },
    { id: "gp3", promptAr: "5 == 5 → True أم False؟", answer: "True", hints: [] },
    { id: "gp4", promptAr: "d1=3,d2=3 — تعادل؟", answer: "نعم", hints: [] },
    { id: "gp5", promptAr: "g=92 — A/B/C (A>=90,B>=80)؟", answer: "A", hints: [] },
  ],
  independentPractice: [
    { id: "ip1", promptAr: "a=10,b=20 — الأكبر؟", answer: "20", hints: [] },
    { id: "ip2", promptAr: "score=50 — ناجح؟", answer: "نعم", hints: [">=50"] },
    { id: "ip3", promptAr: "7 != 7 → ?", answer: "False", hints: [] },
    { id: "ip4", promptAr: "n=0 — زوجي؟", answer: "نعم", hints: ["0%2==0"] },
    { id: "ip5", promptAr: "if x = 1 خطأ؟", answer: "نعم", hints: [] },
    { id: "ip6", promptAr: "g=79 — B أم C؟", answer: "C", hints: ["<80"] },
  ],
  challenge: [
    { id: "ch1", promptAr: "a=5,b=5 — else يطبع a — ماذا؟", answer: "5", hints: ["a>b false"] },
    { id: "ch2", promptAr: "elif بعد if g>=90 — g=95 → ?", answer: "A", hints: [] },
  ],
  summary:
    "if ينفّذ عند True. == للمقارنة، = للتعيين. أزحف 4 مسافات. else للبديل، elif لحالات إضافية. جرّب في المختبر واحفظ محاولاتك.",
  linkedActivity: "/python?ex=if-grade",
};
