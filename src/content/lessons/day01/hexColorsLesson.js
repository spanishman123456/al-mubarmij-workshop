/**
 * ألوان Hex — اليوم الأول
 * pdfPage: 50, 51
 */
export const hexColorsLesson = {
  id: "hex-colors",
  titleAr: "الألوان بنظام Hex (#RRGGBB)",
  pdfRefs: [
    { pdfPage: 50, topic: "تحويل النظام الست عشري — 20 دقيقة" },
    { pdfPage: 51, topic: "خطوات تطبيق ألوان Hex في CSS/HTML" },
  ],
  learningObjectives: [
    "شرح أن #RRGGBB يستخدم النظام الست عشري لثلاث قنوات: أحمر، أخضر، أزرق.",
    "تحويل قيمة 0–255 لكل قناة إلى hex من خانتين (مثل 255 → FF).",
    "قراءة وكتابة ألوان شائعة: #000000، #FFFFFF، #FF0000، #00FF00، #0000FF.",
    "دمج RGB في بايثون: f'#{r:02X}{g:02X}{b:02X}'.",
    "ربط hex بدرس أنظمة العد (أساس 16، A=10…F=15).",
    "تطبيق اللون في CSS: color، background-color.",
  ],
  whyLearn:
    "كل موقع وتطبيق يستخدم hex colors. عندما ترى #3B82F6 في Tailwind أو Figma، أنت تقرأ ثلاثة bytes بالست عشري. بعد درس أنظمة العد، hex ليس «كوداً سرياً» بل R=59, G=130, B=246.",
  prerequisites: [
    "درس أنظمة العد — خاصة الأساس 16 و A–F.",
    "ASCII/Unicode (اختياري للنص الملون).",
  ],
  conceptSimple:
    "#RRGGBB: كل زوج hex = قناة لون 0–255. FF = 255 (أقصى)، 00 = 0 (لا لون). #FF0000 = أحمر كامل. #FFFFFF = أبيض (كل القنوات max). #000000 = أسود.",
  deepSections: [
    {
      id: "rgb-model",
      titleAr: "نموذج RGB",
      bodyAr:
        "الشاشة تخلط أحمر+أخضر+أزرق. (255,0,0) أحمر. (255,255,0) أصفر = أحمر+أخضر. (0,0,0) لا ضوء = أسود.",
    },
    {
      id: "hex-pairs",
      titleAr: "لماذا خانتان hex لكل قناة؟",
      bodyAr:
        "byte واحد = 0–255 = 256 قيمة. hex digit = 16 حالة، خانتان = 16² = 256. FF₁₆ = 15×16+15 = 255.",
    },
    {
      id: "convert-channel",
      titleAr: "تحويل قناة إلى hex",
      bodyAr:
        "255 ÷ 16 = 15 r15 → FF. 68 ÷ 16 = 4 r4 → 44. 10 → A، 11 → B… استخدم جدول القسمة المتكررة من درس العد.",
    },
    {
      id: "css-usage",
      titleAr: "في CSS/HTML",
      bodyAr:
        "style='color: #FF0000' أو class Tailwind. الشفافية: #RRGGBBAA (8 hex) — اختياري متقدم.",
    },
  ],
  terms: [
    { termAr: "#RRGGBB", definitionAr: "صيغة hex لستة خانات: أحمر، أخضر، أزرق." },
    { termAr: "RGB", definitionAr: "Red Green Blue — نموذج ألوان additive." },
    { termAr: "قناة", definitionAr: "مكوّن واحد 0–255 قبل التحويل لhex." },
    { termAr: ":02X", definitionAr: "تنسيق بايثون: hex بخانتين uppercase." },
  ],
  stepsDetailed: [
    { titleAr: "1) اختر لوناً", bodyAr: "مثل أحمر كامل R=255,G=0,B=0." },
    { titleAr: "2) حوّل كل قناة", bodyAr: "255→FF، 0→00." },
    { titleAr: "3) ادمج", bodyAr: "#FF0000." },
    { titleAr: "4) تحقق عكسياً", bodyAr: "FF→255، 00→0." },
    { titleAr: "5) جرّب في المعاينة", bodyAr: "غيّر القيم وشاهد اللون." },
    { titleAr: "6) بايثون", bodyAr: "print(f'#{255:02X}{0:02X}{0:02X}')" },
  ],
  workedExamples: [
    {
      id: "ex-red",
      titleAr: "مثال 1: أحمر #FF0000",
      steps: ["R=255→FF, G=0→00, B=0→00", "الدمج #FF0000", "تحقق: FF=255 ✓"],
      result: "#FF0000",
    },
    {
      id: "ex-green",
      titleAr: "مثال 2: أخضر #00FF00",
      steps: ["R=0, G=255, B=0", "#00FF00"],
      result: "#00FF00",
    },
    {
      id: "ex-blue-mix",
      titleAr: "مثال 3: #4444 (68,68,68) رمادي",
      steps: ["68 ÷ 16 = 4 r4 → 44", "RR=GG=BB=44", "#444444"],
      result: "#444444",
    },
    {
      id: "ex-python",
      titleAr: "مثال 4: بايثون",
      code: "r,g,b = 59, 130, 246\nprint(f'#{r:02X}{g:02X}{b:02X}')",
      steps: ["59→3B, 130→82, 246→F6", "الناتج #3B82F6"],
      result: "#3B82F6",
    },
  ],
  interactiveExample: {
    type: "hex-color-lab",
    defaultValue: "#FF0000",
    promptAr: "حرّك منزلقات RGB وشاهد hex.",
  },
  commonMistakes: [
    { titleAr: "ترتيب BGR", bodyAr: "بعض APIs تستخدم BGR — CSS دائماً RGB.", step: "order" },
    { titleAr: "خانة واحدة", bodyAr: "#F00 shorthand = #FF0000 — ثلاث خانات فقط.", step: "shorthand" },
    { titleAr: "نسيان #", bodyAr: "في CSS يجب # قبل hex.", step: "css" },
    { titleAr: "A=10 confusion", bodyAr: "في hex A=10 وليس 'حرف عشوائي'.", step: "hex" },
  ],
  quickCheck: {
    questions: [
      { id: "qc1", promptAr: "255₁₀ hex؟", answer: "FF", hintAr: "15,15" },
      { id: "qc2", promptAr: "#FFFFFF = ?", answer: "أبيض", hintAr: "كل max" },
      { id: "qc3", promptAr: "0₁₀ hex؟", answer: "00", hintAr: "صفر" },
      { id: "qc4", promptAr: "10₁₀ hex؟", answer: "0A", hintAr: "A=10" },
    ],
  },
  guidedPractice: [
    { id: "gp1", promptAr: "128₁₀ → hex (خانتان)", answer: "80", hints: ["128/16=8r0", "8→8, 0→0"] },
    { id: "gp2", promptAr: "R=255,G=255,B=0 → #?", answer: "FFFF00", hints: ["أصفر", "FF FF 00"] },
    { id: "gp3", promptAr: "A₁₆ = ?₁₀", answer: "10", hints: ["A=10"] },
  ],
  independentPractice: [
    { id: "ip1", promptAr: "15₁₀ → hex", answer: "0F", hints: [] },
    { id: "ip2", promptAr: "#0000FF لون؟", answer: "أزرق", hints: [] },
    { id: "ip3", promptAr: "64₁₀ → hex", answer: "40", hints: [] },
    { id: "ip4", promptAr: "C₁₆ = ?₁₀", answer: "12", hints: [] },
  ],
  summary:
    "Hex colors = RGB بالست عشري. كل زوج 00–FF. اربط بدرس العد: FF=255. استخدم المعاينة التفاعلية وCSS للتطبيق.",
  linkedActivity: "/simulations#number-converter",
};
