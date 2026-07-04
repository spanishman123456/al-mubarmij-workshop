/**
 * مكمل العدد 2 — تمثيل سالب و Overflow
 * pdfPageIndex: 103–105
 */
export const twosComplementLesson = {
  id: "twos-complement",
  titleAr: "مكمل العدد 2: الأعداد السالبة والطرح",
  pdfRefs: [
    { pdfPageIndex: 103, topic: "الطرح بمكمل 2" },
    { pdfPageIndex: 104, topic: "عدد البتات والسالب" },
    { pdfPageIndex: 105, topic: "Overflow" },
  ],
  learningObjectives: [
    "شرح سبب تمثيل الأعداد السالبة في الحاسب.",
    "تحديد عدد البتات n ومجال القيم [−2^(n−1), 2^(n−1)−1].",
    "تطبيق: قلب البتات + 1 للسالب.",
    "قراءة قيمة من bit pattern.",
    "تنفيذ a−b كـ a+(−b) بحذف carry الزائد.",
    "اكتشاف overflow عند تجاوز المجال.",
  ],
  whyLearn: "بدون مكمل 2 لا يوجد طرح موحّد في الدوائر — كل معالج يستخدمه. 8-bit: −128..127.",
  prerequisites: ["الجمع الثنائي", "أنظمة العد"],
  conceptSimple:
    "لـ −5 في 8 bits: |5|=00000101 → flip → 11111010 → +1 → 11111011. MSB=1 يعني سالب. a−b = a+(twos(-b))؛ تجاهل carry بعد n bits.",
  deepSections: [
    { id: "why", titleAr: "لماذا مكمل 2؟", bodyAr: "دائرة واحدة للجمع والطرح — لا دائرة طرح منفصلة." },
    { id: "bits", titleAr: "عدد البتات", bodyAr: "n=8 → −128..127. n=4 → −8..7." },
    { id: "positive", titleAr: "موجب", bodyAr: "MSB=0 — binary عادي." },
    { id: "negative", titleAr: "سالب", bodyAr: "flip + 1." },
    { id: "read", titleAr: "قراءة pattern", bodyAr: "11111011 في 8-bit → flip+1 → 5 → −5." },
    { id: "subtract", titleAr: "طرح = جمع", bodyAr: "7−3: 7 + twos(−3)." },
    { id: "discard", titleAr: "حذف carry", bodyAr: "9-bit result → خذ 8 bits فقط." },
    { id: "overflow", titleAr: "Overflow", bodyAr: "127+1 في 8-bit → −128 (wrap). إشارة: carry into MSB ≠ carry out." },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد n", bodyAr: "8 bits شائع في PDF." },
    { titleAr: "2) |x| binary", bodyAr: "n bits." },
    { titleAr: "3) flip", bodyAr: "0↔1." },
    { titleAr: "4) +1", bodyAr: "binary add." },
    { titleAr: "5) للطرح", bodyAr: "twos(−b) + a." },
    { titleAr: "6) قصّ n bits", bodyAr: "تجاهل carry." },
  ],
  workedExamples: [
    { id: "neg5", titleAr: "−5 في 8-bit", steps: ["5=00000101", "flip 11111010", "+1 → 11111011"], result: "11111011" },
    { id: "neg1", titleAr: "−1", steps: ["00000001", "11111110+1", "11111111"], result: "11111111" },
    { id: "read", titleAr: "قراءة 11111000", steps: ["flip 00000111", "+1=8", "−8"], result: "-8" },
    { id: "sub", titleAr: "7−3", steps: ["7=00000111", "−3=11111101", "sum 00000100=4"], result: "4" },
    { id: "ovf", titleAr: "127+1 overflow", steps: ["01111111+1", "10000000=−128"], result: "overflow" },
  ],
  interactiveExample: { type: "twos-complement-lab", defaultValue: "-5", bits: 8 },
  commonMistakes: [
    { titleAr: "flip دون +1", bodyAr: "ones complement ≠ twos.", step: "plus1" },
    { titleAr: "n خاطئ", bodyAr: "11111011 4-bit ≠ 8-bit.", step: "width" },
    { titleAr: "overflow ignored", bodyAr: "127+1 ليس 128 في 8-bit.", step: "overflow" },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "8-bit min?", answer: "-128", hintAr: "" },
      { id: "q2", promptAr: "−1 in 8-bit?", answer: "11111111", hintAr: "" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "−2 in 4-bit (binary)?", answer: "1110", hints: ["flip 0010"] },
    { id: "g2", promptAr: "11111111 8-bit value?", answer: "-1", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "−10 8-bit last 4 bits?", answer: "1110", hints: ["full 11110110"] },
    { id: "i2", promptAr: "4-bit max positive?", answer: "7", hints: ["0111"] },
    { id: "i3", promptAr: "7+1 3-bit overflow?", answer: "نعم", hints: [] },
    { id: "i4", promptAr: "00000101 value?", answer: "5", hints: [] },
  ],
  summary: "سالب: flip+1. الطرح: جمع مكمل. احترم n bits و overflow.",
  linkedActivity: "/lessons/floating-point",
};
