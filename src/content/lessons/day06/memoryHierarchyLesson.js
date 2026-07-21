/** الذاكرة والتخزين المؤقت — اليوم 6 | pdfPageIndex 307–311 */
export const memoryHierarchyLesson = {
  id: "memory-hierarchy",
  titleAr: "الذاكرة والتخزين المؤقت (Cache)",
  pdfRefs: [
    { pdfPageIndex: 307, topic: "Memory hierarchy introduction" },
    { pdfPageIndex: 308, topic: "Cache near CPU" },
    { pdfPageIndex: 309, topic: "Train analogy for memory levels" },
    { pdfPageIndex: 310, topic: "RAM vs storage" },
  ],
  vocabularyAr: [
    { term: "CPU", def: "وحدة المعالجة المركزية — تنفّذ التعليمات والحسابات." },
    { term: "Cache", def: "ذاكرة صغيرة وسريعة جدًا قرب المعالج لتسريع الوصول للبيانات المتكررة." },
    { term: "RAM", def: "ذاكرة الوصول العشوائي — تخزن البرامج والبيانات أثناء التشغيل." },
    { term: "HDD/SSD", def: "تخزين دائم كبير السعة لكن أبطأ من RAM." },
    { term: "هرم الذاكرة", def: "ترتيب مستويات الذاكرة من الأسرع (الأصغر) إلى الأبطأ (الأكبر)." },
  ],
  learningObjectives: [
    "وصف وظيفة CPU و Cache و RAM و HDD.",
    "ترتيب مستويات الذاكرة حسب السرعة والسعة.",
    "شرح لماذا يحتاج الحاسب أكثر من نوع ذاكرة.",
    "ربط بطء القراءة من القرص بضرورة التخزين المؤقت.",
    "تطبيق المفاهيم في نشاط مطابقة تفاعلي.",
  ],
  whyLearn:
    "عندما يتأخر برنامجك أو يستهلك ذاكرة كثيرة، السبب غالبًا في أين تُخزَّن البيانات. فهم هرم الذاكرة يساعدك على كتابة برامج أسرع وفهم مواصفات الجهاز.",
  prerequisites: ["number-systems", "python-intro"],
  conceptSimple:
    "المعالج سريع جدًا، لكن القرص بطيء. لذلك نضع ذاكرة وسيطة: Cache صغيرة وسريعة قرب CPU، ثم RAM أكبر، ثم تخزين دائم كبير. كلما اقتربت من CPU زادت السرعة وقلّت السعة.",
  deepSections: [
    {
      id: "cpu-role",
      titleAr: "دور المعالج",
      bodyAr:
        "CPU يجلب التعليمات من الذاكرة وينفّذها (جمع، مقارنة، قفز). بدون ذاكرة لا يوجد مكان للبرنامج أثناء التشغيل.",
    },
    {
      id: "cache-idea",
      titleAr: "فكرة الـ Cache",
      bodyAr:
        "البيانات المستخدمة مرارًا تُنسخ إلى Cache. عند الطلب التالي يجدها CPU بسرعة دون الانتظار لـ RAM أو القرص — مثل وضع الكتب المهمة على مكتبك بدل المكتبة البعيدة.",
    },
    {
      id: "ram-role",
      titleAr: "RAM",
      bodyAr:
        "تخزن البرامج المفتوحة والملفات قيد العمل. عند إغلاق الجهاز تُمسح — لذلك نحفظ الملفات المهمة على القرص.",
    },
    {
      id: "storage",
      titleAr: "التخزين الدائم",
      bodyAr:
        "HDD أو SSD يحفظ نظام التشغيل وملفاتك حتى بعد إطفاء الجهاز. السعة كبيرة لكن الوصول أبطأ بكثير من RAM.",
    },
    {
      id: "pyramid",
      titleAr: "هرم السرعة والسعة",
      bodyAr:
        "من الأعلى للأسفل: سجلات CPU → Cache L1/L2/L3 → RAM → SSD/HDD. القاعدة: أسرع = أصغر وأغلى.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) حدّد المكوّن", bodyAr: "اسأل: هل ينفّذ؟ يخزّن مؤقتًا؟ يخزّن دائمًا؟" },
    { titleAr: "2) قارن السرعة", bodyAr: "رتّب من الأسرع للأبطأ: Cache ثم RAM ثم قرص." },
    { titleAr: "3) قارن السعة", bodyAr: "العكس: القرص أكبر، Cache أصغر." },
    { titleAr: "4) تتبع مسار البيانات", bodyAr: "من القرص → RAM → Cache → CPU عند التشغيل." },
    { titleAr: "5) فسّر البطء", bodyAr: "إذا قرأ البرنامج من القرص كثيرًا سيصبح بطيئًا." },
  ],
  workedExamples: [
    {
      id: "mem-ex-1",
      titleAr: "أين يعمل Excel الآن؟",
      difficulty: "سهل",
      steps: ["البرنامج مفتوح", "أجزاؤه النشطة في RAM", "التعليمات المتكررة قد تكون في Cache"],
      result: "RAM + Cache",
    },
    {
      id: "mem-ex-2",
      titleAr: "حفظ ملف Word",
      difficulty: "سهل",
      steps: ["أثناء الكتابة في RAM", "عند الحفظ يُكتب على القرص", "يبقى بعد الإغلاق"],
      result: "HDD/SSD",
    },
    {
      id: "mem-ex-3",
      titleAr: "ترتيب السرعة",
      difficulty: "متوسط",
      steps: ["Cache أسرع من RAM", "RAM أسرع من SSD", "الترتيب: Cache → RAM → SSD"],
      result: "Cache < RAM < SSD",
    },
  ],
  wrongExamples: [
    {
      titleAr: "القرص = RAM",
      bodyAr: "القرص للتخزين الدائم؛ RAM مؤقتة وتُمسح عند الإطفاء.",
    },
    {
      titleAr: "Cache بديل عن RAM",
      bodyAr: "Cache مكمّل صغير — لا يستبدل RAM بالكامل.",
    },
  ],
  interactiveExample: { type: "memory-hierarchy-lab", defaultValue: "match-components" },
  commonMistakes: [
    {
      titleAr: "خلط الوظيفة مع السعة",
      bodyAr: "CPU لا «يخزّن» ملفاتك — ينفّذ فقط.",
      step: "cpu",
    },
    {
      titleAr: "اعتبار Cache ذاكرة دائمة",
      bodyAr: "محتوى Cache مؤقت ويُستبدل باستمرار.",
      step: "cache",
    },
    {
      titleAr: "نسيان التسلسل الهرمي",
      bodyAr: "لا يقرأ CPU مباشرة من القرص في كل تعليمة — يمر عبر RAM/Cache.",
      step: "hierarchy",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "أي مكوّن الأسرع؟", answer: "Cache", hintAr: "الأقرب للمعالج" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "من ينفّذ جمع عددين؟", answer: "CPU", hints: ["المعالج"] },
    { id: "g2", promptAr: "أين تُحفظ الصور بعد إطفاء الجهاز؟", answer: "HDD", hints: ["تخزين دائم", "SSD"] },
    { id: "g3", promptAr: "ذاكرة مؤقتة أثناء فتح المتصفح؟", answer: "RAM", hints: ["أثناء التشغيل"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "الأبطأ عادة: Cache أم HDD؟", answer: "HDD", hints: ["القرص"] },
    { id: "i2", promptAr: "الأصغر سعة عادة؟", answer: "Cache", hints: ["قرب CPU"] },
    { id: "i3", promptAr: "وظيفة Cache بكلمة؟", answer: "تسريع", hints: ["سرعة الوصول"] },
  ],
  challengeAr: "ابحث عن مواصفات جهازك (RAM ونوع القرص) وفسّر كيف يؤثر ذلك على فتح عدة برامج معًا.",
  summary:
    "هرم الذاكرة يوازن بين السرعة والسعة والتكلفة. CPU + Cache + RAM + تخزين دائم يعملون معًا — وفهم أدوارهم أساس لتحسين الأداء.",
  linkedActivity: "/lessons/memory-hierarchy#lab",
};
