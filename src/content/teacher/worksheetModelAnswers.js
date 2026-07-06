/**
 * إجابات نموذجية لأوراق العمل — للمعلم فقط (لا تُرسل للطالب).
 */
export const WORKSHEET_MODEL_ANSWERS = {
  "ws-day-01": {
    teacherDayRoute: "/teacher/day-01-answers",
    tasks: [
      { n: 1, modelAr: "2→10₂، 11→1011₂، 24→11000₂، 50→110010₂، 616→1001101000₂، 22→10110₂" },
      { n: 2, modelAr: "101101→45، 111111→63، 00111011→59، 011010→26" },
      { n: 3, modelAr: "127₁₀" },
      { n: 4, modelAr: "3، 7، 15، 31، 63" },
      { n: 5, modelAr: "12=8+4، 5=4+1، 16=16، 31=16+8+4+2+1" },
      { n: 6, modelAr: "أحمر 16777215، أخضر 65280، أزرق 255؛ أبيض FFFFFF، أسود 000000" },
      { n: 7, modelAr: "ASCII 7-bit؛ Unicode يغطي العربية — مثل «أ» U+0623" },
      { n: 8, modelAr: "ثلاث قواعد من الميثاق + التقويم القبلي تشخيصي" },
    ],
  },
  "ws-day-02": {
    teacherDayRoute: "/teacher/day-02-answers",
    tasks: [
      {
        n: 1,
        modelAr: "1010₂→10، 25₁₀→11001₂، A3₁₆→163₁₀ — مع خطوات التحويل",
        stepsAr: ["قسمة متكررة على 2", "تحقق عكسي"],
      },
      {
        n: 2,
        modelAr: "1011₂+1101₂=11000₂ (24₁₀)؛ 23₅+14₅=42₅",
        stepsAr: ["carry من اليمين", "تحقق عشري"],
      },
      { n: 3, modelAr: "خوارزمية مرقمة: مدخلات → خطوات → مخرجات (مثل: إعداد شاي)" },
      { n: 4, modelAr: "if grade >= 50: print('نجح') else: print('راسب')" },
      { n: 5, modelAr: "سلسلة elif للتقديرات 90/80/70/50" },
      { n: 6, modelAr: "while i <= n: sum += i; i += 1" },
      { n: 7, modelAr: "for i in range(1, 11): print(i*i)" },
      { n: 8, modelAr: "تمثيل IEEE-754 محدود — 0.1+0.2≈0.30000000000000004" },
      { n: 9, modelAr: "تعريفات: خوارزمية، pseudocode، if، while، for، range، float" },
      { n: 10, modelAr: "مختبر 60 د: برنامج if لرمي حجرين + خوارزمية Collatz مبسطة" },
    ],
  },
};
