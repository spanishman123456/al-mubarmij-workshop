/** البحث الثنائي — اليوم 5 | pdfPageIndex 262–272 */
export const binarySearchLesson = {
  id: "binary-search",
  titleAr: "البحث الثنائي (Binary Search)",
  pdfRefs: [
    { pdfPageIndex: 262, topic: "Binary search concept" },
    { pdfPageIndex: 272, topic: "Binary search trace" },
  ],
  vocabularyAr: [
    { term: "بحث ثنائي", def: "خوارزمية تبحث في قائمة مرتبة عبر تقسيم المجال إلى نصفين في كل خطوة." },
    { term: "low / high", def: "حدا المجال الحالي الذي نبحث داخله." },
    { term: "mid", def: "العنصر الأوسط في المجال الحالي للمقارنة." },
    { term: "O(log n)", def: "تعقيد يعني أن عدد الخطوات يزيد ببطء حتى مع بيانات كبيرة." },
  ],
  learningObjectives: [
    "تمييز شرط أساسي للبحث الثنائي: وجود ترتيب.",
    "تحديد low و high و mid في كل خطوة.",
    "تفسير قرار الذهاب للنصف الأيسر أو الأيمن.",
    "مقارنة عدد خطوات البحث الثنائي بالبحث الخطي.",
  ],
  whyLearn:
    "عند وجود بيانات مرتبة، البحث الثنائي يوفر عددًا كبيرًا من الخطوات مقارنة بالبحث الخطي، خصوصًا مع القوائم الكبيرة.",
  prerequisites: ["linear-search", "python-for-range", "if-statement"],
  conceptSimple:
    "ننظر لمنتصف القائمة: إن كان الهدف أصغر نبحث يسارًا، وإن كان أكبر نبحث يمينًا. في كل خطوة نرمي نصف العناصر غير الممكنة.",
  deepSections: [
    {
      id: "sorted-rule",
      titleAr: "شرط الترتيب",
      bodyAr:
        "إذا لم تكن القائمة مرتبة فلن تكون مقارنة المنتصف مفيدة. لذلك إمّا نضمن الترتيب مسبقًا أو نرتب أولًا قبل البحث الثنائي.",
    },
    {
      id: "boundaries",
      titleAr: "تحديث الحدود",
      bodyAr:
        "نبدأ بـ low=0 و high=n-1. عندما arr[mid] < target نجعل low = mid + 1، وعندما arr[mid] > target نجعل high = mid - 1.",
    },
    {
      id: "stop-condition",
      titleAr: "متى نتوقف؟",
      bodyAr:
        "نتوقف بنجاح عندما arr[mid] == target. ونتوقف بفشل عندما يصبح low > high، أي لا يوجد مجال صالح للبحث.",
    },
    {
      id: "efficiency",
      titleAr: "لماذا هو أسرع؟",
      bodyAr:
        "كل مقارنة تحذف نصف المجال. لذلك 1024 عنصرًا قد تحتاج حوالي 10 مقارنات فقط بدل مئات المقارنات في البحث الخطي.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) تأكد من ترتيب القائمة", bodyAr: "بدون ترتيب لا يعمل البحث الثنائي بشكل صحيح." },
    { titleAr: "2) عيّن low و high", bodyAr: "low=0 و high=آخر موضع." },
    { titleAr: "3) احسب mid", bodyAr: "mid = floor((low + high) / 2)." },
    { titleAr: "4) قارن وحدث الحدود", bodyAr: "حرّك low أو high حسب نتيجة المقارنة." },
    { titleAr: "5) أعد الموضع أو -1", bodyAr: "إذا انتهى المجال دون تطابق فالعنصر غير موجود." },
  ],
  workedExamples: [
    {
      id: "binary-ex-1",
      titleAr: "هدف موجود",
      difficulty: "سهل",
      steps: [
        "القائمة المرتبة: [2,4,7,9,13,18] والهدف 9.",
        "mid=2 (القيمة 7) أصغر من 9 → ننتقل يمينًا.",
        "المجال [3..5] ثم mid=4 (13) أكبر من 9 → يسارًا.",
        "mid=3 والقيمة 9 → نجاح.",
      ],
      result: "index = 3",
    },
    {
      id: "binary-ex-2",
      titleAr: "هدف غير موجود",
      difficulty: "متوسط",
      steps: [
        "القائمة: [1,3,5,7,9] والهدف 4.",
        "mid=2 (5) أكبر من 4 → مجال [0..1].",
        "mid=0 (1) أصغر → مجال [1..1].",
        "mid=1 (3) أصغر → low يصبح 2 > high=1.",
      ],
      result: "index = -1",
    },
    {
      id: "binary-ex-3",
      titleAr: "قائمة كبيرة",
      difficulty: "متقدم",
      steps: [
        "100 عنصر مرتبة من 1 إلى 100، الهدف 73.",
        "كل خطوة تقلل المجال تقريبًا للنصف.",
        "نصل للهدف خلال خطوات قليلة مقارنة بالبحث الخطي.",
      ],
      result: "خطوات قليلة ~ log2(100)",
    },
  ],
  wrongExamples: [
    {
      titleAr: "تطبيقه على قائمة غير مرتبة",
      bodyAr: "نتيجة البحث قد تكون خاطئة لأن قرار الاتجاه يعتمد على الترتيب.",
    },
    {
      titleAr: "تحديث low = mid بدل mid + 1",
      bodyAr: "قد يسبب حلقة لا نهائية عندما لا يتغير المجال.",
    },
  ],
  interactiveExample: { type: "binary-search-lab", defaultValue: "sorted-7" },
  commonMistakes: [
    {
      titleAr: "نسيان شرط low <= high",
      bodyAr: "يجب أن تستمر الحلقة فقط ما دام المجال صالحًا.",
      step: "loop",
    },
    {
      titleAr: "عدم استخدام floor",
      bodyAr: "mid يجب أن يكون عددًا صحيحًا يمثل موضعًا صحيحًا.",
      step: "mid",
    },
    {
      titleAr: "ترتيب نصي بدل رقمي",
      bodyAr: "عند التعامل مع أرقام نصية تأكد من التحويل قبل الفرز.",
      step: "sort",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "هل يعمل البحث الثنائي على قائمة غير مرتبة؟", answer: "لا", hintAr: "شرط أساسي" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "في [2,4,6,8,10] ابحث عن 6 — الموضع؟", answer: "2", hints: ["المنتصف أولًا"] },
    { id: "g2", promptAr: "في [1,5,9,12] ابحث عن 2 — الناتج؟", answer: "-1", hints: ["لا يوجد"] },
    { id: "g3", promptAr: "عدد الخطوات التقريبي لـ 16 عنصر؟", answer: "4", hints: ["2^4 = 16"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "في [3,7,11,15,19] ابحث عن 19 — الموضع؟", answer: "4", hints: ["آخر عنصر"] },
    { id: "i2", promptAr: "في [0,1,2,3,4] ابحث عن 0 — الموضع؟", answer: "0", hints: ["أصغر قيمة"] },
    { id: "i3", promptAr: "في [5,10,15,20] ابحث عن 17 — الناتج؟", answer: "-1", hints: ["غير موجود"] },
  ],
  challengeAr:
    "اكتب نسخة من البحث الثنائي تُرجع موضع أول ظهور للهدف إذا كانت القائمة تحتوي عناصر مكررة.",
  summary:
    "البحث الثنائي سريع جدًا مع القوائم المرتبة لأنه يحذف نصف الاحتمالات في كل خطوة. إذا لم تتوفر خاصية الترتيب فارجع للبحث الخطي.",
  linkedActivity: "/simulations#search",
};
