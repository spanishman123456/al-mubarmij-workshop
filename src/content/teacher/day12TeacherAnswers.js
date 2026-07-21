export const day12TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم الثاني عشر",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم 12",
    pdfPageIndex: 439,
    overviewAr: "يركز اليوم 12 على regex وDFA/NFA ثم مدخل التعقيد P/NP وأساسيات المخططات.",
    pacingAr: "≈30 دقيقة regex+automata → 30 دقيقة DFA/NFA → 25 دقيقة P/NP → 30 دقيقة graphs.",
    sequenceAr: [
      "1) التعبيرات العادية وآلات الحالة",
      "2) DFA مقابل NFA",
      "3) مقدمة P و NP",
      "4) تطبيقات نظرية المخططات",
    ],
    materialsAr: "PDF day12، ws-day-12، quiz-day-12، مختبرات day12.",
    assessmentAr: "AutomataLab، ComplexityLab، GraphLab.",
  },
  sections: [
    {
      id: "regex",
      titleAr: "regex والقبول",
      pdfPageIndex: 440,
      lessonRoute: "/lessons/regex-automata",
      items: [
        {
          q: "Regex لسلاسل تنتهي بـ 01؟",
          a: "[01]*01",
          steps: ["أي عدد من 0/1", "ثم 01"],
          teachingNotes: "اختبر 3 سلاسل أمام الطلاب.",
          expectedErrors: ["[01]01", "01*"],
          feedback: "AutomataLab",
        },
      ],
    },
    {
      id: "dfa-nfa",
      titleAr: "DFA و NFA",
      pdfPageIndex: 441,
      lessonRoute: "/lessons/dfa-nfa-design",
      items: [
        {
          q: "هل DFA يسمح بانتقالين لنفس الرمز من نفس الحالة؟",
          a: "لا",
          steps: ["حتمية الانتقال"],
          teachingNotes: "قارن بالرسم NFA بسيط.",
          expectedErrors: ["نعم"],
          feedback: "AutomataLab",
        },
      ],
    },
    {
      id: "complexity",
      titleAr: "P و NP",
      pdfPageIndex: 444,
      lessonRoute: "/lessons/p-vs-np-intro",
      items: [
        {
          q: "هل الفرز ضمن P؟",
          a: "نعم (P)",
          steps: ["حل بزمن متعدد الحدود"],
          teachingNotes: "شدد على فرق الحل/التحقق.",
          expectedErrors: ["NP فقط"],
          feedback: "ComplexityLab",
        },
      ],
    },
    {
      id: "graphs",
      titleAr: "المخططات",
      pdfPageIndex: 445,
      lessonRoute: "/lessons/graph-theory-basics",
      items: [
        {
          q: "عدد حواف K5؟",
          a: "10",
          steps: ["n(n-1)/2 = 5*4/2"],
          teachingNotes: "اربطه بنموذج علاقات طلاب الصف.",
          expectedErrors: ["5", "20"],
          feedback: "GraphLab",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم 12",
      pdfPageIndex: 439,
      lessonRoute: "/worksheets/ws-day-12",
      items: [
        {
          q: "مهام ws-day-12",
          a: "موجودة في worksheetModelAnswers.ws-day-12",
          steps: ["تصحيح آلي في المنصة"],
          teachingNotes: "طابق كل سؤال بالدرس المقابل.",
          expectedErrors: [],
          feedback: "ورقة العمل",
        },
      ],
    },
  ],
};
