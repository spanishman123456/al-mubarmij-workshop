export const dfaNfaLesson = {
  id: "dfa-nfa-design",
  titleAr: "الفرق بين DFA و NFA وتصميم أمثلة",
  pdfRefs: [
    { pdfPageIndex: 441, topic: "DFA vs NFA" },
    { pdfPageIndex: 442, topic: "design examples" },
  ],
  vocabularyAr: [
    { term: "DFA", def: "لكل حالة ورمز انتقال وحيد." },
    { term: "NFA", def: "قد يوجد أكثر من انتقال لنفس الرمز." },
    { term: "Accept State", def: "حالة نهائية مقبولة." },
  ],
  learningObjectives: [
    "تمييز سلوك DFA وNFA.",
    "تصميم DFA بسيط لشرط ثنائي محدد.",
    "تفسير كيف يمكن تحويل NFA إلى DFA.",
  ],
  whyLearn: "فهم DFA/NFA أساس نظريات الحوسبة والـ lexers والمترجمات.",
  prerequisites: ["regex-automata"],
  conceptSimple: "DFA حتمي 100%، أما NFA يسمح بمسارات متعددة.",
  deepSections: [
    { id: "s1", titleAr: "الفرق التشغيلي", bodyAr: "DFA يملك مسارًا واحدًا، NFA قد يختبر عدة مسارات." },
    { id: "s2", titleAr: "القوة التعبيرية", bodyAr: "كلاهما يمثل نفس اللغات المنتظمة، لكن بأساليب مختلفة." },
  ],
  stepsDetailed: [
    { titleAr: "1) اكتب شرط اللغة", bodyAr: "مثل تنتهي بـ 01." },
    { titleAr: "2) ارسم حالات DFA", bodyAr: "حدد البداية والقبول والانتقالات." },
    { titleAr: "3) راجع سلاسل اختبار", bodyAr: "تأكد من القبول والرفض." },
  ],
  workedExamples: [
    { id: "ex1", titleAr: "DFA نهاية 01", steps: ["q0→q1 عند 0", "q1→q2 عند 1"], result: "q2 قبول", difficulty: "متوسط" },
  ],
  commonMistakes: [{ titleAr: "تجاهل انتقال ناقص", bodyAr: "كل رمز يجب أن يملك انتقالًا في DFA." }],
  guidedPractice: [
    { id: "g1", promptAr: "في DFA هل يمكن وجود انتقالين على نفس الرمز من نفس الحالة؟", answer: "لا" },
    { id: "g2", promptAr: "هل NFA أقوى لغويًا من DFA؟", answer: "لا" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "هل يمكن تحويل NFA إلى DFA؟", answer: "نعم" },
    { id: "i2", promptAr: "ما الحالة النهائية تسمى؟", answer: "accept", acceptedAnswers: ["accept", "قبول"] },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "هل DFA حتمي؟", answer: "نعم" }] },
  challengeAr: "ابنِ DFA للغة السلاسل التي تحتوي على 11 مرة واحدة على الأقل.",
  summary: "DFA وNFA طريقتان مكافئتان لتمثيل اللغات المنتظمة.",
  linkedActivity: "/lessons/dfa-nfa-design#lab",
};
