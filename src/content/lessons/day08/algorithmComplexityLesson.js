/** تعقيد الخوارزميات و Big-O — اليوم 8 | pdfPageIndex 384–388 */
export const algorithmComplexityLesson = {
  id: "algorithm-complexity",
  titleAr: "تعقيد الخوارزميات وترميز Big-O",
  pdfRefs: [
    { pdfPageIndex: 373, topic: "اليوم الثامن — تعزيز فهم الخوارزميات" },
    { pdfPageIndex: 384, topic: "مفهوم التعقيد الزمني" },
    { pdfPageIndex: 385, topic: "Big-O Notation — التعريف" },
    { pdfPageIndex: 386, topic: "أمثلة O(1), O(n), O(n²)" },
    { pdfPageIndex: 387, topic: "ربط التعقيد بالبحث والفرز" },
    { pdfPageIndex: 388, topic: "مقارنة خوارزميات اليوم 5" },
  ],
  vocabularyAr: [
    { term: "التعقيد الزمني", def: "كيف ينمو وقت التشغيل مع زيادة حجم المدخلات n." },
    { term: "Big-O", def: "ترميز يصف الحد الأعلى لنمو التكلفة — نهتم بالسلوك عند n كبير." },
    { term: "O(1)", def: "زمن ثابت — لا يعتمد على n، مثل قراءة عنصر في موضع معروف." },
    { term: "O(n)", def: "زمن خطي — يتناسب مع n، مثل المرور على كل عنصر مرة واحدة." },
    { term: "O(n²)", def: "زمن تربيعي — حلقتان متداخلتان على n، مثل Selection Sort." },
    { term: "حجم المدخلات (n)", def: "عدد العناصر أو طول القائمة/النص — المتغير الذي نقيس عليه النمو." },
  ],
  learningObjectives: [
    "شرح لماذا نقيس «سرعة» الخوارزمية عند n كبير وليس عند n=5 فقط.",
    "تمييز O(1) و O(n) و O(n²) بأمثلة من بايثون.",
    "ربط Linear Search بـ O(n) و Binary Search بـ O(log n) تقريبيًا.",
    "ربط Selection Sort بـ O(n²) كما درست في اليوم 5.",
    "تقدير عدد العمليات في حلقة بسيطة وحلقتين متداخلتين.",
    "مقارنة خوارزميتين لنفس المشكلة (بحث خطي vs ثنائي) من حيث Big-O.",
    "قراءة جدول n مقابل «عدد الخطوات» في PDF دون حفظ صيغ رياضية معقدة.",
  ],
  whyLearn:
    "عندما تكبر البيانات (آلاف الطلاب، ملايين السجلات) الفرق بين O(n) و O(n²) يصبح فرقًا بين ثوانٍ وساعات. Big-O لغة مشتركة بين المبرمجين — يربط ما تعلمته في البحث والفرز (اليوم 5) بسبب بطء أو سرعة كل خوارزمية.",
  prerequisites: ["linear-search", "binary-search", "sorting-algorithms", "fibonacci-sequence", "python-for-range", "algorithms"],
  conceptSimple:
    "Big-O يصف «كيف يكبر العمل» مع n. حلقة واحدة على n عنصر ≈ O(n). حلقتان على n ≈ O(n²). Binary Search يقسم المساحة كل مرة ≈ O(log n). قراءة arr[0] = O(1). لا نحسب الثواني بالضبط — نحسب «نمط النمو».",
  deepSections: [
    {
      id: "why-complexity",
      titleAr: "لماذا التعقيد؟",
      bodyAr:
        "برنامج سريع على 10 عناصر قد يتجمد على 100000. Big-O يتنبأ بالسلوك عند n→∞. في PDF اليوم 8 يُعزَّز فهم الخوارزميات بعد فيبوناتشي — قبل برج هانوي وملفات الإدخال/الإخراج.",
    },
    {
      id: "big-o-meaning",
      titleAr: "معنى Big-O",
      bodyAr:
        "«O» = «تنمو تقريبًا كـ…». O(n) يعني: إذا ضاعفت n يتضاعف الوقت تقريبًا. نتجاهل الثوابت (3n → O(n)) ونركز على أسرع نمو (n²+n → O(n²)).",
    },
    {
      id: "constant-linear",
      titleAr: "O(1) و O(n)",
      bodyAr:
        "O(1): return lst[5] — خطوة واحدة. O(n): for x in lst: print(x) — n خطوة. Linear Search في أسوأ حالة يفحص كل العناصر → O(n).",
    },
    {
      id: "quadratic",
      titleAr: "O(n²)",
      bodyAr:
        "for i in range(n): for j in range(n): … — n×n. Selection Sort: حلقة خارجية n وداخلية تقارن تقريبًا n → O(n²). درّست ذلك في sorting-algorithms — الآن تفهم «لماذا» بطيء على قوائم ضخمة.",
    },
    {
      id: "logarithmic",
      titleAr: "O(log n) — Binary Search",
      bodyAr:
        "كل خطوة تقسم n إلى النصف: n → n/2 → n/4 … عدد الخطوات ≈ log₂(n). Binary Search (اليوم 5) يحتاج قائمة مرتبة لكنه أسرع بكثير من Linear Search على n كبير.",
    },
    {
      id: "compare-day5",
      titleAr: "ربط اليوم 5",
      bodyAr:
        "Linear Search: O(n). Binary Search: O(log n) لكن يتطلب فرزًا O(n²) أو أفضل مسبقًا. Selection Sort: O(n²). الجدول في PDF يقارن: n=1000 → البحث الخطي ~1000 خطوة، الثنائي ~10.",
    },
    {
      id: "fibonacci-complexity",
      titleAr: "فيبوناتشي والتعقيد",
      bodyAr:
        "fib_loop: O(n). fib_recursive البسيط: O(2ⁿ) تقريبًا — يتكرر نفس العمل. هذا يوضح أن «استدعاء ذاتي» لا يعني «سريع» — Big-O يكشف الفرق. درس فيبوناتشي السابق يكمّل هنا.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد n", bodyAr: "ما حجم المدخل؟ طول القائمة، عدد الطلاب…" },
    { titleAr: "2) عد الحلقات", bodyAr: "حلقة على n → عامل n؛ متداخلتا n → n²." },
    { titleAr: "3) صنّف Big-O", bodyAr: "O(1), O(log n), O(n), O(n²) — اختر الأسرع نموًا." },
    { titleAr: "4) راجع Linear Search", bodyAr: "حلقة واحدة → O(n)." },
    { titleAr: "5) راجع Binary Search", bodyAr: "تقسيم متكرر → O(log n)." },
    { titleAr: "6) راجع Selection Sort", bodyAr: "حلقتان → O(n²)." },
    { titleAr: "7) قارن عند n كبير", bodyAr: "O(log n) ≪ O(n) ≪ O(n²) ≪ O(2ⁿ)." },
  ],
  workedExamples: [
    {
      id: "complexity-ex-1",
      titleAr: "حلقة واحدة",
      difficulty: "سهل",
      steps: [
        "def sum_list(lst): s=0",
        "for x in lst: s += x",
        "n = len(lst) تكرارات",
        "Big-O: O(n)",
      ],
      result: "O(n)",
    },
    {
      id: "complexity-ex-2",
      titleAr: "Linear Search",
      difficulty: "متوسط",
      steps: [
        "for i in range(len(arr)): if arr[i]==target: return i",
        "أسوأ حالة: target في النهاية أو غير موجود",
        "n مقارنة محتملة",
        "O(n)",
      ],
      result: "O(n)",
    },
    {
      id: "complexity-ex-3",
      titleAr: "Selection Sort",
      difficulty: "متوسط",
      steps: [
        "حلقة i من 0 إلى n-1",
        "داخلها بحث عن الأصغر ≈ n-i",
        "مجموع ≈ n(n-1)/2",
        "O(n²)",
      ],
      result: "O(n²)",
    },
  ],
  commonMistakes: [
    {
      titleAr: "الخلط بين O(n) و O(n²)",
      bodyAr: "حلقة واحدة على n = O(n). حلقتان متداخلتان كل منهما n = O(n²) — لا تعد فقط «عدد الحلقات» دون حجم كل حلقة.",
      step: "loops",
    },
    {
      titleAr: "تجاهل شرط Binary Search",
      bodyAr: "O(log n) للبحث الثنائي يفترض قائمة مرتبة — تكلفة الفرز منفصلة.",
      step: "binary-search",
    },
    {
      titleAr: "قياس الوقت على n صغير فقط",
      bodyAr: "برنامج O(n²) قد يبدو سريعًا على 20 عنصرًا — Big-O يهم عند آلاف العناصر.",
      step: "why",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "حلقة واحدة على n عناصر Big-O؟", answer: "O(n)", hintAr: "خطي" },
      { id: "q2", promptAr: "Selection Sort غالبًا Big-O؟", answer: "O(n^2)", hintAr: "حلقتان" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "for x in arr: print(x) — Big-O?", answer: "O(n)", hints: ["حلقة واحدة"] },
    { id: "g2", promptAr: "Linear Search — Big-O?", answer: "O(n)", hints: ["اليوم 5"] },
    { id: "g3", promptAr: "Selection Sort — Big-O?", answer: "O(n^2)", hints: ["حلقتان"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "return arr[0] — Big-O?", answer: "O(1)", hints: ["ثابت"] },
    { id: "i2", promptAr: "Binary Search — Big-O تقريبي?", answer: "O(log n)", hints: ["تقسيم"] },
    { id: "i3", promptAr: "أبطأ من O(n) في القائمة: O(n) أم O(n²)?", answer: "O(n^2)", hints: ["تربيعي"] },
  ],
  challengeAr:
    "أنشئ جدولًا: n = 10, 100, 1000 — قدّر عدد خطوات Linear Search (n) و Binary Search (log₂ n) و Selection Sort (n²/2) — لاحظ أيها ينفجر أولًا.",
  summary:
    "Big-O يصف نمو وقت الخوارزمية مع n: O(1) ثابت، O(n) خطي، O(log n) لوغاريثمي، O(n²) تربيعي. Linear Search O(n)، Binary Search O(log n)، Selection Sort O(n²) — ربط مباشر بدروس البحث والفرز في اليوم 5.",
  linkedActivity: "/lessons/algorithm-complexity#lab",
};
