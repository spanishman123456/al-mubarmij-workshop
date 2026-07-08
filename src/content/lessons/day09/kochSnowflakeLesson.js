/** منحنى Koch وندفة الثلج — اليوم 9 | pdfPageIndex 417 */
export const kochSnowflakeLesson = {
  id: "koch-snowflake",
  titleAr: "منحنى Koch وندفة الثلج",
  pdfRefs: [
    { pdfPageIndex: 403, topic: "اليوم التاسع — الكسوريات الهندسية" },
    { pdfPageIndex: 415, topic: "تمهيد التشابه الذاتي على المنحنيات" },
    { pdfPageIndex: 417, topic: "قاعدة منحنى Koch وندفة الثلج" },
  ],
  vocabularyAr: [
    { term: "منحنى Koch", def: "كسورية تُبنى باستبدال كل قطعة مستقيمة بأربع قطع أطوالها ثلث الطول الأصلي." },
    { term: "ندفة ثلج Koch", def: "مثلث متساوي الأضلاع يُطبَّق عليه منحنى Koch على كل ضلع من الأضلاع الثلاثة." },
    { term: "قطعة (Segment)", def: "جزء خط مستقيم بين نقطتين — الوحدة التي تُستبدَل بقاعدة Koch." },
    { term: "ثلث الطول", def: "كل قطعة جديدة طولها L/3 إذا كان الطول الأصلي L — أربع قطع تحل محل واحدة." },
    { term: "النتوء (Bump)", def: "الجزء الوسطي من قاعدة Koch يشكل مثلثًا equilateral صغيرًا hacia الأعلى (أو للخارج)." },
    { term: "عمق Koch (depth)", def: "عدد مرات تطبيق قاعدة الاستبدال على كل قطعة — depth=0 خط مستقيم واحد." },
  ],
  learningObjectives: [
    "شرح قاعدة Koch: استبدال قطعة واحدة بأربع قطع طول كل منها ثلث الطول.",
    "رسم يدوي لمرحلة depth=1 على قطعة مستقيمة واحدة.",
    "بناء ندفة ثلج Koch من مثلث بثلاثة أضلاع تُطبَّق عليها القاعدة.",
    "حساب عدد قطع الخط بعد depth معادلة: initialSegments × 4^depth.",
    "فهم أن المحيط ينمو بعامل 4/3 في كل عمق (مفهوم PDF).",
    "ربط Koch بالاستدعاء الذاتي: koch(depth) يستدعي koch(depth−1) على كل قطعة فرعية.",
    "تنفيذ أو تتبّع كود Turtle لرسم ندفة بعمق 1 و 2.",
  ],
  whyLearn:
    "منحنى Koch أول كسورية «قابلة للبرمجة» في المنهج — قاعدة بسيطة (4 قطع بدل 1) تُنتج شكلًا معقدًا. ندفة الثلج تربط الهندسة بالاستدعاء الذاتي وتُظهر كيف ينمو عدد القطع بسرعة (12 عند depth=1، 48 عند depth=2 لثلاثة أضلاع).",
  prerequisites: ["fractals-intro", "python-recursion", "python-for-range", "algorithms"],
  conceptSimple:
    "على كل قطعة مستقيمة: قسّم لثلاثة أثلاث، ارسم «نتوءًا» مثلثيًا في الوسط — النتيجة 4 قطع كل منها طولها L/3. كرّر على كل قطعة جديدة (depth). ندفة الثلج = مثلث — طبّق Koch على 3 أضلاع.",
  deepSections: [
    {
      id: "koch-rule",
      titleAr: "قاعدة الاستبدال",
      bodyAr:
        "ابدأ بقطعة طولها L. قسّمها لثلاثة أجزاء متساوية. في الجزء الأوسط «ارفع» خطًا يشكل ضلعين لمثلث متساوي الأضلاع (النتوء). النتيجة: 4 قطع، كل طولها L/3. PDF صفحة 417 يوضح الرسم — السهم يتجه للخارج من القطعة الأصلية.",
    },
    {
      id: "four-segments",
      titleAr: "لماذا أربع قطع؟",
      bodyAr:
        "القطعة الأصلية تُستبدل بـ: قطعة يسار (L/3) + ضلع نتوء صاعد (L/3) + ضلع نتوء نازل (L/3) + قطعة يمين (L/3) = 4 أجزاء خطية. كل استبدال يضاعف التعقيد ×4 على عدد القطع. depth=1: 1→4. depth=2: كل واحدة من الـ4 تصبح 4 → 16.",
    },
    {
      id: "snowflake",
      titleAr: "ندفة الثلج",
      bodyAr:
        "ارسم مثلثًا متساوي الأضلاع. طبّق قاعدة Koch على كل ضلع من الثلاثة. الشكل الناتج يسمى ندفة ثلج Koch — حدود متعرجة لكن متناظرة. initialSegments=3 (ثلاثة أضلاع). depth=1 → 3×4=12 قطعة خط.",
    },
    {
      id: "segment-count",
      titleAr: "عدد القطع",
      bodyAr:
        "kochSegmentCount(initial, depth) = initial × 4^depth. ندفة: initial=3. depth=0 → 3. depth=1 → 12. depth=2 → 48. depth=3 → 192. النمو أسي — لماذا depth كبير بطيء في الرسم.",
    },
    {
      id: "perimeter",
      titleAr: "المحيط والعامل 4/3",
      bodyAr:
        "كل استبدال يجعل طول كل ضلع ×4/3 (أربع قطع بطول ثلث الأصل = 4L/3). بعد depth: المحيط ×(4/3)^depth. عند depth→∞ المحيط → ∞ لكن المساحة محدودة — «بارادوكس» كلاسيكي يُذكر في المنهج.",
    },
    {
      id: "recursive-turtle",
      titleAr: "تنفيذ استدعائي بـ Turtle",
      bodyAr:
        "def koch_segment(length, depth): if depth==0: forward(length); return. else: l=length/3; koch_segment(l, depth-1); left(60); koch_segment(l, depth-1); right(120); koch_segment(l, depth-1); left(60); koch_segment(l, depth-1). ندفة: ارسم مثلثًا واستدعِ koch_segment على كل ضلع.",
    },
    {
      id: "self-similar-koch",
      titleAr: "التشابه الذاتي في Koch",
      bodyAr:
        "اقترب من أي جزء من المنحنى — ترى نفس نمط النتوءات. هذا التشابه الذاتي هو ما يجعل Koch كسورية. يرتبط بدرس fractals-intro: «الجزء يشبه الكل» هنا على مستوى الخط.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) ارسم قطعة L", bodyAr: "خط مستقيم — هذه الوحدة الأساسية." },
    { titleAr: "2) قسّم لثلاثة أثلاث", bodyAr: "كل جزء طوله L/3." },
    { titleAr: "3) أضف النتوء", bodyAr: "في الوسط: مثلث متساوي الأضلاع hacia الخارج." },
    { titleAr: "4) كرّر depth مرات", bodyAr: "على كل قطعة جديدة طبّق نفس القاعدة." },
    { titleAr: "5) ابنِ ندفة ثلج", bodyAr: "مثلث + Koch على 3 أضلاع." },
    { titleAr: "6) احسب القطع", bodyAr: "3 × 4^depth — تحقق في المختبر." },
    { titleAr: "7) جرّب depth=1 و 2", bodyAr: "koch-seg-1 → 12، koch-seg-2 → 48." },
  ],
  workedExamples: [
    {
      id: "koch-ex-1",
      titleAr: "قطعة واحدة depth=1",
      difficulty: "سهل",
      steps: [
        "قطعة واحدة طولها L",
        "استبدال Koch: 4 قطع كل منها L/3",
        "عدد القطع = 4",
        "الجواب: 4 قطع",
      ],
      result: "4 قطع",
    },
    {
      id: "koch-ex-2",
      titleAr: "ندفة depth=1",
      difficulty: "متوسط",
      steps: [
        "مثلث بثلاثة أضلاع → 3 قطع أولية",
        "كل ضلع يُستبدل بـ 4 قطع",
        "3 × 4 = 12 قطعة خط",
        "المختبر: koch-seg-1 → 12",
      ],
      result: "12",
    },
    {
      id: "koch-ex-3",
      titleAr: "ندفة depth=2",
      difficulty: "متوسط",
      steps: [
        "بعد depth=1: 12 قطعة",
        "depth=2: كل قطعة ×4",
        "12 × 4 = 48",
        "أو: 3 × 4² = 48",
      ],
      result: "48",
    },
  ],
  interactiveExample: { type: "koch-snowflake-lab", defaultValue: "koch-seg-1" },
  commonMistakes: [
    {
      titleAr: "استبدال بـ 3 قطع بدل 4",
      bodyAr: "قاعدة Koch تنتج 4 قطع (مع النتوء المكون من ضلعين) — ليس 3 قطع فقط.",
      step: "koch-rule",
    },
    {
      titleAr: "نسيان ثلاثة أضلاع في الندفة",
      bodyAr: "ندفة الثلج initialSegments=3 — حساب 4^depth فقط دون ×3 يعطي عددًا ناقصًا.",
      step: "snowflake",
    },
    {
      titleAr: "طول القطعة الجديدة خطأ",
      bodyAr: "كل قطعة L/3 وليس L/4 — أربع قطع مجموع أطوالها 4L/3.",
      step: "four-segments",
    },
    {
      titleAr: "زوايا النتوء خاطئة في Turtle",
      bodyAr: "النتوء المثلثي يحتاج left(60) و right(120) — زوايا 60° في مثلث متساوي الأضلاع.",
      step: "recursive-turtle",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "كل استبدال Koch يحوّل قطعة إلى كم قطعة؟", answer: "4", hintAr: "ثلث + نتوء + ثلث" },
      { id: "q2", promptAr: "ندفة Koch — 3 أضلاع، depth=1 — كم قطعة؟", answer: "12", hintAr: "3×4" },
      { id: "q3", promptAr: "طول كل قطعة جديدة من L؟", answer: "L/3", hintAr: "ثلث الطول" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "قطعة واحدة depth=2 — كم قطعة؟", answer: "16", hints: ["4²"] },
    { id: "g2", promptAr: "ندفة depth=2 — كم قطعة؟", answer: "48", hints: ["3×16"] },
    { id: "g3", promptAr: "عامل عدد القطع لكل عمق؟", answer: "4", hints: ["×4"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "ندفة depth=0 — كم قطعة؟", answer: "3", hints: ["أضلاع المثلث"] },
    { id: "i2", promptAr: "3 × 4^1 = ?", answer: "12", hints: ["depth=1"] },
    { id: "i3", promptAr: "Koch كسورية لأن؟", answer: "تشابه ذاتي", hints: ["جزء يشبه الكل"] },
  ],
  challengeAr:
    "ارسم يدويًا ندفة Koch بعمق 2 على ورقة (مثلث صغير). ثم احسب المحيط إن كان ضلع المثلث الأصلي 9 سم — بعد depth=1 المحيط ×4/3، وبعد depth=2 ×(4/3)². قارن مع عدد القطع 48.",
  summary:
    "منحنى Koch: استبدل كل قطعة بأربع قطع طول كل منها ثلث الطول. ندفة الثلج = Koch على ثلاثة أضلاع مثلث. عدد القطع = initialSegments × 4^depth (للندفة: 3×4^depth). المحيط ينمو بعامل 4/3 كل عمق. تنفيذ استدعائي بـ Turtle مع depth كحالة أساس.",
  linkedActivity: "/lessons/koch-snowflake#lab",
};
