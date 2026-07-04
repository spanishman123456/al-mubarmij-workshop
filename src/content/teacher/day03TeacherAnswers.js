/** إجابات وإرشادات المعلم — اليوم الثالث */
export const day03TeacherAnswers = {
  dayId: "day-03",
  titleAr: "اليوم الثالث — ثوابت، حلقات، منطق",
  sections: [
    {
      id: "constants",
      titleAr: "الثوابت",
      answers: [
        { q: "PI = 3.14 ثم PI = 4", a: "خطأ اتفاقياً — لا تعيد تعيين الثوابت." },
        { q: "MAX_SCORE vs max_score", a: "UPPER_CASE للثوابت حسب PEP8." },
      ],
      guidanceAr: "ناقش الفرق بين المتغير (يتغير) والث constant (قيمة منطقية ثابتة).",
    },
    {
      id: "multi-dim",
      titleAr: "مصفوفات متعددة الأبعاد",
      answers: [
        { q: "m[0][1] في [[1,2],[3,4]]", a: "2" },
        { q: "عدد الصفوف", a: "2" },
      ],
      guidanceAr: "ارسم الجدول على السبورة — صف = row، عمود = col.",
    },
    {
      id: "break-continue",
      titleAr: "break / continue / pass / else",
      answers: [
        { q: "continue عند i=2 في range(5)", a: "يتخطى print(2)" },
        { q: "else مع for — متى؟", a: "عند انتهاء الحلقة دون break." },
      ],
    },
    {
      id: "divisors",
      titleAr: "المقسومات",
      answers: [{ q: "مقسومات 12", a: "1, 2, 3, 4, 6, 12" }],
    },
    {
      id: "collatz",
      titleAr: "Collatz",
      answers: [{ q: "n=6 — عدد الخطوات", a: "8" }],
    },
    {
      id: "truth-tables",
      titleAr: "جداول الحقيقة",
      answers: [
        { q: "A AND B — 11", a: "1" },
        { q: "A XOR B — 10", a: "1" },
      ],
    },
    {
      id: "logic-gates",
      titleAr: "البوابات",
      answers: [
        { q: "AND 1,0", a: "0" },
        { q: "NOR 0,0", a: "1" },
      ],
    },
  ],
};
