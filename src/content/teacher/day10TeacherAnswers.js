/** إجابات المعلم — اليوم العاشر */
export const day10TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم العاشر",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم العاشر",
    pdfPageIndex: 428,
    overviewAr:
      "يربط اليوم العاشر بين OOP، إخفاء المعلومات، النمط الهندسي المتكرر، ومشكلتي الخزانة/باسكال. ابدأ بالمفاهيم ثم نفّذ المختبرات الأربع.",
    pacingAr: "≈35 دقيقة OOP → 35 دقيقة steganography → 30 دقيقة fractal tree → 30 دقيقة locker/pascal.",
    sequenceAr: [
      "1) class/object و __init__ وتطبيقات المساحة",
      "2) ASCII + bits + OR لفك الرسائل المخفية",
      "3) شجرة متكررة باستخدام recursion",
      "4) Locker problem + Pascal triangle",
    ],
    materialsAr: "PDF day10، ws-day-10، quiz-day-10، مختبرات اليوم العاشر.",
    assessmentAr: "OopFoundationsLab، SteganographyLab، FractalTreeLab، LockerPascalLab.",
  },
  sections: [
    {
      id: "oop",
      titleAr: "البرمجة كائنية التوجه",
      pdfPageIndex: 423,
      lessonRoute: "/lessons/oop-foundations",
      items: [
        {
          q: "مساحة Circle(3) تقريبًا؟",
          a: "≈ 28.27",
          steps: ["πr²", "π×9"],
          teachingNotes: "ذكّر الطلاب بالفرق بين class و object.",
          expectedErrors: ["9", "18"],
          feedback: "OopFoundationsLab",
        },
      ],
    },
    {
      id: "stego",
      titleAr: "إخفاء المعلومات",
      pdfPageIndex: 437,
      lessonRoute: "/lessons/steganography-python",
      items: [
        {
          q: "01010100 01100101 01100001 01100011 01101000 00000000 = ?",
          a: "Teach",
          steps: ["ASCII decoding", "التوقف عند null"],
          teachingNotes: "راجع قاعدة upper/lower كمصدر بت.",
          expectedErrors: ["Teacher", "Tech"],
          feedback: "SteganographyLab",
        },
      ],
    },
    {
      id: "fractal-tree",
      titleAr: "الشجرة المتكررة",
      pdfPageIndex: 441,
      lessonRoute: "/lessons/fractal-tree-recursion",
      items: [
        {
          q: "عمق 4 — كم قطعة تقريبًا؟",
          a: "31",
          steps: ["2^(d+1)-1 = 2^5-1"],
          teachingNotes: "اربطها بحالات recursion.",
          expectedErrors: ["16", "32"],
          feedback: "FractalTreeLab",
        },
      ],
    },
    {
      id: "locker-pascal",
      titleAr: "الخزانة ومثلث باسكال",
      pdfPageIndex: 468,
      lessonRoute: "/lessons/locker-pascal-problem",
      items: [
        {
          q: "حتى 10 خزائن، ما المفتوح؟",
          a: "1، 4، 9",
          steps: ["المربعات الكاملة فقط"],
          teachingNotes: "تأكيد منطق القواسم الفردية.",
          expectedErrors: ["1،2،3", "1،9"],
          feedback: "LockerPascalLab",
        },
        {
          q: "صف باسكال 4؟",
          a: "1,4,6,4,1",
          steps: ["جمع عنصرين من الصف السابق"],
          teachingNotes: "وضّح الفهرسة من الصفر.",
          expectedErrors: ["1,3,3,1"],
          feedback: "LockerPascalLab",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم العاشر",
      pdfPageIndex: 428,
      lessonRoute: "/worksheets/ws-day-10",
      items: [
        {
          q: "مهام ws-day-10",
          a: "موجودة في worksheetModelAnswers.ws-day-10",
          steps: ["تصحيح آلي داخل المنصة"],
          teachingNotes: "اربط السؤال بالدرس الموافق له.",
          expectedErrors: [],
          feedback: "ورقة العمل",
        },
      ],
    },
  ],
};
