/** إجابات المعلم — اليوم السادس */
export const day06TeacherAnswers = {
  titleAr: "إجابات المعلم — اليوم السادس",
  teacherGuidance: {
    titleAr: "إرشادات تدريس اليوم السادس",
    pdfPageIndex: 295,
    overviewAr:
      "يركز اليوم السادس على التشفير وهرم الذاكرة وجدولة المعالج. ابدأ بشفرة قيصر تفاعليًا، ثم اربط مكونات الجهاز بالسرعة والسعة، وأخيرًا نفّذ FCFS يدويًا قبل المختبر.",
    pacingAr: "≈40 دقيقة تشفير → 35 دقيقة ذاكرة → 40 دقيقة جدولة + ورقة عمل.",
    sequenceAr: [
      "1) شفرة قيصر — تشفير وفك تشفير",
      "2) هرم الذاكرة: CPU / Cache / RAM / HDD",
      "3) مخطط جانت و FCFS",
      "4) مقدمة SRT ومقارنة الانتظار",
    ],
    materialsAr: "PDF 295–338، محاكاة /simulations#caesar، مختبرات المنصة، ws-day-06.",
    assessmentAr: "تحقق: ناتج قيصر بإزاحة معروفة، مطابقة وظائف الذاكرة، متوسط انتظار FCFS على 3 عمليات.",
  },
  sections: [
    {
      id: "caesar",
      titleAr: "شفرة قيصر",
      pdfPageIndex: 301,
      lessonRoute: "/lessons/caesar-cipher",
      items: [
        {
          q: "شفّر HELLO بإزاحة 3",
          a: "KHOOR",
          steps: ["H→K، E→H، L→O، L→O، O→R"],
          teachingNotes: "وضّح modulo 26 و التفاف Z→A.",
          expectedErrors: ["نسيان التفاف", "تشفير المسافات"],
          feedback: "CaesarCipherLab + /simulations#caesar",
        },
        {
          q: "فك KHOOR بإزاحة 3",
          a: "HELLO",
          steps: ["استخدم إزاحة −3 أو وضع فك التشفير"],
          teachingNotes: "اربط بخصوصية الرسائل الرقمية.",
          expectedErrors: ["إزاحة موجبة عند الفك"],
          feedback: "مختبر الدرس",
        },
      ],
    },
    {
      id: "memory",
      titleAr: "الذاكرة والتخزين المؤقت",
      pdfPageIndex: 307,
      lessonRoute: "/lessons/memory-hierarchy",
      items: [
        {
          q: "ما وظيفة CPU؟",
          a: "تنفيذ التعليمات والحسابات.",
          steps: ["لا تخزين دائم للملفات"],
          teachingNotes: "استخدم تشبيه القطار للهرم (صفحة PDF 309).",
          expectedErrors: ["خلط CPU مع RAM"],
          feedback: "MemoryHierarchyLab",
        },
        {
          q: "رتّب السرعة: Cache، RAM، HDD",
          a: "Cache → RAM → HDD",
          steps: ["الأقرب للمعالج أسرع"],
          teachingNotes: "اذكر أن السعة عكس السرعة.",
          expectedErrors: ["اعتبار القرص أسرع من RAM"],
          feedback: "نشاط المطابقة في المختبر",
        },
        {
          q: "سؤال 6-ب التقويم: وظيفة Cache؟",
          a: "تخزين مؤقت سريع للبيانات المتكررة قرب CPU.",
          steps: ["ليس بديلًا كاملًا عن RAM"],
          teachingNotes: "اربط بأسئلة pre-06a–d.",
          expectedErrors: ["Cache = قرص دائم"],
          feedback: "quiz-day-06 / التقويم القبلي",
        },
      ],
    },
    {
      id: "scheduling",
      titleAr: "جدولة المعالج",
      pdfPageIndex: 312,
      lessonRoute: "/lessons/cpu-scheduling",
      items: [
        {
          q: "FCFS: P1(0,3) P2(1,2) P3(2,1) — متوسط الانتظار؟",
          a: "1.67 (تقريبًا)",
          steps: ["انتظار: 0، 2، 3", "المجموع 5 ÷ 3"],
          teachingNotes: "ارسم جانت قبل الحساب.",
          expectedErrors: ["البدء قبل الوصول", "قسمة خاطئة"],
          feedback: "CpuSchedulingLab",
        },
        {
          q: "ما الفرق بين FCFS و SRT؟",
          a: "FCFS أول وصول؛ SRT يفضّل أقصر وقت متبقٍ وقد يقطع.",
          steps: ["قارن متوسط الانتظار على نفس المدخلات"],
          teachingNotes: "ناقش العدالة مقابل الكفاءة.",
          expectedErrors: ["خلط الانتظار مع الدوران"],
          feedback: "مختبر الجدولة",
        },
      ],
    },
    {
      id: "worksheet",
      titleAr: "ورقة عمل اليوم السادس",
      pdfPageIndex: 314,
      lessonRoute: "/worksheets/ws-day-06",
      items: [
        {
          q: "مهام ورقة العمل المنظمة",
          a: "تشفير، مكونات الذاكرة، FCFS، صح/خطأ، اختيار من متعدد.",
          steps: ["راجع worksheetModelAnswers.ws-day-06"],
          teachingNotes: "لا إجابات مقالية طويلة — تصحيح آلي.",
          expectedErrors: ["إجابة غير محددة"],
          feedback: "لوحة المعلم → تقدم الطلاب",
        },
      ],
    },
  ],
};
