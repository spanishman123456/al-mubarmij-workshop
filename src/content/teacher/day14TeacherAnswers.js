export const day14TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم الرابع عشر",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم 14",
    pdfPageIndex: 454,
    overviewAr: "اليوم 14 مخصص لتنفيذ المشروع، اختباره، ثم تجهيز العرض النهائي.",
    pacingAr: "≈30 دقيقة معمارية → 35 دقيقة تنفيذ → 30 دقيقة اختبار → 25 دقيقة عرض.",
    sequenceAr: [
      "1) مراجعة معمارية المشروع",
      "2) متابعة sprint التنفيذ",
      "3) اختبار وتصحيح الأعطال",
      "4) بروفة العرض التقديمي",
    ],
    materialsAr: "PDF day14، ws-day-14، مختبرات day14.",
    assessmentAr: "ProjectBuildLab، ProjectTestingLab، ProjectDemoLab.",
  },
  sections: [
    {
      id: "architecture",
      titleAr: "معمارية المشروع",
      pdfPageIndex: 455,
      lessonRoute: "/lessons/project-architecture",
      items: [
        {
          q: "هل تقسيم المشروع إلى modules مفيد؟",
          a: "نعم",
          steps: ["تقليل التعقيد", "تحسين الصيانة"],
          teachingNotes: "اطلب من كل فريق رسم مخطط وحدات.",
          expectedErrors: ["لا حاجة للتقسيم"],
          feedback: "ProjectBuildLab",
        },
      ],
    },
    {
      id: "implementation",
      titleAr: "تنفيذ sprint",
      pdfPageIndex: 456,
      lessonRoute: "/lessons/project-implementation-sprint",
      items: [
        {
          q: "6 من 8 مهام = ؟%",
          a: "75%",
          steps: ["6/8*100"],
          teachingNotes: "تابع backlog بشكل يومي.",
          expectedErrors: ["60%", "80%"],
          feedback: "ProjectBuildLab",
        },
      ],
    },
    {
      id: "testing",
      titleAr: "اختبار وتصحيح",
      pdfPageIndex: 457,
      lessonRoute: "/lessons/project-testing-debugging",
      items: [
        {
          q: "9 اختبارات ناجحة من 12 = ؟%",
          a: "75%",
          steps: ["9/12*100"],
          teachingNotes: "أكد خطوة إعادة إنتاج الخطأ أولًا.",
          expectedErrors: ["66%", "90%"],
          feedback: "ProjectTestingLab",
        },
      ],
    },
    {
      id: "presentation",
      titleAr: "تجهيز العرض",
      pdfPageIndex: 458,
      lessonRoute: "/lessons/project-presentation-rehearsal",
      items: [
        {
          q: "ما أول جزء في عرض المشروع؟",
          a: "المشكلة",
          steps: ["مشكلة", "حل", "demo", "أثر"],
          teachingNotes: "لا تسمح ببدء العرض من الكود مباشرة.",
          expectedErrors: ["الحل مباشرة"],
          feedback: "ProjectDemoLab",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم 14",
      pdfPageIndex: 454,
      lessonRoute: "/worksheets/ws-day-14",
      items: [
        {
          q: "مهام ws-day-14",
          a: "موجودة في worksheetModelAnswers.ws-day-14",
          steps: ["تصحيح آلي داخل المنصة"],
          teachingNotes: "راجع استدلال الطالب مع كل إجابة.",
          expectedErrors: [],
          feedback: "ورقة العمل",
        },
      ],
    },
  ],
};
