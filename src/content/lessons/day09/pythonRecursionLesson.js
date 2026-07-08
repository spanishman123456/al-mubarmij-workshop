/** الاستدعاء الذاتي في بايثون — اليوم 9 | pdfPageIndex 403–412 */
export const pythonRecursionLesson = {
  id: "python-recursion",
  titleAr: "الاستدعاء الذاتي في بايثون",
  pdfRefs: [
    { pdfPageIndex: 403, topic: "مراجعة اليوم التاسع والاستدعاء الذاتي" },
    { pdfPageIndex: 405, topic: "تعريف الاستدعاء الذاتي والحالة الأساسية" },
    { pdfPageIndex: 407, topic: "دالة factorial(n) بالاستدعاء الذاتي" },
    { pdfPageIndex: 409, topic: "دالة sumToN(n) — مجموع الأعداد من 1 إلى n" },
    { pdfPageIndex: 410, topic: "تتبّع مكدس الاستدعاء وعدد الاستدعاءات" },
    { pdfPageIndex: 411, topic: "RecursionError عند غياب حالة الإيقاف" },
    { pdfPageIndex: 412, topic: "تمارين الاستدعاء الذاتي وربطها بفيبوناتشي وبرج هانوي" },
  ],
  vocabularyAr: [
    { term: "الاستدعاء الذاتي (Recursion)", def: "عندما تنادي دالة نفسها لحل نسخة أصغر من نفس المشكلة حتى تصل لحالة يُعرف فيها الجواب مباشرة." },
    { term: "حالة أساس (Base Case)", def: "شرط يوقف الاستدعاء الذاتي — مثل n<=1 في factorial أو n<=0 في sumToN." },
    { term: "حالة عامة (Recursive Case)", def: "الجزء الذي يعيد استدعاء الدالة بقيمة أقرب للحالة الأساسية، مثل n * factorial(n-1)." },
    { term: "factorial (المضروب)", def: "n! = n × (n−1) × … × 1، مع 0!=1 و 1!=1 — مثال كلاسيكي للاستدعاء الذاتي." },
    { term: "sumToN", def: "مجموع الأعداد الصحيحة من 1 إلى n: 1+2+…+n — يُحسب بـ n + sumToN(n−1) مع sumToN(0)=0." },
    { term: "RecursionError", def: "استثناء بايثون عند تجاوز عمق الاستدعاء الذاتي — يحدث غالبًا عند نسيان الحالة الأساسية." },
  ],
  learningObjectives: [
    "شرح الفرق بين الحلقة والاستدعاء الذاتي لنفس المسألة (مثل المضروب أو المجموع).",
    "كتابة دالة factorial(n) بالاستدعاء الذاتي مع حالة أساس n<=1.",
    "كتابة دالة sumToN(n) مع حالة أساس n<=0 ترجع 0.",
    "تتبّع مكدس الاستدعاء لـ factorial(4) وعدّ عدد الاستدعاءات.",
    "تحديد متى تتوقف الدالة الذاتية ولماذا يجب أن «تقترب» من الحالة الأساسية في كل خطوة.",
    "التعرف على RecursionError وسببه (استدعاء لا نهائي أو عمق زائد).",
    "ربط الاستدعاء الذاتي بما تعلمته في فيبوناتشي وبرج هانوي من اليوم الثامن.",
  ],
  whyLearn:
    "الاستدعاء الذاتي ليس حيلة سحرية — هو طريقة تقسيم المشكلة: «حل n» يعتمد على «حل n−1». factorial و sumToN يعلمانك الحالة الأساسية وRecursionError قبل الانتقال للكسوريات. نفس الفكرة في فيبوناتشي وبرج هانوي — اليوم التاسع يثبّت الأساس في بايثون.",
  prerequisites: ["fibonacci-sequence", "tower-of-hanoi", "python-scope", "python-for-range", "algorithms"],
  conceptSimple:
    "الدالة تنادي نفسها بقيمة أصغر حتى تصل للحالة الأساسية. factorial(5) = 5 × factorial(4) … حتى factorial(1)=1. sumToN(4) = 4 + sumToN(3) … حتى sumToN(0)=0. بدون if للإيقاف → RecursionError.",
  deepSections: [
    {
      id: "recursion-definition",
      titleAr: "ما هو الاستدعاء الذاتي؟",
      bodyAr:
        "def f(n): … return f(n-1) — الدالة تستدعي نفسها. كل استدعاء يُضاف طبقة على مكدس الاستدعاء (call stack). عند الوصول للحالة الأساسية تبدأ الطبقات بالانطواء وإرجاع النتائج. PDF صفحة 405 يعرّف المفهوم بعد مراجعة فيبوناتشي من اليوم 8.",
    },
    {
      id: "base-case",
      titleAr: "الحالة الأساسية — شرط الإيقاف",
      bodyAr:
        "if n <= 1: return 1 في factorial — هنا لا نستدعي factorial مرة أخرى. if n <= 0: return 0 في sumToN. الحالة الأساسية يجب أن تكون «أصغر مشكلة» مع جواب معروف. بدونها البرنامج يدور إلى ما لا نهاية حتى RecursionError: maximum recursion depth exceeded.",
    },
    {
      id: "factorial",
      titleAr: "المضروب factorial(n)",
      bodyAr:
        "def factorial(n): if n<=1: return 1; return n * factorial(n-1). factorial(5)=5×4×3×2×1=120. factorial(0)=1 بالاتفاق. تتبّع factorial(4): 4×3×2×1 — أربع ضربات بعد الوصول لـ 1. PDF صفحة 407 يطلب تنفيذ الدالة واختبارها.",
    },
    {
      id: "sum-to-n",
      titleAr: "مجموع sumToN(n)",
      bodyAr:
        "def sumToN(n): if n<=0: return 0; return n + sumToN(n-1). sumToN(6)=6+5+4+3+2+1=21. الحالة الأساسية n<=0 (وليس n==1 فقط) تغطي n=0 وتجنب استدعاء سالب. نفس النمط: «الحالي + حل أصغر».",
    },
    {
      id: "call-stack",
      titleAr: "مكدس الاستدعاء والتتبّع",
      bodyAr:
        "factorial(4) يستدعي factorial(3) ثم 2 ثم 1 — 4 استدعاءات قبل البدء بالرجوع. factorialWithTrace في المختبر يعدّ الاستدعاءات: fact(4) → 5 استدعاءات (4،3،2،1،1). رسم الشجرة على الورق يوضح لماذا العمق يتضاعف بسرعة في مسائل مثل فيبوناتشي الذاتي البسيط.",
    },
    {
      id: "recursion-error",
      titleAr: "RecursionError — ماذا يحدث؟",
      bodyAr:
        "بايثون يحدّ عمق الاستدعاء (افتراضيًا ~1000). دالة بدون حالة أساس تستدعي نفسها حتى الحد → RecursionError. مثال خطأ: def bad(n): return bad(n-1) بدون if n<=0. الحل: أضف حالة أساس واضحة وتأكد أن n يتناقص (أو يقترب من الشرط) في كل استدعاء.",
    },
    {
      id: "loop-vs-recursion",
      titleAr: "حلقة أم استدعاء ذاتي؟",
      bodyAr:
        "factorial بالحلقة: result=1; for i in range(2,n+1): result*=i — أسرع وأوضح للمبتدئين. بالاستدعاء الذاتي: يعلّم التفكير التقسيمي ويمهّد للكسوريات (Koch، Sierpinski). فيبوناتشي وبرج هانوي من اليوم 8 يستخدمان الاستدعاء الذاتي لأن «المشكلة تشبه نفسها» — factorial و sumToN نفس الفكرة بمسائل أبسط.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد الحالة الأساسية", bodyAr: "متى تعرف الجواب مباشرة؟ n<=1 لـ factorial، n<=0 لـ sumToN." },
    { titleAr: "2) اكتب if للإيقاف", bodyAr: "return القيمة الثابتة — لا استدعاء ذاتي في هذا الفرع." },
    { titleAr: "3) اكتب الحالة العامة", bodyAr: "return n * factorial(n-1) أو n + sumToN(n-1)." },
    { titleAr: "4) تأكد من التقارب", bodyAr: "كل استدعاء يقلّل n — وإلا لن تصل للأساس أبدًا." },
    { titleAr: "5) اختبر قيمًا صغيرة", bodyAr: "factorial(0)، factorial(5)، sumToN(0)، sumToN(6)." },
    { titleAr: "6) تتبّع المكدس", bodyAr: "ارسم factorial(4) خطوة بخطوة وعدّ الاستدعاءات." },
    { titleAr: "7) جرّب المختبر", bodyAr: "أجب عن التحديات: fact-5، sum-6، fact-calls-4." },
  ],
  workedExamples: [
    {
      id: "rec-ex-1",
      titleAr: "factorial(5)",
      difficulty: "سهل",
      steps: [
        "factorial(5) = 5 × factorial(4)",
        "factorial(4) = 4 × 3 × 2 × 1 = 24",
        "5 × 24 = 120",
        "الجواب: 120 = 5!",
      ],
      result: "120",
    },
    {
      id: "rec-ex-2",
      titleAr: "sumToN(6)",
      difficulty: "متوسط",
      steps: [
        "sumToN(6) = 6 + sumToN(5)",
        "sumToN(5) = 5+4+3+2+1 = 15",
        "6 + 15 = 21",
        "تحقق: 1+2+3+4+5+6 = 21",
      ],
      result: "21",
    },
    {
      id: "rec-ex-3",
      titleAr: "عدد استدعاءات factorial(4)",
      difficulty: "متوسط",
      steps: [
        "fact(4) → fact(3) → fact(2) → fact(1)",
        "عند fact(1) تُرجع 1 دون استدعاء جديد",
        "المكدس: 4 طبقات انتظار + fact(1) = 5 استدعاءات للدالة",
        "الجواب: 5 استدعاءات",
      ],
      result: "5",
    },
  ],
  interactiveExample: { type: "python-recursion-lab", defaultValue: "fact-5" },
  commonMistakes: [
    {
      titleAr: "نسيان الحالة الأساسية",
      bodyAr: "def factorial(n): return n * factorial(n-1) بدون if → RecursionError عند أي n.",
      step: "base-case",
    },
    {
      titleAr: "حالة أساس لا تُوقف التقارب",
      bodyAr: "if n==0: return 1 في sumToN خطأ — sumToN(0) يجب أن يكون 0 وليس 1.",
      step: "sum-to-n",
    },
    {
      titleAr: "استدعاء ذاتي بدون تقليل n",
      bodyAr: "return factorial(n) بدون n-1 يعيد نفس المشكلة إلى ما لا نهاية.",
      step: "recursive-case",
    },
    {
      titleAr: "خلط factorial مع sumToN",
      bodyAr: "factorial يضرب (n!)؛ sumToN يجمع (1+…+n). sumToN(5)=15 وليس 120.",
      step: "definition",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "factorial(0) = ?", answer: "1", hintAr: "0! = 1 بالاتفاق" },
      { id: "q2", promptAr: "sumToN(0) = ?", answer: "0", hintAr: "حالة أساس" },
      { id: "q3", promptAr: "استدعاء ذاتي بلا حالة أساس يُنتج؟", answer: "RecursionError", hintAr: "عمق زائد" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "factorial(3) = ?", answer: "6", hints: ["3×2×1"] },
    { id: "g2", promptAr: "sumToN(4) = ?", answer: "10", hints: ["4+3+2+1"] },
    { id: "g3", promptAr: "countDownSteps(4) = ?", answer: "4", hints: ["4→3→2→1"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "factorial(1) = ?", answer: "1", hints: ["حالة أساس"] },
    { id: "i2", promptAr: "sumToN(10) = ?", answer: "55", hints: ["1+…+10"] },
    { id: "i3", promptAr: "ما شرط الإيقاف في factorial؟", answer: "n<=1", hints: ["حالة أساس"] },
  ],
  challengeAr:
    "اكتب factorial و sumToN في بايثون، ثم قارن factorial_loop(n) مع factorial(n) لـ n من 0 إلى 8. احذف عمدًا الحالة الأساسية من إحدى الدالتين ولاحظ RecursionError — اشرح بالعربية كيف يمنع if n<=1 هذا الخطأ.",
  summary:
    "الاستدعاء الذاتي: دالة تنادي نفسها مع تقريب المشكلة من الحالة الأساسية. factorial(n)=n×factorial(n−1) مع n<=1→1؛ sumToN(n)=n+sumToN(n−1) مع n<=0→0. مكدس الاستدعاء يتتبع الطبقات حتى الرجوع. بدون إيقاف → RecursionError. هذا الأساس يمهّد للكسوريات في بقية اليوم التاسع.",
  linkedActivity: "/lessons/python-recursion#lab",
};
