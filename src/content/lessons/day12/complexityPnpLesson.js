export const complexityPnpLesson = {
  id: "p-vs-np-intro",
  titleAr: "مقدمة P و NP والتفكير في التعقيد",
  pdfRefs: [
    { pdfPageIndex: 443, topic: "P and NP overview" },
    { pdfPageIndex: 444, topic: "examples" },
  ],
  vocabularyAr: [
    { term: "Complexity", def: "مقدار الموارد (زمن/ذاكرة) المطلوبة لحل المشكلة." },
    { term: "P", def: "مسائل يمكن حلها بزمن متعدد الحدود." },
    { term: "NP", def: "مسائل يمكن التحقق من حلها بزمن متعدد الحدود." },
  ],
  learningObjectives: [
    "تعريف P وNP بشكل مبسط.",
    "تمييز الحل السريع عن التحقق السريع.",
    "تصنيف أمثلة تعليمية ضمن P أو NP.",
  ],
  whyLearn: "فهم التعقيد يساعد الطالب على اختيار خوارزميات عملية وعدم الانخداع بحلول غير قابلة للتوسع.",
  prerequisites: ["algorithms", "search-sort"],
  conceptSimple: "كل مسألة في P هي ضمن NP، لكن هل P=NP؟ سؤال مفتوح شهير.",
  deepSections: [
    { id: "s1", titleAr: "الفارق بين الحل والتحقق", bodyAr: "قد يصعب إيجاد الحل لكن يسهل فحصه إذا أعطي." },
    { id: "s2", titleAr: "أمثلة صفية", bodyAr: "الفرز مثال في P، وبعض مسائل التوافق تقدم فكرة NP." },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد المهمة", bodyAr: "حل أم تحقق؟" },
    { titleAr: "2) قيّم الزمن", bodyAr: "هل ينمو بزمن عملي مع حجم المدخلات؟" },
    { titleAr: "3) صنف مبدئيًا", bodyAr: "P أو NP كنموذج ذهني." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "تصنيف الفرز", steps: ["خوارزميات معروفة", "زمن متعدد الحدود"], result: "P", difficulty: "سهل" },
  ],
  commonMistakes: [{ titleAr: "اعتبار NP = غير قابل للحل", bodyAr: "هذا خطأ؛ NP يتعلق بسهولة التحقق." }],
  guidedPractice: [
    { id: "g1", promptAr: "هل كل P ضمن NP؟", answer: "نعم" },
    { id: "g2", promptAr: "هل الفرز عادة في P؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اكتب الحرف الذي يمثل مسائل الحل الكفء", answer: "P" },
    { id: "i2", promptAr: "هل NP تعني مستحيل؟", answer: "لا" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل سؤال P=NP محسوم؟", answer: "لا" }] },
  challengeAr: "قدّم مثالًا لمهمة قد يكون التحقق من حلها أسهل من إيجاده.",
  summary: "P/NP إطار تفكير مهم لفهم حدود الخوارزميات.",
  linkedActivity: "/lessons/p-vs-np-intro#lab",
};
