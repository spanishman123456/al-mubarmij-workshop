export const regexAutomataLesson = {
  id: "regex-automata",
  titleAr: "التعبيرات العادية وربطها بآلات الحالة",
  pdfRefs: [
    { pdfPageIndex: 439, topic: "regex basics" },
    { pdfPageIndex: 440, topic: "state transitions" },
  ],
  vocabularyAr: [
    { term: "Regex", def: "نمط يصف مجموعة سلاسل نصية/ثنائية." },
    { term: "State", def: "حالة داخل الآلة أثناء قراءة الرموز." },
    { term: "Transition", def: "انتقال من حالة لأخرى حسب الرمز." },
  ],
  learningObjectives: [
    "كتابة regex بسيط لسلاسل ثنائية.",
    "تفسير انتقالات آلة حالة لمطابقة النمط.",
    "التحقق من قبول/رفض سلسلة مع شرح السبب.",
  ],
  whyLearn: "هذا الدرس يربط بين التمثيل النصي للنمط (regex) والتمثيل الرسومي (آلة الحالة).",
  prerequisites: ["number-systems", "algorithms"],
  conceptSimple: "النمط [01]*01 يعني أي سلسلة ثنائية تنتهي بـ 01.",
  deepSections: [
    { id: "sec1", titleAr: "بناء النمط", bodyAr: "نكتب regex ليعبر عن الشرط المطلوب بدقة." },
    { id: "sec2", titleAr: "تحويله إلى آلة", bodyAr: "لكل جزء من الشرط حالات وانتقالات." },
  ],
  stepsDetailed: [
    { titleAr: "1) حدّد الشرط", bodyAr: "مثال: تنتهي بـ 01." },
    { titleAr: "2) اكتب regex", bodyAr: "[01]*01." },
    { titleAr: "3) اختبر أمثلة", bodyAr: "1101 مقبول، 1110 مرفوض." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "تحقق قبول 0101", steps: ["تنتهي بـ 01"], result: "مقبولة", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "نسيان *", bodyAr: "بدون * ستفقد سلاسل صحيحة أطول." }],
  guidedPractice: [
    { id: "g1", promptAr: "هل 1001 يطابق [01]*01؟", answer: "نعم" },
    { id: "g2", promptAr: "هل 1110 يطابق [01]*01؟", answer: "لا" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اكتب regex لنهاية 10", answer: "[01]*10" },
    { id: "i2", promptAr: "هل 0110 يطابق [01]*10؟", answer: "نعم" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل regex يعبّر عن لغة محددة؟", answer: "نعم" }] },
  challengeAr: "صمم regex ولائحة حالات لشرط: تنتهي بـ 001.",
  summary: "regex أداة وصف، وآلة الحالة أداة تنفيذ وتحقق.",
  linkedActivity: "/lessons/regex-automata#lab",
};
