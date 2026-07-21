/**
 * مقدمة بايثون — اليوم الأول
 * pdfPage: 40, 43, 85, 113 | printedPage: متفرقة
 */
export const pythonIntroLesson = {
  id: "python-intro",
  titleAr: "مقدمة لغة البرمجة بايثون",
  pdfRefs: [
    { pdfPage: 85, topic: "مقدمة إلى لغة البرمجة بايثون" },
    { pdfPage: 40, topic: "المحرر، print، القسمة الصحيحة" },
    { pdfPage: 43, topic: "تطبيقات 45 دقيقة على بايثون" },
    { pdfPage: 113, topic: "خطوات التنفيذ في المختبر" },
  ],
  learningObjectives: [
    "تسمية مكونات بيئة بايثون: المحرر، النافذة التفاعلية، وملف البرنامج.",
    "كتابة أول برنامج باستخدام print() وشرح دور النصوص بين علامتي اقتباس.",
    "التمييز بين int و float و string و bool كأنواع بيانات أساسية.",
    "استخدام المتغيرات والتعيين (=) وتتبع قيمة المتغير خطوة بخطوة.",
    "تطبيق العمليات الحسابية و // للقسمة الصحيحة و % للباقي.",
    "قراءة رسائل الخطأ الشائعة (SyntaxError, NameError) وتحديد السطر المعني.",
  ],
  whyLearn:
    "بايثون لغة البداية في هذا المقرر: واضحة، قريبة من اللغة الطبيعية، وتُستخدم في الذكاء الاصطناعي والأمن السيبراني وتحليل البيانات. كل ما تتعلمه اليوم — المتغيرات، الطباعة، الأنواع — سيبنى عليه حلقات while و if والخوارزميات في الأيام التالية.",
  prerequisites: [
    "إكمال دروس أنظمة العد (فهم الأرقام والتحويل).",
    "القدرة على الكتابة باللوحة المفاتيح العربية/الإنجليزية.",
    "حساب جمع وضرب وقسمة بسيطة.",
  ],
  conceptSimple:
    "البرنامج = تعليمات مرتبة ينفّذها الحاسب. في بايثون نكتب print('مرحباً') لطباعة نص. المتغير صندوق يحمل قيمة: age = 15. النوع يحدد ما يمكن فعله: 5 + 3 يعطي 8 (int)، '5' + '3' يعطي '53' (string).",
  deepSections: [
    {
      id: "environment",
      titleAr: "بيئة بايثون",
      bodyAr:
        "تشغّل بايثون عبر IDLE أو محرر VS Code أو مختبر المنصة. النافذة التفاعلية (REPL) تنفّذ سطراً واحداً فوراً — مفيد للتجربة. ملف .py يحفظ برنامجاً كاملاً. بعد الكتابة اضغط Run أو F5. المخرجات تظهر في نافذة Output أسفل المحرر.",
    },
    {
      id: "print",
      titleAr: "دالة print",
      bodyAr:
        "print(value) تعرض value على الشاشة. النصوص بين ' ' أو \" \". الفاصلة بين وسائط print تضيف مسافة: print(2, 5) → 2 5. بايثون 3 يحذف 2/5 كقسمة صحيحة تلقائياً — النتيجة 0.4 (float). للقسمة الصحيحة استخدم // : 5 // 2 = 2.",
    },
    {
      id: "types",
      titleAr: "أنواع البيانات",
      bodyAr:
        "int: أعداد صحيحة (42، -3). float: عشري (3.14، 2.0). string: نص ('Hello'). bool: True أو False. type(x) يخبرك النوع. لا تخلط int مع string في الجمع — استخدم str() أو int() للتحويل.",
    },
    {
      id: "variables",
      titleAr: "المتغيرات والتعيين",
      bodyAr:
        "name = 'أحمد' ينشئ متغيراً ويخزّن القيمة. = ليس «يساوي» بل «عيّن». يمكن إعادة التعيين: x = 5 ثم x = x + 1 → x يصبح 6. أسماء المتغيرات: حروف وأرقام و _ ، لا تبدأ برقم.",
    },
    {
      id: "errors",
      titleAr: "قراءة الأخطاء",
      bodyAr:
        "SyntaxError: خطأ في بناء الجملة — ناقص قوس أو علامة اقتباس. NameError: متغير غير معرّف. TypeError: عملية على نوع خاطئ (مثل '5' + 3). اقرأ آخر سطر في رسالة الخطأ — يذكر رقم السطر.",
    },
  ],
  terms: [
    { termAr: "print()", definitionAr: "دالة مدمجة لعرض قيم على الشاشة." },
    { termAr: "int", definitionAr: "عدد صحيح بدون كسور." },
    { termAr: "float", definitionAr: "عدد عشري (نقطة عائمة)." },
    { termAr: "string", definitionAr: "سلسلة أحرف بين علامتي اقتباس." },
    { termAr: "متغير", definitionAr: "اسم يرتبط بقيمة في الذاكرة." },
    { termAr: "//", definitionAr: "قسمة صحيحة — الناتج int بدون كسور." },
  ],
  stepsDetailed: [
    { titleAr: "1) افتح المختبر", bodyAr: "من المنصة: مختبر بايثون. أو IDLE → File → New." },
    { titleAr: "2) اكتب print('مرحباً')", bodyAr: "احفظ الملف بامتداد .py إن لزم." },
    { titleAr: "3) شغّل البرنامج", bodyAr: "تحقق من ظهور النص في Output." },
    { titleAr: "4) أضف متغيراً", bodyAr: "name = 'سارة' ثم print(name)." },
    { titleAr: "5) جرّب حساباً", bodyAr: "print(10 + 5 * 2) — تذكر أسبقية العمليات." },
    { titleAr: "6) جرّب // و %", bodyAr: "print(17 // 5) و print(17 % 5)." },
    { titleAr: "7) اقرأ type()", bodyAr: "print(type(3.0)) → <class 'float'>." },
    { titleAr: "8) صحّح خطأاً متعمداً", bodyAr: "احذف قوساً واقرأ SyntaxError." },
  ],
  workedExamples: [
    {
      id: "ex-hello",
      titleAr: "مثال 1 (سهل): مرحباً بالعالم",
      code: "print('Hello, World!')\nprint('مرحباً يا مبرمج!')",
      steps: [
        "السطر الأول يطبع بالإنجليزية.",
        "السطر الثاني يطبع بالعربية — بايثون 3 يدعم Unicode.",
        "كل print ينتهي بسطر جديد تلقائياً.",
      ],
      result: "Hello, World!\nمرحباً يا مبرمج!",
    },
    {
      id: "ex-vars",
      titleAr: "مثال 2 (سهل): متغيرات وطباعة",
      code: "age = 15\nname = 'خالد'\nprint(name, 'عمره', age)",
      steps: [
        "age يخزّن int 15.",
        "name يخزّن string.",
        "print يعرض: خالد عمره 15 (مسافات بين الوسائط).",
      ],
      result: "خالد عمره 15",
    },
    {
      id: "ex-division",
      titleAr: "مثال 3 (متوسط): القسمة والباقي",
      code: "print(5 / 2)\nprint(5 // 2)\nprint(5 % 2)",
      steps: [
        "5 / 2 = 2.5 (float — قسمة حقيقية).",
        "5 // 2 = 2 (قسمة صحيحة).",
        "5 % 2 = 1 (باقي القسمة — مفيد في أنظمة العد!).",
      ],
      result: "2.5\n2\n1",
    },
    {
      id: "ex-types",
      titleAr: "مثال 4 (متوسط): تحويل الأنواع",
      code: "x = '42'\ny = int(x)\nprint(y + 8)",
      steps: [
        "x نص — لا يمكن جمعه مع رقم.",
        "int(x) يحوّل '42' إلى 42.",
        "42 + 8 = 50.",
      ],
      result: "50",
    },
    {
      id: "ex-pdf-age",
      titleAr: "مثال 5 (من PDF): طباعة العمر",
      code: "age = 14\nprint('عمري', age, 'سنة')",
      steps: [
        "نشاط PDF: اطلب من الطالب age.",
        "print يدمج النص والرقم.",
        "النتيجة: عمري 14 سنة",
      ],
      result: "عمري 14 سنة",
    },
  ],
  interactiveExample: {
    type: "python-lab",
    defaultValue: "print('Hello')",
    promptAr: "عدّل البرنامج ليطبع اسمك وعمرك.",
  },
  commonMistakes: [
    {
      titleAr: "نسيان علامات الاقتاس",
      bodyAr: "print(Hello) → NameError. النص يحتاج 'Hello'.",
      step: "syntax",
    },
    {
      titleAr: "جمع int مع string",
      bodyAr: "'5' + 3 → TypeError. حوّل بـ int() أو str().",
      step: "types",
    },
    {
      titleAr: "استخدام = بدل ==",
      bodyAr: "if age = 15 خطأ — = للتعيين فقط (سيُشرح لاحقاً في if).",
      step: "operators",
    },
    {
      titleAr: "مسافات بادئة خاطئة",
      bodyAr: "IndentationError عندما تزيد/تنقص المسافات داخل دالة.",
      step: "indent",
    },
  ],
  quickCheck: {
    questions: [
      { id: "qc1", promptAr: "5 // 2 = ?", answer: "2", hintAr: "قسمة صحيحة" },
      { id: "qc2", promptAr: "type(3.14)؟", answer: "float", hintAr: "يوجد نقطة عشرية" },
      { id: "qc3", promptAr: "print('a','b') مخرج؟", answer: "a b", hintAr: "مسافة بين الوسائط" },
      { id: "qc4", promptAr: "int('10') + 5 = ?", answer: "15", hintAr: "تحويل ثم جمع" },
    ],
  },
  guidedPractice: [
    {
      id: "gp1",
      promptAr: "اكتب مخرج print(2 + 3 * 4) — رقم فقط",
      answer: "14",
      hints: ["3*4=12 أولاً", "2+12=14"],
    },
    {
      id: "gp2",
      promptAr: "17 % 5 = ?",
      answer: "2",
      hints: ["17÷5=3 باقي 2"],
    },
    {
      id: "gp3",
      promptAr: "type(True) بالإنجليزية؟",
      answer: "bool",
      hints: ["True/False"],
    },
    {
      id: "gp4",
      promptAr: "str(7) + str(3) = ? (بدون مسافات)",
      answer: "73",
      hints: ["دمج نصوص"],
    },
  ],
  independentPractice: [
    { id: "ip1", promptAr: "10 // 3 = ?", answer: "3", hints: [] },
    { id: "ip2", promptAr: "float(5) + 0.5 = ?", answer: "5.5", hints: [] },
    { id: "ip3", promptAr: "len('Hi') = ? (عدد الأحرف)", answer: "2", hints: ["H و i"] },
    { id: "ip4", promptAr: "2 ** 3 = ? (أس)", answer: "8", hints: ["2×2×2"] },
  ],
  summary:
    "بايثون تنفّذ سطراً سطراً. print للعرض، المتغيرات للتخزين، الأنواع تحدد العمليات. // و % مرتبطان بأنظمة العد. افتح المختبر وجرّب قبل الانتقال للحلقات.",
  linkedActivity: "/python",
};
