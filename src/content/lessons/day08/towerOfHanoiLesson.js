/** برج هانوي والحل الاستدعائي الذاتي — اليوم 8 | pdfPageIndex ~395 */
export const towerOfHanoiLesson = {
  id: "tower-of-hanoi",
  titleAr: "لغز برج هانوي والحل الاستدعائي",
  pdfRefs: [
    { pdfPageIndex: 373, topic: "اليوم الثامن — الاستدعاء الذاتي في تطبيقات كلاسيكية" },
    { pdfPageIndex: 392, topic: "تمهيد لألغاز التقسيم والتكرار" },
    { pdfPageIndex: 394, topic: "قواعد برج هانوي" },
    { pdfPageIndex: 395, topic: "الحل الاستدعائي وعدد الحركات" },
    { pdfPageIndex: 396, topic: "تتبّع hanoi(3) خطوة بخطوة" },
    { pdfPageIndex: 397, topic: "ربط برج هانوي بـ Big-O و 2ⁿ" },
  ],
  vocabularyAr: [
    { term: "برج هانوي", def: "لغز يتكون من أقراص بأحجام مختلفة على ثلاثة أعمدة — نقل الكل إلى عمود الهدف بقواعد محددة." },
    { term: "قرص (Disk)", def: "قطعة دائرية بحجم واحد — لا يُوضَع قرص أكبر فوق قرص أصغر." },
    { term: "عمود (Peg/Rod)", def: "أحد الأعمدة الثلاثة: المصدر، الوسيط، الهدف — source, auxiliary, destination." },
    { term: "حركة (Move)", def: "نقل قرص واحد من عمود إلى عمود آخر وفق القواعد." },
    { term: "hanoi(n, src, aux, dst)", def: "دالة استدعائية: انقل n أقراص من src إلى dst باستخدام aux." },
    { term: "2ⁿ − 1", def: "الحد الأدنى لعدد الحركات لـ n أقراص — n=3 → 7 حركات." },
  ],
  learningObjectives: [
    "شرح قواعد برج هانوي الثلاث بلغة بسيطة.",
    "حل اللغز يدويًا لـ n=2 و n=3 وكتابة تسلسل الحركات.",
    "كتابة دالة hanoi(n, source, auxiliary, destination) بالاستدعاء الذاتي.",
    "تحديد الحالة الأساسية: n=1 → حركة واحدة مباشرة.",
    "تتبّع الاستدعاءات لـ hanoi(3) على الورق.",
    "حساب عدد الحركات = 2ⁿ − 1 وربطه بتعقيد O(2ⁿ).",
    "ربط اللغز بدرس فيبوناتشي والاستدعاء الذاتي من نفس اليوم.",
  ],
  whyLearn:
    "برج هانوي أشهر مثال على «قسّم المشكلة»: لنقل n قرصًا، انقل n−1 إلى الوسيط، انقل الأكبر، ثم انقل n−1 من الوسيط إلى الهدف. نفس نمط التفكير في خوارزميات التقسيم والتراجع — ويُثبت أن الاستدعاء الذاتي ليس مجرد فيبوناتشي.",
  prerequisites: ["fibonacci-sequence", "algorithm-complexity", "python-scope", "algorithms"],
  conceptSimple:
    "ثلاثة أعمدة وأقراص من الأكبر للأصغر. القواعد: (1) قرص واحد في كل حركة (2) قرص أعلى فقط (3) لا قرص كبير فوق صغير. hanoi(n): انقل n−1 للوسيط، انقل الأكبر للهدف، انقل n−1 من الوسيط للهدف. n=1: انقل مباشرة.",
  deepSections: [
    {
      id: "rules",
      titleAr: "قواعد اللغز",
      bodyAr:
        "ابدأ بكل الأقراص على عمود A (المصدر). الهدف: نقلها إلى C. يمكن استخدام B كوسيط. في كل خطوة: انقل قرصًا واحدًا من رأس عمود. ممنوع وضع قرص أكبر فوق أصغر. PDF صفحة ~395 يعرض الرسم والقواعد.",
    },
    {
      id: "manual-n2",
      titleAr: "حل يدوي لقرصين",
      bodyAr:
        "قرصان على A: انقل الصغير A→B، الكبير A→C، الصغير B→C — 3 حركات = 2²−1. هذا يمهّد لفهم n−1 قبل n.",
    },
    {
      id: "manual-n3",
      titleAr: "حل يدوي لثلاثة أقراص",
      bodyAr:
        "7 حركات: A→C, A→B, C→B, A→C, B→A, B→C, A→C (تسلسلات معروفة). لاحظ: لنقل 3 ننقل 2 للوسيط أولًا — نفس البنية في الكود.",
    },
    {
      id: "recursive-pattern",
      titleAr: "نمط الاستدعاء الذاتي",
      bodyAr:
        "def hanoi(n, src, aux, dst): if n==1: move(src,dst); return. hanoi(n-1, src, dst, aux) — انقل n−1 بعيدًا. move(src,dst) — القرص الأكبر. hanoi(n-1, aux, src, dst) — أعد n−1 فوقه.",
    },
    {
      id: "base-case-hanoi",
      titleAr: "الحالة الأساسية",
      bodyAr:
        "n==1: print(f'{src} → {dst}') أو سجّل الحركة. لا استدعاء أعمق — هذا يوقف التفرع. بدونها: hanoi(0)… أو n سالب → منطق خاطئ.",
    },
    {
      id: "move-count",
      titleAr: "عدد الحركات",
      bodyAr:
        "T(n) = 2·T(n−1) + 1، T(1)=1 → T(n)=2ⁿ−1. n=4 → 15 حركة. ينمو بسرعة — n=20 مستحيل يدويًا. يربط بدرس Big-O: O(2ⁿ) أبطأ من O(n²).",
    },
    {
      id: "python-implementation",
      titleAr: "تنفيذ بايثون",
      bodyAr:
        "def move(f,t): print(f'{f} → {t}'). def hanoi(n,a,b,c): if n==1: move(a,c); return. hanoi(n-1,a,c,b); move(a,c); hanoi(n-1,b,a,c). hanoi(3,'A','B','C') يطبع 7 أسطر — طابق مع الحل اليدوي.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) احفظ القواعد", bodyAr: "قرص واحد، أعلى فقط، لا كبير فوق صغير." },
    { titleAr: "2) حل n=2 يدويًا", bodyAr: "3 حركات — تحقق من القواعد." },
    { titleAr: "3) حل n=3 يدويًا", bodyAr: "7 حركات — سجّل التسلسل." },
    { titleAr: "4) اكتب move()", bodyAr: "دالة تطبع أو تسجّل حركة واحدة." },
    { titleAr: "5) if n==1", bodyAr: "الحالة الأساسية — حركة مباشرة." },
    { titleAr: "6) ثلاثة استدعاءات", bodyAr: "n−1، move كبير، n−1 مع تبديل الأعمدة." },
    { titleAr: "7) تحقق العدد", bodyAr: "عد الأسطر — يجب 2ⁿ−1." },
  ],
  workedExamples: [
    {
      id: "hanoi-ex-1",
      titleAr: "n=1",
      difficulty: "سهل",
      steps: [
        "قرص واحد على A",
        "hanoi(1, A, B, C)",
        "move(A, C)",
        "حركة واحدة",
      ],
      result: "1 حركة",
    },
    {
      id: "hanoi-ex-2",
      titleAr: "n=2",
      difficulty: "متوسط",
      steps: [
        "hanoi(1,A,B,C): A→B",
        "move(A,C): A→C",
        "hanoi(1,B,A,C): B→C",
        "المجموع: 3 = 2²−1",
      ],
      result: "3 حركات",
    },
    {
      id: "hanoi-ex-3",
      titleAr: "n=3 — أول 3 حركات",
      difficulty: "متوسط",
      steps: [
        "hanoi(2,A,C,B) ينقل قرصين A→B عبر C",
        "أول حركة في n=2: A→C",
        "ثم A→B ثم C→B",
        "بعد n−1: move(A,C) للقرص الكبير",
      ],
      result: "7 حركات إجمالًا",
    },
  ],
  commonMistakes: [
    {
      titleAr: "تبديل أعمدة الوسيط والهدف",
      bodyAr: "في hanoi(n-1, src, dst, aux) يصبح dst وسيطًا — ترتيب المعاملات ثلاثي مهم.",
      step: "recursive",
    },
    {
      titleAr: "محاولة نقل أكثر من قرص",
      bodyAr: "كل move قرص واحد — لا «انقل البرج كاملًا» في خطوة.",
      step: "rules",
    },
    {
      titleAr: "نسيان hanoi(n-1) الثاني",
      bodyAr: "بعد move الكبير يجب hanoi(n-1, aux, src, dst) — وإلا تبقى n−1 قرص على الوسيط.",
      step: "pattern",
    },
  ],
  quickCheck: {
    questions: [
      { id: "q1", promptAr: "عدد حركات n=3 في برج هانوي؟", answer: "7", hintAr: "2^n-1" },
      { id: "q2", promptAr: "ما الحالة الأساسية في hanoi؟", answer: "n==1", hintAr: "قرص واحد" },
    ],
  },
  guidedPractice: [
    { id: "g1", promptAr: "عدد حركات n=2?", answer: "3", hints: ["2²−1"] },
    { id: "g2", promptAr: "عدد حركات n=3?", answer: "7", hints: ["2³−1"] },
    { id: "g3", promptAr: "الحالة الأساسية في hanoi?", answer: "n==1", hints: ["قرص واحد"] },
  ],
  independentPractice: [
    { id: "i1", promptAr: "2⁴ − 1 = ?", answer: "15", hints: ["16−1"] },
    { id: "i2", promptAr: "كم عمودًا في اللغز?", answer: "3", hints: ["مصدر، وسيط، هدف"] },
    { id: "i3", promptAr: "n=4 — عدد الحركات?", answer: "15", hints: ["2⁴−1"] },
  ],
  challengeAr:
    "نفّذ hanoi(4) في بايثون وعدّ الحركات — تحقق أنها 15. ثم اشرح بالعربية لماذا T(n)=2T(n−1)+1 يشبه فيبوناتشي لكن بأس 2.",
  summary:
    "برج هانوي: انقل n قرصًا بقواعد ثلاث. الحل: hanoi(n−1) ثم move كبير ثم hanoi(n−1) مع تبديل الأعمدة. الحركات = 2ⁿ−1. تطبيق كلاسيكي للاستدعاء الذاتي بعد فيبوناتشي — ويعزز فهم Big-O للنمو الأسي.",
  linkedActivity: "/lessons/tower-of-hanoi#lab",
};
