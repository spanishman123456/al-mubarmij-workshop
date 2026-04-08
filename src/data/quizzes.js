/**
 * اختبارات نظرية متعددة الخيارات — مُحاذاة لوحدات المسار.
 * correctIndex: فهرس الإجابة الصحيحة في optionsAr (0..n-1)
 */

/** @typedef {{
 *   id: string,
 *   questionAr: string,
 *   optionsAr: string[],
 *   correctIndex: number,
 *   explainAr: string,
 * }} QuizQuestion */

/** @typedef {{
 *   id: string,
 *   unitId: string | null,
 *   titleAr: string,
 *   descriptionAr: string,
 *   passPercent: number,
 *   questions: QuizQuestion[],
 * }} Quiz */

/** @type {Quiz[]} */
export const quizzes = [
  {
    id: "quiz-intro",
    unitId: "intro",
    titleAr: "اختبار قصير: انطلاقة المقرر",
    descriptionAr: "تمييز المفاهيم الأساسية والسلامة الرقمية.",
    passPercent: 60,
    questions: [
      {
        id: "intro-q1",
        questionAr: "أي عبارة تصف «علوم الحاسب» بشكل أدق؟",
        optionsAr: [
          "تعلّم استخدام برنامج معيّن فقط",
          "دراسة كيف تُصمَّم الحلول والخوارزميات والبرامج",
          "صيانة الشاشة والفأرة فقط",
          "الرسم على الحاسب فقط",
        ],
        correctIndex: 1,
        explainAr: "علوم الحاسب أوسع من استخدام تطبيق واحد؛ تشمل التفكير الخوارزمي والبرمجة.",
      },
      {
        id: "intro-q2",
        questionAr: "ما أفضل ممارسة للسلامة الرقمية في الورشة؟",
        optionsAr: [
          "مشاركة كلمة مرور الصف مع صديق",
          "الالتزام بقواعد المعلّم وعدم نشر بيانات الآخرين",
          "تنزيل أي ملف من الإنترنت دون سؤال",
          "إيقاف جدار الحماية دائماً",
        ],
        correctIndex: 1,
        explainAr: "احترام الخصوصية وقواعد الصف يحمي الجميع.",
      },
      {
        id: "intro-q3",
        questionAr: "ما هي «الخوارزمية»؟",
        optionsAr: [
          "لغة برمجة",
          "سلسلة خطوات واضحة لحل مسألة",
          "نوع من الذاكرة",
          "برنامج جاهز فقط",
        ],
        correctIndex: 1,
        explainAr: "الخوارزمية هي خطوات منطقية لحل مشكلة، قبل أو مع كتابة الكود.",
      },
      {
        id: "intro-q4",
        questionAr: "لماذا نستخدم «مختبر بايثون» في الموقع؟",
        optionsAr: [
          "لأن بايثون لا يعمل إلا في المتصفح",
          "لتجربة كود بسيط دون تثبيت على كل جهاز",
          "لاستبدال المعلّم",
          "لحذف الملفات من الجهاز",
        ],
        correctIndex: 1,
        explainAr: "Skulpt يشغّل بايثون في المتصفح لسهولة الورشة.",
      },
    ],
  },
  {
    id: "quiz-computing",
    unitId: "computing-basics",
    titleAr: "اختبار قصير: المكونات والبرمجيات",
    descriptionAr: "تمييز الماديات والبرمجيات والتخزين.",
    passPercent: 60,
    questions: [
      {
        id: "cb-q1",
        questionAr: "أي مما يلي يُعد مكوّناً مادياً؟",
        optionsAr: ["نظام التشغيل", "المتصفح", "المعالج (CPU)", "محرر النصوص"],
        correctIndex: 2,
        explainAr: "المعالج قطعة مادية؛ الباقي برمجيات.",
      },
      {
        id: "cb-q2",
        questionAr: "ما دور نظام التشغيل تقريباً؟",
        optionsAr: [
          "طباعة النصوص فقط",
          "إدارة الموارد وتشغيل البرامج كواجهة بين المستخدم والجهاز",
          "تصميم المواقع فقط",
          "حفظ الملفات في السحابة دائماً",
        ],
        correctIndex: 1,
        explainAr: "نظام التشغيل يدير الذاكرة والملفات والعمليات.",
      },
      {
        id: "cb-q3",
        questionAr: "1024 بايت ≈",
        optionsAr: ["1 بت", "1 بايت", "1 كيلوبايت", "1 ميجابايت"],
        correctIndex: 2,
        explainAr: "1024 بايت = 1 كيلوبايت (في التعريف الثنائي الشائع).",
      },
      {
        id: "cb-q4",
        questionAr: "المجلد (folder) يُستخدم أساساً لـ:",
        optionsAr: [
          "تشغيل المعالج أسرع",
          "تنظيم الملفات ذات الصلة",
          "حذف الإنترنت",
          "زيادة حجم الشاشة",
        ],
        correctIndex: 1,
        explainAr: "المجلدات تساعد على ترتيب الملفات منطقياً.",
      },
    ],
  },
  {
    id: "quiz-binary",
    unitId: "binary",
    titleAr: "اختبار قصير: النظام الثنائي",
    descriptionAr: "تحويلات بسيطة ومفاهيم موضعية.",
    passPercent: 60,
    questions: [
      {
        id: "bin-q1",
        questionAr: "العدد الثنائي 101 بالعشري يساوي:",
        optionsAr: ["3", "5", "6", "7"],
        correctIndex: 1,
        explainAr: "4+0+1 = 5.",
      },
      {
        id: "bin-q2",
        questionAr: "العدد العشري 8 بالثنائي (4 بت) هو:",
        optionsAr: ["1000", "0111", "1010", "1100"],
        correctIndex: 0,
        explainAr: "8 = 2³ → 1000.",
      },
      {
        id: "bin-q3",
        questionAr: "لماذا يستخدم الحاسب الثنائي داخلياً؟",
        optionsAr: [
          "لأن الأرقام من 0 إلى 9 فقط",
          "لأن حالتي جهد عالٍ ومنخفض يمكن تمثيلهما بسهولة",
          "لأن اللغة العربية ثنائية",
          "لأن الشاشة ثنائية الأبعاد فقط",
        ],
        correctIndex: 1,
        explainAr: "الدوائر تميّز حالتين واضحتين تطابق 0 و1.",
      },
      {
        id: "bin-q4",
        questionAr: "أي عدد ثنائي أكبر: 1000 أم 0111 ؟",
        optionsAr: ["1000", "0111", "متساويان", "لا يمكن المقارنة"],
        correctIndex: 0,
        explainAr: "1000 = 8 و 0111 = 7.",
      },
    ],
  },
  {
    id: "quiz-python",
    unitId: "python-basics",
    titleAr: "اختبار قصير: مقدمة بايثون",
    descriptionAr: "متغيرات، أنواع، وطباعة.",
    passPercent: 60,
    questions: [
      {
        id: "py-q1",
        questionAr: "ما نوع القيمة 3.0 في بايثون؟",
        optionsAr: ["int", "str", "float", "bool"],
        correctIndex: 2,
        explainAr: "الوجود العشري يشير عادةً إلى float.",
      },
      {
        id: "py-q2",
        questionAr: 'ما مخرجات: print("مرحبا" + "!" ) ؟',
        optionsAr: ["مرحبا !", "مرحبا!", "خطأ", "مرحبا"],
        correctIndex: 1,
        explainAr: "جمع نصين يلصقهما: مرحبا!",
      },
      {
        id: "py-q3",
        questionAr: "أي اسم متغير صالح في بايثون؟",
        optionsAr: ["2score", "my-var", "total_score", "class"],
        correctIndex: 2,
        explainAr: "لا يبدأ برقم؛ الشرطة - غير مسموحة؛ class محجوزة.",
      },
      {
        id: "py-q4",
        questionAr: "ماذا يفعل int(\"12\") ؟",
        optionsAr: ["يطبع 12", "يحوّل النص إلى عدد صحيح 12", "يخطئ دائماً", "ينتج نصاً طويلاً"],
        correctIndex: 1,
        explainAr: "int() يحوّل النص الرقمي إلى عدد صحيح.",
      },
    ],
  },
  {
    id: "quiz-algorithms",
    unitId: "algorithms",
    titleAr: "اختبار قصير: الخوارزميات والمخططات",
    descriptionAr: "مفاهيم وخطوات وقرارات.",
    passPercent: 60,
    questions: [
      {
        id: "alg-q1",
        questionAr: "أي عنصر لا يُعد عادةً جزءاً من مخطط انسيابي بسيط؟",
        optionsAr: ["بداية/نهاية", "عملية", "قرار (نعم/لا)", "سرعة المعالج بالجيجاهرتز"],
        correctIndex: 3,
        explainAr: "رموز التدفق: بداية، عملية، قرار، نهاية — لا قياس سرعة.",
      },
      {
        id: "alg-q2",
        questionAr: "الخوارزمية يجب أن تكون:",
        optionsAr: ["عشوائية بالكامل", "خطوات واضحة ومنتهية", "بدون مدخلات", "بدون مخرجات"],
        correctIndex: 1,
        explainAr: "الخوارزمية محددة الخطوات وتنتهي (للمسائل الصحيحة).",
      },
      {
        id: "alg-q3",
        questionAr: "شبه الكود أقرب إلى:",
        optionsAr: ["صورة فقط", "لغة برمجة دقيقة 100٪", "وصف نصي للخطوات بين اللغة الطبيعية والكود", "النظام الثنائي فقط"],
        correctIndex: 2,
        explainAr: "شبه الكود يبسط الخطوات قبل كتابة بايثون.",
      },
      {
        id: "alg-q4",
        questionAr: "تتبع المتغيرات يدوياً يساعد على:",
        optionsAr: ["تسريع المعالج", "اكتشاف أخطاء المنطق وفهم الخطوات", "حذف الملفات", "تغيير لغة لوحة المفاتيح"],
        correctIndex: 1,
        explainAr: "التتبع اليدوي يوضح قيم المتغيرات بعد كل خطوة.",
      },
    ],
  },
  {
    id: "quiz-control",
    unitId: "python-control",
    titleAr: "اختبار قصير: الشروط والحلقات",
    descriptionAr: "if، while، for، range.",
    passPercent: 60,
    questions: [
      {
        id: "ctrl-q1",
        questionAr: "أي شرط يتحقق عند المساواة في بايثون؟",
        optionsAr: ["=", "==", "===", "eq"],
        correctIndex: 1,
        explainAr: "== للمقارنة، = للإسناد.",
      },
      {
        id: "ctrl-q2",
        questionAr: "ماذا تنتج range(3)؟",
        optionsAr: ["0,1,2", "1,2,3", "0,1,2,3", "3,2,1"],
        correctIndex: 0,
        explainAr: "range(3) يعطي 0 و1 و2.",
      },
      {
        id: "ctrl-q3",
        questionAr: "حلقة while قد لا تنتهي إذا:",
        optionsAr: ["الشرط دائماً خطأ", "الشرط دائماً صحيح ولا يتغير", "استخدمت print", "استخدمت for"],
        correctIndex: 1,
        explainAr: "حلقة لا نهائية إن بقي الشرط صحيحاً دون تغيير.",
      },
      {
        id: "ctrl-q4",
        questionAr: "elif يُستخدم عندما:",
        optionsAr: [
          "لا تريد أي شروط",
          "تريد فحص شرط بديل بعد أن فشل if السابق",
          "تريد حذف المتغيرات",
          "تريد إيقاف بايثون",
        ],
        correctIndex: 1,
        explainAr: "elif يتابع سلسلة الشروط بعد if.",
      },
    ],
  },
  {
    id: "quiz-logic",
    unitId: "logic-digital",
    titleAr: "اختبار قصير: المنطق الرقمي",
    descriptionAr: "قيم منطقية وجداول وبوابات.",
    passPercent: 60,
    questions: [
      {
        id: "log-q1",
        questionAr: "True and False ينتج:",
        optionsAr: ["True", "False", "خطأ نحوي", "0 فقط"],
        correctIndex: 1,
        explainAr: "AND يتطلب الطرفين صحيحين.",
      },
      {
        id: "log-q2",
        questionAr: "مخرجات بوابة AND عندما A=1 و B=1 (تشبيه بالمنطق الثنائي):",
        optionsAr: ["0", "1", "غير معرّف", "2"],
        correctIndex: 1,
        explainAr: "1 AND 1 = 1.",
      },
      {
        id: "log-q3",
        questionAr: "not True يساوي:",
        optionsAr: ["True", "False", "0", "1"],
        correctIndex: 1,
        explainAr: "not يعكس القيمة المنطقية.",
      },
      {
        id: "log-q4",
        questionAr: "بوابة OR تُخرج 1 عندما:",
        optionsAr: ["كلا المدخلين 0", "أحد المدخلين أو كلاهما 1", "فقط عندما يكون المدخلان 0 و1 معاً", "لا تُخرج 1 أبداً"],
        correctIndex: 1,
        explainAr: "OR = 1 إذا كان أي مدخل 1.",
      },
    ],
  },
  {
    id: "quiz-search-sort",
    unitId: "search-sort",
    titleAr: "اختبار قصير: البحث والفرز",
    descriptionAr: "مفاهيم قبل الدوال الجاهزة.",
    passPercent: 60,
    questions: [
      {
        id: "ss-q1",
        questionAr: "البحث الخطي في قائمة من n عنصراً قد يحتاج في أسوأ الحالات تقريباً:",
        optionsAr: ["خطوة واحدة", "n مقارنة", "دائماً خطوة واحدة", "لا يحتاج مقارنات"],
        correctIndex: 1,
        explainAr: "قد نمرّ على كل العناصر.",
      },
      {
        id: "ss-q2",
        questionAr: "فكرة فرز الفقاعات تشمل:",
        optionsAr: [
          "حذف عناصر عشوائياً",
          "مقارنة عناصر متجاورة وإعادة ترتيبها تكراراً",
          "فرز دون مقارنات",
          "تحويل القائمة إلى نص فقط",
        ],
        correctIndex: 1,
        explainAr: "مقارنات متجاورة حتى يستقر الترتيب.",
      },
      {
        id: "ss-q3",
        questionAr: "sorted([3,1,2]) تُرجع:",
        optionsAr: ["[3,1,2]", "[1,2,3]", "[1,3,2]", "خطأ"],
        correctIndex: 1,
        explainAr: "قائمة جديدة مرتبة تصاعدياً.",
      },
      {
        id: "ss-q4",
        questionAr: "قائمة.sort() تعدّل:",
        optionsAr: ["قائمة جديدة فقط دون الأصل", "القائمة نفسها في مكانها", "ملفاً على القرص دائماً", "نوع البيانات إلى نص فقط"],
        correctIndex: 1,
        explainAr: ".sort() يُعدّل القائمة الأصلية (في مكانها).",
      },
    ],
  },
  {
    id: "quiz-oop",
    unitId: "oop-projects",
    titleAr: "اختبار قصير: الكائنات والقوائم",
    descriptionAr: "class، قوائم، مشروع.",
    passPercent: 60,
    questions: [
      {
        id: "oop-q1",
        questionAr: "في بايثون، class يُعرّف عادةً:",
        optionsAr: ["ملف نصي فقط", "قالباً لإنشاء كائنات", "حلقة دائمة", "نوع الذاكرة فقط"],
        correctIndex: 1,
        explainAr: "الصف (class) قالب للكائنات.",
      },
      {
        id: "oop-q2",
        questionAr: "__init__ تُستخدم لـ:",
        optionsAr: ["حذف الكائن", "تهيئة خصائص الكائن عند الإنشاء", "طباعة النظام فقط", "إيقاف البرنامج"],
        correctIndex: 1,
        explainAr: "المُنشئ يضبط القيم الابتدائية.",
      },
      {
        id: "oop-q3",
        questionAr: "[1,2].append(3) يجعل القائمة:",
        optionsAr: ["[1,2]", "[1,2,3]", "[3,1,2]", "[1,3,2]"],
        correctIndex: 1,
        explainAr: "append يضيف في النهاية.",
      },
      {
        id: "oop-q4",
        questionAr: "extend مختلف عن append لأنه:",
        optionsAr: [
          "يحذف القائمة",
          "يضيف عناصر من تكرار (مثل قائمة) كعناصر منفصلة",
          "لا يعمل في بايثون",
          "يحوّل كل شيء إلى نص",
        ],
        correctIndex: 1,
        explainAr: "extend يمدّد القائمة بعناصر من التكرار.",
      },
    ],
  },
  {
    id: "quiz-comprehensive",
    unitId: null,
    titleAr: "اختبار شامل — مراجعة كل الوحدات",
    descriptionAr: "أسئلة متنوعة للتدريب قبل الامتحان؛ تغطي موضوعات من المسار كاملاً.",
    passPercent: 70,
    questions: [
      {
        id: "fin-q1",
        questionAr: "أفضل تعريف للخوارزمية:",
        optionsAr: [
          "برنامج جاهز من الإنترنت",
          "سلسلة خطوات محددة لحل مسألة",
          "نوع من الشاشات",
          "لغة برمجة قديمة",
        ],
        correctIndex: 1,
        explainAr: "تعريف الخوارزمية كخطوات واضحة.",
      },
      {
        id: "fin-q2",
        questionAr: "العدد الثنائي 111 بالعشري:",
        optionsAr: ["5", "6", "7", "8"],
        correctIndex: 2,
        explainAr: "4+2+1=7.",
      },
      {
        id: "fin-q3",
        questionAr: "في بايثون: 10 // 3 يساوي:",
        optionsAr: ["3.33", "3", "4", "1"],
        correctIndex: 1,
        explainAr: "// قسمة صحيحة للأسفل.",
      },
      {
        id: "fin-q4",
        questionAr: "if x > 0: يتطلب في السطر التالي:",
        optionsAr: ["لا شيء", "مسافة بادئة (كتلة)", "فاصلة منقوطة", "كلمة end"],
        correctIndex: 1,
        explainAr: "بايثون يعتمد على المسافات البادئة للكتل.",
      },
      {
        id: "fin-q5",
        questionAr: "for i in range(2, 5): القيم التي يأخذها i:",
        optionsAr: ["2,3,4", "2,3,4,5", "1,2,3,4", "5,4,3"],
        correctIndex: 0,
        explainAr: "range(2,5) = 2,3,4 (النهاية غير مشمولة).",
      },
      {
        id: "fin-q6",
        questionAr: "True or False يساوي:",
        optionsAr: ["False", "True", "0", "خطأ"],
        correctIndex: 1,
        explainAr: "OR: يكفي أن يكون أحد الطرفين True.",
      },
      {
        id: "fin-q7",
        questionAr: "البحث الخطي مناسب كوصف لـ:",
        optionsAr: [
          "البحث دائماً في مليون عنصر بخطوة واحدة",
          "المرور على العناصر حتى العثور على الهدف أو انتهاء القائمة",
          "حذف كل العناصر",
          "ترتيب القائمة دون مقارنة",
        ],
        correctIndex: 1,
        explainAr: "وصف البحث الخطي.",
      },
      {
        id: "fin-q8",
        questionAr: "len([1,2,3]) يساوي:",
        optionsAr: ["2", "3", "6", "0"],
        correctIndex: 1,
        explainAr: "ثلاثة عناصر.",
      },
      {
        id: "fin-q9",
        questionAr: "مكوّن مادي حقيقي:",
        optionsAr: ["نظام التشغيل", "لوحة المفاتيح", "المتصفح", "المحرر"],
        correctIndex: 1,
        explainAr: "لوحة المفاتيح قطعة فعلية.",
      },
      {
        id: "fin-q10",
        questionAr: "class Student: يُعرّف:",
        optionsAr: ["دالة واحدة فقط", "صفاً يمكن إنشاء كائنات منه", "ملف فيديو", "حلقة while"],
        correctIndex: 1,
        explainAr: "class يعرّف نوعاً/قالباً.",
      },
      {
        id: "fin-q11",
        questionAr: "ما الذي يقلّل احتمال خطأ المنطق في البرنامج؟",
        optionsAr: [
          "كتابة كود بدون تعليقات أبداً",
          "تتبع القيم يدوياً للخطوات المهمة",
          "حذف كل if",
          "تعطيل الحلقات دائماً",
        ],
        correctIndex: 1,
        explainAr: "التتبع اليدوي يساعد على فهم سير التنفيذ.",
      },
      {
        id: "fin-q12",
        questionAr: "سلوك رقمي مسؤول يتضمن:",
        optionsAr: [
          "نشر كلمات مرور الآخرين",
          "احترام الخصوصية وعدم إيذاء الآخرين عبر الشبكة",
          "إزعاج الآخرين عمداً في المنتديات",
          "نسخ الواجبات دون ذكر المصدر دائماً",
        ],
        correctIndex: 1,
        explainAr: "الأخلاقيات الرقمية جزء من المقرر.",
      },
    ],
  },
];

export function getQuizById(id) {
  return quizzes.find((q) => q.id === id) ?? null;
}

export function getQuizzesForUnit(unitId) {
  return quizzes.filter((q) => q.unitId === unitId);
}

export function getUnitQuizzesOnly() {
  return quizzes.filter((q) => q.unitId != null);
}
