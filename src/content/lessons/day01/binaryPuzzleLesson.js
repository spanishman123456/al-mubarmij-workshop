/**
 * أحجية الأرقام الثنائية — اليوم 1
 * pdfPageIndex: 70–76 (printed ~4–53)
 */
export const binaryPuzzleLesson = {
  id: "binary-puzzle",
  titleAr: "أحجية الأرقام الثنائية",
  pdfRefs: [
    { pdfPageIndex: 70, topic: "أحجية أعداد طويلة" },
    { pdfPageIndex: 76, topic: "تحويل إلى النظام الثنائي" },
  ],
  learningObjectives: [
    "قراءة عدد ثنائي طويل وتحويله إلى عشري خطوة بخطوة.",
    "التعرف على أن كل خانة ثنائية = قوة للعدد 2.",
    "حل ألغاز PDF بأعداد من 8–16 bit.",
    "التحقق العكسي من الحل.",
  ],
  whyLearn: "أحجية PDF تُعرّفك على أعداد ثنائية طويلة كما في الذاكرة — ليس 4 bits فقط بل 16+ bit.",
  prerequisites: ["درس أنظمة العد", "بطاقات ثنائية unplugged"],
  conceptSimple:
    "كل أحجية تعطيك عدداً ثنائياً طويلاً. حوّله للعشري بجدول المنازل: من اليمين 2⁰، 2¹، 2²… ثم اجمع فقط حيث الرقم 1.",
  stepsDetailed: [
    { titleAr: "1) اقرأ العدد من اليمين", bodyAr: "حدد منزلة 0، 1، 2…" },
    { titleAr: "2) اكتب قيمة كل منzلة", bodyAr: "1→الوزن، 0→تجاهل." },
    { titleAr: "3) اجمع", bodyAr: "المجموع = العشري." },
    { titleAr: "4) تحقق", bodyAr: "حوّل العشري ثنائياً — يجب أن تحصل على نفس العدد." },
  ],
  workedExamples: [
    {
      id: "puzzle-8bit",
      titleAr: "مثال: 10110110₂",
      steps: ["128+32+16+4+2 = 182", "تحقق: 182₁₀ → 10110110₂"],
      result: "182",
    },
    {
      id: "puzzle-short",
      titleAr: "مثال: 11011₂",
      steps: ["من اليمين: 1+2+8+16", "1×1 + 1×2 + 0×4 + 1×8 + 1×16", "27"],
      result: "27",
    },
  ],
  interactiveExample: { type: "binary-puzzle", defaultValue: "10110110" },
  commonMistakes: [
    { titleAr: "العد من اليسار", bodyAr: "ابدأ من اليمين (منزلة 0)." },
    { titleAr: "جمع كل الأرقام كأرقام", bodyAr: "1+0+1 ≠ 2 — استخدم الأوزان." },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "1111₂ = ?", answer: "15", hintAr: "8+4+2+1" },
      { id: "q2", promptAr: "101000₂ = ?", answer: "40", hintAr: "32+8" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "1001₂ = ?", answer: "9", hints: ["8+1"] },
    { id: "g2", promptAr: "101010₂ = ?", answer: "42", hints: ["32+8+2"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "11100101₂ = ?", answer: "229", hints: ["128+64+32+4+1"] },
    { id: "i2", promptAr: "10000000₂ = ?", answer: "128", hints: ["2^7"] },
  ],
  summary: "الأحجية تدربك على قراءة ثنائي طويل — نفس مهارة تحليل bytes في الحاسب.",
  linkedActivity: "/lessons/number-systems",
};
