/** الاقترانات المنطقية والمكافئات — اليوم 4 | pdfPageIndex 194–195 */
export const logicEquivalenceLesson = {
  id: "logic-equivalence",
  titleAr: "الاقترانات المنطقية والمكافئات",
  pdfRefs: [{ pdfPageIndex: 194, topic: "Logical equivalence" }],
  vocabularyAr: [
    { term: "مكافئة منطقية", def: "تعبيران لهما نفس جدول الحقيقة لكل تركيب مدخلات." },
    { term: "قانون دي مورغان", def: "NOT(A AND B) ≡ (NOT A) OR (NOT B)" },
    { term: "التوزيع", def: "A AND (B OR C) ≡ (A AND B) OR (A AND C)" },
    { term: "الامتصاص", def: "A OR (A AND B) ≡ A" },
  ],
  learningObjectives: [
    "التحقق من المكافئة بجدول الحقيقة.",
    "تطبيق قوانين الجبر البولي.",
    "تبسيط تعبير قبل وبعد المكافئة.",
    "ربط المكافئة بتصميم الدوائر.",
  ],
  whyLearn: "المكافئة تسمح باستبدال دارة معقدة بأخرى أبسط دون تغيير السلوك.",
  prerequisites: ["truth-tables", "logic-gates"],
  conceptSimple: "إذا أعطى تعبيران نفس العمود في جدول الحقيقة — فهما مكافئان.",
  deepSections: [
    {
      id: "verify-table",
      titleAr: "التحقق بجدول الحقيقة",
      bodyAr: "ابنِ جدولًا لكل تعبير؛ قارن عمود الناتج صفًا بصف. تطابق كامل = مكافئة.",
    },
    {
      id: "laws",
      titleAr: "قوانين شائعة",
      bodyAr: "دي مورغان، التبادل، التوزيع، الهوية، الإلغاء، الامتصاص — كلها تُثبت بالجدول أو بالتجميع.",
    },
    {
      id: "karnaugh-link",
      titleAr: "الربط بكارنوف",
      bodyAr: "تعبيران مكافئان يُنتجان نفس خريطة كارنوف بعد التبسيط الكامل.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) صغ التعبيرين", bodyAr: "مثلاً: NOT(A AND B) و (NOT A) OR (NOT B)" },
    { titleAr: "2) جدول لكلٍ", bodyAr: "نفس المتغيرات بنفس الترتيب." },
    { titleAr: "3) قارن", bodyAr: "أعمدة الناتج متطابقة؟" },
    { titleAr: "4) استنتج", bodyAr: "مكافئ أو لا — اذكر الصف المخالف إن وُجد." },
  ],
  workedExamples: [
    {
      id: "demorgan",
      titleAr: "دي مورغان",
      steps: ["A=0,B=0: NOT(0)=1 = 1 OR 1", "A=1,B=1: NOT(1)=0 = 0 OR 0", "كل الصفوف متطابقة"],
      result: "مكافئ",
    },
    {
      id: "absorption",
      titleAr: "الامتصاص A OR (A AND B)",
      steps: ["عند A=0: 0 OR 0 = 0", "عند A=1: 1 OR B = 1", "يساوي A فقط"],
      result: "≡ A",
    },
    {
      id: "non-equiv",
      titleAr: "مثال غير مكافئ",
      steps: ["A AND B ≠ A OR B", "الصف 10 يختلف"],
      result: "غير مكافئ",
    },
  ],
  wrongExamples: [
    { titleAr: "خلط AND مع OR", bodyAr: "قانون دي مورغان يبدّل AND↔OR عند النفي." },
  ],
  interactiveExample: { type: "equivalence-lab" },
  commonMistakes: [
    { titleAr: "مقارنة صف واحد", bodyAr: "يجب كل الصفوف.", step: "table" },
    { titleAr: "ترتيب متغيرات", bodyAr: "A,B يجب أن يطابق B,A في الجدول.", step: "vars" },
  ],
  quickCheck: {
    questions: [{ id: "q1", promptAr: "NOT(A AND B) مكافئ لـ؟", answer: "(NOT A) OR (NOT B)", hintAr: "دي مورغان" }],
  },
  guidedPractice: [
    { id: "g1", promptAr: "A OR A ≡ ?", answer: "A", hints: ["هوية"] },
    { id: "g2", promptAr: "A AND 1 ≡ ?", answer: "A", hints: [] },
    { id: "g3", promptAr: "NOT(NOT A) ≡ ?", answer: "A", hints: ["نفي مزدوج"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "A AND 0 ≡ ?", answer: "0", hints: [] },
    { id: "i2", promptAr: "A OR 0 ≡ ?", answer: "A", hints: [] },
    { id: "i3", promptAr: "(A AND B) OR (A AND NOT B) ≡ ?", answer: "A", hints: ["توزيع عكسي"] },
  ],
  challengeAr: "أثبت بالجدول: A XOR B ≡ (A OR B) AND NOT(A AND B).",
  summary: "المكافئة = نفس جدول الحقيقة. استخدم القوانين أو كارنوف للتبسيط.",
  linkedActivity: "/lessons/karnaugh-maps",
};
