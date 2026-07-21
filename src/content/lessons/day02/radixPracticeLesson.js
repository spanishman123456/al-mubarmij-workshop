/**
 * تطبيقات حساب الأساس — اليوم 2
 * pdfPageIndex: 99–104
 */
export const radixPracticeLesson = {
  id: "radix-practice",
  titleAr: "تطبيقات على حساب الأساس والقيمة المكانية",
  pdfRefs: [{ pdfPageIndex: 99, topic: "تطبيقات الأساس" }],
  learningObjectives: [
    "حل تحويلات لأساس 2، 3، 5، 8، 16.",
    "استخدام جدول القيمة المكانية بثقة.",
    "التعامل مع أصفار بادئة وhex.",
  ],
  whyLearn: "PDF يعطي تمارين متنوعة على الأساس — إتقانها يُسهّل الخوارزميات التي تستخدم % و //.",
  prerequisites: ["أنظمة العد", "النشاط التمهيدي للتحويلات"],
  conceptSimple: "كل أساس b: رموز 0..b-1، منزلة i وزنها b^i.",
  deepSections: [
    { id: "bases", titleAr: "الأساسات في PDF", bodyAr: "ثنائي 2، ثلاثي 3، خماسي 5، ثماني 8، hex 16 — نفس القواعد." },
    { id: "place", titleAr: "جدول المنازل", bodyAr: "اكتب الأوزان قبل الحساب." },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد b", bodyAr: "2، 5، 8…" },
    { titleAr: "2) تحقق من digits", bodyAr: "لا رمز ≥ b." },
    { titleAr: "3) حوّل", bodyAr: "ضرب أو قسمة." },
    { titleAr: "4) تحقق عكسياً", bodyAr: "إلزامي." },
  ],
  workedExamples: [
    { id: "r1", titleAr: "123₅ → عشري", steps: ["1×25 + 2×5 + 3×1", "25+10+3=38"], result: "38" },
    { id: "r2", titleAr: "38₁₀ → أساس 5", steps: ["38÷5=7r3", "7÷5=1r2", "1÷5=0r1 → 123"], result: "123" },
    { id: "r3", titleAr: "77₈ → عشري", steps: ["7×8 + 7", "56+7=63"], result: "63" },
    { id: "r4", titleAr: "2D₁₆ → عشري", steps: ["2×16 + 13(D)", "32+13=45"], result: "45" },
    { id: "r5", titleAr: "1120₃ → عشري", steps: ["1×27 + 1×9 + 2×3", "27+9+6=42"], result: "42" },
  ],
  interactiveExample: { type: "number-base-converter", defaultFrom: 10, defaultTo: 5, defaultValue: "38" },
  commonMistakes: [
    { titleAr: "digit 5 في أساس 5", bodyAr: "مسموح 0-4 فقط.", step: "digit" },
    { titleAr: "hex A=10", bodyAr: "A ليس «حرفاً» بل 10.", step: "hex" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "F₁₆ = ?", answer: "15", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "101₂ → ?", answer: "5", hints: ["4+1"], kind: "toDecimal", base: 2 },
    { id: "g2", promptAr: "10₁₀ → ثنائي", answer: "1010", hints: [], kind: "fromDecimal", base: 2 },
    { id: "g3", promptAr: "38₁₀ → أساس 5", answer: "123", hints: [], kind: "fromDecimal", base: 5 },
  ],
  independentPractice: [
    { id: "i1", promptAr: "111111₂ → ?", answer: "63", kind: "toDecimal", base: 2, hints: [] },
    { id: "i2", promptAr: "100₁₀ → hex", answer: "64", kind: "fromDecimal", base: 16, hints: [] },
    { id: "i3", promptAr: "55₈ → ?", answer: "45", kind: "toDecimal", base: 8, hints: [] },
    { id: "i4", promptAr: "42₁₀ → أساس 3", answer: "1120", kind: "fromDecimal", base: 3, hints: [] },
  ],
  summary: "تمرين مركز على الأساسات — نفس عمق أنظمة العد مع تركيز PDF.",
  linkedActivity: "/lessons/number-systems",
};
