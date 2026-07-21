/** الحقول المترابطة Tuples — اليوم 4 | pdfPageIndex 196–199 */
export const pythonTuplesLesson = {
  id: "python-tuples",
  titleAr: "الحقول المترابطة (Tuples) في بايثون",
  pdfRefs: [
    { pdfPageIndex: 196, topic: "Tuples intro" },
    { pdfPageIndex: 198, topic: "Tuple applications" },
  ],
  vocabularyAr: [
    { term: "tuple", def: "تسلسل مرتب غير قابل للتعديل بين أقواس (): (1, 2, 3)" },
    { term: "immutable", def: "لا يمكن تغيير عنصر بعد الإنشاء — على عكس list." },
    { term: "فهرس", def: "t[0] أول عنصر؛ t[-1] آخر عنصر." },
    { term: "تفكيك", def: "x, y = point — تعيين متوازٍ من عناصر tuple." },
  ],
  learningObjectives: [
    "إنشاء tuple والوصول بالفهرس.",
    "تمييز tuple عن list.",
    "تفكيك tuple في متغيرات.",
    "استخدام tuple لإحداثيات وأزواج ثابتة.",
  ],
  whyLearn: "Tuples مناسبة للبيانات الثابتة: إحداثيات، ألوان RGB، سجل طالب (اسم، صف).",
  prerequisites: ["python-arrays", "python-constants"],
  conceptSimple: "point = (3, 5) — زوج مرتب. point[0]=3. لا point[0]=9 بعد الإنشاء.",
  deepSections: [
    {
      id: "create",
      titleAr: "الإنشاء والفهرسة",
      bodyAr: "t = (10, 20, 30) أو t = 10, 20 — الفاصلة تُنشئ tuple. len(t)، t[i]، t[-1].",
    },
    {
      id: "vs-list",
      titleAr: "مقارنة مع list",
      bodyAr: "list قابلة للتعديل append؛ tuple أسرع وأوضح للثوابت. استخدم [] للقوائم و () للثوابت المرتبة.",
    },
    {
      id: "unpack",
      titleAr: "التفكيك",
      bodyAr: "x, y = (4, 7) — x=4, y=7. مفيد مع دوال ترجع أكثر من قيمة.",
    },
    {
      id: "nested",
      titleAr: "Tuples متداخلة",
      bodyAr: "grid = ((0,0), (1,0), (0,1)) — شبكة إحداثيات صغيرة.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) أنشئ", bodyAr: "rgb = (255, 128, 0)" },
    { titleAr: "2) اقرأ", bodyAr: "r = rgb[0]" },
    { titleAr: "3) لا تعدّل", bodyAr: "rgb[0]=300 → TypeError" },
    { titleAr: "4) فكّك", bodyAr: "r, g, b = rgb" },
    { titleAr: "5) طبّق", bodyAr: "دالة ترجع (quotient, remainder)" },
  ],
  workedExamples: [
    {
      id: "rgb",
      titleAr: "لون RGB",
      code: "orange = (255, 165, 0)\nr, g, b = orange\nprint(r, g, b)",
      steps: ["tuple ثلاثي", "تفكيك", "255 165 0"],
      result: "255 165 0",
    },
    {
      id: "coords",
      titleAr: "إحداثيات",
      code: "start = (0, 0)\nend = (5, 3)\ndx = end[0] - start[0]",
      steps: ["start[0]=0", "end[0]=5", "dx=5"],
      result: "dx = 5",
    },
    {
      id: "divmod",
      titleAr: "divmod",
      code: "q, r = divmod(17, 5)\nprint(q, r)",
      steps: ["divmod → tuple", "q=3", "r=2"],
      result: "3 2",
    },
  ],
  wrongExamples: [
    { titleAr: "t[0] = 5", bodyAr: "TypeError — tuple غير قابل للتعديل." },
    { titleAr: "t = [1,2)]", bodyAr: "خلط أقواس list و tuple." },
  ],
  interactiveExample: { type: "tuple-lab", defaultValue: "(10, 20, 30)" },
  commonMistakes: [
    { titleAr: "tuple من عنصر", bodyAr: "(5) رقم؛ (5,) tuple — الفاصلة مطلوبة.", step: "syntax" },
    { titleAr: "تفكيك بعدد خاطئ", bodyAr: "x,y = (1,2,3) → ValueError", step: "unpack" },
  ],
  quickCheck: {
    questions: [{ id: "q1", promptAr: "t=(2,4,6) — t[1]؟", answer: "4", hintAr: "فهرس من 0" }],
  },
  guidedPractice: [
    { id: "g1", promptAr: "len((1,2,3))?", answer: "3", hints: [] },
    { id: "g2", promptAr: "(5,) tuple؟", answer: "نعم", hints: ["فاصلة"] },
    { id: "g3", promptAr: "a,b=(7,8) — b?", answer: "8", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "t=(-1,0,1) — t[-1]?", answer: "1", hints: [] },
    { id: "i2", promptAr: "يمكن append لـ tuple؟", answer: "لا", hints: [] },
    { id: "i3", promptAr: "divmod(10,3) — r?", answer: "1", hints: ["الباقي"] },
  ],
  challengeAr: "اكتب دالة ترجع tuple (min, max) لقائمة أعداد.",
  summary: "Tuple = تسلسل ثابت مرتب. مثالي للإحداثيات والقيم التي لا تتغير.",
  linkedActivity: "/lessons/nested-loops-lab",
};
