/** الشجرة الهندسية المتكررة — اليوم 10 | pdfPageIndex 441–444 */
export const fractalTreeLesson = {
  id: "fractal-tree-recursion",
  titleAr: "رسم الشجرة ذات النمط الهندسي المتكرر",
  pdfRefs: [
    { pdfPageIndex: 441, topic: "نشاط Fractal Tree" },
    { pdfPageIndex: 442, topic: "اشتقاق البرنامج تدريجيًا" },
    { pdfPageIndex: 443, topic: "تحسين الشجرة بالأوراق والفروع" },
  ],
  vocabularyAr: [
    { term: "Fractal Tree", def: "رسم شجرة يتكرر فيه نفس النمط على مستويات أصغر." },
    { term: "Depth", def: "عمق الاستدعاء الذاتي (عدد مستويات التفرع)." },
    { term: "Branch", def: "فرع جديد يُرسم من الفرع السابق." },
    { term: "Base Case", def: "شرط إيقاف رسم الفروع الصغيرة جدًا." },
  ],
  learningObjectives: [
    "شرح كيف يظهر التشابه الذاتي في الشجرة.",
    "تحديد base case في دالة drawTree.",
    "تعديل زاوية/عامل التصغير وملاحظة الأثر.",
    "تقدير عدد الفروع عند عمق معين.",
  ],
  whyLearn:
    "هذا الدرس يربط الاستدعاء الذاتي من اليوم التاسع بتطبيق بصري مباشر، فيرى الطالب كيف تبني الخوارزمية شكلًا معقدًا من قاعدة بسيطة.",
  prerequisites: ["python-recursion", "koch-snowflake", "sierpinski-triangle"],
  conceptSimple:
    "ارسم جذعًا، ثم استدعِ نفس الدالة لرسم فرعين أصغر يمينًا ويسارًا. كرر حتى يصبح الحجم صغيرًا جدًا (base case).",
  deepSections: [
    {
      id: "tree-core",
      titleAr: "البنية الأساسية للشجرة",
      bodyAr:
        "forward(size) يرسم الجذع، ثم left/right لتغيير الاتجاه، ثم drawTree(size*factor) لفرعين أصغر، وأخيرًا العودة backward(size).",
    },
    {
      id: "stop-rule",
      titleAr: "قاعدة الإيقاف",
      bodyAr:
        "if size < 5: return تمنع الاستدعاءات اللانهائية وتحافظ على زمن التنفيذ. كلما زاد العمق زادت الفروع بسرعة.",
    },
    {
      id: "parameter-impact",
      titleAr: "تأثير المعاملات",
      bodyAr:
        "زاوية أكبر تعطي شجرة أوسع، وعامل تصغير أصغر يعطي فروعًا أقصر. تعديل المعلمات ينتج أشكالًا مختلفة بنفس الخوارزمية.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) اكتب drawTree(size)", bodyAr: "ابدأ بدالة تستقبل الحجم." },
    { titleAr: "2) أضف base case", bodyAr: "إذا الحجم صغير جدًا أوقف الرسم." },
    { titleAr: "3) ارسم الجذع", bodyAr: "forward(size)." },
    { titleAr: "4) ارسم فرعين", bodyAr: "left ثم recursion، right ثم recursion." },
    { titleAr: "5) ارجع لنقطة البداية", bodyAr: "backward(size) لإكمال الرسم." },
  ],
  workedExamples: [
    {
      id: "tree-ex-1",
      titleAr: "عدد القطع عند عمق 2",
      difficulty: "سهل",
      steps: ["مستوى 0: 1", "مستوى 1: 2", "مستوى 2: 4", "المجموع = 7"],
      result: "7",
    },
    {
      id: "tree-ex-2",
      titleAr: "عدد القطع عند عمق 4",
      difficulty: "متوسط",
      steps: ["1 + 2 + 4 + 8 + 16", "المجموع = 31"],
      result: "31",
    },
  ],
  commonMistakes: [
    { titleAr: "نسيان العودة backward", bodyAr: "بدون الرجوع تتراكم الإزاحة في موضع خاطئ وتتشوه الشجرة." },
    { titleAr: "عامل تصغير غير مناسب", bodyAr: "إذا factor قريب من 1 تصبح الفروع طويلة جدًا ويبطؤ الرسم." },
  ],
  guidedPractice: [
    { id: "g1", promptAr: "عمق 1 — مجموع القطع؟", answer: "3", hints: ["1+2"] },
    { id: "g2", promptAr: "عمق 3 — مجموع القطع؟", answer: "15", hints: ["1+2+4+8"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "متى تتوقف الدالة؟", answer: "عند base case", acceptedAnswers: ["base case", "حالة الإيقاف"] },
    { id: "i2", promptAr: "عمق 2 — مجموع القطع؟", answer: "7" },
  ],
  quickCheck: {
    questions: [{ id: "q1", promptAr: "هل الشجرة مثال على التشابه الذاتي؟", answer: "نعم", hintAr: "الجزء يشبه الكل" }],
  },
  challengeAr: "عدّل زاوية التفرع إلى 20 ثم 40 وقارن شكل الشجرة وعدد التداخلات.",
  summary:
    "Fractal Tree تطبق recursion بصريًا: قاعدة إيقاف + فرعان أصغر كل مرة. نفس الفكرة تبني رسومات مركبة بخطوات بسيطة.",
  linkedActivity: "/lessons/fractal-tree-recursion#lab",
};
