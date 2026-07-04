/**
 * بطاقات مطابقة الأرقام الثنائية — اليوم 1
 * pdfPageIndex: 81–82
 */
export const binaryMatchingLesson = {
  id: "binary-matching",
  titleAr: "بطاقات المطابقة للأرقام الثنائية",
  pdfRefs: [{ pdfPageIndex: 81, topic: "مطابقة بطاقات ثنائية" }],
  learningObjectives: [
    "مطابقة عدد عشري مع تمثيله الثنائي على بطاقات.",
    "استخدام بطاقات 1، 2، 4، 8… لبناء العدد.",
    "التحقق بجمع أوزان البطاقات الظاهرة.",
  ],
  whyLearn: "نشاط PDF يجمع التمثيل اليدوي (بطاقات) مع التحويل — يثبت أن الثنائي ليس حفظاً بل جمع أوزان.",
  prerequisites: ["بطاقات ثنائية unplugged", "أنظمة العد"],
  conceptSimple: "لكل بطاقة وزن. اختر البطاقات التي مجموعها = العدد العشري — ثم اكتب 1 تحت البطاقة الظاهرة و 0 تحت المخفية.",
  stepsDetailed: [
    { titleAr: "1) رتّب البطاقات", bodyAr: "16، 8، 4، 2، 1 من اليسار لليمين." },
    { titleAr: "2) اختر عدداً", bodyAr: "مثل 21 أو 27." },
    { titleAr: "3) اقلب البطاقات", bodyAr: "21 = 16+4+1 → 10101." },
    { titleAr: "4) طابق", bodyAr: "طابق العشري مع الثنائي في النشاط." },
  ],
  workedExamples: [
    {
      id: "m-21",
      titleAr: "21 ↔ 10101",
      steps: ["بطاقات 16، 4، 1 ظاهرة", "10101₂"],
      result: "10101",
    },
    {
      id: "m-13",
      titleAr: "13 ↔ 1101",
      steps: ["8+4+1", "1101₂"],
      result: "1101",
    },
  ],
  interactiveExample: { type: "binary-matching", defaultValue: "21" },
  commonMistakes: [
    { titleAr: "اختيار بطاقة أكبر من العدد", bodyAr: "ابدأ من أكبر بطاقة ≤ العدد." },
    { titleAr: "ترتيب البطاقات معكوس", bodyAr: "الأكبر يساراً في النشاط الورقي." },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "10₁₀ ثنائي؟", answer: "1010", hintAr: "8+2" },
      { id: "q2", promptAr: "11011₂ = ?", answer: "27", hintAr: "16+8+2+1" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "5₁₀ → ثنائي", answer: "101", hints: ["4+1"] },
    { id: "g2", promptAr: "9₁₀ → ثنائي", answer: "1001", hints: ["8+1"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "20₁₀ → ثنائي", answer: "10100", hints: [] },
    { id: "i2", promptAr: "31₁₀ → ثنائي", answer: "11111", hints: [] },
  ],
  summary: "المطابقة تربط البطاقات الورقية بالثنائي المكتوب.",
  linkedActivity: "/lessons/binary-cards",
};
