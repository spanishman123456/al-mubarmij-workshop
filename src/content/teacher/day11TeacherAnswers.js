/** إجابات المعلم — اليوم 11 */
export const day11TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم الحادي عشر",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم 11",
    pdfPageIndex: 429,
    overviewAr:
      "يركز اليوم 11 على مقدمة الذكاء الاصطناعي، قياس أداء النماذج، أخلاقيات الاستخدام، ثم إعداد عرض بحثي قصير.",
    pacingAr: "≈30 دقيقة AI foundation → 30 دقيقة ML basics → 30 دقيقة ethics → 25 دقيقة research/presentation.",
    sequenceAr: [
      "1) تعريف AI وتطبيقات واقعية",
      "2) تدريب/اختبار وحساب Accuracy",
      "3) الانحياز والخصوصية والمسؤولية",
      "4) بناء عرض بحثي منظم",
    ],
    materialsAr: "PDF day11، ws-day-11، quiz-day-11، مختبرات اليوم 11.",
    assessmentAr: "AiFoundationsLab، MachineLearningLab، AiEthicsLab، AiPresentationLab.",
  },
  sections: [
    {
      id: "ai-foundation",
      titleAr: "مقدمة AI",
      pdfPageIndex: 430,
      lessonRoute: "/lessons/ai-foundations",
      items: [
        {
          q: "ما تعريف الذكاء الاصطناعي باختصار؟",
          a: "التعلم من البيانات لاكتشاف الأنماط واتخاذ قرار",
          steps: ["بيانات", "نمط", "قرار"],
          teachingNotes: "أكّد الفرق عن if التقليدية.",
          expectedErrors: ["روبوت فقط", "أي برنامج عادي"],
          feedback: "AiFoundationsLab",
        },
      ],
    },
    {
      id: "ml-basics",
      titleAr: "التعلم الآلي وقياس الأداء",
      pdfPageIndex: 432,
      lessonRoute: "/lessons/machine-learning-basics",
      items: [
        {
          q: "TP=8,TN=6,FP=2,FN=4 — الدقة؟",
          a: "70%",
          steps: ["(8+6)/(8+6+2+4)=14/20"],
          teachingNotes: "اطلب من الطالب شرح المقام والبسط شفهيًا.",
          expectedErrors: ["60%", "80%"],
          feedback: "MachineLearningLab",
        },
      ],
    },
    {
      id: "ai-ethics",
      titleAr: "أخلاقيات AI",
      pdfPageIndex: 434,
      lessonRoute: "/lessons/ai-ethics-safety",
      items: [
        {
          q: "هل انحياز البيانات خطر على عدالة النموذج؟",
          a: "نعم",
          steps: ["البيانات المنحازة → قرار غير عادل"],
          teachingNotes: "اربط الإجابة بمثال مدرسي بسيط.",
          expectedErrors: ["لا"],
          feedback: "AiEthicsLab",
        },
      ],
    },
    {
      id: "research-presentation",
      titleAr: "البحث والعرض",
      pdfPageIndex: 435,
      lessonRoute: "/lessons/ai-research-presentation",
      items: [
        {
          q: "هل ترتيب (مشكلة→حل→مثال→أثر) مناسب للعرض؟",
          a: "نعم",
          steps: ["بنية عرض واضحة", "انتقال منطقي"],
          teachingNotes: "استخدم Rubric العرض أثناء المناقشة.",
          expectedErrors: ["لا ترتيب"],
          feedback: "AiPresentationLab",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم 11",
      pdfPageIndex: 429,
      lessonRoute: "/worksheets/ws-day-11",
      items: [
        {
          q: "مهام ws-day-11",
          a: "موجودة في worksheetModelAnswers.ws-day-11",
          steps: ["تصحيح آلي داخل المنصة"],
          teachingNotes: "طابق كل سؤال بالدرس الموافق له.",
          expectedErrors: [],
          feedback: "ورقة العمل",
        },
      ],
    },
  ],
};
