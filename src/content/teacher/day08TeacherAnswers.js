/** إجابات المعلم — اليوم الثامن */
export const day08TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم الثامن",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم الثامن",
    pdfPageIndex: 373,
    overviewAr:
      "يركز اليوم على فيبوناتشي والتكرار، Big-O، برج هانوي، وملفات المخرجات — pdfPage 373–402. ابدأ بالمتتالية قبل التعقيد، ثم هانوي كتطبيق تكراري، وأخيرًا حفظ النتائج في ملف.",
    pacingAr: "≈35 دقيقة فيبوناتشي → 30 دقيقة Big-O → 30 دقيقة هانوي → 25 دقيقة ملفات.",
    sequenceAr: [
      "1) متتالية فيبوناتشي — حلقة مقابل استدعاء ذاتي",
      "2) Big-O وربط البحث/الفرز (اليوم 5)",
      "3) برج هانوي — قواعد + hanoi(n,a,b,c)",
      "4) open/write/read — ملف مخرجات",
    ],
    materialsAr: "PDF 373–402، محاكاة /simulations#fibonacci و #hanoi، ws-day-08.",
    assessmentAr: "FibonacciLab، ComplexityLab، TowerOfHanoiLab، PythonFilesLab، quiz-day-08.",
  },
  sections: [
    {
      id: "fibonacci",
      titleAr: "متتالية فيبوناتشي",
      pdfPageIndex: 392,
      lessonRoute: "/lessons/fibonacci-sequence",
      items: [
        {
          q: "F(6) = ?",
          a: "8",
          steps: ["0,1,1,2,3,5,8"],
          teachingNotes: "قارن الحلقة والاستدعاء الذاتي.",
          expectedErrors: ["6", "13"],
          feedback: "FibonacciLab",
        },
      ],
    },
    {
      id: "complexity",
      titleAr: "Big-O",
      pdfPageIndex: 384,
      lessonRoute: "/lessons/algorithm-complexity",
      items: [
        {
          q: "for i in range(n): print(i) — التعقيد؟",
          a: "O(n)",
          steps: ["حلقة واحدة على n"],
          teachingNotes: "اربط linear-search و selection sort.",
          expectedErrors: ["O(1)", "O(n²)"],
          feedback: "ComplexityLab",
        },
      ],
    },
    {
      id: "hanoi",
      titleAr: "برج هانوي",
      pdfPageIndex: 395,
      lessonRoute: "/lessons/tower-of-hanoi",
      items: [
        {
          q: "3 أقراص — أقل عدد حركات؟",
          a: "7",
          steps: ["2³−1 = 7"],
          teachingNotes: "TowerOfHanoiLab — تحقق من القواعد.",
          expectedErrors: ["6", "8"],
          feedback: "TowerOfHanoiLab",
        },
      ],
    },
    {
      id: "files",
      titleAr: "الملفات",
      pdfPageIndex: 399,
      lessonRoute: "/lessons/python-files-io",
      items: [
        {
          q: "with open('out.txt','w') as f: f.write('a\\nb') — كم سطر؟",
          a: "2",
          steps: ["\\n يفصل سطرين"],
          teachingNotes: "encoding=utf-8 للعربية.",
          expectedErrors: ["1"],
          feedback: "PythonFilesLab",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم الثامن",
      pdfPageIndex: 375,
      lessonRoute: "/worksheets/ws-day-08",
      items: [
        {
          q: "مهام ws-day-08",
          a: "فيبوناتشي، Big-O، هانوي، ملفات — تصحيح آلي.",
          steps: ["worksheetModelAnswers.ws-day-08"],
          teachingNotes: "لا مقالات طويلة.",
          expectedErrors: [],
          feedback: "لوحة المعلم",
        },
      ],
    },
  ],
};
