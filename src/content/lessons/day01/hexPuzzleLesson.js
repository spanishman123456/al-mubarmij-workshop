/**
 * أحجية تحويل النظام الست عشري — اليوم 1
 * pdfPageIndex: 50–51
 */
export const hexPuzzleLesson = {
  id: "hex-puzzle",
  titleAr: "أحجية تحويل النظام الست عشري",
  pdfRefs: [{ pdfPageIndex: 50, topic: "20 دقيقة تحويل hex" }],
  learningObjectives: [
    "تحويل عشري ↔ hex بخانتين لكل byte.",
    "حل ألغاز PDF لأعداد مثل 255، 68، 10.",
    "ربط hex بـ RGB في الألوان.",
    "التحقق العكسي.",
  ],
  whyLearn: "أحجية PDF تسبق درس الألوان — إذا أتقنت hex هنا، #FF0000 يصبح واضحاً.",
  prerequisites: ["أنظمة العد — أساس 16"],
  conceptSimple: "68₁₀ → قسمة: 68÷16=4r4 → 44₁₆. عكساً: 4×16+4=68.",
  stepsDetailed: [
    { titleAr: "1) عشري → hex", bodyAr: "قسمة متكررة على 16." },
    { titleAr: "2) hex → عشري", bodyAr: "ضرب منزلة ×16 + جمع." },
    { titleAr: "3) A–F", bodyAr: "10=A … 15=F." },
    { titleAr: "4) تحقق", bodyAr: "حوّل عكسياً." },
  ],
  workedExamples: [
    { id: "h-255", titleAr: "255 → FF", steps: ["255÷16=15r15", "15=F → FF"], result: "FF" },
    { id: "h-68", titleAr: "68 → 44", steps: ["68÷16=4r4", "4×16+4=68"], result: "44" },
  ],
  interactiveExample: { type: "hex-puzzle", defaultValue: "68" },
  commonMistakes: [
    { titleAr: "خانة واحدة", bodyAr: "10 → 0A وليس A." },
    { titleAr: "A=10", bodyAr: "A hex = 10 decimal." },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "10₁₀ hex؟", answer: "0A", hintAr: "A=10" },
      { id: "q2", promptAr: "FF hex عشري؟", answer: "255", hintAr: "15×16+15" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "15₁₀ hex", answer: "0F", hints: [] },
    { id: "g2", promptAr: "FF hex عشري", answer: "255", hints: ["15×16+15"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "100₁₀ hex", answer: "64", hints: [] },
    { id: "i2", promptAr: "2A hex عشري", answer: "42", hints: ["2×16+10"] },
  ],
  summary: "أحجية hex تثبت التحويل قبل تطبيق الألوان.",
  linkedActivity: "/lessons/hex-colors",
};
