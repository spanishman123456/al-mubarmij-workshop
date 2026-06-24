/**
 * سؤال خامس لاختبارات الوحدات القصيرة
 */

export const UNIT_QUIZ_EXTRAS = {
  "quiz-intro": {
    id: "intro-q5",
    type: "truefalse",
    questionAr: "التقويم القبلي يساعد المعلم والطالب على معرفة نقطة البداية.",
    optionsAr: ["صح", "خطأ"],
    correctIndex: 0,
    explainAr: "baseline للمقارنة لاحقاً.",
  },
  "quiz-computing": {
    id: "cb-q5",
    type: "fill",
    questionAr: "أكمل: الذاكرة العشوائية RAM تُفقد محتوياتها عند _____",
    correctAnswer: "إيقاف التشغيل",
    acceptAnswers: ["إيقاف التشغيل", "اطفاء الجهاز", "انقطاع الكهرباء"],
    explainAr: "RAM volatile — التخزين الدائم على القرص.",
  },
  "quiz-binary": {
    id: "bin-q5",
    type: "mcq",
    questionAr: "العدد الثنائي 1111 يساوي عشرياً:",
    optionsAr: ["7", "15", "16", "31"],
    correctIndex: 1,
    explainAr: "8+4+2+1 = 15.",
  },
  "quiz-python": {
    id: "py-q5",
    type: "fill",
    questionAr: "أكمل: لتخزين نص في متغير نستخدم علامات _____",
    correctAnswer: "اقتباس",
    acceptAnswers: ["اقتباس", "تنصيص", '"', "علامات اقتباس"],
    explainAr: "Strings between quotes in Python.",
  },
  "quiz-algorithms": {
    id: "algo-q5",
    type: "truefalse",
    questionAr: "كل خوارزمية صحيحة يجب أن تنتهي بعد عدد محدود من الخطوات.",
    optionsAr: ["صح", "خطأ"],
    correctIndex: 0,
    explainAr: "النهاية شرط من شروط الخوارزمية.",
  },
  "quiz-control": {
    id: "ctrl-q5",
    type: "mcq",
    questionAr: "أي بنية تنفّذ كتلة فقط عند تحقق شرط؟",
    optionsAr: ["if", "while", "for دائماً", "import"],
    correctIndex: 0,
    explainAr: "if للتفرع الشرطي.",
  },
  "quiz-logic": {
    id: "logic-q5",
    type: "fill",
    questionAr: "أكمل: نتيجة 1 AND 1 = _____",
    correctAnswer: "1",
    acceptAnswers: ["1", "واحد"],
    explainAr: "AND يعطي 1 عند 1 و1.",
  },
  "quiz-search-sort": {
    id: "ss-q5",
    type: "truefalse",
    questionAr: "يمكن استخدام البحث الخطي على قائمة غير مرتبة.",
    optionsAr: ["صح", "خطأ"],
    correctIndex: 0,
    explainAr: "الخطي لا يشترط الترتيب.",
  },
  "quiz-oop": {
    id: "oop-q5",
    type: "mcq",
    questionAr: "في البرمجة كائنية التوجه، الكائن object يجمع:",
    optionsAr: ["بيانات وسلوكاً", "شاشة وفأرة", "ملفات فقط", "ألواناً فقط"],
    correctIndex: 0,
    explainAr: "Data + methods = object.",
  },
};
