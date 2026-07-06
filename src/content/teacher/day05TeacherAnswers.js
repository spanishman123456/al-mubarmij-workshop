/** إجابات المعلم — اليوم الخامس */
export const day05TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم الخامس",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم الخامس",
    pdfPageIndex: 294,
    overviewAr:
      "يركز اليوم الخامس على خوارزميات البحث والفرز وتمييز الأعداد الأولية. احرص على البدء بالتتبع اليدوي قبل كتابة الكود، ثم الانتقال للمختبرات.",
    pacingAr: "≈35 دقيقة بحث خطي/ثنائي → 30 دقيقة Selection Sort → 25 دقيقة غربال.",
    sequenceAr: [
      "1) البحث الخطي ومتى نستخدمه",
      "2) البحث الثنائي وشرط الترتيب",
      "3) فرز الاختيار بالتتبع اليدوي",
      "4) غربال إراتوستينس وتطبيق الأعداد الأولية",
    ],
    materialsAr: "PDF 253–294، محاكاة /simulations#search، مختبرات المنصة.",
    assessmentAr: "تحقق: index لبحث خطي/ثنائي، ناتج دورة Selection Sort، قائمة أوليات حتى 30.",
  },
  sections: [
    {
      id: "linear",
      titleAr: "البحث الخطي",
      pdfPageIndex: 253,
      lessonRoute: "/lessons/linear-search",
      items: [
        {
          q: "في [7,3,12,5,9,4] ابحث عن 9 — ما الموضع؟",
          a: "الموضع 4.",
          steps: ["نفحص 7 ثم 3 ثم 12 ثم 5 ثم 9", "التطابق عند i=4"],
          teachingNotes: "أكد أن الفهرسة تبدأ من 0.",
          expectedErrors: ["العد من 1", "إرجاع true بدل index"],
          feedback: "LinearSearchLab + محاكاة /simulations#search",
        },
      ],
    },
    {
      id: "binary",
      titleAr: "البحث الثنائي",
      pdfPageIndex: 262,
      lessonRoute: "/lessons/binary-search",
      items: [
        {
          q: "في [2,5,9,13,18,22,30] ابحث عن 13 — ما الموضع؟",
          a: "الموضع 3.",
          steps: ["low=0, high=6", "mid=3 والقيمة 13 => نجاح مباشر"],
          teachingNotes: "كرر سؤال: ماذا يحدث لو القائمة غير مرتبة؟",
          expectedErrors: ["تطبيق الخوارزمية على قائمة غير مرتبة", "تحديث حدود خاطئ"],
          feedback: "BinarySearchLab",
        },
      ],
    },
    {
      id: "selection-sort",
      titleAr: "Selection Sort",
      pdfPageIndex: 285,
      lessonRoute: "/lessons/sorting-algorithms",
      items: [
        {
          q: "رتب [8,3,6,1,9] بفرز الاختيار — ما الناتج؟",
          a: "[1,3,6,8,9]",
          steps: ["الدورة1: نقل 1 للبداية", "الدورة2: 3 في موضعه", "ثم 6 ثم 8"],
          teachingNotes: "اطلب من الطالب كتابة حالة القائمة بعد كل دورة.",
          expectedErrors: ["التبديل داخل الحلقة الداخلية", "نسيان إعادة minIdx=i"],
          feedback: "SelectionSortLab",
        },
      ],
    },
    {
      id: "sieve",
      titleAr: "غربال إراتوستينس",
      pdfPageIndex: 287,
      lessonRoute: "/lessons/sieve-primes",
      items: [
        {
          q: "ما الأعداد الأولية حتى 30؟",
          a: "2، 3، 5، 7، 11، 13، 17، 19، 23، 29",
          steps: ["حذف مضاعفات 2", "ثم 3", "ثم 5 (بدءًا من 25)"],
          teachingNotes: "ذكر بأن 1 ليس أوليًا.",
          expectedErrors: ["إدراج 1", "البدء من 2p دائمًا مع تكرار زائد"],
          feedback: "SievePrimesLab",
        },
      ],
    },
  ],
};
