/** الثوابت — اليوم 3 | pdfPageIndex ~152 */
export const constantsLesson = {
  id: "python-constants",
  titleAr: "الثوابت في بايثون",
  pdfRefs: [{ pdfPageIndex: 152, topic: "Constants" }],
  learningObjectives: [
    "تمييز الثابت عن المتغير.",
    "استخدام أسماء UPPER_CASE للثوابت.",
    "فهم أن بايثون لا تمنع تغيير القيمة — اتفاقية.",
  ],
  whyLearn: "الثوابت تجعل الكود أوضح: PI، MAX_SCORE، GRAVITY.",
  prerequisites: ["متغيرات بايثون"],
  conceptSimple: "PI = 3.14159 — اسم بأحرف كبيرة يدل على «لا تغيّر». القيمة ثابتة منطقياً.",
  deepSections: [
    { id: "naming", titleAr: "تسمية UPPER_CASE", bodyAr: "MAX_ATTEMPTS = 3 — اتفاق PEP8." },
    { id: "vs-var", titleAr: "ثابت vs متغير", bodyAr: "score يتغير؛ PI لا يتغير في البرنامج." },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد القيمة الثابتة", bodyAr: "رقم لا يتغير أثناء التشغيل." },
    { titleAr: "2) اسم UPPER", bodyAr: "DAYS_IN_WEEK = 7" },
    { titleAr: "3) استخدم", bodyAr: "area = PI * r ** 2" },
    { titleAr: "4) لا تعيد تعيين", bodyAr: "اتفاق — لا PI = 4" },
  ],
  workedExamples: [
    { id: "e1", titleAr: "PI", code: "PI = 3.14159\nr = 5\nprint(PI * r * r)", steps: ["PI=3.14159", "area≈78.54"], result: "area" },
    { id: "e2", titleAr: "MAX", code: "MAX = 100\nx = 150\nprint(x > MAX)", steps: ["150>100", "True"], result: "True" },
  ],
  interactiveExample: { type: "if-lab", defaultValue: "MAX_SCORE = 100\nscore = 85\nprint(score <= MAX_SCORE)" },
  commonMistakes: [
    { titleAr: "lower case", bodyAr: "pi vs PI — الوضوح.", step: "name" },
    { titleAr: "reassign", bodyAr: "تغيير ثابت يربك القارئ.", step: "logic" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "اتفاق ثابت؟", answer: "UPPER_CASE", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "DAYS=7 — ثابت؟", answer: "نعم", hints: [] },
    { id: "g2", promptAr: "x=5 — ثابت؟", answer: "لا", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "GRAVITY=9.8 — نوع؟", answer: "float", hints: [] },
    { id: "i2", promptAr: "MAX=10, x=11>MAX?", answer: "True", hints: [] },
  ],
  summary: "ثابت = UPPER_CASE + لا تعيد تعيين منطقياً.",
  linkedActivity: "/lessons/python-multi-arrays",
};
