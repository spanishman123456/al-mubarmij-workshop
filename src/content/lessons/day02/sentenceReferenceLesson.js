/**
 * الدليل المرجعي لبناء الجملة — if / for / while / range
 * pdfPageIndex: 139–140
 */
export const sentenceReferenceLesson = {
  id: "sentence-reference",
  titleAr: "الدليل المرجعي لبناء الجمل في بايثون",
  pdfRefs: [
    { pdfPageIndex: 139, topic: "if / else / elif" },
    { pdfPageIndex: 140, topic: "for / while / range" },
  ],
  learningObjectives: [
    "قراءة مرجع PDF لبنية if و else و elif.",
    "معرفة بنية for مع in و range.",
    "معرفة while والفرق عن for.",
    "استخدام الدليل أثناء كتابة البرامج — لا حفظ عن ظهر قلب.",
  ],
  whyLearn: "PDF يعطي «بطاقة مرجعية» — مثل قاموس أثناء البرمجة. تقلل أخطاء النقطتين والبادئة.",
  prerequisites: ["مقدمة بايثون", "بداية درس if"],
  conceptSimple: "if condition:\\n    body\\nelse:\\n    body — for x in range(n):\\n    body — while condition:\\n    body",
  deepSections: [
    {
      id: "if-ref",
      titleAr: "if / elif / else",
      bodyAr:
        "if cond1:\\n    ...\\nelif cond2:\\n    ...\\nelse:\\n    ...\\n— elif اختياري، else اختياري، لكن else واحد فقط في النهاية.",
    },
    {
      id: "for-ref",
      titleAr: "for و in",
      bodyAr:
        "for item in sequence:\\n    ...\\nfor i in range(5):  # 0,1,2,3,4\\nfor i in range(2, 10, 2):  # 2,4,6,8",
    },
    {
      id: "while-ref",
      titleAr: "while",
      bodyAr: "while condition:\\n    ...\\n— يكرّر ما دام الشرط True. احذر حلقة لا نهائية.",
    },
    {
      id: "range-ref",
      titleAr: "range",
      bodyAr: "range(stop) | range(start, stop) | range(start, stop, step) — يولّد أعداداً للتكرار.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) افتح المرجع", bodyAr: "من هذا الدرس أو PDF." },
    { titleAr: "2) انسخ الهيكل", bodyAr: "if: ثم أزحف." },
    { titleAr: "3) استبدل cond", bodyAr: "بشرطك." },
    { titleAr: "4) املأ body", bodyAr: "print أو تعيين." },
  ],
  workedExamples: [
    { id: "ref1", titleAr: "هيكل if", code: "if x > 0:\n    print('موجب')", steps: ["cond + :", "indent body"], result: "مرجع" },
    { id: "ref2", titleAr: "for range", code: "for i in range(3):\n    print(i)", steps: ["range(3) → 0,1,2", "print كل i"], result: "0\n1\n2" },
    { id: "ref3", titleAr: "while", code: "n = 3\nwhile n > 0:\n    print(n)\n    n -= 1", steps: ["n=3,2,1", "يتوقف عند 0"], result: "3\n2\n1" },
  ],
  interactiveExample: { type: "if-lab", defaultValue: "for i in range(3):\n    print(i)", promptAr: "جرّب range و for." },
  commonMistakes: [
    { titleAr: "نسخ while بدون تحديث", bodyAr: "حلقة لا نهائية.", step: "while" },
    { titleAr: "range(5) يبدأ من 1", bodyAr: "يبدأ من 0.", step: "range" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "range(3) يعطي؟", answer: "0,1,2", hintAr: "zero-based" }] },
  guidedPractice: [
    { id: "g1", promptAr: "range(2) آخر قيمة؟", answer: "1", hints: ["0,1"] },
    { id: "g2", promptAr: "while ينتهي عند؟", answer: "False", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "for i in range(1): كم مرة؟", answer: "1", hints: [] },
    { id: "i2", promptAr: "elif بعد else؟", answer: "لا", hints: [] },
  ],
  summary: "احتفظ بالمرجع — if/for/while/range — واستخدمه في المختبر.",
  linkedActivity: "/lessons/if-statement",
};
