/**
 * بطاقات الأرقام الثنائية — Computer Science Unplugged
 * pdfPage 31 (printedPage 9) — pdfPage 32 (printedPage 13)
 */
export const binaryCardsLesson = {
  id: "binary-cards",
  titleAr: "بطاقات الأرقام الثنائية (Unplugged)",
  pdfRefs: [
    { pdfPage: 31, printedPage: 9, topic: "حديقة الحاسبة — العد من الصفر" },
    { pdfPage: 32, printedPage: 13, topic: "بطاقات 1,2,4,8,16…" },
  ],
  learningObjectives: [
    "فهم أن كل بطاقة تمثل قوة للعدد 2.",
    "تمثيل عدد عشري بمجموعة بطاقات (1=ظاهرة، 0=مقلوبة).",
    "ربط النشاط الورقي بالقيمة المكانية في النظام الثنائي.",
    "العد من الصفر (zero-based indexing) كما في البرمجة.",
  ],
  whyLearn:
    "قبل كتابة كود، يمكن «تشغيل» الحاسب يدوياً. بطاقات 1، 2، 4، 8… تعلّمك أن الثنائي ليس سحراً بل جمع أوزان — نفس فكرة جدول القيمة المكانية.",
  prerequisites: ["معرفة مبدأية بالنظام الثنائي من درس أنظمة العد."],
  conceptSimple:
    "لكل بطاقة قيمة: 1، 2، 4، 8، 16… لتمثيل عدد، اقلب البطاقات التي مجموع ظاهر منها = العدد. مثال: 21 = 16+4+1 → البطاقات 16، 4، 1 ظاهرة.",
  stepsDetailed: [
    { titleAr: "1) رتّب البطاقات", bodyAr: "من اليمين: 1، 2، 4، 8، 16 (أو أكثر)." },
    { titleAr: "2) اختر عدداً عشرياً", bodyAr: "مثل 21 أو 27 من PDF." },
    { titleAr: "3) اقلب البطاقات", bodyAr: "ابدأ من أكبر بطاقة ≤ العدد، كرّر." },
    { titleAr: "4) تحقق", bodyAr: "اجمع قيم البطاقات الظاهرة — يجب أن تساوي العدد." },
  ],
  workedExamples: [
    {
      id: "cards-21",
      titleAr: "21 = 16 + 4 + 1",
      steps: ["بطاقة 16: ظاهرة", "بطاقة 8: مقلوبة", "بطاقة 4: ظاهرة", "بطاقة 2: مقلوبة", "بطاقة 1: ظاهرة", "10101₂"],
      result: "10101",
    },
    {
      id: "cards-27",
      titleAr: "27 = 16 + 8 + 2 + 1",
      steps: ["16+8+2+1=27", "11011₂"],
      result: "11011",
    },
  ],
  interactiveExample: { type: "binary-cards", defaultValue: 21 },
  commonMistakes: [
    { titleAr: "نسيان بطاقة 1", bodyAr: "الأعداد الفردية تحتاج بطاقة 1." },
    { titleAr: "العد من 1", bodyAr: "في البرمجة المنازل تبدأ من 0 — first box is box 0." },
  ],
  quickCheck: {
    questions: [{ id: "q1", promptAr: "21 يحتاج بطاقة 16؟", answer: "نعم", hintAr: "16 ≤ 21" }],
  },
  guidedPractice: [
    { id: "g1", promptAr: "5 بالبطاقات = ?", answer: "101", hints: ["4+1", "101"] },
    { id: "g2", promptAr: "13 بالبطاقات = ?", answer: "1101", hints: ["8+4+1"] },
  ],
  independentPractice: [{ id: "i1", promptAr: "10 بالبطاقات ثنائي؟", answer: "1010", hints: ["8+2"] }],
  summary: "البطاقات = قيمة مكانية ملموسة. الظاهر = 1، المقلوب = 0.",
  linkedActivity: "/lessons/number-systems",
};
