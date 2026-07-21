/** إخفاء المعلومات — اليوم 10 | pdfPageIndex 436–440 */
export const steganographyLesson = {
  id: "steganography-python",
  titleAr: "إخفاء المعلومات وفك التشفير بالبتات",
  pdfRefs: [
    { pdfPageIndex: 436, topic: "مقدمة steganography" },
    { pdfPageIndex: 437, topic: "ASCII + null terminator" },
    { pdfPageIndex: 439, topic: "bitwise OR و bit shifting" },
  ],
  vocabularyAr: [
    { term: "Steganography", def: "إخفاء رسالة داخل وسيط آخر (نص/صورة) دون لفت الانتباه." },
    { term: "حمولة (Payload)", def: "الرسالة السرية المراد إخفاؤها." },
    { term: "Carrier", def: "النص أو الصورة التي تحمل الحمولة." },
    { term: "ASCII", def: "ترميز حروف إلى أرقام ثنائية." },
    { term: "Bitwise OR", def: "عامل دمج بتات في بايثون يُكتب |." },
  ],
  learningObjectives: [
    "شرح الفرق بين التشفير وإخفاء المعلومات.",
    "تحويل نص قصير إلى بتات ASCII.",
    "استخراج بتات الرسالة من حامل نصي.",
    "التوقف عند null في فك الرسالة.",
  ],
  whyLearn:
    "هذا الدرس يربط مفاهيم اليوم الأول (ASCII والبتات) مع أمن المعلومات عمليًا، ويُظهر كيف تُخفى البيانات داخل وسائط عادية.",
  prerequisites: ["ascii-unicode", "caesar-cipher", "python-for-range"],
  conceptSimple:
    "نقرأ الحروف واحدًا واحدًا، ونحوّل نمطًا بسيطًا (مثل Upper/Lower) إلى 0 و1، ثم نجمع كل 8 بت لنستعيد حرفًا ASCII حتى نصل لقيمة null.",
  deepSections: [
    {
      id: "crypto-vs-stego",
      titleAr: "التشفير أم الإخفاء؟",
      bodyAr:
        "التشفير يخفي معنى الرسالة، أما steganography فيخفي وجود الرسالة نفسها داخل وسيط يبدو طبيعيًا.",
    },
    {
      id: "ascii-payload",
      titleAr: "بناء الحمولة ASCII",
      bodyAr:
        "الحرف T مثلًا يساوي 01010100. نجمع البتات للحروف بالتسلسل ونضيف null (00000000) كعلامة نهاية.",
    },
    {
      id: "extract-loop",
      titleAr: "خوارزمية الاستخراج",
      bodyAr:
        "مرّ على كل حرف في الحامل: إن كان حرفًا أبجديًا اجمع 0/1 حسب الحالة. بعدها اقسم السلسلة لمجموعات 8 بت وحوّلها إلى أحرف.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد طريقة الإخفاء", bodyAr: "مثال: uppercase=0 و lowercase=1." },
    { titleAr: "2) استخرج سلسلة البتات", bodyAr: "اجمع البتات من الحروف الأبجدية فقط." },
    { titleAr: "3) قسّم كل 8 بت", bodyAr: "كل 8 بت تمثل حرف ASCII واحدًا." },
    { titleAr: "4) حوّل للأحرف", bodyAr: "binary -> int -> chr." },
    { titleAr: "5) أوقف عند null", bodyAr: "00000000 يعني نهاية الرسالة." },
  ],
  workedExamples: [
    {
      id: "stego-ex-1",
      titleAr: "فك البتات إلى كلمة",
      difficulty: "متوسط",
      steps: ["01010100=84='T'", "01100101='e'", "01100001='a'", "01100011='c'", "01101000='h'"],
      result: "Teach",
    },
    {
      id: "stego-ex-2",
      titleAr: "عامل OR",
      difficulty: "سهل",
      steps: ["5=0101", "6=0110", "0101|0110=0111", "الناتج 7"],
      result: "7",
    },
  ],
  commonMistakes: [
    { titleAr: "نسيان null", bodyAr: "بدون null قد يستمر فك الرسالة في بيانات غير مقصودة." },
    { titleAr: "حساب الرموز غير الأبجدية", bodyAr: "المسافات وعلامات الترقيم غالبًا لا تحمل بتات الحمولة." },
  ],
  guidedPractice: [
    { id: "g1", promptAr: "ASCII للحرف A؟", answer: "65", hints: ["01000001"] },
    { id: "g2", promptAr: "5 | 6 = ?", answer: "7", hints: ["0101|0110"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "null في ASCII يساوي؟", answer: "0", hints: ["00000000"] },
    { id: "i2", promptAr: "ما اسم الرسالة المخفية؟", answer: "payload", acceptedAnswers: ["payload", "حمولة"] },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "هل steganography = encryption؟", answer: "لا", hintAr: "فرق الهدف" },
    ],
  },
  challengeAr: "اكتب دالة بايثون تستخرج رسالة مخفية من نص حامل وتنهي عند null.",
  summary:
    "إخفاء المعلومات يستخدم وسيطًا عاديًا لحمل رسالة سرية. الأساس الحسابي يعتمد على البتات، ASCII، وعمليات OR/Shift.",
  linkedActivity: "/lessons/steganography-python#lab",
};
