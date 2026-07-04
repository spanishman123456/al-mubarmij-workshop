/**
 * النشاط التمهيدي — التحويلات (اليوم 2)
 * pdfPageIndex: 93–98
 */
export const conversionsIntroLesson = {
  id: "conversions-intro",
  titleAr: "النشاط التمهيدي: مراجعة التحويلات بين الأنظمة",
  pdfRefs: [{ pdfPageIndex: 93, topic: "نشاط تمهيدي تحويلات" }],
  learningObjectives: [
    "مراجعة التحويل العشري ↔ ثنائي ↔ hex من اليوم الأول.",
    "حل تحويلات سريعة كتمهيد قبل الخوارزميات.",
    "ربط الباقي % بالتحويل والشروط الزوجي/فردي.",
  ],
  whyLearn: "اليوم الثاني يبني على أنظمة العد — هذا النشاط يُفعّل ما حفظته قبل الدخول في الخوارزميات و if.",
  prerequisites: ["درس أنظمة العد `/lessons/number-systems`."],
  conceptSimple: "راجع: إلى عشري = ضرب أوزان وجمع. من عشري = قسمة متكررة وبواقي من الأسفل.",
  stepsDetailed: [
    { titleAr: "1) حدد الاتجاه", bodyAr: "إلى عشري أم من عشري؟" },
    { titleAr: "2) طبّق القاعدة", bodyAr: "جدول أو قسمة." },
    { titleAr: "3) تحقق", bodyAr: "عكس الاتجاه." },
    { titleAr: "4) سجّل", bodyAr: "دوّن خطأك إن وُجد." },
  ],
  workedExamples: [
    { id: "e1", titleAr: "1010₂ → عشري", steps: ["من اليمين: 1×8 + 0×4 + 1×2 + 0×1", "8+2 = 10"], result: "10" },
    { id: "e2", titleAr: "15₁₀ → ثنائي", steps: ["15→7r1→3r1→1r1→0r1", "1111 من الأسفل"], result: "1111" },
    { id: "e3", titleAr: "255₁₀ → hex", steps: ["255÷16=15r15 → FF", "F=15"], result: "FF" },
    { id: "e4", titleAr: "A₁₆ → عشري", steps: ["A = 10", "10₁₀"], result: "10" },
  ],
  interactiveExample: { type: "number-base-converter", defaultValue: "42", promptAr: "حوّل 42 عشرياً إلى ثنائي." },
  commonMistakes: [
    { titleAr: "قراءة البواقي معكوساً", bodyAr: "من الأعلى خطأ.", step: "order" },
    { titleAr: "digit غير صالح", bodyAr: "2 في ثنائي.", step: "digit" },
  ],
  quickCheck: {
    questions: [{ id: "q1", promptAr: "1111₂ = ?", answer: "15", hintAr: "8+4+2+1" }],
  },
  guidedPractice: [
    { id: "g1", promptAr: "1100₂ → ?", answer: "12", hints: ["8+4"] },
    { id: "g2", promptAr: "7₁₀ → ثنائي", answer: "111", hints: ["4+2+1"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "100000₂ → ?", answer: "32", hints: [] },
    { id: "i2", promptAr: "20₁₀ → ثنائي", answer: "10100", hints: [] },
  ],
  summary: "التحويلات أساس اليوم — راجع قبل الخوارزميات.",
  linkedActivity: "/simulations#number-converter",
};
