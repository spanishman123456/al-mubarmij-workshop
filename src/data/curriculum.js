/**
 * هيكل المسار الدراسي — مُحاذى لمقرر «برمجة الحاسب» (علوم الحاسب + بايثون).
 * الدروس مُنظَّمة للتوسيع: يمكنك لاحقاً مطابقة النصوص حرفياً مع ملف PDF الرسمي عند توفره.
 */
export const GRADES = [
  { id: "g4", labelAr: "الصف الرابع", labelEn: "Grade 4" },
  { id: "g5", labelAr: "الصف الخامس", labelEn: "Grade 5" },
  { id: "g6", labelAr: "الصف السادس", labelEn: "Grade 6" },
  { id: "g7", labelAr: "الصف السابع", labelEn: "Grade 7" },
  { id: "g8", labelAr: "الصف الثامن", labelEn: "Grade 8" },
];

/**
 * وحدات مع دروس تفصيلية — كل وحدة تحتوي `lessons`.
 */
export const curriculumUnits = [
  {
    id: "intro",
    weekHint: "أسبوع تمهيدي",
    titleAr: "انطلاقة المقرر والتعارف الرقمي",
    titleEn: "Introduction",
    summaryAr:
      "التعريف بعلوم الحاسب، الاتفاقيات، الأخلاقيات الرقمية، والاستخدام الآمن — تمهيد لمسار الورشة.",
    grades: ["g4", "g5", "g6", "g7", "g8"],
    tags: ["مهارات رقمية", "أخلاقيات"],
    lessons: [
      {
        id: "intro-welcome",
        titleAr: "ما هي علوم الحاسب؟",
        summaryAr: "مفهوم المقرر وعلاقته بالبرمجة وحل المشكلات.",
        objectivesAr: ["تمييز علوم الحاسب عن استخدام الجهاز فقط", "ربط البرمجة بلغة بايثون كأداة تعلّم"],
        sections: [
          {
            titleAr: "فكرة عامة",
            bodyAr:
              "علوم الحاسب تدرس كيف تُصمَّم الحلول: تمثيل البيانات، الخوارزميات، والبرمجة. المقرر يربط هذه المفاهيم بلغة بايثون لتنفيذ أفكارك على الحاسب.",
          },
          {
            titleAr: "ماذا ستتعلم؟",
            bodyAr:
              "من النظام الثنائي إلى الخوارزميات والمنطق الرقمي ثم برامج بايثون متدرجة — مع أنشطة وتمارين في كل مرحلة.",
          },
        ],
        vocabulary: [
          { termAr: "خوارزمية", defAr: "سلسلة خطوات واضحة لحل مسألة." },
          { termAr: "برنامج", defAr: "تعليمات يفهمها الحاسب لتنفيذ مهمة." },
        ],
        exerciseIds: ["intro-print", "hello"],
      },
      {
        id: "intro-digital-citizenship",
        titleAr: "السلوك الرقمي والسلامة",
        summaryAr: "قواعد السلوك، الخصوصية، والمصداقية عند استخدام الأجهزة والشبكة.",
        objectivesAr: ["ذكر قواعد أساسية للسلامة الرقمية", "فهم أهمية احترام الغير والملكية الفكرية"],
        sections: [
          {
            titleAr: "ميثاق الصف",
            bodyAr:
              "الالتزام بالوقت، احترام الآراء، عدم مشاركة كلمات المرور، واستخدام المحتوى بشكل قانوني أثناء الورشة والمنزل.",
          },
        ],
        exerciseIds: [],
      },
      {
        id: "intro-lab-setup",
        titleAr: "بيئة التعلم والمختبر",
        summaryAr: "كيف نستخدم المتصفح، المجلدات، ومختبر بايثون في الموقع.",
        objectivesAr: ["تشغيل كود بايثون في المتصفح", "حفظ التجارب والملاحظات"],
        sections: [
          {
            titleAr: "مختبر بايثون في الموقع",
            bodyAr:
              "صفحة «مختبر بايثون» تشغّل كوداً بسيطاً عبر Skulpt دون تثبيت — مناسب للصفوف أثناء الحصة.",
          },
        ],
        exerciseIds: ["hello"],
      },
    ],
  },
  {
    id: "computing-basics",
    weekHint: "أساسيات الحاسب",
    titleAr: "المكونات والبرمجيات والتخزين",
    titleEn: "Hardware & software",
    summaryAr: "تمييز المكونات المادية والبرمجيات، أنواع التخزين، ودور نظام التشغيل.",
    grades: ["g4", "g5", "g6", "g7", "g8"],
    tags: ["حاسب", "مفاهيم"],
    lessons: [
      {
        id: "cb-hw-sw",
        titleAr: "المكونات المادية مقابل البرمجيات",
        summaryAr: "وحدة المعالجة، الذاكرة، التخزين، المدخلات والمخرجات.",
        objectivesAr: ["تصنيف عناصر الجهاز", "ربط كل مكوّن بدوره في تشغيل البرنامج"],
        sections: [
          {
            titleAr: "المكونات المادية",
            bodyAr: "الشاشة، لوحة المفاتيح، الفأرة، المعالج، الذاكرة العشوائية، القرص — كلها أجزاء يمكن لمسها.",
          },
          {
            titleAr: "البرمجيات",
            bodyAr: "نظام التشغيل، المتصفح، المحرر، والتطبيقات — تعليمات وتجارب مستخدمة لتشغيل المهام.",
          },
        ],
        vocabulary: [
          { termAr: "نظام التشغيل", defAr: "البرنامج الذي يدير الموارد ويشغّل التطبيقات." },
        ],
        exerciseIds: [],
      },
      {
        id: "cb-storage",
        titleAr: "وحدات التخزين والملفات",
        summaryAr: "البت، البايت، الكيلوبايت، والمجلدات والملفات.",
        objectivesAr: ["قراءة أحجام ملفات بسيطة", "تنظيم الملفات في مجلدات منطقية"],
        sections: [
          {
            titleAr: "من البت إلى الكيلوبايت",
            bodyAr: "الترابط مع درس النظام الثنائي لاحقاً: الملفات تُخزَّن كسلاسل من البتات.",
          },
        ],
        exerciseIds: [],
      },
      {
        id: "cb-networks-intro",
        titleAr: "شبكات وإنترنت — مقدمة",
        summaryAr: "فكرة الاتصال، الرابط، والتحميل الآمن.",
        objectivesAr: ["وصف دور المتصفح والخادم ببساطة", "ذكر نصيحة أمان عند البحث"],
        sections: [
          {
            titleAr: "اتصال بسيط",
            bodyAr: "الجهاز يطلب صفحة من خادم عبر الرابط؛ فهم ذلك يساعد لاحقاً عند التعامل مع APIs في مشاريع متقدمة.",
          },
        ],
        exerciseIds: [],
      },
    ],
  },
  {
    id: "binary",
    weekHint: "الأسابيع 1–3",
    titleAr: "النظام الثنائي والتمثيل الرقمي",
    titleEn: "Binary",
    summaryAr: "التحويل بين الأنظمة، البت والبايت، والتمثيل المحدود للأعداد.",
    grades: ["g4", "g5", "g6", "g7", "g8"],
    tags: ["رياضيات", "منطق"],
    lessons: [
      {
        id: "bin-positional",
        titleAr: "النظام الموضعي والأساس 2",
        summaryAr: "لماذا نستخدم 0 و1 فقط، وقراءة أرقام ثنائية صغيرة.",
        objectivesAr: ["كتابة الأعداد 0–15 بالثنائي", "فهم مضاعفات الأس 2"],
        sections: [
          {
            titleAr: "الفكرة",
            bodyAr: "كل مرتبة تمثل قوى للعدد 2؛ نجمع القيم للحصول على العدد العشري.",
          },
        ],
        vocabulary: [{ termAr: "بت", defAr: "رقم ثنائي واحد 0 أو 1." }],
        exerciseIds: ["bin-convert-small"],
      },
      {
        id: "bin-convert",
        titleAr: "تحويل عشري ↔ ثنائي",
        summaryAr: "قسمة متتالية أو جمع القوى.",
        objectivesAr: ["تحويل في كلا الاتجاهين للأعداد الصغيرة"],
        sections: [{ titleAr: "استراتيجية", bodyAr: "ابدأ بأمثلة صغيرة ثم زد النطاق تدريجياً." }],
        exerciseIds: ["bin-convert-small", "bin-add"],
      },
      {
        id: "bin-ascii-hint",
        titleAr: "لمحة عن ترميز النصوص",
        summaryAr: "فكرة أن الحروف تُخزَّن كأرقام (مقدمة لاحقة للصفوف الأعلى).",
        objectivesAr: ["ربط الحرف برقم تخزين"],
        sections: [
          {
            titleAr: "لماذا يهم البرمجة؟",
            bodyAr: "عند معالجة النصوص في بايثون نتعامل مع سلاسل حروف مبنية على ترميزات.",
          },
        ],
        exerciseIds: ["strings-basics"],
      },
      {
        id: "bin-activity",
        titleAr: "نشاط: بطاقات وبأحجية",
        summaryAr: "أنشطة صفية باستخدام بطاقات 0/1 كما في المقرر.",
        objectivesAr: ["تطبيق تعاوني في الصف"],
        sections: [{ titleAr: "ورشة", bodyAr: "استخدم محوّل الثنائي في الصفحة الرئيسية كمرجع بصري." }],
        exerciseIds: ["bin-convert-small"],
      },
    ],
  },
  {
    id: "python-basics",
    weekHint: "بداية بايثون",
    titleAr: "مقدمة لغة بايثون",
    titleEn: "Python basics",
    summaryAr: "الطباعة، التعليقات، التعريفات، والتعليمات البسيطة.",
    grades: ["g4", "g5", "g6", "g7", "g8"],
    tags: ["بايثون", "برمجة"],
    lessons: [
      {
        id: "py-first",
        titleAr: "أول برنامج: print",
        summaryAr: "دالة الطباعة والسلاسل النصية.",
        objectivesAr: ["تشغيل برنامج يطبع جملة"],
        sections: [{ titleAr: "تجربة", bodyAr: 'print("مرحباً") يعرض نصاً على الشاشة.' }],
        exerciseIds: ["hello"],
      },
      {
        id: "py-vars",
        titleAr: "المتغيرات والأسماء",
        summaryAr: "تخزين قيمة في اسم واضح.",
        objectivesAr: ["إنشاء متغيرات رقمية ونصية"],
        sections: [{ titleAr: "قواعد", bodyAr: "أسماء بدون مسافات، تفضيل الحروف الإنجليزية في الكود." }],
        exerciseIds: ["vars-swap"],
      },
      {
        id: "py-input",
        titleAr: "الإدخال input",
        summaryAr: "قراءة نص من المستخدم (في بيئات تدعم ذلك).",
        objectivesAr: ["فهم الفرق بين النص كنص وبينه كرقم"],
        sections: [{ titleAr: "ملاحظة Skulpt", bodyAr: "بعض بيئات المتصفح تقتصر؛ ركّز على المنطق أولاً." }],
        exerciseIds: ["hello"],
      },
      {
        id: "py-types",
        titleAr: "أنواع بيانات أولية",
        summaryAr: "int، float، str والتحويل البسيط.",
        objectivesAr: ["استخدام int() و str() عند الحاجة"],
        sections: [{ titleAr: "أخطاء شائعة", bodyAr: "جمع نص مع رقم بدون تحويل يسبب خطأ." }],
        exerciseIds: ["types-cast"],
      },
      {
        id: "py-style",
        titleAr: "التعليقات والتنسيق",
        summaryAr: "شرح الكود للقارئ، وسطر واحد لكل فكرة عند الإمكان.",
        objectivesAr: ["كتابة تعليق # بجانب سطر مهم"],
        sections: [{ titleAr: "أسلوب", bodyAr: "الكود الواضح يقلّل الأخطاء في المشاريع الجماعية." }],
        exerciseIds: ["hello"],
      },
    ],
  },
  {
    id: "algorithms",
    weekHint: "خوارزميات",
    titleAr: "الخوارزميات والمخططات الانسيابية",
    titleEn: "Algorithms",
    summaryAr: "صف الخطوات، رموز المخطط، وربطها بحل مسائل.",
    grades: ["g5", "g6", "g7", "g8"],
    tags: ["خوارزميات", "تفكير"],
    lessons: [
      {
        id: "alg-def",
        titleAr: "تعريف الخوارزمية",
        summaryAr: "مدخلات، مخرجات، وخطوات محددة.",
        objectivesAr: ["كتابة خوارزمية لمسألة يومية"],
        sections: [{ titleAr: "مثال", bodyAr: "صنع كوب شاي: خطوات متتابعة واضحة." }],
        exerciseIds: ["algo-steps"],
      },
      {
        id: "alg-flowchart",
        titleAr: "مخطط انسيابي",
        summaryAr: "بداية، نهاية، عملية، قرار.",
        objectivesAr: ["رسم تدفق بسيط لمسألة شرطية"],
        sections: [{ titleAr: "رمز القرار", bodyAr: "معالجة فرعين: نعم/لا." }],
        exerciseIds: ["algo-steps"],
      },
      {
        id: "alg-pseudo",
        titleAr: "شبه كود",
        summaryAr: "كتابة خطوط شبه برمجية قبل بايثون.",
        objectivesAr: ["ترجمة شبه كود إلى بايثون لاحقاً"],
        sections: [{ titleAr: "الانتقال", bodyAr: "الشبه كود يربط الفكرة بالكود الفعلي." }],
        exerciseIds: ["if-grade"],
      },
      {
        id: "alg-trace",
        titleAr: "تتبع يدوي",
        summaryAr: "متابعة قيم المتغيرات خطوة بخطوة.",
        objectivesAr: ["تتبع جدول صغير لقيم المتغيرات"],
        sections: [{ titleAr: "التدريب", bodyAr: "يساعد على فهم أخطاء المنطق." }],
        exerciseIds: ["trace-table"],
      },
    ],
  },
  {
    id: "python-control",
    weekHint: "تحكم",
    titleAr: "الشروط والحلقات والمتغيرات",
    titleEn: "Control flow",
    summaryAr: "if و elif و else، while، for، range.",
    grades: ["g5", "g6", "g7", "g8"],
    tags: ["بايثون", "تحكم"],
    lessons: [
      {
        id: "ctrl-if",
        titleAr: "جمل if",
        summaryAr: "اتخاذ قرار في البرنامج.",
        objectivesAr: ["كتابة شروط مقارنة رقمية"],
        sections: [{ titleAr: "المقارنات", bodyAr: "==، !=، <، >، <=، >=" }],
        exerciseIds: ["if-grade"],
      },
      {
        id: "ctrl-while",
        titleAr: "حلقة while",
        summaryAr: "تكرار طالما شرط ما زال صحيحاً.",
        objectivesAr: ["تجنب الحلقة اللانهائية"],
        sections: [{ titleAr: "تحذير", bodyAr: "تأكد أن الشرط يتغير داخل الحلقة." }],
        exerciseIds: ["while-sum"],
      },
      {
        id: "ctrl-for",
        titleAr: "حلقة for و range",
        summaryAr: "عدّ محدوداً أو المرور على تسلسل.",
        objectivesAr: ["استخدام range(start, stop, step)"],
        sections: [{ titleAr: "مثال", bodyAr: "مجموع الأعداد من 1 إلى n." }],
        exerciseIds: ["loop-sum"],
      },
      {
        id: "ctrl-nested",
        titleAr: "تداخل بسيط",
        summaryAr: "حلقة داخل حلقة لأنماط جدولية.",
        objectivesAr: ["طباعة نمط نجوم بسيط"],
        sections: [{ titleAr: "تطبيق", bodyAr: "استخدم حلقتين للصفوف والأعمدة." }],
        exerciseIds: ["nested-loop-pattern"],
      },
      {
        id: "ctrl-collatz",
        titleAr: "مشروع صغير: تسلسل كولاتز",
        summaryAr: "تكرار شرطي على الأعداد الفردية والزوجية.",
        objectivesAr: ["تطبيق الخوارزمية خطوة بخطوة"],
        sections: [{ titleAr: "الفكرة", bodyAr: "تجربة رياضية تربط المنطق بالبرمجة." }],
        exerciseIds: ["collatz-step"],
      },
    ],
  },
  {
    id: "logic-digital",
    weekHint: "منطق رقمي",
    titleAr: "المنطق الرقمي وجداول الحقيقة",
    titleEn: "Digital logic",
    summaryAr: "NOT, AND, OR، جداول الحقيقة، ومقدمة للبوابات.",
    grades: ["g6", "g7", "g8"],
    tags: ["منطق", "حاسب"],
    lessons: [
      {
        id: "logic-bool",
        titleAr: "قيم منطقية في بايثون",
        summaryAr: "True و False و عامل not.",
        objectivesAr: ["تقييم تعبيرات منطقية بسيطة"],
        sections: [{ titleAr: "الربط", bodyAr: "يربط البرمجة بالبوابات لاحقاً." }],
        exerciseIds: ["bool-expr"],
      },
      {
        id: "logic-truth",
        titleAr: "جداول الحقيقة",
        summaryAr: "صياغة المخرجات لكل مدخلات.",
        objectivesAr: ["إكمال جدول لبوابة AND ثنائية المدخلات"],
        sections: [{ titleAr: "انتقال", bodyAr: "من الجدول إلى رسم بسيط للدائرة لاحقاً." }],
        exerciseIds: ["truth-and"],
      },
      {
        id: "logic-gates",
        titleAr: "بوابات منطقية",
        summaryAr: "فكرة AND/OR/NOT كبناء للدوائر.",
        objectivesAr: ["وصف دور كل بوابة"],
        sections: [{ titleAr: "مقدمة", bodyAr: "المعرفة تساعد في فهم المعالج والذاكرة بعمق." }],
        exerciseIds: ["truth-and"],
      },
      {
        id: "logic-kmap-hint",
        titleAr: "تبسيط (مقدمة للصف الثامن)",
        summaryAr: "فكرة تجميع القيم المتشابهة — يُعاد لاحقاً بالتفصيل.",
        objectivesAr: ["التعرف على أن التعابير يمكن اختصارها"],
        sections: [{ titleAr: "ملاحظة", bodyAr: "خريطة كارنوف موضوع متقدم يُدرَّس تدريجياً." }],
        exerciseIds: [],
      },
    ],
  },
  {
    id: "search-sort",
    weekHint: "بحث وفرز",
    titleAr: "خوارزميات البحث والفرز",
    titleEn: "Search & sort",
    summaryAr: "بحث خطي، مفهوم التعقيد البسيط، وفرز الفقاعات كمثال.",
    grades: ["g7", "g8"],
    tags: ["خوارزميات", "بايثون"],
    lessons: [
      {
        id: "ss-linear",
        titleAr: "البحث الخطي",
        summaryAr: "المرور على عناصر القائمة حتى العثور على الهدف.",
        objectivesAr: ["تطبيق بحث خطي في قائمة بايثون"],
        sections: [{ titleAr: "الفكرة", bodyAr: "بسيط لكن قد يكون بطيئاً لقوائم طويلة." }],
        exerciseIds: ["linear-search"],
      },
      {
        id: "ss-bubble",
        titleAr: "فرز الفقاعات (مفهوم)",
        summaryAr: "مقارنات متجاورة وإعادة الترتيب.",
        objectivesAr: ["وصف خطوات الفرز بلغة بسيطة"],
        sections: [{ titleAr: "ربط", bodyAr: "تنفيذ مبسط في بايثون كتمرين." }],
        exerciseIds: ["bubble-sort-lite"],
      },
      {
        id: "ss-pythonic",
        titleAr: "استخدام sorted و sort",
        summaryAr: "الفرز الجاهز بعد فهم الفكرة.",
        objectivesAr: ["فرز قائمة أعداد صاعدياً"],
        sections: [{ titleAr: "أفضل الممارسات", bodyAr: "افهم الخوارزمية قبل الاعتماد على الدالة الجاهزة." }],
        exerciseIds: ["list-sort"],
      },
    ],
  },
  {
    id: "oop-projects",
    weekHint: "مشاريع",
    titleAr: "الكائنات والمشاريع الختامية",
    titleEn: "OOP & projects",
    summaryAr: "فئات وكائنات بسيطة، قوائم، وربط المفاهيم في مشروع.",
    grades: ["g7", "g8"],
    tags: ["بايثون", "مشروع"],
    lessons: [
      {
        id: "oop-class",
        titleAr: "class و __init__",
        summaryAr: "تعريف صف بسيط بالخصائص والدوال.",
        objectivesAr: ["إنشاء كائن واستدعاء دالة"],
        sections: [{ titleAr: "فكرة", bodyAr: "تجميع البيانات والسلوك في كيان واحد." }],
        exerciseIds: ["class-point"],
      },
      {
        id: "oop-lists",
        titleAr: "قوائم وأساليبها",
        summaryAr: "append، extend، الفهرسة، القطع.",
        objectivesAr: ["معالجة قائمة داخل كائن"],
        sections: [{ titleAr: "تطبيق", bodyAr: "تخزين مجموعة طلاب أو درجات." }],
        exerciseIds: ["list-max", "list-comp-hint"],
      },
      {
        id: "oop-file-hint",
        titleAr: "ملفات نصية (مقدمة)",
        summaryAr: "فتح ملف للقراءة بسيطة — حسب إمكانيات البيئة.",
        objectivesAr: ["فهم خطوات: فتح، قراءة، إغلاق"],
        sections: [{ titleAr: "Skulpt", bodyAr: "قد تكون دعم الملفات محدودة؛ استخدم في بيئة محلية لاحقاً." }],
        exerciseIds: [],
      },
      {
        id: "oop-capstone",
        titleAr: "مشروع ختامي مقترح",
        summaryAr: "برنامج صغير يجمع إدخالاً، حلقات، وقوائم.",
        objectivesAr: ["تخطيط مشروع متعدد الملفات (اختياري)"],
        sections: [{ titleAr: "اقتراح", bodyAr: "مدير درجات بسيط أو لعبة أرقام — يقدّم في الصف." }],
        exerciseIds: ["mini-gradebook"],
      },
    ],
  },
];

