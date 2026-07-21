/** البحث والعرض في الذكاء الاصطناعي — اليوم 11 */
export const aiResearchPresentationLesson = {
  id: "ai-research-presentation",
  titleAr: "إعداد بحث وعرض تقديمي في الذكاء الاصطناعي",
  pdfRefs: [
    { pdfPageIndex: 434, topic: "مهارات البحث" },
    { pdfPageIndex: 435, topic: "مهارات العرض" },
    { pdfPageIndex: 436, topic: "التغذية الراجعة" },
  ],
  vocabularyAr: [
    { term: "Research Question", def: "سؤال واضح يحدد هدف البحث." },
    { term: "Source Credibility", def: "موثوقية المصدر العلمي المستخدم." },
    { term: "Slide Design", def: "تنظيم الشريحة بصريًا لتسهيل الفهم." },
    { term: "Rubric", def: "معيار تقييم العرض بعناصر واضحة." },
  ],
  learningObjectives: [
    "صياغة سؤال بحثي واضح حول موضوع AI.",
    "اختيار مصادر موثوقة وتلخيصها.",
    "بناء عرض قصير منظم (مشكلة/حل/مثال/أثر).",
    "تطبيق Rubric التقييم الذاتي قبل العرض النهائي.",
  ],
  whyLearn:
    "العرض الجيد يبرهن الفهم الحقيقي، ويحوّل المعرفة التقنية إلى تواصل واضح يمكن للآخرين الاستفادة منه.",
  prerequisites: ["ai-foundations", "ai-ethics-safety", "communication-skills"],
  conceptSimple:
    "ابنِ عرضك حول سؤال واحد: ما المشكلة؟ كيف يحلها AI؟ ما مثال عملي؟ وما الأثر أو المخاطر؟",
  deepSections: [
    {
      id: "research-flow",
      titleAr: "خط سير البحث",
      bodyAr:
        "ابدأ بسؤال، اجمع 2-3 مصادر موثوقة، استخرج الفكرة الأساسية، ثم اكتب نقاطًا قصيرة بدل فقرات طويلة.",
    },
    {
      id: "slide-structure",
      titleAr: "هيكل العرض",
      bodyAr:
        "شريحة 1: المشكلة، شريحة 2: الفكرة التقنية، شريحة 3: مثال واقعي، شريحة 4: الفوائد والمخاطر، شريحة 5: الخلاصة.",
    },
    {
      id: "delivery",
      titleAr: "مهارات الإلقاء",
      bodyAr:
        "استخدم لغة واضحة، تواصل بصري، زمن منضبط، وأجب عن الأسئلة اعتمادًا على الدليل لا الانطباع.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) اختر موضوعًا محددًا", bodyAr: "مثل AI في التعليم أو الطب." },
    { titleAr: "2) اكتب سؤال البحث", bodyAr: "سؤال قابل للإجابة خلال عرض قصير." },
    { titleAr: "3) لخص المصادر", bodyAr: "ثلاث نقاط لكل مصدر." },
    { titleAr: "4) صمم الشرائح", bodyAr: "3-5 نقاط مختصرة في الشريحة." },
    { titleAr: "5) تدرب على التقديم", bodyAr: "جولة تجريبية مع زميل وتغذية راجعة." },
  ],
  workedExamples: [
    {
      id: "pres-ex-1",
      titleAr: "خطة عرض قصيرة",
      difficulty: "سهل",
      steps: ["المشكلة: صعوبة متابعة التقدم", "الحل: تحليل أداء تلقائي", "المثال: لوحة تعلم", "الأثر: دعم أسرع للطالب"],
      result: "عرض واضح",
    },
  ],
  commonMistakes: [
    { titleAr: "حشو الشريحة بنص طويل", bodyAr: "الأفضل نقاط مختصرة + شرح شفهي." },
    { titleAr: "غياب المصدر", bodyAr: "أي معلومة يجب أن يكون لها مرجع." },
  ],
  guidedPractice: [
    { id: "g1", promptAr: "هل ترتيب (مشكلة→حل→مثال→أثر) مناسب؟", answer: "نعم" },
    { id: "g2", promptAr: "هل 3-5 نقاط في الشريحة مناسب؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اذكر عنصرين من Rubric العرض", answer: "وضوح الفكرة وموثوقية المصدر" },
    { id: "i2", promptAr: "هل يُفضّل قراءة النص حرفيًا من الشريحة؟", answer: "لا" },
  ],
  quickCheck: {
    questions: [{ id: "q1", promptAr: "هل كل عرض جيد يحتاج سؤالًا بحثيًا واضحًا؟", answer: "نعم" }],
  },
  challengeAr: "جهز عرضًا من 4 شرائح عن تطبيق AI تختاره، مع ذكر خطر أخلاقي واحد وطريقة الحد منه.",
  summary:
    "البحث والعرض يكملان التعلم التقني: فهم + توثيق + تواصل = أثر تعليمي حقيقي.",
  linkedActivity: "/lessons/ai-research-presentation#lab",
};
