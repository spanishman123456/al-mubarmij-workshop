/**
 * الحساب في أنظمة العد — جمع وطرح
 * pdfPageIndex: 99–102
 */
export const baseArithmeticLesson = {
  id: "base-arithmetic",
  titleAr: "الحساب في أنظمة العد: الجمع والطرح",
  pdfRefs: [
    { pdfPageIndex: 99, topic: "الجمع في أساس 5" },
    { pdfPageIndex: 100, topic: "الجمع الست عشري" },
    { pdfPageIndex: 101, topic: "الجمع الثنائي" },
    { pdfPageIndex: 102, topic: "الطرح الثنائي" },
  ],
  learningObjectives: [
    "شرح مفهوم الحمل (carry) بحسب أساس النظام.",
    "تنفيذ الجمع في hex والأساس 5 والثنائي عمودياً.",
    "تنفيذ الطرح الثنائي مع الاستلاف (borrow).",
    "التحقق بتحويل الناتج إلى العشري.",
    "اكتشاف أخطاء الحمل وترتيب الخانات.",
  ],
  whyLearn:
    "الحاسب يجمع bits — فهم الجمع في كل أساس يربطك بعمليات ALU. hex مهم للألوان والذاكرة؛ الثنائي للدوائر؛ الأساس 5 تمرين PDF يثبت القاعدة العامة.",
  prerequisites: ["أنظمة العد والتحويلات", "القيمة المكانية"],
  conceptSimple:
    "في كل عمود: digit₁ + digit₂ + carry_in. إذا المجموع ≥ الأساس → carry_out = floor(sum/base)، digit = sum mod base. الطرح: إن top < bottom استلف 1 من العمود الأيسر (= +base).",
  deepSections: [
    { id: "carry", titleAr: "الحمل حسب الأساس", bodyAr: "في hex: 9+8=17 → digit 1 carry 1. في base 5: 4+4=8 → digit 3 carry 1. في binary: 1+1=2 → digit 0 carry 1." },
    { id: "hex", titleAr: "جمع hex", bodyAr: "A+D=17→1 carry 1. 1+F+1=17… اكتب من اليمين." },
    { id: "base5", titleAr: "جمع أساس 5", bodyAr: "23₅ + 14₅ = 42₅ (22₁₀): 3+4=7→2 c1، 2+1+1=4، 1." },
    { id: "binary-add", titleAr: "جمع ثنائي", bodyAr: "1011 + 1101: 1+1=0 carry1، 1+0+1=0 carry1…" },
    { id: "binary-sub", titleAr: "طرح ثنائي", bodyAr: "1101−101: من اليمين، borrow عند الحاجة. unsigned: minuend ≥ subtrahend." },
    { id: "verify", titleAr: "التحقق", bodyAr: "حوّل كلا العددين والناتج عشرياً — يجب أن يتطابق a+b أو a−b." },
  ],
  stepsDetailed: [
    { titleAr: "1) محاذاة الأعداد", bodyAr: "من اليمين — pad أصفار يساراً." },
    { titleAr: "2) من عمود الآحاد", bodyAr: "digit + digit + carry_in." },
    { titleAr: "3) سجّل digit و carry_out", bodyAr: "sum mod base." },
    { titleAr: "4) كرّر يساراً", bodyAr: "حتى تنتهي الأرقام + carry." },
    { titleAr: "5) للطرح: borrow", bodyAr: "إن top < bottom: +base و borrow=1 للعمود التالي." },
    { titleAr: "6) تحقق عشرياً", bodyAr: "إلزامي." },
  ],
  workedExamples: [
    { id: "hex1", titleAr: "A3₁₆ + 5D₁₆", steps: ["3+D=16→0 c1", "A+5+1=16→0 c1", "1", "100₁₆"], result: "100" },
    { id: "b5", titleAr: "23₅ + 14₅", steps: ["3+4=7→2 c1", "2+1+1=4", "1", "42₅"], result: "42" },
    { id: "bin1", titleAr: "1011₂ + 1101₂", steps: ["1+1=0 c1", "1+0+1=0 c1", "0+1+1=0 c1", "1+1+1=1", "11000₂"], result: "11000" },
    { id: "binsub", titleAr: "1101₂ − 101₂", steps: ["1−1=0", "0−0=0", "1−1=0", "1−0=1", "1000₂"], result: "1000" },
    { id: "verify1", titleAr: "تحقق: 11000₂", steps: ["16+8=24", "1011=11, 1101=13, 11+13=24 ✓"], result: "24" },
  ],
  interactiveExample: { type: "base-arithmetic-lab", defaultValue: "1011+1101", promptAr: "جرّب جمعاً ثنائياً أو hex." },
  commonMistakes: [
    { titleAr: "نسيان carry", bodyAr: "1+1=0 وليس 2 في binary.", step: "carry" },
    { titleAr: "borrow معكوس", bodyAr: "الاستلاف من اليسار لا اليمين.", step: "borrow" },
    { titleAr: "hex > F", bodyAr: "digit غير صالح.", step: "digit" },
    { titleAr: "عدم المحاذاة", bodyAr: "الأرقام غير محاذية من اليمين.", step: "align" },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "1+1 في binary digit؟", answer: "0", hintAr: "carry 1" },
      { id: "q2", promptAr: "F+1 hex (digit)؟", answer: "0", hintAr: "carry" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "111₂ + 1₂ = ?", answer: "1000", hints: ["carry chain"] },
    { id: "g2", promptAr: "10₅ + 10₅ = ?", answer: "20", hints: ["2+2=4"] },
    { id: "g3", promptAr: "1000₂ − 11₂ = ?", answer: "101", hints: ["borrow"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "FF₁₆ + 1₁₆ = ?", answer: "100", hints: [] },
    { id: "i2", promptAr: "44₅ + 11₅ = ?", answer: "100", hints: [] },
    { id: "i3", promptAr: "1010₂ + 1010₂ = ?", answer: "10100", hints: [] },
    { id: "i4", promptAr: "10000₂ − 1₂ = ?", answer: "1111", hints: [] },
  ],
  summary: "الجمع: sum mod base + carry. الطرح: borrow. تحقق عشرياً دائماً.",
  linkedActivity: "/lessons/twos-complement",
};
