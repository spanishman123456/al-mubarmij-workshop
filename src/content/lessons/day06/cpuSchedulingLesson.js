/** جدولة عمليات المعالج — اليوم 6 | pdfPageIndex 312–314 */
export const cpuSchedulingLesson = {
  id: "cpu-scheduling",
  titleAr: "جدولة عمليات وحدة المعالج (FCFS و SRT)",
  pdfRefs: [
    { pdfPageIndex: 312, topic: "Gantt chart introduction" },
    { pdfPageIndex: 313, topic: "Shortest Remaining Time" },
    { pdfPageIndex: 314, topic: "CPU scheduling applications worksheet" },
  ],
  vocabularyAr: [
    { term: "عملية (Process)", def: "برنامج قيد التنفيذ يحتاج وقتًا على المعالج." },
    { term: "وقت الوصول (Arrival)", def: "اللحظة التي تصبح فيها العملية جاهزة للتنفيذ." },
    { term: "وقت الخدمة (Burst)", def: "المدة التي تحتاجها العملية على المعالج دون انقطاع." },
    { term: "وقت الانتظار (Wait)", def: "الوقت الذي تنتظره العملية في الطابور قبل أن تبدأ." },
    { term: "FCFS", def: "First Come First Served — أول وصول أول خدمة." },
    { term: "SRT", def: "Shortest Remaining Time — اختيار العملية ذات أقصر وقت متبقٍ." },
  ],
  learningObjectives: [
    "شرح لماذا يحتاج المعالج جدولة عند وجود عدة عمليات.",
    "تطبيق FCFS يدويًا وحساب وقت الانتظار والدوران.",
    "قراءة مخطط جانت (Gantt) لتمثيل استخدام CPU.",
    "مقارنة FCFS مع SRT في مثال بسيط.",
    "حساب متوسط وقت الانتظار ومتوسط وقت الدوران.",
  ],
  whyLearn:
    "جهازك يشغّل عشرات البرامج «معًا» لكن المعالج نواة واحدة أو قليلة. الجدولة تقرر من ينفّذ الآن — وهذا مفهوم أساسي في أنظمة التشغيل والأداء.",
  prerequisites: ["algorithms", "python-while"],
  conceptSimple:
    "عندما تصل عدة عمليات، يضعها نظام التشغيل في طابور. FCFS يخدم الأقدم وصولًا. SRT يختار العملية التي بقي لها أقل وقت على CPU — قد يقطع عملية طويلة لصالح قصيرة.",
  deepSections: [
    {
      id: "why-schedule",
      titleAr: "لماذا الجدولة؟",
      bodyAr:
        "CPU واحد لا ينفّذ إلا عملية في اللحظة نفسها. البقية تنتظر. الجدولة تختار الترتيب لتقليل الانتظار أو تحسين الاستجابة.",
    },
    {
      id: "fcfs",
      titleAr: "FCFS خطوة بخطوة",
      bodyAr:
        "رتّب العمليات حسب وقت الوصول. عندما يصبح CPU حرًا ابدأ أقدم عملية وصلت. احسب: انتظار = بداية التنفيذ − وقت الوصول، دوران = انتهاء − وقت الوصول.",
    },
    {
      id: "gantt",
      titleAr: "مخطط جانت",
      bodyAr:
        "محور أفقي للزمن، كل عملية لون أو رمز. يوضح فترات التشغيل والفراغات عندما ينتظر CPU وصول عملية جديدة.",
    },
    {
      id: "srt",
      titleAr: "SRT باختصار",
      bodyAr:
        "عند كل لحظة اختر العملية الجاهزة ذات أقل burst متبقٍ. قد تُقاطَع عملية طويلة إذا وصلت عملية أقصر — يقلل متوسط الانتظار أحيانًا.",
    },
    {
      id: "metrics",
      titleAr: "المقاييس",
      bodyAr:
        "متوسط الانتظار = مجموع أوقات الانتظار ÷ عدد العمليات. متوسط الدوران = مجموع أوقات الدوران ÷ العدد. تُستخدم لمقارنة الخوارزميات.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) اجمع البيانات", bodyAr: "لكل عملية: المعرف، وقت الوصول، وقت الخدمة." },
    { titleAr: "2) رتّب حسب FCFS", bodyAr: "الأقدم وصولًا أولًا (عند التعادل حسب الرقم)." },
    { titleAr: "3) احسب البداية والنهاية", bodyAr: "البداية = max(وصول، انتهاء السابقة)." },
    { titleAr: "4) احسب الانتظار والدوران", bodyAr: "انتظار = بداية − وصول؛ دوران = نهاية − وصول." },
    { titleAr: "5) المتوسطات", bodyAr: "اجمع ثم اقسم على عدد العمليات." },
  ],
  workedExamples: [
    {
      id: "sched-ex-1",
      titleAr: "عمليتان بسيطتان — FCFS",
      difficulty: "سهل",
      steps: [
        "P1: وصول 0، خدمة 3 → ينفّذ 0–3، انتظار 0",
        "P2: وصول 1، خدمة 2 → ينفّذ 3–5، انتظار 2",
        "متوسط الانتظار = (0+2)/2 = 1",
      ],
      result: "avg wait = 1",
    },
    {
      id: "sched-ex-2",
      titleAr: "ثلاث عمليات",
      difficulty: "متوسط",
      steps: [
        "P1(0,3) ثم P2(1,2) ثم P3(2,1)",
        "أوقات انتظار: 0، 2، 3",
        "متوسط ≈ 1.67",
      ],
      result: "avg wait ≈ 1.67",
    },
    {
      id: "sched-ex-3",
      titleAr: "فراغ CPU",
      difficulty: "متوسط",
      steps: ["P1 يصل عند 5", "CPU خامد 0–5", "يبدأ P1 عند 5، انتظار 0"],
      result: "idle ثم تشغيل",
    },
  ],
  wrongExamples: [
    {
      titleAr: "البدء قبل وقت الوصول",
      bodyAr: "لا تبدأ عملية قبل أن تصل — انتظر حتى arrival.",
    },
    {
      titleAr: "خلط الدوران مع الانتظار",
      bodyAr: "الدوران يشمل وقت التنفيذ؛ الانتظار فقط في الطابور.",
    },
  ],
  interactiveExample: { type: "cpu-scheduling-lab", defaultValue: "fcfs-3proc" },
  commonMistakes: [
    {
      titleAr: "ترتيب خاطئ عند تعادل الوصول",
      bodyAr: "استخدم ترتيب المعرف P1 قبل P2 عند نفس وقت الوصول.",
      step: "order",
    },
    {
      titleAr: "نسيان فترة الخمول",
      bodyAr: "إذا لم تصل عمليات، الزمن يمر بدون تنفيذ.",
      step: "idle",
    },
    {
      titleAr: "خطأ في المتوسط",
      bodyAr: "اقسم على عدد العمليات وليس على مجموع الأزمنة.",
      step: "average",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "FCFS اختصار؟", answer: "First Come First Served", hintAr: "أول وصول" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "P1 وصول 0 خدمة 2 — متى ينتهي؟", answer: "2", hints: ["0+2"] },
    { id: "g2", promptAr: "P2 وصول 1 خدمة 1 بعد P1 أعلاه — انتظار P2؟", answer: "1", hints: ["يبدأ عند 2"] },
    { id: "g3", promptAr: "متوسط انتظار (0 و 1)؟", answer: "0.5", hints: ["(0+1)/2"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "دوران P1 في المثال الأول (وصول 0 خدمة 3)؟", answer: "3", hints: ["نهاية − وصول"] },
    { id: "i2", promptAr: "SRT يفضّل العملية الأقصر في ماذا؟", answer: "الوقت المتبقي", hints: ["remaining"] },
    { id: "i3", promptAr: "مخطط جانت يُظهر الزمن على أي محور؟", answer: "أفقي", hints: ["horizontal"] },
  ],
  challengeAr: "قارن FCFS و SRT على 4 عمليات تختارها — هل انخفض متوسط الانتظار؟ لماذا قد لا يكون SRT عادلًا؟",
  summary:
    "جدولة CPU تنظّم من يستخدم المعالج ومتى. FCFS بسيطة وعادلة في الترتيب؛ SRT تحسّن الانتظار أحيانًا بتفضيل العمليات القصيرة.",
  linkedActivity: "/lessons/cpu-scheduling#lab",
};
