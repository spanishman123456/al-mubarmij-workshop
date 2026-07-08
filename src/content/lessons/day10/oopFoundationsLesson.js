/** البرمجة كائنية التوجه — اليوم 10 | pdfPageIndex 421–427 */
export const oopFoundationsLesson = {
  id: "oop-foundations",
  titleAr: "البرمجة كائنية التوجه في بايثون",
  pdfRefs: [
    { pdfPageIndex: 421, topic: "مراجعة مصطلحات OOP" },
    { pdfPageIndex: 423, topic: "تطبيقات Circle/Square" },
    { pdfPageIndex: 425, topic: "Class Value و __init__" },
  ],
  vocabularyAr: [
    { term: "Class", def: "قالب يحدد خصائص وسلوك الكائن." },
    { term: "Object", def: "نسخة فعلية من class." },
    { term: "__init__", def: "دالة تهيئة الكائن عند الإنشاء." },
    { term: "Method", def: "دالة مرتبطة بالكائن." },
    { term: "Attribute", def: "خاصية أو قيمة مخزنة داخل الكائن." },
  ],
  learningObjectives: [
    "تمييز الفرق بين class و object.",
    "كتابة class بسيطة تحتوي __init__ و method.",
    "حساب المساحة لكائنات Circle و Square.",
    "تتبع ناتج استدعاء methods على أكثر من كائن.",
  ],
  whyLearn:
    "تنظيم البرنامج بالكائنات يجعل الكود أوضح وأسهل في التوسعة، وهو أساس مهم لبناء تطبيقات كبيرة بدل ملفات مليئة بالدوال المتفرقة.",
  prerequisites: ["python-scope", "python-files-io", "functions"],
  conceptSimple:
    "بدل كتابة متغيرات منفصلة لكل كيان، نكتب class واحدة ثم ننشئ objects متعددة منها، وكل object يمتلك بياناته الخاصة وسلوكه.",
  deepSections: [
    {
      id: "oop-terms",
      titleAr: "مصطلحات OOP الأساسية",
      bodyAr:
        "في class BankAcct مثلًا: balance خاصية، و deposit/withdraw methods. كل حساب بنكي كائن مستقل حتى لو من نفس class.",
    },
    {
      id: "init-method",
      titleAr: "كيف تعمل __init__",
      bodyAr:
        "__init__ تستقبل self ومعاملات الإنشاء الأولى. عند كتابة x = Circle(3) تُخزَّن القيمة داخل self.rad ثم تستخدم في methods لاحقًا.",
    },
    {
      id: "multi-objects",
      titleAr: "أكثر من كائن لنفس الصف",
      bodyAr:
        "x و y من نفس class يمكن أن يملكا أرصدة مختلفة؛ لذلك نرى نفس method تعطي نتائج مختلفة حسب بيانات كل كائن.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد الصف", bodyAr: "اختر اسم class يعبر عن الكيان." },
    { titleAr: "2) اكتب __init__", bodyAr: "هيئ الخصائص الأساسية داخل self." },
    { titleAr: "3) أضف method", bodyAr: "مثل calcArea أو deposit." },
    { titleAr: "4) أنشئ كائنات", bodyAr: "Object لكل حالة بيانات مختلفة." },
    { titleAr: "5) اختبر النتائج", bodyAr: "استدع methods وتحقق من المخرجات." },
  ],
  workedExamples: [
    {
      id: "oop-ex-1",
      titleAr: "مساحة دائرة",
      difficulty: "سهل",
      steps: ["Circle(3)", "calcArea() = π×3²", "≈ 28.27"],
      result: "28.27",
    },
    {
      id: "oop-ex-2",
      titleAr: "حسابان بنكيان مستقلان",
      difficulty: "متوسط",
      steps: ["x.deposit(70) ثم x.withdraw(20)", "y.deposit(130) ثم y.withdraw(30)", "نتيجة x لا تؤثر في y"],
      result: "x=50, y=100",
    },
  ],
  commonMistakes: [
    { titleAr: "نسيان self", bodyAr: "أي method داخل class يجب أن يستقبل self كأول معامل." },
    { titleAr: "الخلط بين class و object", bodyAr: "class قالب، object نسخة حية من القالب." },
  ],
  guidedPractice: [
    { id: "g1", promptAr: "Square(side=4).calcArea() = ?", answer: "16", hints: ["4×4"] },
    { id: "g2", promptAr: "ما وظيفة __init__؟", answer: "تهيئة الكائن", hints: ["initial values"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "Circle(2).calcArea() ≈ ?", answer: "12.57", acceptedAnswers: ["12.57", "12.56"] },
    { id: "i2", promptAr: "Object هو _____ من class", answer: "نسخة", hints: ["instance"] },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "هل يمكن إنشاء أكثر من object لنفس class؟", answer: "نعم", hintAr: "instance متعددة" },
    ],
  },
  challengeAr: "اكتب class Value تحتوي a و b و method add() و operands() تعيد tuple.",
  summary:
    "OOP تعني بناء البرنامج كأصناف وكائنات. __init__ للتهيئة، وmethods للسلوك. هذه البنية تسهّل صيانة الكود وتوسعة المشاريع.",
  linkedActivity: "/lessons/oop-foundations#lab",
};
