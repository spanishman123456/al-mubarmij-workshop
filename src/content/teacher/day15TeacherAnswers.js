export const day15TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم الخامس عشر",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم 15",
    pdfPageIndex: 459,
    overviewAr: "اليوم 15 يركز على العروض الختامية، التغذية الراجعة، التقييم النهائي، وخطة ما بعد الدورة.",
    pacingAr: "≈30 دقيقة عروض → 25 دقيقة feedback → 25 دقيقة تقييم → 20 دقيقة خاتمة.",
    sequenceAr: [
      "1) عرض المشاريع النهائية",
      "2) تغذية راجعة من الأقران",
      "3) تقييم ختامي وتحليل النتائج",
      "4) خطة الخطوات التالية",
    ],
    materialsAr: "PDF day15، ws-day-15، rubrics التقييم.",
    assessmentAr: "FinalPresentationLab، PeerFeedbackLab، FinalEvaluationLab.",
  },
  sections: [
    {
      id: "presentation",
      titleAr: "العرض النهائي",
      pdfPageIndex: 460,
      lessonRoute: "/lessons/final-project-presentation",
      items: [
        {
          q: "متوسط rubric [4,5,4,3]؟",
          a: "4",
          steps: ["(4+5+4+3)/4"],
          teachingNotes: "راجع معايير rubric قبل التقييم.",
          expectedErrors: ["3", "5"],
          feedback: "FinalPresentationLab",
        },
      ],
    },
    {
      id: "feedback",
      titleAr: "التغذية الراجعة",
      pdfPageIndex: 461,
      lessonRoute: "/lessons/peer-feedback-and-refinement",
      items: [
        {
          q: "هل feedback الفعال يجب أن يكون محددًا؟",
          a: "نعم",
          steps: ["ملاحظة", "سبب", "اقتراح"],
          teachingNotes: "شجع اللغة المهنية المحترمة.",
          expectedErrors: ["ملاحظات عامة"],
          feedback: "PeerFeedbackLab",
        },
      ],
    },
    {
      id: "evaluation",
      titleAr: "التقييم الختامي",
      pdfPageIndex: 462,
      lessonRoute: "/lessons/final-evaluation",
      items: [
        {
          q: "42 من 50 = ؟%",
          a: "84%",
          steps: ["42/50*100"],
          teachingNotes: "اطلب من الطالب تفسير النتيجة.",
          expectedErrors: ["80%", "90%"],
          feedback: "FinalEvaluationLab",
        },
      ],
    },
    {
      id: "closure",
      titleAr: "الخاتمة",
      pdfPageIndex: 463,
      lessonRoute: "/lessons/program-closure-next-steps",
      items: [
        {
          q: "هل الخطة التالية بعد الدورة مهمة؟",
          a: "نعم",
          steps: ["هدف", "موعد", "قياس"],
          teachingNotes: "اختتم بخطة تعلم شهرية للطالب.",
          expectedErrors: ["التوقف بعد انتهاء الدورة"],
          feedback: "FinalEvaluationLab",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم 15",
      pdfPageIndex: 459,
      lessonRoute: "/worksheets/ws-day-15",
      items: [
        {
          q: "مهام ws-day-15",
          a: "موجودة في worksheetModelAnswers.ws-day-15",
          steps: ["تصحيح آلي داخل المنصة"],
          teachingNotes: "اربط النتائج بخطة ما بعد الدورة.",
          expectedErrors: [],
          feedback: "ورقة العمل",
        },
      ],
    },
  ],
};
