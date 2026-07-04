/**
 * ASCII و Unicode — اليوم الأول
 * pdfPage: 46, 96, 97, 129, 131
 */
export const asciiUnicodeLesson = {
  id: "ascii-unicode",
  titleAr: "ASCII و Unicode — ترميز الأحرف",
  pdfRefs: [
    { pdfPage: 96, topic: "أهداف ASCII/Unicode" },
    { pdfPage: 97, topic: "مقدمة جهاز الحاسب والترميز" },
    { pdfPage: 46, topic: "تطبيقات 20 دقيقة" },
    { pdfPage: 129, topic: "تبادل ASCII بين الطلاب" },
  ],
  learningObjectives: [
    "شرح أن الحاسب يخزّن النص كأرقام (bytes) وليس كأحرف مباشرة.",
    "تعداد نطاق ASCII (0–127) وذكر أمثلة: 'A'=65، 'a'=97، '0'=48.",
    "التمييز بين ASCII (128 حرفاً) و Unicode (كل لغات العالم).",
    "استخدام ord() و chr() في بايثون للتحويل بين حرف ورقم.",
    "قراءة جدول ASCII للعثور على رمز حرف أو العكس.",
    "ربط الترميز بتخزين النصوص العربية (UTF-8).",
  ],
  whyLearn:
    "عندما تضغط 'A' على لوحة المفاتيح، الحاسب يخزّن 65. عندما ترسل رسالة أو تفتح ملفاً نصياً، bytes تتحول لأحرف عبر جدول ترميز. فهم ASCII/Unicode أساس لـ hex colors (#FF)، لملفات CSV، ولأمن المعلومات (Caesar cipher في يوم لاحق).",
  prerequisites: [
    "درس أنظمة العد (فهم تحويل رقم ↔ تمثيل).",
    "مقدمة بايثون: print و string.",
  ],
  conceptSimple:
    "كل حرف له رقم Unicode. ASCII subset: 128 حرفاً إنجليزياً ورموزاً أساسية. 'A' = 65، 'B' = 66… الفرق بين uppercase و lowercase = 32. chr(65) → 'A'، ord('A') → 65. العربية خارج ASCII — UTF-8 يستخدم عدة bytes للحرف الواحد.",
  deepSections: [
    {
      id: "why-numbers",
      titleAr: "لماذا أرقام وليس أحرف؟",
      bodyAr:
        "الذاكرة bits فقط (0/1). نجمّع 8 bits = byte = 256 قيمة (0–255). اتُفق مبكراً: 65 = A، 66 = B… هذا ASCII. بدون اتفاق، ملف مكتوب على جهاز لن يُقرأ على آخر.",
    },
    {
      id: "ascii-ranges",
      titleAr: "أقسام جدول ASCII",
      bodyAr:
        "0–31: تحكم (Enter، Tab). 32: مسافة. 48–57: '0'–'9'. 65–90: 'A'–'Z'. 97–122: 'a'–'z'. 128+: Extended ASCII (تختلف حسب locale). Unicode يوسّع ليشمل العربية U+0600+.",
    },
    {
      id: "ord-chr",
      titleAr: "ord و chr في بايثون",
      bodyAr:
        "ord('X') → 88. chr(88) → 'X'. مفيد لتشفير Caesar: chr(ord('A')+3) → 'D' (مع wrap). للعربية ord('ب') > 127 — UTF-8.",
    },
    {
      id: "utf8",
      titleAr: "UTF-8 والعربية",
      bodyAr:
        "UTF-8 متغير الطول: ASCII حرف = 1 byte، العربية غالباً 2 bytes. ملف .py بـ # -*- coding: utf-8 -*- أو UTF-8 افتراضي في Python 3.",
    },
  ],
  terms: [
    { termAr: "ASCII", definitionAr: "American Standard Code — 128 رمزاً أساسياً." },
    { termAr: "Unicode", definitionAr: "معيار عالمي لكل محرف في كل لغة." },
    { termAr: "UTF-8", definitionAr: "ترميز bytes متوافق مع ASCII للحروف اللاتينية." },
    { termAr: "ord()", definitionAr: "حرف → رقم Unicode." },
    { termAr: "chr()", definitionAr: "رقم → حرف." },
    { termAr: "byte", definitionAr: "8 bits — وحدة تخزين صغيرة." },
  ],
  stepsDetailed: [
    { titleAr: "1) افتح جدول ASCII", bodyAr: "في الدرس التفاعلي أو ورقة PDF." },
    { titleAr: "2) ابحث عن 'A'", bodyAr: "الرمز العشري 65." },
    { titleAr: "3) جرّب ord('A')", bodyAr: "في مختبر بايثون — يجب 65." },
    { titleAr: "4) جرّب chr(66)", bodyAr: "الناتج 'B'." },
    { titleAr: "5) احسب فرق a و A", bodyAr: "ord('a')-ord('A') = 32." },
    { titleAr: "6) رمّز اسمك", bodyAr: "اكتب ord لكل حرف (إنجليزي)." },
    { titleAr: "7) فكّ الرموز", bodyAr: "chr(72)+chr(105) → 'Hi'." },
    { titleAr: "8) ناقش UTF-8", bodyAr: "لماذا ord('ب') > 127؟" },
  ],
  workedExamples: [
    {
      id: "ex-A",
      titleAr: "مثال 1: حرف A",
      steps: ["'A' في ASCII = 65", "ord('A') → 65", "chr(65) → 'A'"],
      result: "65 ↔ A",
    },
    {
      id: "ex-digit",
      titleAr: "مثال 2: الرقم '5' ليس العدد 5",
      steps: ["ord('5') = 53 (ليس 5!)", "chr(53) = '5'", "لتحويل نص لرقم: int('5') = 5"],
      result: "53 vs 5",
    },
    {
      id: "ex-hi",
      titleAr: "مثال 3: ترميز Hi",
      steps: ["H=72, i=105", "chr(72)+chr(105) = 'Hi'", "ord('H')+ord('i') = 177 (جمع أرقام ≠ ترميز)"],
      result: "Hi",
    },
    {
      id: "ex-caesar-preview",
      titleAr: "مثال 4 (معاينة): Caesar +1 على B",
      steps: ["ord('B') = 66", "chr(66+1) = 'C'", "سيتوسّع في درس التشفير"],
      result: "C",
    },
  ],
  interactiveExample: {
    type: "ascii-table",
    defaultValue: "A",
    promptAr: "اختر حرفاً وشاهد رمزه في الجدول.",
  },
  commonMistakes: [
    { titleAr: "خلط '5' مع 5", bodyAr: "ord('5')=53 بينما int('5')=5.", step: "digits" },
    { titleAr: "chr(300) في ASCII", bodyAr: "chr(300) يعمل في Unicode لكن ليس ASCII تقليدي.", step: "range" },
    { titleAr: "جمع ord للحصول على كلمة", bodyAr: "ord('H')+ord('i')≠'Hi' — استخدم chr+concat.", step: "concat" },
  ],
  quickCheck: {
    questions: [
      { id: "qc1", promptAr: "ord('A')؟", answer: "65", hintAr: "65–90 للأحرف الكبيرة" },
      { id: "qc2", promptAr: "chr(97)؟", answer: "a", hintAr: "97 = a" },
      { id: "qc3", promptAr: "ord('0')؟", answer: "48", hintAr: "الأرقام تبدأ 48" },
      { id: "qc4", promptAr: "ASCII كم حرفاً أساسياً؟", answer: "128", hintAr: "0–127" },
    ],
  },
  guidedPractice: [
    { id: "gp1", promptAr: "ord('Z')؟", answer: "90", hints: ["بعد Y=89"] },
    { id: "gp2", promptAr: "chr(72)؟", answer: "H", hints: ["65=A"] },
    { id: "gp3", promptAr: "ord('a') - ord('A')؟", answer: "32", hints: ["فرق ثابت"] },
  ],
  independentPractice: [
    { id: "ip1", promptAr: "ord('M')؟", answer: "77", hints: [] },
    { id: "ip2", promptAr: "chr(99)؟", answer: "c", hints: [] },
    { id: "ip3", promptAr: "ord(' ') (مسافة)؟", answer: "32", hints: [] },
    { id: "ip4", promptAr: "chr(48)؟", answer: "0", hints: [] },
  ],
  summary:
    "الحاسب يخزّن أحرفاً كأرقام. ASCII للإنجليزية الأساسية، Unicode/UTF-8 للعالم. ord/chr أدوات بايثون للتحويل. هذا أساس التشفير والملفات النصية.",
  linkedActivity: "/lessons/hex-colors",
};
