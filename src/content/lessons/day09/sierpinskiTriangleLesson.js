/** مثلث Sierpinski — اليوم 9 | pdfPageIndex 418–419 */
export const sierpinskiTriangleLesson = {
  id: "sierpinski-triangle",
  titleAr: "مثلث Sierpinski",
  pdfRefs: [
    { pdfPageIndex: 403, topic: "اليوم التاسع — كسوريات المثلث" },
    { pdfPageIndex: 418, topic: "قاعدة تقسيم مثلث Sierpinski" },
    { pdfPageIndex: 419, topic: "التنفيذ الاستدعائي وعدد المثلثات الصغيرة" },
  ],
  vocabularyAr: [
    { term: "مثلث Sierpinski", def: "كسورية تُبنى بتقسيم مثلث متساوي الأضلاع وإفراغ مثلث مركزي ثم تكرار العملية على الباقي." },
    { term: "تقسيم متساوي الأضلاع", def: "ربط منتصفات الأضلاع الثلاثة لتكوين أربعة مثلثات — واحد وسطي مقلوب وأثلاثة في الزوايا." },
    { term: "المثلث المُفرَّغ", def: "المثلث الأوسطي الذي يُترك أبيض (لا يُرسم) في كل خطوة — يخلق الفراغ الكسوري." },
    { term: "مثلث صغير مملوء", def: "أصغر وحدة مرسومة عند depth معيّن — عددها 3^depth." },
    { term: "عمق Sierpinski (depth)", def: "عدد مرات تطبيق قاعدة التقسيم — depth=0 مثلث واحد مملوء كامل." },
    { term: "Turtle Graphics", def: "مكتبة رسم بالحاسوب — تُستخدم لرسم Sierpinski بتحريك السلحفاة واستدعاء ذاتي." },
  ],
  learningObjectives: [
    "شرح قاعدة Sierpinski: قسّم المثلث لأربعة، افرغ الوسط، كرّر على الثلاثة الزاوية.",
    "رسم يدوي لـ depth=0 و depth=1 و depth=2 على الورق.",
    "حساب عدد المثلثات الصغيرة المملوءة: 3^depth.",
    "كتابة أو تتبّع دالة sierpinski(x, y, size, depth) بالاستدعاء الذاتي.",
    "تحديد الحالة الأساسية depth==0: ارسم مثلثًا واحدًا مملوءًا.",
    "ربط Sierpinski بالتشابه الذاتي من درس fractals-intro.",
    "مقارنة Sierpinski مع Koch من حيث قاعدة التقسيم وعدد العناصر الناتجة.",
  ],
  whyLearn:
    "مثلث Sierpinski كسورية أيقونية — قاعدة تقسيم بسيطة (احذف الوسط، كرّر على الباقي) تُنتج نمطًا يظهر في الرياضيات والفن. عدد المثلثات 3^depth يربط الاستدعاء الذاتي بالأسس — ويُكمّل منحنى Koch في اليوم التاسع.",
  prerequisites: ["koch-snowflake", "fractals-intro", "python-recursion", "python-for-range"],
  conceptSimple:
    "ابدأ بمثلث مملوء. قسّمه لأربعة مثلثات متساوية — اترك الوسط أبيض. على كل مثلث زاوية (3) كرّر بنفس القاعدة. depth=0: ارسم مثلثًا. depth=2: 9 مثلثات صغيرة مملوءة = 3².",
  deepSections: [
    {
      id: "subdivision-rule",
      titleAr: "قاعدة التقسيم",
      bodyAr:
        "مثلث متساوي الأضلاع ABC. D,E,F منتصفات الأضلاع. أربعة مثلثات: ثلاثة عند A,B,C وزاوية رابعة في الوسط (مقلوب). «احذف» الوسط — لا تملأه. على المثلثات الثلاثة في الزوايا طبّق نفس القاعدة. PDF صفحة 418 يعرض الرسم.",
    },
    {
      id: "empty-center",
      titleAr: "لماذا نُفرّغ الوسط؟",
      bodyAr:
        "المثلث الأوسطي الأبيض يخلق فراغًا يتكرر على كل مقياس — عند التكبير ترى نفس نمط الفراغات. بدون إفراغ الوسط تحصل على تقسيم عادي وليس Sierpinski الكسوري الكلاسيكي.",
    },
    {
      id: "triangle-count",
      titleAr: "عدد المثلثات الصغيرة",
      bodyAr:
        "sierpinskiSmallTriangles(depth) = 3^depth. depth=0 → 1. depth=1 → 3. depth=2 → 9. depth=3 → 27. كل عمق يضاعف العدد ×3 لأن ثلاثة مثلثات زاوية فقط تُعاد معالجتها.",
    },
    {
      id: "recursive-code",
      titleAr: "التنفيذ الاستدعائي",
      bodyAr:
        "def sierpinski(x, y, size, depth): if depth==0: ارسم مثلثًا بحجم size عند (x,y); return. half=size/2; sierpinski على الزاوية العليا؛ اليسرى السفلى؛ اليمنى السفلى — كل واحد depth-1 وsize/2. لا استدعاء للوسط. PDF صفحة 419 يوضح البنية.",
    },
    {
      id: "manual-depth-2",
      titleAr: "رسم يدوي depth=2",
      bodyAr:
        "depth=0: مثلث كبير واحد. depth=1: مثلث وسط أبيض + 3 مثلثات. depth=2: كل مثلث زاوية يُقسّم مرة أخرى — 3×3=9 مثلثات مملوءة صغيرة. لاحظ التشابه الذاتي: اقتطع زاوية — ترى نفس النمط.",
    },
    {
      id: "compare-koch",
      titleAr: "مقارنة مع Koch",
      bodyAr:
        "Koch: استبدال قطعة خطية ×4 على كل عمق. Sierpinski: تقسيم مساحة ×3 مثلثات زاوية. Koch يعدّ القطع 4^depth؛ Sierpinski يعدّ المثلثات 3^depth. كلاهما depth=0 كحالة أساس واستدعاء ذاتي.",
    },
    {
      id: "turtle-drawing",
      titleAr: "الرسم بـ Turtle",
      bodyAr:
        "يمكن رسم المثلث بـ forward و left(120) ثلاث مرات. عند depth>0: قبل الرسم الكامل، استدعِ sierpinski على ثلاث مواقع زاوية بمواقع محسوبة هندسيًا (منتصفات). حجم أصغر = size/2. الاتجاهات تحتاج دقة — المختبر يتحقق من العدد لا من الرسم.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) ارسم مثلثًا أساسيًا", bodyAr: "depth=0 — مثلث واحد مملوء." },
    { titleAr: "2) قسّم لأربعة", bodyAr: "اربط منتصفات الأضلاع." },
    { titleAr: "3) افرغ الوسط", bodyAr: "لا تملأ المثلث الأوسطي." },
    { titleAr: "4) كرّر على 3 زوايا", bodyAr: "depth-1 على كل مثلث زاوية." },
    { titleAr: "5) توقف عند depth=0", bodyAr: "حالة أساس — ارسم وارجع." },
    { titleAr: "6) احسب المثلثات", bodyAr: "3^depth — sierp-2 → 9، sierp-3 → 27." },
    { titleAr: "7) جرّب المختبر", bodyAr: "تحقق من الأعداد قبل رسم Turtle." },
  ],
  workedExamples: [
    {
      id: "sierp-ex-1",
      titleAr: "depth=0",
      difficulty: "سهل",
      steps: [
        "مثلث واحد كامل",
        "لا تقسيم — حالة أساس",
        "sierpinskiSmallTriangles(0) = 3⁰ = 1",
        "الجواب: 1 مثلث",
      ],
      result: "1",
    },
    {
      id: "sierp-ex-2",
      titleAr: "depth=2",
      difficulty: "متوسط",
      steps: [
        "depth=1: 3 مثلثات زاوية",
        "كل واحد يُقسّم → 3 مثلثات صغيرة",
        "3 × 3 = 9 مثلثات مملوءة",
        "3² = 9",
      ],
      result: "9",
    },
    {
      id: "sierp-ex-3",
      titleAr: "depth=3",
      difficulty: "متوسط",
      steps: [
        "من depth=2: 9 مثلثات",
        "كل زاوية ×3 عند التقسيم التالي",
        "9 × 3 = 27",
        "3³ = 27 — المختبر sierp-3",
      ],
      result: "27",
    },
  ],
  interactiveExample: { type: "sierpinski-triangle-lab", defaultValue: "sierp-2" },
  commonMistakes: [
    {
      titleAr: "تقسيم المثلث الوسطي أيضًا",
      bodyAr: "قاعدة Sierpinski تُفرّغ الوسط — الاستدعاء الذاتي على 3 زوايا فقط وليس 4.",
      step: "subdivision-rule",
    },
    {
      titleAr: "استخدام 4^depth بدل 3^depth",
      bodyAr: "عدد المثلثات المملوءة 3^depth — Koch يستخدم 4^depth للقطع، Sierpinski مختلف.",
      step: "triangle-count",
    },
    {
      titleAr: "نسيان تقليل الحجم للنصف",
      bodyAr: "كل مستوى: size/2 — وإلا تتداخل المثلثات ولا يظهر النمط.",
      step: "recursive-code",
    },
    {
      titleAr: "depth=0 يرسم تقسيمًا",
      bodyAr: "عند depth==0 ارسم مثلثًا واحدًا فقط دون تقسيم — كحالة أساس.",
      step: "base-case",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "Sierpinski depth=1 — كم مثلثًا مملوءًا؟", answer: "3", hintAr: "3¹" },
      { id: "q2", promptAr: "Sierpinski depth=2 — كم مثلثًا؟", answer: "9", hintAr: "3²" },
      { id: "q3", promptAr: "أي مثلث لا يُعاد تقسيمه؟", answer: "الوسط", hintAr: "مُفرَّغ" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "3^2 = ?", answer: "9", hints: ["depth=2"] },
    { id: "g2", promptAr: "3^3 = ?", answer: "27", hints: ["depth=3"] },
    { id: "g3", promptAr: "كم مثلث زاوية يُستدعى في كل خطوة؟", answer: "3", hints: ["ليس 4"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "depth=0 — عدد المثلثات؟", answer: "1", hints: ["3⁰"] },
    { id: "i2", promptAr: "عامل العدد لكل عمق؟", answer: "3", hints: ["×3"] },
    { id: "i3", promptAr: "Sierpinski كسورية لأن؟", answer: "تشابه ذاتي", hints: ["جزء يشبه الكل"] },
  ],
  challengeAr:
    "ارسم Sierpinski يدويًا حتى depth=3 (27 مثلثًا صغيرًا). اكتب دالة بايثون أو شبه-كود sierpinski(x,y,size,depth) بثلاثة استدعاءات زاوية. قارن 3^depth مع 4^depth في Koch — لماذا يختلف الأساس؟",
  summary:
    "مثلث Sierpinski: قسّم مثلثًا متساوي الأضلاع لأربعة، افرغ الوسط، كرّر على الثلاثة الزاوية. عدد المثلثات المملوءة = 3^depth. depth=0 حالة أساس. تنفيذ استدعائي بـ Turtle مع size/2 كل مستوى. كسورية بتشابه ذاتي — تكمل Koch في ختام اليوم التاسع.",
  linkedActivity: "/lessons/sierpinski-triangle#lab",
};
