/** إجابات المعلم — اليوم السابع */
export const day07TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم السابع",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم السابع",
    pdfPageIndex: 339,
    overviewAr:
      "يركز اليوم السابع على النطاق scope في بايثون، ثم مشاريع لعبية: نرد، تك-تak-تو، وتخطيط تعاوني. ابدأ بالنطاق قبل الدخول في منطق اللعبة.",
    pacingAr: "≈40 دقيقة scope → 25 دقيقة نرد → 35 دقيقة tic-tac-toe → 30 دقيقة تخطيط.",
    sequenceAr: [
      "1) النطاق المحلي والعام والمعاملات",
      "2) random ومحاكاة رمي النرد",
      "3) خوارزمية تك-تak-تو",
      "4) تخطيط اللعبة قبل الكود",
    ],
    materialsAr: "PDF 339–372، مختبرات المنصة، ws-day-07.",
    assessmentAr: "تحقق: إجابة scope، مجموع نرد، فوز tic-tac-toe، ترتيب خطوات التخطيط.",
  },
  sections: [
    {
      id: "scope",
      titleAr: "نطاق المتغيرات",
      pdfPageIndex: 354,
      lessonRoute: "/lessons/python-scope",
      items: [
        {
          q: "x=10; def f(): x=3; print(x) — ماذا يطبع f()؟",
          a: "3",
          steps: ["x داخل f محلي", "يحجب x العام"],
          teachingNotes: "ارسم جدول LEGB.",
          expectedErrors: ["10", "خطأ NameError"],
          feedback: "ScopeLab",
        },
      ],
    },
    {
      id: "dice",
      titleAr: "رمي النرد",
      pdfPageIndex: 370,
      lessonRoute: "/lessons/dice-random",
      items: [
        {
          q: "نردان: 4 و 3 — ما المجموع والتصنيف؟",
          a: "7 — متوسط",
          steps: ["4+3=7", "6<sum≤9 → متوسط"],
          teachingNotes: "ربط import random.",
          expectedErrors: ["12", "منخفض"],
          feedback: "DiceRandomLab",
        },
      ],
    },
    {
      id: "ttt",
      titleAr: "تك-تak-تو",
      pdfPageIndex: 356,
      lessonRoute: "/lessons/tic-tac-toe",
      items: [
        {
          q: "صف X في [0,1,2,4] — من يفوز؟",
          a: "X",
          steps: ["الصف العلوي 0-1-2 مكتمل"],
          teachingNotes: "CHECK WIN_LINES.",
          expectedErrors: ["O", "تعادل"],
          feedback: "TicTacToeLab",
        },
      ],
    },
    {
      id: "planning",
      titleAr: "تخطيط اللعبة",
      pdfPageIndex: 361,
      lessonRoute: "/lessons/game-planning",
      items: [
        {
          q: "رتّب: كتابة الكود قبل تحديد القواعد؟",
          a: "خطأ — القواعد أولًا",
          steps: ["1 قواعد", "2 مخطط", "3 دوال", "4 اختبار", "5 عرض"],
          teachingNotes: "شجّع العمل الجماعي.",
          expectedErrors: ["الكود أولًا"],
          feedback: "GamePlanningLab",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم السابع",
      pdfPageIndex: 341,
      lessonRoute: "/worksheets/ws-day-07",
      items: [
        {
          q: "مهام ws-day-07",
          a: "scope، نرد، tic-tac-toe، تخطيط — تصحيح آلي.",
          steps: ["راجع worksheetModelAnswers"],
          teachingNotes: "لا مقالات طويلة.",
          expectedErrors: [],
          feedback: "لوحة المعلم",
        },
      ],
    },
  ],
};
