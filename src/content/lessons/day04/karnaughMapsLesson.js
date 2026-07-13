/** خريطة كارنوف — اليوم 4 | pdfPageIndex 190–193 */
export const karnaughMapsLesson = {
  id: "karnaugh-maps",
  titleAr: "خريطة كارنوف — تبسيط التعابير المنطقية",
  pdfRefs: [
    { pdfPageIndex: 190, topic: "Karnaugh map intro" },
    { pdfPageIndex: 192, topic: "Karnaugh applications" },
  ],
  vocabularyAr: [
    { term: "خريطة كارنوف", def: "شبكة تُمثّل جدول الحقيقة بترتيب Gray لتجميع 1ات متجاورة." },
    { term: "Minterm", def: "حاصل ضرب حرفي — صف في الجدول حيث الناتج = 1." },
    { term: "مجموعة (Group)", def: "مستطيل من 1 أو X بحجم 1، 2، 4، … لتبسيط التعبير." },
    { term: "Gray code", def: "ترتيب صفوف/أعمدة يختلف فيه بت واحد فقط بين جارين." },
  ],
  learningObjectives: [
    "قراءة خريطة كارنوف لمتغيرين وثلاثة.",
    "تجميع الخلايا ذات القيمة 1 في مجموعات صحيحة.",
    "اشتقاق تعبير مبسّط من المجموعات.",
    "ربط الخريطة بجدول الحقيقة والبوابات.",
  ],
  whyLearn: "تبسيط الدوائر المنطقية يقلّل عدد البوابات — أسرع وأرخص وأقل استهلاكًا للطاقة.",
  prerequisites: ["truth-tables", "logic-gates"],
  conceptSimple:
    "بدل كتابة كل minterm على حدة، نجمع الخلايا المتجاورة في كارنوف ونستبدل المتغيرات المتناقضة بإلغائها.",
  deepSections: [
    {
      id: "from-truth-table",
      titleAr: "من جدول الحقيقة إلى الخريطة",
      bodyAr:
        "انقل قيم الناتج 1 إلى خريطة 2×2 (لـ A,B) أو 2×4 (لـ A,B,C). ترتيب الصفوف والأعمدة يتبع Gray: 00، 01، 11، 10 — وليس 00، 01، 10، 11.",
    },
    {
      id: "grouping-rules",
      titleAr: "قواعد التجميع",
      bodyAr:
        "المجموعة مستطيلة بحجم قوة 2 (1، 2، 4، 8). يمكن التفاف عبر حافة الخريطة. كل مجموعة تُنتج حدًا واحدًا في التعبير المبسّط.",
    },
    {
      id: "simplify",
      titleAr: "كتابة التعبير المبسّط",
      bodyAr:
        "لكل مجموعة: المتغير ثابت في المجموعة يُكتب كما هو؛ المتغير الذي يتغير يُحذف. اجمع الحدود بـ OR (+).",
    },
    {
      id: "dont-care",
      titleAr: "قيم لا تهتم (X)",
      bodyAr: "في بعض المسائل يمكن استخدام X كـ 0 أو 1 لتكبير المجموعة — فقط عندما يُسمح بذلك في السؤال.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) املأ الخريطة", bodyAr: "من جدول الحقيقة أو من التعبير المنطقي." },
    { titleAr: "2) علّم كل 1", bodyAr: "لا تنسَ الخلايا على الحواف — قد تلتقي عبر التفاف." },
    { titleAr: "3) كوّن أكبر مجموعات", bodyAr: "ابدأ بمجموعات 4 ثم 2 ثم 1." },
    { titleAr: "4) اكتب الحدود", bodyAr: "كل مجموعة → حد AND؛ اجمع بـ OR." },
    { titleAr: "5) تحقق", bodyAr: "قارن بعدد البوابات قبل وبعد أو بجدول الحقيقة." },
  ],
  workedExamples: [
    {
      id: "ex-ab-and",
      titleAr: "A AND B — متغيران",
      difficulty: "سهل",
      promptAr: "بسّط الدالة المنطقية لمتغيرين باستخدام خريطة كارنوف.",
      expression: "A AND B",
      values: [
        { name: "A", value: "1" },
        { name: "B", value: "1" },
      ],
      cell: "11",
      steps: [
        "جدول: 1 فقط عند A=1,B=1 → خلية واحدة 1.",
        "مجموعة واحدة بحجم 1 عند (11).",
        "التعبير: A·B",
      ],
      result: "A AND B",
    },
    {
      id: "ex-ab-or",
      titleAr: "A OR B",
      difficulty: "سهل",
      promptAr: "بسّط الدالة التي يكون ناتجها واحدًا في كل خلية ما عدا الصفر.",
      expression: "A OR B",
      values: ["01", "10", "11"],
      steps: [
        "ثلاث خلايا = 1 (كل صف ما عدا 00).",
        "مجموعة عمودية أو أفقية بحجم 2+2 ممكنة.",
        "النتيجة: A + B",
      ],
      result: "A OR B",
    },
    {
      id: "ex-three-var",
      titleAr: "مثال ثلاث متغيرات",
      difficulty: "متوسط",
      promptAr: "رتّب خلايا الدالة ذات المتغيرات الثلاثة وفق ترميز غراي.",
      expression: "(A AND B) OR C",
      values: ["000", "001", "011", "010", "110", "111", "101", "100"],
      steps: [
        "خريطة 2×4 لـ A,B,C.",
        "جمّع أزواج متجاورة على حافة Gray.",
        "احذف المتغير المتغيّر داخل المجموعة.",
      ],
      result: "تعبير أقصر بعد التجميع",
    },
  ],
  wrongExamples: [
    { titleAr: "مجموعة غير مستطيلة", bodyAr: "شكل L لا يُقبل — يجب مستطيل كامل." },
    { titleAr: "حجم 3 خلايا", bodyAr: "3 ليست قوة 2 — قسّم إلى 2+1 أو وسّع بـ X." },
  ],
  interactiveExample: { type: "karnaugh-lab", defaultValue: "2-var" },
  commonMistakes: [
    { titleAr: "ترتيب Gray", bodyAr: "خلط 10 و 01 في الموضع.", step: "layout" },
    { titleAr: "نسيان التفاف", bodyAr: "خلايا الطرفين متجاورتان منطقيًا.", step: "wrap" },
    { titleAr: "مجموعات صغيرة جدًا", bodyAr: "لم تُكوّن أكبر مجموعة ممكنة.", step: "group" },
  ],
  quickCheck: {
    questions: [{
      id: "q1",
      promptAr: "هل هذا الحجم صالح لمجموعة كارنوف؟",
      cell: "4",
      answer: "4",
      hintAr: "قوة 2",
    }],
  },
  guidedPractice: [
    { id: "g1", promptAr: "كم خلية في الخريطة؟", values: ["2", "2"], answer: "4", hints: ["صفان × عمودان"] },
    { id: "g2", promptAr: "اكتب أول ترتيبين في ترميز غراي لبتين.", values: ["00", "01"], answer: "00,01", hints: ["فرق بت واحد"] },
    { id: "g3", promptAr: "إذا كانت خلية واحدة فقط تساوي واحدًا، فكم حدًا أصغر يوجد؟", cell: "1", answer: "1", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "كم خلية ناتجها واحد في خريطة من متغيرين؟", expression: "NOT A", answer: "2", hints: ["نصف الخلايا"] },
    { id: "i2", promptAr: "كم خلية ناتجها واحد؟", expression: "A XOR B", values: ["01", "10"], answer: "2", hints: ["الخليتان المعروضتان"] },
    { id: "i3", promptAr: "ما حجم أكبر مجموعة في خريطة بأربعة متغيرات؟", values: ["4", "4"], answer: "16", hints: ["كل الخريطة"] },
  ],
  challengeAr: "ابنِ خريطة 3 متغيرات من التعبير (A AND B) OR C وبيّن خطوات التجميع يدويًا.",
  challengeExpression: "(A AND B) OR C",
  summary:
    "كارنوف = جدول حقيقة بترتيب Gray + تجميع مستطيلات قوة 2 → تعبير أبسط. راجع محاكاة كارنوف في المنصة.",
  linkedActivity: "/simulations#karnaugh",
};
