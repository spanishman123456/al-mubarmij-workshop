/** الملفات وقراءة/كتابة البيانات في بايثون — اليوم 8 | pdfPageIndex 399–401 */
export const pythonFilesIoLesson = {
  id: "python-files-io",
  titleAr: "الملفات: فتح وقراءة وكتابة البيانات في بايثون",
  pdfRefs: [
    { pdfPageIndex: 373, topic: "اليوم الثامن — خاتمة وموضوعات متقدمة" },
    { pdfPageIndex: 397, topic: "تطبيقات البحث والفرز — حفظ النتائج" },
    { pdfPageIndex: 399, topic: "مفهوم الملف وملف المخرجات" },
    { pdfPageIndex: 400, topic: "open() و read() و write()" },
    { pdfPageIndex: 401, topic: "with وفصل السطور والترميز" },
    { pdfPageIndex: 402, topic: "خاتمة اليوم الثامن" },
  ],
  vocabularyAr: [
    { term: "ملف (File)", def: "كائن تخزين دائم على القرص — نص أو بيانات تبقى بعد إغلاق البرنامج." },
    { term: "open()", def: "دالة بايثون لفتح ملف — تُرجع كائن ملف للقراءة أو الكتابة." },
    { term: "وضع (Mode)", def: "'r' قراءة، 'w' كتابة (يمسح المحتوى)، 'a' إلحاق، 'r+' قراءة وكتابة." },
    { term: "with", def: "سياق يغلق الملف تلقائيًا عند الخروج — أفضل ممارسة لتجنب نسيان close()." },
    { term: "read() / readlines()", def: "read() يقرأ كل المحتوى؛ readlines() قائمة بالأسطر مع \\n." },
    { term: "write()", def: "يكتب نصًا إلى الملف — غالبًا مع \\n لسطر جديد." },
  ],
  learningObjectives: [
    "شرح الفرق بين البيانات في الذاكرة (متغيرات) والبيانات في ملف على القرص.",
    "فتح ملف نصي للقراءة بـ open('file.txt', 'r', encoding='utf-8').",
    "قراءة محتوى الملف كاملًا أو سطرًا بسطر.",
    "كتابة نتائج برنامج (مثل فيبوناتشي أو البحث) إلى ملف مخرجات.",
    "استخدام with open(...) as f: لإغلاق الملف تلقائيًا.",
    "التعامل مع FileNotFoundError عند مسار خاطئ.",
    "ربط حفظ الملفات بنتائج خوارزميات البحث والفرز من اليوم 5.",
  ],
  whyLearn:
    "بدون ملفات تضيع كل النتائج عند إغلاق البرنامج. PDF يذكر «ملف المخرجات» — مثل حفظ نتائج فرز أو قائمة فيبوناتشي. open/read/write مهارة أساسية قبل قواعد البيانات والشبكات في أي مشروع حقيقي.",
  prerequisites: ["python-intro", "python-scope", "linear-search", "sorting-algorithms", "fibonacci-sequence"],
  conceptSimple:
    "with open('data.txt', 'r', encoding='utf-8') as f: text = f.read(). للكتابة: open('out.txt', 'w') as f: f.write('سطر\\n'). الملف يُغلق تلقائيًا مع with. المسار قد يكون نسبيًا لمجلد البرنامج.",
  deepSections: [
    {
      id: "file-vs-memory",
      titleAr: "ملف مقابل ذاكرة",
      bodyAr:
        "المتغيرات في RAM تختفي عند انتهاء البرنامج. الملف على القرص يبقى — grades.txt، log.txt، output.txt. وحدة المعالجة تقرأ/تكتب عبر نظام التشغيل — كما في PDF عند حديث «سجلات الملفات».",
    },
    {
      id: "open-modes",
      titleAr: "open والأوضاع",
      bodyAr:
        "f = open('notes.txt', 'r') — قراءة فقط؛ إن لم يوجد الملف → FileNotFoundError. 'w' — يُنشئ أو يمسح ثم يكتب. 'a' — يضيف في النهاية دون مسح. استخدم encoding='utf-8' للعربية.",
    },
    {
      id: "reading",
      titleAr: "قراءة المحتوى",
      bodyAr:
        "content = f.read() — نص كامل. for line in f: — سطر بسطر (فعّال للملفات الكبيرة). lines = f.readlines() — قائمة. strip() يزيل \\n من نهاية السطر.",
    },
    {
      id: "writing",
      titleAr: "كتابة المخرجات",
      bodyAr:
        "with open('fib_out.txt', 'w', encoding='utf-8') as f: for i in range(10): f.write(str(fib(i)) + '\\n'). PDF «ملف المخرجات» — احفظ نتائج خوارزمية بدل print فقط.",
    },
    {
      id: "with-statement",
      titleAr: "عبارة with",
      bodyAr:
        "with open(path) as f: … — يستدعي f.close() حتى عند خطأ. بدون with: f=open(); …; f.close() — خطر نسيان close يبقي الملف «مقفلًا».",
    },
    {
      id: "paths-errors",
      titleAr: "المسارات والأخطاء",
      bodyAr:
        "مسار نسبي: 'data/scores.txt'. FileNotFoundError: تحقق من الاسم والمجلد. PermissionError: لا صلاحية كتابة. جرّب os.path.exists(path) قبل القراءة في برامج أكبر.",
    },
    {
      id: "link-search-sort",
      titleAr: "ربط البحث والفرز",
      bodyAr:
        "بعد Linear Search: with open('found.txt','w') as f: f.write(f'index={i}\\n'). بعد Selection Sort: اكتب القائمة المرتبة سطرًا لكل عنصر. يربط اليوم 8 بيوم 5 عمليًا — البيانات تبقى محفوظة.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) حدد الملف والوضع", bodyAr: "قراءة 'r' أم كتابة 'w' أم إلحاق 'a'?" },
    { titleAr: "2) استخدم with", bodyAr: "with open(name, mode, encoding='utf-8') as f:" },
    { titleAr: "3) اقرأ أو اكتب", bodyAr: "read() أو for line in f أو write()." },
    { titleAr: "4) عالج الأسطر", bodyAr: "line.strip() — split() إن كان CSV بسيط." },
    { titleAr: "5) احفظ النتائج", bodyAr: "اكتب مخرجات الخوارزمية بدل الاكتفاء بالطباعة." },
    { titleAr: "6) تحقق من الملف", bodyAr: "افتحه في المحرر — هل المحتوى صحيح؟" },
    { titleAr: "7) تعامل مع الأخطاء", bodyAr: "try/except FileNotFoundError — رسالة واضحة للمستخدم." },
  ],
  workedExamples: [
    {
      id: "io-ex-1",
      titleAr: "قراءة ملف كامل",
      difficulty: "سهل",
      steps: [
        "with open('hello.txt', 'r', encoding='utf-8') as f:",
        "    text = f.read()",
        "print(text)",
        "يعرض كل محتوى hello.txt",
      ],
      result: "محتوى الملف",
    },
    {
      id: "io-ex-2",
      titleAr: "كتابة ثلاثة أسطر",
      difficulty: "متوسط",
      steps: [
        "with open('out.txt', 'w', encoding='utf-8') as f:",
        "    f.write('السطر 1\\n')",
        "    f.write('السطر 2\\n')",
        "الملف يحتوي سطرين + \\n",
      ],
      result: "out.txt مُنشأ",
    },
    {
      id: "io-ex-3",
      titleAr: "حفظ فيبوناتشي",
      difficulty: "متوسط",
      steps: [
        "with open('fib.txt','w') as f:",
        "  for n in range(8):",
        "    f.write(f'F({n})={fib(n)}\\n')",
        "ثمانية أسطر: F(0)=0 … F(7)=13",
      ],
      result: "fib.txt",
    },
  ],
  commonMistakes: [
    {
      titleAr: "نسيان encoding للعربية",
      bodyAr: "بدون encoding='utf-8' قد تظهر رموز غريبة — خاصة على Windows.",
      step: "encoding",
    },
    {
      titleAr: "استخدام 'w' بالخطأ",
      bodyAr: "وضع 'w' يمسح الملف القديم — استخدم 'a' للإضافة أو احفظ نسخة احتياطية.",
      step: "modes",
    },
    {
      titleAr: "نسيان \\n عند write",
      bodyAr: "write('abc') write('def') → abcdef في سطر واحد — أضف '\\n' لكل سطر.",
      step: "writing",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "ما وضع الإلحاق دون مسح الملف؟", answer: "a", hintAr: "append" },
      { id: "q2", promptAr: "ما العبارة التي تغلق الملف تلقائيًا؟", answer: "with", hintAr: "context manager" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "وضع القراءة فقط?", answer: "r", hints: ["read"] },
    { id: "g2", promptAr: "ما الذي يغلق الملف تلقائيًا?", answer: "with", hints: ["context manager"] },
    { id: "g3", promptAr: "كتابة تمسح القديم?", answer: "w", hints: ["write"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "read() يقرأ?", answer: "كل الملف", hints: ["نص كامل"] },
    { id: "i2", promptAr: "خطأ عند ملف غير موجود?", answer: "FileNotFoundError", hints: ["مسار"] },
    { id: "i3", promptAr: "إلحاق دون مسح?", answer: "a", hints: ["append"] },
  ],
  challengeAr:
    "اكتب برنامجًا يقرأ أعدادًا من numbers.txt (سطر لكل عدد)، يطبّق Linear Search للبحث عن هدف، ويكتب النتيجة في result.txt — اربط I/O بخوارزمية من اليوم 5.",
  summary:
    "open(path, mode, encoding) يفتح ملفًا؛ with يضمن الإغلاق. read/readlines/for line للقراءة؛ write للكتابة. 'r'/'w'/'a' تحدد السلوك. حفظ المخرجات في ملف يجعل نتائج البحث والفرز وفيبوناتشي دائمة — مهارة ختامية لليوم 8.",
  linkedActivity: "/lessons/python-files-io#lab",
};
