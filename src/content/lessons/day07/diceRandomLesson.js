/** النرد والعشوائية — اليوم 7 | pdfPageIndex 370 */
export const diceRandomLesson = {
  id: "dice-random",
  titleAr: "رمي النرد ووحدة random في بايثون",
  pdfRefs: [
    { pdfPageIndex: 370, topic: "أحجار النرد — رمي نردين وحساب المجموع" },
    { pdfPageIndex: 141, topic: "خوارزمية مقارنة حجرين (مرجع PDF)" },
    { pdfPageIndex: 142, topic: "إجابات نشاط النرد — pseudocode" },
  ],
  vocabularyAr: [
    { term: "عشوائي (Random)", def: "نتيجة لا يمكن التنبؤ بها بدقة في كل مرة — مثل رمي النرد الحقيقي." },
    { term: "وحدة random", def: "مكتبة بايثون الجاهزة لتوليد أرقام عشوائية واختيارات." },
    { term: "randint(a, b)", def: "يعيد عددًا صحيحًا عشوائيًا بين a و b شاملين." },
    { term: "مجموع النردين", def: "die1 + die2 — يتراوح من 2 (1+1) إلى 12 (6+6)." },
    { term: "محاكاة (Simulation)", def: "تقليد سلوك حقيقي (رمي نرد) بالبرنامج لتكرار التجربة آلاف المرات." },
    { term: "RNG", def: "مولّد الأرقام العشوائية — في الحاسب «شبه عشوائي» لكن كافٍ للألعاب والتعليم." },
  ],
  learningObjectives: [
    "شرح معنى «عشوائي» في الألعاب والبرامج التعليمية.",
    "استخدام import random و random.randint(1, 6) لمحاكاة نرد واحد.",
    "رمي نردين وحساب المجموع برمجيًا.",
    "تصنيف المجموع إلى فئات (منخفض، متوسط، مرتفع) باستخدام if.",
    "مقارنة نتيجتي لاعبين (مثل خوارزمية PDF) عند تساوي أو اختلاف المجموع.",
    "تكرار الرمي داخل حلقة لجمع إحصاءات بسيطة (كم مرة ظهر 7؟).",
    "ربط العشوائية بألعاب اللوحة والنرد في المنهج.",
  ],
  whyLearn:
    "ألعاب النرد والبطاقات تعتمد على نتائج غير محددة مسبقًا. وحدة random تمنحك «حظًا رقميًا» لبناء ألعاب عادلة، اختبارات محاكاة، وتمارين احتمال. اليوم تربط الخوارزمية التي كتبتها سابقًا (مقارنة حجرين) بتنفيذ بايثون حقيقي.",
  prerequisites: ["if-statement", "python-for-range", "python-while", "algorithms"],
  conceptSimple:
    "import random ثم die = random.randint(1, 6) يعطي وجهًا عشوائيًا للنرد. نردان: d1, d2 = random.randint(1,6), random.randint(1,6) ثم total = d1 + d2. المجموع 7 شائع نسبيًا (6 تركيبات من 36).",
  deepSections: [
    {
      id: "why-random",
      titleAr: "لماذا العشوائية؟",
      bodyAr:
        "بدون عشوائية تكون اللعبة متوقعة ومملة. في الحاسب نستخدم خوارزميات تبدو عشوائية (PRNG) — كافية لرمي النرد والاختبارات. المهم: كل رمية مستقلة في التصميم التعليمي.",
    },
    {
      id: "randint",
      titleAr: "random.randint",
      bodyAr:
        "random.randint(1, 6) يشمل الطرفين 1 و 6 — مثل النرد الحقيقي. لا تستخدم range(6) مباشرة للمبتدئين دون +1 لأن range يبدأ من 0.",
    },
    {
      id: "two-dice",
      titleAr: "نردان ومجموعهما",
      bodyAr:
        "d1 = random.randint(1,6); d2 = random.randint(1,6); s = d1 + d2. اطبع d1, d2, s. في PDF: قارن s للاعب 1 و s2 للاعب 2 — الأكبر يفوز، التساوي تعادل.",
    },
    {
      id: "sum-distribution",
      titleAr: "توزيع المجاميع",
      bodyAr:
        "أقل مجموع 2، أعلى 12. المجموع 7 يظهر بـ 6 طرق (1+6, 2+5, …) من 36 حالة — الأكثر شيوعًا. 2 و 12 الأندر (طريقة واحدة لكل).",
    },
    {
      id: "categories",
      titleAr: "تصنيف المجموع",
      bodyAr:
        "منخفض: s ≤ 6. متوسط: 7 ≤ s ≤ 9. مرتفع: s ≥ 10. يساعد في شرح if/elif وفي ألعاب تربط النتيجة بمكافأة أو عقوبة.",
    },
    {
      id: "loop-simulation",
      titleAr: "محاكاة بالحلقة",
      bodyAr:
        "count7 = 0\nfor i in range(1000):\n    if random.randint(1,6)+random.randint(1,6)==7: count7+=1\nprint(count7) — يقترب من التكرار النظري مع كثرة التجارب.",
    },
    {
      id: "seed-optional",
      titleAr: "random.seed (إثرائي)",
      bodyAr:
        "random.seed(42) يثبّت التسلسل العشوائي للتجارب — مفيد عند تصحيح البرنامج. في اللعب الحقيقي لا تستخدم seed ثابتًا.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) استورد random", bodyAr: "import random في أعلى الملف." },
    { titleAr: "2) ارمِ نردًا", bodyAr: "die = random.randint(1, 6)" },
    { titleAr: "3) ارمِ نردين", bodyAr: "d1, d2 = random.randint(1,6), random.randint(1,6)" },
    { titleAr: "4) احسب المجموع", bodyAr: "total = d1 + d2" },
    { titleAr: "5) صنّف أو قارن", bodyAr: "استخدم if لمقارنة لاعبين أو فئات المجموع." },
    { titleAr: "6) اطبع النتائج", bodyAr: "وضّح الوجهين والمجموع للمستخدم." },
    { titleAr: "7) كرّر في حلقة (اختياري)", bodyAr: "لإحصاء التكرارات أو لعب عدة جولات." },
  ],
  workedExamples: [
    {
      id: "dice-ex-1",
      titleAr: "رمية واحدة ثابتة للتتبع",
      difficulty: "سهل",
      steps: [
        "d1=4, d2=6 (قيم ثابتة للتعلم)",
        "total = 4 + 6 = 10",
        "التصنيف: مرتفع (≥10)",
      ],
      result: "10 — مرتفع",
    },
    {
      id: "dice-ex-2",
      titleAr: "مقارنة لاعبين",
      difficulty: "متوسط",
      steps: [
        "اللاعب 1: 3+5=8",
        "اللاعب 2: 2+6=8",
        "8 == 8 → تعادل",
      ],
      result: "تعادل",
    },
    {
      id: "dice-ex-3",
      titleAr: "كود بايثون مختصر",
      difficulty: "متوسط",
      steps: [
        "import random",
        "a, b = random.randint(1,6), random.randint(1,6)",
        "print(a, b, a+b)",
        "المخرج يتغير كل تشغيل",
      ],
      result: "مثال: 2 5 7",
    },
  ],
  wrongExamples: [
    {
      titleAr: "randint(0, 5) لنرد ست وجوه",
      bodyAr: "النرد الصحيح 1–6 وليس 0–5 — وإلا تخرج 0 وهو غير صالح على النرد الحقيقي.",
    },
    {
      titleAr: "نسيان import random",
      bodyAr: "NameError: random غير معرّف — يجب import random أولًا.",
    },
  ],
  interactiveExample: { type: "dice-random-lab", defaultValue: "roll-two" },
  commonMistakes: [
    {
      titleAr: "استخدام random() × 6 دون floor",
      bodyAr: "random.random() يعطي [0,1) — للمبتدئين استخدم randint مباشرة لتجنب أخطاء التقريب.",
      step: "randint",
    },
    {
      titleAr: "جمع نرد واحد مرتين بالخطأ",
      bodyAr: "d = random.randint(1,6); total = d + d يعطي نفس الوجه مرتين — تحتاج استدعاءين منفصلين.",
      step: "two-dice",
    },
    {
      titleAr: "شرط elif ناقص عند التصنيف",
      bodyAr: "if s<=6 ... elif s<=9 — تذكر else للمرتفع أو حدّد الحدود بوضوح.",
      step: "categories",
    },
    {
      titleAr: "خلط المجموع مع الوجه الواحد",
      bodyAr: "وجه 6 لا يعني مجموع 6 مع نردين — المجموع قد يكون 12.",
      step: "sum",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "أقل مجموع لنردين؟", answer: "2", hintAr: "1+1" },
      { id: "q2", promptAr: "أعلى مجموع لنردين؟", answer: "12", hintAr: "6+6" },
      { id: "q3", promptAr: "randint(1,6) يعطي أعدادًا من؟", answer: "1 إلى 6", hintAr: "شامل الطرفين" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "d1=2, d2=3 — المجموع؟", answer: "5", hints: ["2+3"] },
    { id: "g2", promptAr: "مجموع 5 — التصنيف؟", answer: "منخفض", hints: ["≤6"] },
    { id: "g3", promptAr: "مجموع 9 — التصنيف؟", answer: "متوسط", hints: ["7–9"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "مجموع 11 — التصنيف؟", answer: "مرتفع", hints: ["≥10"] },
    { id: "i2", promptAr: "كم وجهًا للنرد العادي؟", answer: "6", hints: ["1..6"] },
    { id: "i3", promptAr: "3+4 مقابل 2+5 — من يفوز؟", answer: "تعادل", hints: ["7=7"] },
  ],
  challengeAr:
    "اكتب برنامجًا يرمي نردين 1000 مرة ويحسب كم مرة كان المجموع 7، ثم يقارن النسبة بـ 6/36 ≈ 16.7%.",
  summary:
    "وحدة random تمكّنك من محاكاة النرد بـ randint(1,6). مجموع نردين يدخل في المقارنات والتصنيفات والحلقات — حلقة بين الخوارزمية والكود في ألعاب الحظ.",
  linkedActivity: "/lessons/dice-random#lab",
};
