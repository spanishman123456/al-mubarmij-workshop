/** إجابات المعلم — اليوم التاسع */
export const day09TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم التاسع",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم التاسع",
    pdfPageIndex: 403,
    overviewAr:
      "يركز اليوم على الاستدعاء الذاتي والكسوريات — pdfPage 403–426. ابدأ بمراجعة فيبوناتشي/هانoyi ثم factorial و sumToN، ثم مفهوم التشابه الذاتي، Koch snowflake، و Sierpinski.",
    pacingAr: "≈40 دقيقة recursion → 25 دقيقة كسوريات → 30 دقيقة Koch → 25 دقيقة Sierpinski.",
    sequenceAr: [
      "1) الاستدعاء الذاتي — حالة أساس + factorial/sumToN",
      "2) الكسوريات والتشابه الذاتي",
      "3) منحنى Koch وندفة الثلج (3×4^depth)",
      "4) مثلث Sierpinski (3^depth مثلثات)",
    ],
    materialsAr: "PDF 403–426، ws-day-09، quiz-day-09.",
    assessmentAr: "RecursionLab، FractalsIntroLab، KochSnowflakeLab، SierpinskiLab، quiz-day-09.",
  },
  sections: [
    {
      id: "recursion",
      titleAr: "الاستدعاء الذاتي",
      pdfPageIndex: 407,
      lessonRoute: "/lessons/python-recursion",
      items: [
        {
          q: "factorial(5) = ?",
          a: "120",
          steps: ["5×4×3×2×1 = 120"],
          teachingNotes: "تأكد من if n<=1 قبل return n*factorial(n-1).",
          expectedErrors: ["24", "60"],
          feedback: "RecursionLab",
        },
        {
          q: "sumToN(6) = ?",
          a: "21",
          steps: ["6+5+4+3+2+1"],
          teachingNotes: "قارن بالحلقة for.",
          expectedErrors: ["15", "36"],
          feedback: "RecursionLab",
        },
      ],
    },
    {
      id: "fractals",
      titleAr: "الكسوريات",
      pdfPageIndex: 415,
      lessonRoute: "/lessons/fractals-intro",
      items: [
        {
          q: "ما تعريف الكسورية؟",
          a: "شكل يتكرر فيه الجزء شبيهًا بالكل",
          steps: ["تشابه ذاتي عند تكبير"],
          teachingNotes: "FractalsIntroLab — MCQ.",
          expectedErrors: ["خط مستقيم فقط"],
          feedback: "FractalsIntroLab",
        },
      ],
    },
    {
      id: "koch",
      titleAr: "ندفة Koch",
      pdfPageIndex: 417,
      lessonRoute: "/lessons/koch-snowflake",
      items: [
        {
          q: "3 أضلاع، عمق 2 — كم قطعة خط؟",
          a: "48",
          steps: ["3 × 4² = 48"],
          teachingNotes: "كل تكرار يضرب عدد القطع في 4.",
          expectedErrors: ["12", "16"],
          feedback: "KochSnowflakeLab",
        },
      ],
    },
    {
      id: "sierpinski",
      titleAr: "Sierpinski",
      pdfPageIndex: 418,
      lessonRoute: "/lessons/sierpinski-triangle",
      items: [
        {
          q: "عمق 3 — كم مثلثًا صغيرًا؟",
          a: "27",
          steps: ["3³ = 27"],
          teachingNotes: "SierpinskiLab.",
          expectedErrors: ["9", "81"],
          feedback: "SierpinskiLab",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم التاسع",
      pdfPageIndex: 403,
      lessonRoute: "/worksheets/ws-day-09",
      items: [
        {
          q: "مهام ws-day-09",
          a: "انظر worksheetModelAnswers",
          steps: ["worksheetModelAnswers.ws-day-09"],
          teachingNotes: "تصحيح آلي.",
          expectedErrors: [],
          feedback: "ورقة العمل",
        },
      ],
    },
  ],
};