/**
 * @param {string} unitId
 */
export function getUnitById(unitId) {
  return curriculumUnits.find((u) => u.id === unitId) ?? null;
}

/**
 * @param {string} unitId
 * @param {string} lessonId
 */
export function getLessonById(unitId, lessonId) {
  const u = getUnitById(unitId);
  if (!u?.lessons) return null;
  const lesson = u.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { ...lesson, unitId: u.id, unitTitleAr: u.titleAr };
}

/** كل الدروس مع معلومات الوحدة — للبحث والفلترة */
export function getAllLessonsFlat() {
  const out = [];
  for (const u of curriculumUnits) {
    for (const le of u.lessons ?? []) {
      out.push({ ...le, unitId: u.id, unitTitleAr: u.titleAr });
    }
  }
  return out;
}

export const learningPillars = [
  {
    titleAr: "أسس علوم الحاسب",
    titleEn: "CS fundamentals",
    descAr: "من المكونات المادية إلى التمثيل الثنائي والمنطق والخوارزميات — كما يعرّف المقرر.",
    icon: "🧠",
  },
  {
    titleAr: "بايثون كأداة أساسية",
    titleEn: "Python-first",
    descAr: "تمارين وأنشطة متدرجة بلغة بايثون لربط المفاهيم بكود حقيقي.",
    icon: "🐍",
  },
  {
    titleAr: "تعلم باللعب والتحدي",
    titleEn: "Play & challenge",
    descAr: "ألغاز، محوّل ثنائي، مسابقات، ومشاريع صغيرة تحافظ على الحماس.",
    icon: "🎮",
  },
  {
    titleAr: "الصفوف 4–8",
    titleEn: "Grades 4–8",
    descAr: "محتوى مُوسم حسب الصف داخل المنصة لتوافق ورشتك.",
    icon: "📚",
  },
];
