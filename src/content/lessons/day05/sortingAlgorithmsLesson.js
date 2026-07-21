/** فرز الاختيار — اليوم 5 | pdfPageIndex 285–286 */
export const sortingAlgorithmsLesson = {
  id: "sorting-algorithms",
  titleAr: "الفرز بخوارزمية الاختيار (Selection Sort)",
  pdfRefs: [
    { pdfPageIndex: 285, topic: "Selection sort idea" },
    { pdfPageIndex: 286, topic: "Selection sort trace" },
  ],
  vocabularyAr: [
    { term: "فرز", def: "إعادة ترتيب العناصر تصاعديًا أو تنازليًا." },
    { term: "Selection Sort", def: "اختيار أصغر عنصر من الجزء غير المرتب ووضعه في مكانه الصحيح." },
    { term: "swap", def: "تبديل مكان عنصرين داخل القائمة." },
    { term: "in-place", def: "الخوارزمية تعدّل نفس القائمة دون إنشاء نسخة كبيرة جديدة." },
  ],
  learningObjectives: [
    "فهم فكرة اختيار الأصغر في كل دورة.",
    "تتبع الموضعين i و minIdx أثناء الفرز.",
    "تطبيق التبديل الصحيح بين عنصرين.",
    "تقدير عدد المقارنات في Selection Sort.",
  ],
  whyLearn:
    "الفرز يجعل البحث والتحليل لاحقًا أسهل. وفرز الاختيار مناسب للتدريب لأنه واضح الخطوات وسهل التتبع يدويًا.",
  prerequisites: ["linear-search", "python-arrays", "python-for-range"],
  conceptSimple:
    "نثبت الموضع i، ثم نبحث عن أصغر عنصر من i إلى النهاية، وبعدها نبدله مع العنصر في الموضع i. نكرر حتى تترتب القائمة.",
  deepSections: [
    {
      id: "pass-idea",
      titleAr: "ماذا يحدث في كل دورة؟",
      bodyAr:
        "الدورة الأولى تضع أصغر عنصر في الموضع 0. الدورة الثانية تضع ثاني أصغر عنصر في الموضع 1، وهكذا حتى نهاية القائمة.",
    },
    {
      id: "min-index",
      titleAr: "تتبّع minIdx",
      bodyAr:
        "نبدأ minIdx=i. كلما وجدنا عنصرًا أصغر من arr[minIdx] نحدّث minIdx. بعد انتهاء المقارنات نبدّل إن تغيّر minIdx.",
    },
    {
      id: "swapping",
      titleAr: "التبديل الآمن",
      bodyAr:
        "في بايثون يمكن التبديل بسطر واحد: arr[i], arr[minIdx] = arr[minIdx], arr[i]. إذا كان minIdx=i فلا حاجة لتبديل.",
    },
    {
      id: "cost",
      titleAr: "تكلفة الخوارزمية",
      bodyAr:
        "عدد المقارنات تقريبًا n(n-1)/2 في كل الحالات تقريبًا، لذلك تعقيدها O(n²). هذا جيد للتعلم لكنه ليس الأفضل لقوائم ضخمة.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) ثبّت الموضع i", bodyAr: "ابدأ من i=0 وحتى n-2." },
    { titleAr: "2) ابحث عن الأصغر", bodyAr: "افحص العناصر من i+1 إلى النهاية." },
    { titleAr: "3) حدّث minIdx", bodyAr: "كلما وجدت قيمة أصغر خزّن موضعها." },
    { titleAr: "4) بدّل عند الحاجة", bodyAr: "ضع أصغر قيمة في الموضع i." },
    { titleAr: "5) كرر للدورة التالية", bodyAr: "مع كل دورة يكبر الجزء المرتب في بداية القائمة." },
  ],
  workedExamples: [
    {
      id: "sel-ex-1",
      titleAr: "قائمة قصيرة",
      difficulty: "سهل",
      steps: [
        "القائمة: [7, 4, 9, 1].",
        "الدورة 1: أصغر عنصر 1 → تبديل مع الموضع 0 → [1,4,9,7].",
        "الدورة 2: أصغر من [4,9,7] هو 4 (لا تبديل).",
        "الدورة 3: أصغر من [9,7] هو 7 → [1,4,7,9].",
      ],
      result: "[1, 4, 7, 9]",
    },
    {
      id: "sel-ex-2",
      titleAr: "قائمة شبه مرتبة",
      difficulty: "متوسط",
      steps: [
        "القائمة: [2, 3, 1, 4].",
        "الدورة 1: الأصغر 1 → [1,3,2,4].",
        "الدورة 2: الأصغر في الجزء الأخير 2 → [1,2,3,4].",
      ],
      result: "[1, 2, 3, 4]",
    },
    {
      id: "sel-ex-3",
      titleAr: "وجود تكرار",
      difficulty: "متوسط",
      steps: [
        "القائمة: [5, 2, 5, 1].",
        "الدورة 1: الأصغر 1 ينتقل للبداية.",
        "التكرار لا يسبب مشكلة؛ الخوارزمية ترتب القيم بالتسلسل.",
      ],
      result: "[1, 2, 5, 5]",
    },
  ],
  wrongExamples: [
    {
      titleAr: "البدء بـ minIdx=0 دائمًا",
      bodyAr: "يجب أن يبدأ minIdx=i في كل دورة، وإلا نقارن جزءًا مرتبًا بلا حاجة.",
    },
    {
      titleAr: "تبديل داخل الحلقة الداخلية",
      bodyAr: "التبديل يتم بعد نهاية البحث عن الأصغر، وليس بعد كل مقارنة.",
    },
  ],
  interactiveExample: { type: "selection-sort-lab", defaultValue: "array-6" },
  commonMistakes: [
    {
      titleAr: "نسيان إعادة minIdx",
      bodyAr: "في كل دورة جديدة يجب إعادة minIdx=i.",
      step: "loop",
    },
    {
      titleAr: "حد الحلقة الداخلي خطأ",
      bodyAr: "يجب أن يبدأ j من i+1 وليس من 0.",
      step: "indexes",
    },
    {
      titleAr: "خلط بين الفرز الفقاعي والاختيار",
      bodyAr: "Selection Sort يبحث عن الأصغر ثم يبدّل مرة واحدة في الدورة.",
      step: "algorithm",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "كم مرة نثبت عنصرًا في دورة واحدة؟", answer: "1", hintAr: "موضع i فقط" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "في [4,1,3] بعد الدورة الأولى يصبح أول عنصر؟", answer: "1", hints: ["ابحث عن الأصغر"] },
    { id: "g2", promptAr: "في [2,5,1,4] minIdx في الدورة الأولى؟", answer: "2", hints: ["موضع القيمة 1"] },
    { id: "g3", promptAr: "كم دورة أساسية لقائمة طولها 5؟", answer: "4", hints: ["n-1"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "رتب [3,2,1] — أول عنصر بعد اكتمال الفرز؟", answer: "1", hints: ["تصاعدي"] },
    { id: "i2", promptAr: "رتب [9,7,8] — آخر عنصر بعد الفرز؟", answer: "9", hints: ["أكبر قيمة"] },
    { id: "i3", promptAr: "تعقيد Selection Sort التقريبي؟", answer: "O(n^2)", hints: ["n تربيع"] },
  ],
  challengeAr:
    "عدّل Selection Sort ليرتب تنازليًا، ثم قارن عدد المقارنات قبل وبعد التعديل ولاحظ أنه لا يتغير.",
  summary:
    "Selection Sort يرتب القائمة عبر اختيار أصغر عنصر في كل دورة ووضعه في مكانه. الخوارزمية واضحة للتعلم لكنها أبطأ من خوارزميات متقدمة عند البيانات الكبيرة.",
  linkedActivity: "/simulations#search",
};
