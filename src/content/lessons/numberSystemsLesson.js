/**
 * درس أنظمة العد — النسخة الكاملة
 * pdfPage: 32, 33, 34, 77, 78 | printedPage: 13, 10, 14, 54, 55
 */

export const numberSystemsLesson = {
  id: "number-systems",
  titleAr: "أنظمة العد والتحويل بينها",
  pdfRefs: [
    { pdfPage: 32, printedPage: 13, topic: "جدول الأنظمة والقيمة المكانية" },
    { pdfPage: 33, printedPage: 10, topic: "تحويل ثنائي↔عشري" },
    { pdfPage: 34, printedPage: 14, topic: "تحويل لأي أساس" },
    { pdfPage: 77, printedPage: 54, topic: "تطبيقات التحويل" },
    { pdfPage: 78, printedPage: 55, topic: "إجابات التطبيقات" },
  ],
  learningObjectives: [
    "شرح معنى «نظام العد» و«الأساس» وربطهما بعدد الرموز المستخدمة.",
    "توضيح سبب اختلاف الرموز بين الأنظمة (2، 3، 8، 10، 16).",
    "بناء جدول القيمة المكانية وتحديد قوة كل منزلة.",
    "تطبيق الضرب في قوى الأساس ثم الجمع للتحويل إلى العشري.",
    "تطبيق القسمة المتكررة وقراءة البواقي من الأسفل إلى الأعلى.",
    "التمييز بين التحويل المباشر (ثنائي↔ثماني/hex) وغير المباشر (عبر العشري).",
    "التحقق العكسي من كل ناتج والتعامل مع الأصفار البادئة.",
  ],
  whyLearn:
    "كل bit في الذاكرة إما 0 أو 1. عندما تقرأ «1 KB = 1024 بايت» فأنت ترى أثر النظام الثنائي (2¹⁰). عندما تكتب لوناً #FF0000 فأنت تستخدم الست عشري. بدون فهم الأنظمة، تبدو هذه الأرقام عشوائية — ومع الفهم تصبح منطقية وقابلة للحساب.",
  prerequisites: [
    "جمع وضرب وقسمة الأعداد الصحيحة.",
    "فهم الأسس: 2³ يعني 2×2×2 = 8.",
    "ترتيب المنازل في العدد العشري (آحاد، عشرات، مئات).",
  ],
  conceptSimple:
    "نظام العد طريقة لتمثيل الكميات برموز. الأساس b يعني: (1) لدينا b رمزاً مختلفاً فقط، (2) كل منزلة قيمتها b مرفوعة لأس رقم المنزلة. مثال: في العشري المنزلة 0 = 1، المنزلة 1 = 10، المنزلة 2 = 100. في الثنائي: 1، 2، 4، 8، 16…",
  deepSections: [
    {
      id: "base-meaning",
      titleAr: "معنى نظام العد والأساس",
      bodyAr:
        "الأساس هو «عدد الرموز» في النظام. في الأساس 10 نستخدم ten digits: 0–9. عندما نكتب 573 فإننا نجمع: 5×100 + 7×10 + 3×1. الحاسب يستخدم الأساس 2 لأن الدوائر الإلكترونية حالتان فقط: تيار أو لا تيار. الأساس 16 اختصار لكتابة long binary: كل hex digit = 4 bits.",
    },
    {
      id: "why-symbols",
      titleAr: "لماذا تختلف الرموز بين الأنظمة؟",
      bodyAr:
        "لأن كل نظام يسمح فقط بقيم digit أقل من الأساس. في الثنائي لا معنى للرقم 2 — أعلى قيمة 1. في الأساس 8 الرموز 0–7. عندما نحتاج قيمة ≥10 في hex نستخدم حروف A–F لتمثيل 10–15. هذا ليس «حروفاً عشوائية» بل أرقام بصيغة مختلفة.",
    },
    {
      id: "place-value",
      titleAr: "القيمة المكانية",
      bodyAr:
        "موقع الرقم يحدد وزنه. من اليمين: المنزلة 0، 1، 2… قيمة المنزلة i = b^i. الرقم في هذه المنزلة يُضرب في هذا الوزن. مثال 10101₂: المنزلة 0 فيها 1×1، المنزلة 2 فيها 1×4، المنزلة 4 فيها 1×16.",
    },
    {
      id: "multiply-powers",
      titleAr: "لماذا نضرب في قوى الأساس؟",
      bodyAr:
        "لأن كل منزلة يساراً = منزلة سابقة × الأساس. في العشري: منزلة العشرات = 10×الآحاد. في الثنائي: منزلة 4 = 2×منزلة 2. الضرب في b^i يطبّق هذا القانون رياضياً.",
    },
    {
      id: "summation",
      titleAr: "كيف نجمع للوصول إلى العشري؟",
      bodyAr:
        "نأخذ كل digit × وزن منزلته ونجمع. 10101₂ = 16+4+1 = 21. لا نجمع الأرقام كأنها عشري (10101 ≠ ten thousand…) — نجمع الأوزان.",
    },
    {
      id: "repeated-division",
      titleAr: "القسمة المتكررة",
      bodyAr:
        "لتحويل عشري → أساس b: قسّم على b، سجّل الباقي، كرّر على الناتج الصحيح حتى 0. الباقي في كل خطوة = digit في النظام الجديد.",
    },
    {
      id: "remainder-order",
      titleAr: "لماذا نقرأ البواقي من الأسفل إلى الأعلى؟",
      bodyAr:
        "أول باقٍ = أقل منزلة (يمين)، آخر باقٍ = أعلى منزلة (يسار). مثل كتابة العشري من اليمين لليسار. قراءة من الأعلى خطأ شائع يعكس العدد.",
    },
    {
      id: "reverse-verify",
      titleAr: "التحقق العكسي",
      bodyAr:
        "بعد التحويل، حوّل الناتج إلى العشري. إذا حصلت على العدد الأصلي فالحل صحيح. مثال: 1000100₂ → 68 ✓.",
    },
    {
      id: "direct-vs-indirect",
      titleAr: "مباشر وغير مباشر",
      bodyAr:
        "غير مباشر: أي نظام → عشري → نظام آخر (يعمل دائماً). مباشر: ثنائي↔ثماني (3 bits)، ثنائي↔hex (4 bits) — أسرع لأن 8=2³ و16=2⁴.",
    },
  ],
  stepsDetailed: [
    {
      titleAr: "1) حدّد الأساس والرموز المسموحة",
      bodyAr: "اكتب b وقائمة الرموز 0…(b−1). تحقق أن كل digit في العدد ضمن القائمة.",
    },
    {
      titleAr: "2) للتحويل إلى العشري: جدول المنازل",
      bodyAr: "من اليمين، اكتب b⁰, b¹, b²… ضع digit فوق كل منزلة.",
    },
    {
      titleAr: "3) اضرب digit × قيمة المنزلة",
      bodyAr: "كل صف في الجدول: product = digitValue × powerValue.",
    },
    {
      titleAr: "4) اجمع products",
      bodyAr: "المجموع = القيمة العشرية.",
    },
    {
      titleAr: "5) للتحويل من العشري: قسّم متكرراً",
      bodyAr: "n ÷ b → quotient, remainder. سجّل remainder كـ digit.",
    },
    {
      titleAr: "6) اقرأ remainders من الأسفل",
      bodyAr: "آخر remainder = أقصى اليسار في الناتج.",
    },
    {
      titleAr: "7) تحقق عكسياً",
      bodyAr: "حوّل الناتج إلى عشري وقارن.",
    },
    {
      titleAr: "8) للثنائي↔ثماني/hex: جمّع البتات",
      bodyAr: "3 أو 4 bits من اليمين → digit واحد.",
    },
  ],
  systemsTable: [
    { nameAr: "ثنائي", base: 2, digits: "0, 1", whyAr: "حالتان في الدائرة: 0/1" },
    { nameAr: "ثلاثي", base: 3, digits: "0, 1, 2", whyAr: "تمرين نظري — ثلاث حالات" },
    { nameAr: "خماسي", base: 5, digits: "0–4", whyAr: "مثال PDF: 38→123₅" },
    { nameAr: "ثماني", base: 8, digits: "0–7", whyAr: "3 bits = رقم octal" },
    { nameAr: "عشري", base: 10, digits: "0–9", whyAr: "نظامنا اليومي" },
    { nameAr: "ست عشري", base: 16, digits: "0–9, A–F", whyAr: "4 bits = رقم hex" },
  ],
  workedExamples: [
    {
      id: "bin-10101",
      titleAr: "مثال 1 (سهل): 10101₂ → عشري",
      input: "10101",
      base: 2,
      difficulty: "easy",
      placeValue: { mode: "toDecimal", value: "10101", base: 2 },
      steps: [
        "حدد الأساس 2 — الرموز 0 و1 فقط.",
        "من اليمين: منازل 0..4 بقيم 1,2,4,8,16.",
        "1×16 + 0×8 + 1×4 + 0×2 + 1×1 = 21.",
      ],
      result: "21",
    },
    {
      id: "bin-1111",
      titleAr: "مثال 2 (سهل): 1111₂ → عشري",
      input: "1111",
      base: 2,
      difficulty: "easy",
      placeValue: { mode: "toDecimal", value: "1111", base: 2 },
      steps: ["من اليمين: 1×1 + 1×2 + 1×4 + 1×8", "8+4+2+1 = 15"],
      result: "15",
    },
    {
      id: "dec-68-bin",
      titleAr: "مثال 3 (متوسط): 68₁₀ → ثنائي",
      input: "68",
      targetBase: 2,
      difficulty: "medium",
      placeValue: { mode: "fromDecimal", value: "68", base: 2 },
      steps: ["68→34r0→17r0→8r1→4r0→2r0→1r0→0r1", "الناتج 1000100₂", "تحقق: 64+4=68"],
      result: "1000100",
    },
    {
      id: "dec-38-bin",
      titleAr: "مثال 4 (متوسط): 38₁₀ → ثنائي",
      input: "38",
      targetBase: 2,
      difficulty: "medium",
      placeValue: { mode: "fromDecimal", value: "38", base: 2 },
      steps: ["38→19r0→9r1→4r1→2r0→1r0→0r1", "100110₂", "32+4+2=38"],
      result: "100110",
    },
    {
      id: "dec-42-base3",
      titleAr: "مثال 5 (متقدم): 42₁₀ → أساس 3",
      input: "42",
      targetBase: 3,
      difficulty: "hard",
      placeValue: { mode: "fromDecimal", value: "42", base: 3 },
      steps: ["42→14r0→4r2→1r1→0r1", "1120₃", "27+9+6=42"],
      result: "1120",
    },
    {
      id: "dec-38-base5",
      titleAr: "مثال 6 (متقدم): 38₁₀ → أساس 5",
      input: "38",
      targetBase: 5,
      difficulty: "hard",
      placeValue: { mode: "fromDecimal", value: "38", base: 5 },
      steps: ["38→7r3→1r2→0r1", "123₅", "25+10+3=38"],
      result: "123",
    },
    {
      id: "bin-101101-oct",
      titleAr: "مثال 7 (مباشر): 101101₂ → ثماني",
      input: "101101",
      base: 2,
      difficulty: "hard",
      steps: ["قسّم 101101 من اليمين: 101 | 101", "001→1، 101→5", "الناتج 55₈"],
      result: "55",
      direct: "binary-octal",
    },
    {
      id: "bin-101101-hex",
      titleAr: "مثال 8 (مباشر): 101101₂ → hex",
      input: "101101",
      base: 2,
      difficulty: "hard",
      steps: ["101101 → 0010 | 1101", "2 | D", "الناتج 2D₁₆"],
      result: "2D",
      direct: "binary-hex",
    },
  ],
  interactiveExample: {
    type: "number-base-converter",
    defaultFrom: 10,
    defaultTo: 2,
    defaultValue: "68",
    promptAr: "حوّل 68 عشرياً إلى ثنائي، ثم تحقق عكسياً.",
  },
  commonMistakes: [
    { titleAr: "قراءة البواقي من الأعلى", bodyAr: "يعكس ترتيب digits — خطأ remainder_order.", step: "fromDecimal" },
    { titleAr: "digit 2 في الثنائي", bodyAr: "غير صالح — خطأ invalid_digit.", step: "validation" },
    { titleAr: "جمع digits كعشري", bodyAr: "10101 ≠ 10101 عشري — خطأ wrong_sum.", step: "toDecimal" },
    { titleAr: "نسيان padding في التجميع", bodyAr: "أضف أصفاراً يساراً لجعل bits مضاعف 3 أو 4.", step: "direct" },
    { titleAr: "A في hex = «حرف»", bodyAr: "A=10 — خطأ symbol_confusion.", step: "hex" },
  ],
  hints: [
    "حدد الأساس أولاً.",
    "اكتب جدول المنازل قبل الحساب.",
    "في القسمة: الباقي = digit، الناتج = ما تُقسمه في الخطوة التالية.",
    "تحقق دائماً بالتحويل العكسي.",
  ],
  quickCheck: {
    questions: [
      { id: "qc1", promptAr: "10101₂ = ?", answer: "21", hintAr: "16+4+1" },
      { id: "qc2", promptAr: "102₂ صالح؟", answer: "لا", hintAr: "أساس 2" },
      { id: "qc3", promptAr: "68₁₀ ثنائي؟", answer: "1000100", hintAr: "قسمة متكررة" },
      { id: "qc4", promptAr: "F₁₆ = ?", answer: "15", hintAr: "hex digits" },
    ],
  },
  guidedPractice: [
    {
      id: "gp1",
      promptAr: "5₁₀ → ثنائي (خطوة بخطوة)",
      answer: "101",
      kind: "fromDecimal",
      base: 2,
      hints: ["5÷2=2r1", "2÷2=1r0", "1÷2=0r1", "اقرأ: 101"],
    },
    {
      id: "gp2",
      promptAr: "13₁₀ → ثنائي",
      answer: "1101",
      kind: "fromDecimal",
      base: 2,
      hints: ["13÷2=6r1", "6÷2=3r0", "3÷2=1r1", "1÷2=0r1"],
    },
    {
      id: "gp3",
      promptAr: "1101₂ → عشري",
      answer: "13",
      kind: "toDecimal",
      base: 2,
      hints: ["8+4+0+1", "13"],
    },
    {
      id: "gp4",
      promptAr: "1111₂ → عشري",
      answer: "15",
      kind: "toDecimal",
      base: 2,
      hints: ["8+4+2+1"],
    },
    {
      id: "gp5",
      promptAr: "17₁₀ → أساس 5",
      answer: "32",
      kind: "fromDecimal",
      base: 5,
      hints: ["17÷5=3r2", "3÷5=0r3"],
    },
  ],
  independentPractice: [
    { id: "ip1", promptAr: "25₁₀ → ثنائي", answer: "11001", kind: "fromDecimal", base: 2, hints: ["25÷2…"] },
    { id: "ip2", promptAr: "101101₂ → عشري", answer: "45", kind: "toDecimal", base: 2, hints: ["32+8+4+1"] },
    { id: "ip3", promptAr: "100₁₀ → hex", answer: "64", kind: "fromDecimal", base: 16, hints: ["256÷16…"] },
    { id: "ip4", promptAr: "77₈ → عشري", answer: "63", kind: "toDecimal", base: 8, hints: ["7×8+7"] },
    { id: "ip5", promptAr: "29₁₀ → ثنائي", answer: "11101", kind: "fromDecimal", base: 2, hints: [] },
    { id: "ip6", promptAr: "1111111₂ → عشري", answer: "127", kind: "toDecimal", base: 2, hints: [] },
  ],
  challenge: [
    { id: "ch1", promptAr: "101101₂ → oct مباشرة", answer: "55", hints: ["3 bits"] },
    { id: "ch2", promptAr: "2D₁₆ → عشري", answer: "45", hints: ["2×16+13"] },
  ],
  summary:
    "الأساس يحدد الرموز وقيم المنازل. للعشري: ضرب واجمع. من العشري: قسّم واجمع البواقي من الأسفل. تحقق عكسياً. ثنائي↔oct/hex بالتجميع.",
  linkedActivity: "/simulations#number-converter",
};
