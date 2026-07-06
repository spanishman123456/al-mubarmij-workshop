/** إجابات المعلم — اليوم الرابع */
export const day04TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم الرابع",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم الرابع",
    pdfPageIndex: 210,
    overviewAr:
      "اليوم الرابع يربط التبسيط المنطقي (كارنوف والمكافئة) ببرمجة بايثون (tuple والحلقات المتداخلة). ابدأ بالمنطق صباحًا ثم انتقل للبرمجة بعد الاستراحة.",
    pacingAr: "≈40 دقيقة كارنوف ومكافئة → 45 دقيقة tuples وحلقات متداخلة.",
    sequenceAr: [
      "1) خريطة كارنوف (مقدمة + تطبيقات)",
      "2) الاقترانات المنطقية والمكافئة",
      "3) الحقول المترابطة + تطبيقات",
      "4) برنامج الحلقات المتداخلة + تطبيقات",
    ],
    materialsAr: "PDF 190–211، محاكاة كارنوف، مختبرات المنصة.",
    assessmentAr: "تحقق: تبسيط A·B، دي مورغان، t[1]=20، صف i×j في جدول 4×4.",
  },
  sections: [
    {
      id: "karnaugh",
      titleAr: "خريطة كارنوف",
      pdfPageIndex: 204,
      lessonRoute: "/lessons/karnaugh-maps",
      items: [
        {
          q: "A AND B — خريطة 2×2 — أين الوحيدة؟",
          a: "الخلية 11 (A=1,B=1).",
          steps: ["ثلاث خلايا 0", "خلية واحدة 1", "مجموعة حجم 1 → A·B"],
          teachingNotes: "راجع Gray code على المحاور قبل التجميع.",
          expectedErrors: ["ترتيب صفوف عشري", "مجموعة بحجم 3"],
          feedback: "KarnaughMapLab + محاكاة /simulations#karnaugh",
        },
        {
          q: "لماذا التفاف الحافة؟",
          a: "في Gray، الخلايا على الطرفين متجاورة منطقيًا — تُجمَّع كمجموعة واحدة.",
          steps: ["مثال 4×4", "مجموعة تمتد من العمود 0 إلى 3"],
          teachingNotes: "استخدم لونًا مختلفًا للمجموعات المتداخلة.",
          expectedErrors: ["رفض التفاف"],
          feedback: "",
        },
      ],
    },
    {
      id: "equivalence",
      titleAr: "الاقترانات المنطقية",
      pdfPageIndex: 206,
      lessonRoute: "/lessons/logic-equivalence",
      items: [
        {
          q: "NOT(A AND B) ≡ ?",
          a: "(NOT A) OR (NOT B) — قانون دي مورغان.",
          steps: ["جدول 4 صفوف متطابقة"],
          teachingNotes: "اطلب بناء الجدول يدويًا قبل الحفظ.",
          expectedErrors: ["NOT A AND NOT B بدون OR"],
          feedback: "LogicEquivalenceLab المهمة 1",
        },
        {
          q: "A OR (A AND B) ≡ ?",
          a: "A — قانون الامتصاص.",
          steps: ["عند A=0: 0", "عند A=1: 1"],
          teachingNotes: "",
          expectedErrors: ["A OR B"],
          feedback: "",
        },
      ],
    },
    {
      id: "tuples",
      titleAr: "الحقول المترابطة",
      pdfPageIndex: 208,
      lessonRoute: "/lessons/python-tuples",
      items: [
        {
          q: "t=(10,20,30) — t[1]؟",
          a: "20",
          steps: ["فهرس من 0", "العنصر الثاني"],
          teachingNotes: "قارن مع list قابلة للتعديل.",
          expectedErrors: ["10 (الأول)", "t[2]"],
          feedback: "TupleLab",
        },
        {
          q: "a,b = (7,8) — قيم a,b؟",
          a: "a=7, b=8",
          steps: ["تفكيك متوازٍ"],
          teachingNotes: "ربط بـ divmod.",
          expectedErrors: ["ترتيب معكوس دون قصد"],
          feedback: "",
        },
      ],
    },
    {
      id: "nested",
      titleAr: "الحلقات المتداخلة",
      pdfPageIndex: 208,
      lessonRoute: "/lessons/nested-loops-lab",
      items: [
        {
          q: "جدول 4×4 — الصف i=2؟",
          a: "0, 2, 4, 6",
          steps: ["j=0..3", "i*j"],
          teachingNotes: "ناقش n² تكرارًا.",
          expectedErrors: ["نسيان print() بين الصفوف"],
          feedback: "NestedLoopsLab",
        },
      ],
    },
  ],
};
