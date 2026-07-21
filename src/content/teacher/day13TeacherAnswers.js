export const day13TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم الثالث عشر",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم 13",
    pdfPageIndex: 449,
    overviewAr: "يركز اليوم 13 على مراجعة شاملة، التقويم البعدي، وتجهيز المشروع النهائي.",
    pacingAr: "≈30 دقيقة مراجعة → 25 دقيقة تحليل التقويم → 35 دقيقة فكرة المشروع → 25 دقيقة خطة التنفيذ.",
    sequenceAr: [
      "1) مراجعة مركزة للمحاور",
      "2) تفسير quiz-post ونسبة التحسن",
      "3) صياغة فكرة المشروع",
      "4) إعداد خطة SMART",
    ],
    materialsAr: "PDF day13، ws-day-13، quiz-post، مختبرات day13.",
    assessmentAr: "ReviewLab، PostAssessmentLab، ProjectPrepLab.",
  },
  sections: [
    {
      id: "review",
      titleAr: "المراجعة الشاملة",
      pdfPageIndex: 449,
      lessonRoute: "/lessons/comprehensive-review",
      items: [
        {
          q: "متوسط [60,70,80]؟",
          a: "70",
          steps: ["(60+70+80)/3"],
          teachingNotes: "اربط الناتج بخطة مراجعة فردية.",
          expectedErrors: ["60", "80"],
          feedback: "ReviewLab",
        },
      ],
    },
    {
      id: "post",
      titleAr: "التقويم البعدي",
      pdfPageIndex: 450,
      lessonRoute: "/lessons/post-assessment-readiness",
      items: [
        {
          q: "Pre=50 و Post=65 نسبة التحسن؟",
          a: "30%",
          steps: ["(65-50)/50*100"],
          teachingNotes: "ناقش سبب التحسن لا الرقم فقط.",
          expectedErrors: ["15%", "65%"],
          feedback: "PostAssessmentLab",
        },
      ],
    },
    {
      id: "idea",
      titleAr: "فكرة المشروع",
      pdfPageIndex: 451,
      lessonRoute: "/lessons/project-ideation",
      items: [
        {
          q: "ما أول خطوة قبل تنفيذ المشروع؟",
          a: "تعريف المشكلة",
          steps: ["مشكلة", "مستخدم", "حل"],
          teachingNotes: "لا تسمح بالقفز للكود دون تحديد المشكلة.",
          expectedErrors: ["بدء البرمجة مباشرة"],
          feedback: "ProjectPrepLab",
        },
      ],
    },
    {
      id: "plan",
      titleAr: "تخطيط التنفيذ",
      pdfPageIndex: 452,
      lessonRoute: "/lessons/project-planning",
      items: [
        {
          q: "هل هدف 80% خلال أسبوع SMART؟",
          a: "نعم",
          steps: ["قابل للقياس", "مؤطر زمنيًا"],
          teachingNotes: "اجعل كل فريق يكتب هدف SMART خاصًا به.",
          expectedErrors: ["هدف عام بلا رقم"],
          feedback: "ProjectPrepLab",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم 13",
      pdfPageIndex: 449,
      lessonRoute: "/worksheets/ws-day-13",
      items: [
        {
          q: "مهام ws-day-13",
          a: "موجودة في worksheetModelAnswers.ws-day-13",
          steps: ["تصحيح آلي داخل المنصة"],
          teachingNotes: "راجع مع الطالب منطق الإجابة لا الخيار فقط.",
          expectedErrors: [],
          feedback: "ورقة العمل",
        },
      ],
    },
  ],
};
