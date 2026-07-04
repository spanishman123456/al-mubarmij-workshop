/** المصفوفات متعددة المتغيرات — اليوم 3 */
export const multiDimArraysLesson = {
  id: "python-multi-arrays",
  titleAr: "المصفوفات متعددة المتغيرات",
  pdfRefs: [{ pdfPageIndex: 155, topic: "2D lists" }],
  learningObjectives: [
    "تمثيل جدول 2D كقائمة قوائم.",
    "الوصول grid[row][col].",
    "تعديل عنصر.",
  ],
  whyLearn: "لوحات، صور bitmap، جداول.",
  prerequisites: ["python-arrays"],
  conceptSimple: "matrix = [[1,2],[3,4]] — matrix[0][1]=2.",
  deepSections: [
    { id: "2d", titleAr: "قائمة قوائم", bodyAr: "صف = قائمة، مصفوفة = قائمة صفوف." },
    { id: "access", titleAr: "وصول", bodyAr: "m[r][c] — r صف، c عمود." },
    { id: "loop", titleAr: "تكرار", bodyAr: "for row in m: for x in row:" },
  ],
  stepsDetailed: [
    { titleAr: "1) أنشئ", bodyAr: "[[...],[...]]" },
    { titleAr: "2) اقرأ", bodyAr: "[r][c]" },
    { titleAr: "3) عدّل", bodyAr: "m[0][0]=9" },
    { titleAr: "4) iterate", bodyAr: "nested for" },
  ],
  workedExamples: [
    { id: "e1", titleAr: "2×2", code: "m=[[1,2],[3,4]]\nprint(m[1][0])", steps: ["m[1]=[3,4]", "m[1][0]=3"], result: "3" },
    { id: "e2", titleAr: "تعديل", code: "m[0][1]=9", steps: ["row0", "[[1,9],[3,4]]"], result: "9" },
  ],
  interactiveExample: { type: "if-lab", defaultValue: "m=[[1,2],[3,4]]\nprint(m[0][1])" },
  commonMistakes: [
    { titleAr: "index order", bodyAr: "[row][col] not [col][row].", step: "order" },
    { titleAr: "ragged rows", bodyAr: "صفوف بأطوال مختلفة — انتبه للفهرس.", step: "shape" },
  ],
  quickCheck: { questions: [{ id: "q1", promptAr: "m[0][0] first?", answer: "نعم", hintAr: "" }] },
  guidedPractice: [
    { id: "g1", promptAr: "[[1,2],[3,4]][1][1]?", answer: "4", hints: [] },
    { id: "g2", promptAr: "len([[1],[2,3]])?", answer: "2", hints: [] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "2×2 m[0][1] after m[0][1]=0?", answer: "0", hints: [] },
    { id: "i2", promptAr: "rows in 3×1?", answer: "3", hints: [] },
  ],
  summary: "2D = list of lists — [row][col].",
  linkedActivity: "/lessons/python-break-continue",
};
