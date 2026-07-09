export const projectArchitectureLesson = {
  id: "project-architecture",
  titleAr: "هيكل المشروع وتقسيم المكونات",
  pdfRefs: [
    { pdfPageIndex: 454, topic: "project architecture" },
    { pdfPageIndex: 455, topic: "module planning" },
  ],
  vocabularyAr: [
    { term: "Module", def: "وحدة وظيفية مستقلة داخل المشروع." },
    { term: "Dependency", def: "اعتمادية بين مكونات النظام." },
  ],
  learningObjectives: [
    "تصميم هيكل منطقي للمشروع.",
    "تقسيم الحل إلى وحدات قابلة للتنفيذ.",
    "تحديد الواجهات بين المكونات.",
  ],
  whyLearn: "الهيكل الجيد يقلل التعقيد ويسهّل التطوير الجماعي.",
  prerequisites: ["project-planning"],
  conceptSimple: "كل وحدة لها وظيفة واضحة ومدخلات/مخرجات محددة.",
  deepSections: [
    { id: "s1", titleAr: "تقسيم النظام", bodyAr: "واجهة مستخدم، منطق أعمال، بيانات." },
    { id: "s2", titleAr: "تدفق البيانات", bodyAr: "حدد أين تبدأ البيانات وإلى أين تذهب." },
  ],
  stepsDetailed: [
    { titleAr: "1) ارسم مخططًا بسيطًا", bodyAr: "3-4 وحدات رئيسية." },
    { titleAr: "2) عرّف واجهات كل وحدة", bodyAr: "ما المطلوب منها وما تنتجه." },
    { titleAr: "3) راجع التداخل", bodyAr: "قلل الترابط غير الضروري." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "تطبيق مهام دراسية", steps: ["واجهة", "خدمة", "تخزين"], result: "هيكل قابل للتوسع", difficulty: "متوسط" },
  ],
  commonMistakes: [{ titleAr: "كل شيء في ملف واحد", bodyAr: "يصعب الاختبار والصيانة." }],
  guidedPractice: [
    { id: "g1", promptAr: "هل تقسيم المشروع إلى modules مفيد؟", answer: "نعم" },
    { id: "g2", promptAr: "هل يجب أن تكون مسؤولية الوحدة واضحة؟", answer: "نعم" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "اذكر 3 وحدات لمشروعك", answer: "..." },
    { id: "i2", promptAr: "ما علاقة واجهة المستخدم بالبيانات؟", answer: "..." },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل الهيكل الجيد يقلل الأخطاء لاحقًا؟", answer: "نعم" }] },
  challengeAr: "ارسم مخطط معماري مختصر لمشروعك النهائي.",
  summary: "المعمارية الجيدة تضمن تنفيذًا أسرع وصيانة أسهل.",
  linkedActivity: "/lessons/project-architecture#lab",
};
