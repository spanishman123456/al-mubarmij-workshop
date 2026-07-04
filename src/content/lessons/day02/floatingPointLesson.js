/**
 * الأعداد ذات الفاصلة العائمة — مقدمة مناسبة للمرحلة
 * pdfPageIndex: 106
 */
export const floatingPointLesson = {
  id: "floating-point",
  titleAr: "الأعداد ذات الفاصلة العائمة",
  pdfRefs: [{ pdfPageIndex: 106, topic: "Floating point" }],
  learningObjectives: [
    "شرح لماذا int لا يكفي للكسر والأعداد الكبيرة جداً.",
    "تمييز int و float في بايثون.",
    "فهم sign × mantissa × 2^exponent على مستوى مبسّط.",
    "معرفة حدود الدقة (0.1+0.2).",
    "قراءة أعداد علمية 1.5e10.",
  ],
  whyLearn: "العلوم والرسومات تحتاج float. فهم التقريب يمنع مفاجآت في المقارنات.",
  prerequisites: ["بايثون: int/float", "الأسس"],
  conceptSimple:
    "float يخزّن عدداً ≈ mantissa × 2^exponent. بايثون: 3.14، 2e5. int: 42 بدون كسر. 0.1+0.2 ≠ 0.3 بالضبط — تقريب ثنائي.",
  deepSections: [
    { id: "why", titleAr: "لماذا float؟", bodyAr: "مساحة محدودة — نضحي بدقة لمدى أوسع." },
    { id: "parts", titleAr: "الأجزاء", bodyAr: "إشارة + أس + جزء significand (مبسّط)." },
    { id: "int-vs", titleAr: "int vs float", bodyAr: "5 vs 5.0 — type مختلف." },
    { id: "big-small", titleAr: "كبير/صغير", bodyAr: "1.5e10 = 15 مليار." },
    { id: "precision", titleAr: "حدود الدقة", bodyAr: "لا تعتمد == مع float — استخدم abs(a-b)<epsilon." },
  ],
  stepsDetailed: [
    { titleAr: "1) type()", bodyAr: "type(3.0) → float." },
    { titleAr: "2) قسمة", bodyAr: "5/2=2.5 float." },
    { titleAr: "3) scientific", bodyAr: "1e-3 = 0.001." },
    { titleAr: "4) مقارنة", bodyAr: "round أو epsilon." },
  ],
  workedExamples: [
    { id: "e1", titleAr: "int vs float", code: "type(5)\ntype(5.0)", steps: ["int", "float"], result: "int, float" },
    { id: "e2", titleAr: "0.1+0.2", code: "print(0.1+0.2)\nprint(0.1+0.2==0.3)", steps: ["0.30000000000000004", "False"], result: "تقريب" },
    { id: "e3", titleAr: "scientific", code: "x = 1.5e10\nprint(x)", steps: ["1.5 × 10¹⁰", "15000000000.0"], result: "1.5e10" },
    { id: "e4", titleAr: "epsilon compare", code: "abs(0.1+0.2-0.3) < 1e-9", steps: ["0.1+0.2≠0.3", "abs diff < epsilon → True"], result: "ok" },
  ],
  interactiveExample: { type: "if-lab", defaultValue: "print(0.1+0.2)\nprint(type(3.14))" },
  commonMistakes: [
    { titleAr: "float==", bodyAr: "0.1+0.2==0.3 False.", step: "compare" },
    { titleAr: "int division", bodyAr: "5/2 float في Py3.", step: "divide" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "type(2.0)?", answer: "float", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "1e3 = ?", answer: "1000", hints: [] },
    { id: "g2", promptAr: "5/2 in Py3?", answer: "2.5", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "int(3.9)?", answer: "3", hints: [] },
    { id: "i2", promptAr: "float(5)?", answer: "5.0", hints: [] },
  ],
  summary: "float للكسور والمدى — احذر التقريب والمقارنة.",
  linkedActivity: "/lessons/python-arrays",
};
