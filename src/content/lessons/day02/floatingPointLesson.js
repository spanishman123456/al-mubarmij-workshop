/**
 * الأعداد ذات الفاصلة العائمة — عمق + تمارين دقة
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
    "مقارنة float بأمان باستخدام epsilon.",
    "تمييز أخطاء المقارنة والتقريب.",
  ],
  whyLearn: "العلوم والرسومات تحتاج float. فهم التقريب يمنع مفاجآت في المقارنات.",
  prerequisites: ["بايثون: int/float", "الأسس"],
  conceptSimple:
    "float يخزّن عدداً ≈ mantissa × 2^exponent. بايثون: 3.14، 2e5. int: 42 بدون كسر. 0.1+0.2 ≠ 0.3 بالضبط — تقريب ثنائي.",
  deepSections: [
    { id: "why", titleAr: "لماذا float؟", bodyAr: "مساحة محدودة — نضحي بدقة لمدى أوسع. π و 0.333… لا تُمثل بدقة في ثنائي." },
    { id: "parts", titleAr: "الأجزاء", bodyAr: "إشارة + أس (exponent) + جزء significand (mantissa مبسّط)." },
    { id: "int-vs", titleAr: "int vs float", bodyAr: "5 int — عدد صحيح. 5.0 float — عدد عشري. type(5)≠type(5.0)." },
    { id: "big-small", titleAr: "كبير/صغير", bodyAr: "1.5e10 = 15 مليار. 1e-6 = 0.000001 — نفس الفكرة." },
    { id: "precision", titleAr: "حدود الدقة", bodyAr: "bits محدودة → بعض العشريات تقريب. لا تعتمد == مع float." },
    { id: "compare-safe", titleAr: "مقارنة آمنة", bodyAr: "abs(a-b) < 1e-9 بدل a==b. round(x,2) للعرض." },
    { id: "apps", titleAr: "تطبيقات", bodyAr: "فيزياء، رسومات، نسب مئوية، حسابات علمية." },
  ],
  stepsDetailed: [
    { titleAr: "1) type()", bodyAr: "type(3.0) → float." },
    { titleAr: "2) قسمة", bodyAr: "5/2=2.5 float." },
    { titleAr: "3) scientific", bodyAr: "1e-3 = 0.001." },
    { titleAr: "4) مقارنة", bodyAr: "round أو epsilon." },
    { titleAr: "5) خطأ شائع", bodyAr: "0.1+0.2==0.3 → False." },
    { titleAr: "6) تحقق", bodyAr: "abs diff < epsilon." },
  ],
  workedExamples: [
    { id: "e1", titleAr: "int vs float", code: "type(5)\ntype(5.0)", steps: ["int", "float"], result: "int, float" },
    { id: "e2", titleAr: "0.1+0.2", code: "print(0.1+0.2)\nprint(0.1+0.2==0.3)", steps: ["0.30000000000000004", "False"], result: "تقريب" },
    { id: "e3", titleAr: "scientific", code: "x = 1.5e10\nprint(x)", steps: ["1.5 × 10¹⁰", "15000000000.0"], result: "1.5e10" },
    { id: "e4", titleAr: "epsilon compare", code: "abs(0.1+0.2-0.3) < 1e-9", steps: ["0.1+0.2≠0.3", "abs diff < epsilon → True"], result: "ok" },
    { id: "e5", titleAr: "كبير", code: "print(2.5e8)", steps: ["2.5×10⁸", "250000000.0"], result: "2.5e8" },
    { id: "e6", titleAr: "صغير", code: "print(3e-4)", steps: ["3×10⁻⁴", "0.0003"], result: "3e-4" },
  ],
  interactiveExample: { type: "if-lab", defaultValue: "print(0.1+0.2)\nprint(type(3.14))\nprint(abs(0.1+0.2-0.3)<1e-9)" },
  commonMistakes: [
    { titleAr: "float==", bodyAr: "0.1+0.2==0.3 False — خطأ مقارنة.", step: "compare" },
    { titleAr: "int division", bodyAr: "5/2 float في Py3.", step: "divide" },
    { titleAr: "تقريب عرض", bodyAr: "print يعرض 0.30000000000000004 — ليس خطأ منطق.", step: "display" },
    { titleAr: "خلط int/float", bodyAr: "3+0.1 → float — انتبه للنوع.", step: "types" },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "type(2.0)?", answer: "float", hintAr: "" },
      { id: "q2", promptAr: "0.1+0.2==0.3?", answer: "False", hintAr: "epsilon" },
      { id: "q3", promptAr: "1e3 = ?", answer: "1000", hintAr: "" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "1e3 = ?", answer: "1000", hints: [] },
    { id: "g2", promptAr: "5/2 in Py3?", answer: "2.5", hints: [] },
    { id: "g3", promptAr: "int(3.9)?", answer: "3", hints: ["يقطع"] },
    { id: "g4", promptAr: "abs(0.1+0.2-0.3)<1e-9?", answer: "True", hints: ["epsilon"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "float(5)?", answer: "5.0", hints: [] },
    { id: "i2", promptAr: "2.0e2 = ?", answer: "200", hints: [] },
    { id: "i3", promptAr: "type(10)?", answer: "int", hints: [] },
    { id: "i4", promptAr: "round(0.1+0.2,1)?", answer: "0.3", hints: [] },
    { id: "i5", promptAr: "1.5e1 = ?", answer: "15", hints: [] },
  ],
  summary: "float للكسور والمدى — احذر التقريب. int للصحيح. قارن بـ epsilon لا ==.",
  linkedActivity: "/lessons/python-arrays",
};
