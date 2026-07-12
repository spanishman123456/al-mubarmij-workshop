/**
 * سجل موحّد لمشروعات skui — مصدر الحقيقة الوحيد للاختيار والبيانات الوصفية.
 * starterCode = تطبيق قابل للتشغيل فورًا (مصدر مشترك مع حل المعلم).
 */
import { SKUI_DEMO_APPS } from "./skuiDemoApps.js";

export const SKUI_PROJECT_TYPES = Object.freeze({
  app: "تطبيق",
  game: "لعبة",
  sim: "محاكاة",
  tool: "أداة",
});

function runnableStarter(id, title) {
  return (
    SKUI_DEMO_APPS[id] ||
    `# مشروع: ${title}
import skui as ui
app = ui.App(title="${title}", theme="modern", appearance="dark")
app.add(ui.Guide(title="ابدأ هنا", message="عدّل الكود ثم شغّل المشروع.", character="assistant"))
app.add(ui.Alert(text="المشروع جاهز", variant="info"))
app.run()
`
  );
}

/**
 * @typedef {object} SkuiProject
 * @property {string} id
 * @property {string} exportSlug
 * @property {string} titleAr
 * @property {string} description
 * @property {"تطبيق"|"لعبة"|"محاكاة"|"أداة"} type
 * @property {"مبتدئ"|"متوسط"|"متقدم"} difficulty
 * @property {string} icon
 * @property {string[]} components
 * @property {string[]} usageSteps
 * @property {string} starterCode
 * @property {string} teacherSolutionId
 * @property {string[]} tests
 * @property {string} [dayId]
 * @property {string} [curriculumTopic]
 */

/** @type {SkuiProject[]} */
export const SKUI_PROJECTS = [
  {
    id: "app-guess-number",
    exportSlug: "number-guessing-game",
    titleAr: "لعبة تخمين الرقم",
    description: "خمّن الرقم السري مع تغذية راجعة وعدد محاولات وواجهة لعبة حقيقية.",
    type: "لعبة",
    difficulty: "مبتدئ",
    icon: "🎯",
    components: ["App", "Guide", "Input", "Button", "Alert", "Badge", "Card"],
    usageSteps: [
      "اضغط ابدأ الجولة لتوليد رقم سري بين 1 و 20.",
      "أدخل تخمينك ثم اضغط تحقق.",
      "اقرأ الرسالة: أكبر / أصغر / صحيح.",
      "تابع حتى تفوز أو تنفد المحاولات.",
      "اضغط جولة جديدة لإعادة اللعب.",
    ],
    starterCode: runnableStarter("app-guess-number", "لعبة تخمين الرقم"),
    teacherSolutionId: "app-guess-number",
    tests: [
      "الرقم السري ضمن المجال 1–20",
      "تغذية راجعة صحيحة",
      "زيادة عدد المحاولات",
      "إنهاء الجولة عند التخمين الصحيح",
      "إعادة التشغيل",
      "يعمل داخل المعاينة وبعد WebApp",
    ],
    dayId: "day-02",
    curriculumTopic: "Python — المتغيرات، الشروط if، الخوارزميات",
  },
  {
    id: "app-calculator",
    exportSlug: "modern-calculator",
    titleAr: "آلة حاسبة",
    description: "آلة حاسبة تفاعلية بلوحة أرقام كاملة وعمليات وأزرار ثلاثية الأبعاد.",
    type: "أداة",
    difficulty: "مبتدئ",
    icon: "🔢",
    components: ["App", "Guide", "Grid", "Button", "Text", "Alert", "Card"],
    usageSteps: [
      "اضغط الأرقام لبناء العدد.",
      "اختر العملية (+ − × ÷).",
      "اضغط = لعرض الناتج.",
      "C للمسح و⌫ لحذف آخر رقم.",
      "يمكنك الكتابة من لوحة المفاتيح.",
    ],
    starterCode: runnableStarter("app-calculator", "آلة حاسبة"),
    teacherSolutionId: "app-calculator",
    tests: [
      "الأزرار تعمل",
      "العمليات الأربع صحيحة",
      "المسح يعمل",
      "القسمة على صفر تعرض خطأ",
      "يعمل داخل المعاينة وبعد التصدير",
    ],
  },
  {
    id: "app-registration",
    exportSlug: "registration-form",
    titleAr: "نموذج تسجيل",
    description: "بطاقة تسجيل حديثة مع تحقق من المدخلات ورسالة نجاح.",
    type: "تطبيق",
    difficulty: "مبتدئ",
    icon: "📝",
    components: ["App", "Guide", "Input", "Button", "Alert", "Card"],
    usageSteps: [
      "أدخل الاسم والبريد وكلمة المرور.",
      "اضغط تسجيل.",
      "اقرأ رسالة التحقق أو النجاح.",
    ],
    starterCode: runnableStarter("app-registration", "نموذج تسجيل"),
    teacherSolutionId: "app-registration",
    tests: ["التحقق من الحقول", "رسالة نجاح", "يعمل بعد WebApp"],
  },
  {
    id: "app-todo",
    exportSlug: "todo-list",
    titleAr: "قائمة مهام",
    description: "أضف المهام وأتممها واحذفها مع فلترة المكتمل وغير المكتمل.",
    type: "تطبيق",
    difficulty: "متوسط",
    icon: "✅",
    components: ["App", "Guide", "Input", "Button", "List", "Checkbox", "Row"],
    usageSteps: [
      "اكتب مهمة ثم اضغط إضافة.",
      "علّم المهمة كمكتملة.",
      "احذف ما لا تحتاجه.",
      "فلتر بين الكل / النشط / المكتمل.",
    ],
    starterCode: runnableStarter("app-todo", "قائمة مهام"),
    teacherSolutionId: "app-todo",
    tests: ["إضافة مهمة", "إتمام", "حذف", "فلترة"],
  },
  {
    id: "app-quiz",
    exportSlug: "quick-quiz",
    titleAr: "اختبار قصير",
    description: "بطاقة سؤال وخيارات ومؤشر تقدم ونتيجة نهائية.",
    type: "لعبة",
    difficulty: "مبتدئ",
    icon: "❓",
    components: ["App", "Guide", "Select", "Button", "Progress", "Alert", "Text"],
    usageSteps: [
      "اقرأ السؤال واختر إجابة.",
      "اضغط التالي للانتقال.",
      "شاهد النتيجة النهائية وأعد المحاولة.",
    ],
    starterCode: runnableStarter("app-quiz", "اختبار قصير"),
    teacherSolutionId: "app-quiz",
    tests: ["عرض السؤال", "تقدم", "نتيجة", "إعادة محاولة"],
    dayId: "day-05",
    curriculumTopic: "Python — الشروط والقوائم",
  },
  {
    id: "app-timer",
    exportSlug: "focus-timer",
    titleAr: "مؤقت",
    description: "مؤقت رقمي جذاب مع تشغيل وإيقاف وإعادة ضبط وتنبيه بصري.",
    type: "أداة",
    difficulty: "متوسط",
    icon: "⏱️",
    components: ["App", "Guide", "Timer", "Button", "Alert", "Progress"],
    usageSteps: [
      "اضبط الثواني المطلوبة.",
      "شغّل المؤقت ثم أوقفه عند الحاجة.",
      "أعد الضبط للبدء من جديد.",
    ],
    starterCode: runnableStarter("app-timer", "مؤقت"),
    teacherSolutionId: "app-timer",
    tests: ["تشغيل", "إيقاف", "إعادة ضبط", "تنبيه عند الانتهاء"],
  },
  {
    id: "app-dashboard",
    exportSlug: "simple-dashboard",
    titleAr: "لوحة بيانات بسيطة",
    description: "بطاقات مؤشرات ومخطط ونسب تقدم بتصميم لوحة حقيقية.",
    type: "تطبيق",
    difficulty: "متوسط",
    icon: "📊",
    components: ["App", "Guide", "Card", "Grid", "Chart", "Progress", "Badge"],
    usageSteps: [
      "اقرأ المؤشرات في البطاقات.",
      "لاحظ المخطط ونسب التقدم.",
      "حدّث البيانات بزر التحديث.",
    ],
    starterCode: runnableStarter("app-dashboard", "لوحة بيانات"),
    teacherSolutionId: "app-dashboard",
    tests: ["عرض المؤشرات", "مخطط", "تحديث"],
  },
  {
    id: "app-colors",
    exportSlug: "color-studio",
    titleAr: "تطبيق ألوان",
    description: "منزلقات RGB ومعاينة مباشرة وقيمة HEX.",
    type: "أداة",
    difficulty: "متوسط",
    icon: "🎨",
    components: ["App", "Guide", "Slider", "Text", "Card", "Alert"],
    usageSteps: [
      "حرّك منزلقات R وG وB.",
      "شاهد المعاينة الفورية وقيمة HEX.",
    ],
    starterCode: runnableStarter("app-colors", "تطبيق ألوان"),
    teacherSolutionId: "app-colors",
    tests: ["تغيير RGB", "عرض HEX", "معاينة مباشرة"],
  },
  {
    id: "app-canvas-demo",
    exportSlug: "canvas-game",
    titleAr: "لعبة Canvas",
    description: "مساحة لعب مع حركة ونقاط وإعادة تشغيل.",
    type: "لعبة",
    difficulty: "متقدم",
    icon: "🕹️",
    components: ["App", "Guide", "Canvas", "Button", "Text", "Badge"],
    usageSteps: [
      "اضغط تحريك لتحريك الشكل.",
      "اجمع النقاط.",
      "أعد التشغيل لجولة جديدة.",
    ],
    starterCode: runnableStarter("app-canvas-demo", "لعبة Canvas"),
    teacherSolutionId: "app-canvas-demo",
    tests: ["رسم", "حركة", "نقاط", "إعادة تشغيل"],
    dayId: "day-08",
    curriculumTopic: "Python — الحلقات والإحداثيات",
  },
  {
    id: "app-linear-search",
    exportSlug: "linear-search-sim",
    titleAr: "محاكاة البحث الخطي",
    description: "ابحث عن قيمة في قائمة مع إبراز خطوات البحث.",
    type: "محاكاة",
    difficulty: "متوسط",
    icon: "🔍",
    components: ["App", "Guide", "Input", "Button", "List", "Alert", "Badge"],
    usageSteps: [
      "أدخل العدد المطلوب.",
      "اضغط ابحث وشاهد خطوات الفحص.",
      "اقرأ إن وُجد العنصر أو لم يوجد.",
    ],
    starterCode: runnableStarter("app-linear-search", "محاكاة البحث الخطي"),
    teacherSolutionId: "app-linear-search",
    tests: ["بحث موجود", "بحث غير موجود", "عرض الخطوات"],
    dayId: "day-06",
    curriculumTopic: "Python — القوائم والخوارزميات",
  },
  {
    id: "app-caesar",
    exportSlug: "caesar-cipher",
    titleAr: "برنامج تشفير وفك تشفير",
    description: "شفرة قيصر مع مفتاح إزاحة وتشفير وفك.",
    type: "أداة",
    difficulty: "متوسط",
    icon: "🔐",
    components: ["App", "Guide", "Input", "Slider", "Button", "Alert", "Row"],
    usageSteps: [
      "اكتب نصًا إنجليزيًا.",
      "اضبط مفتاح الإزاحة.",
      "شفّر أو افك التشفير.",
    ],
    starterCode: runnableStarter("app-caesar", "تشفير قيصر"),
    teacherSolutionId: "app-caesar",
    tests: ["تشفير", "فك تشفير", "مفتاح الإزاحة"],
    dayId: "day-04",
    curriculumTopic: "Python — النصوص والحلقات",
  },
  {
    id: "app-edu-game",
    exportSlug: "edu-math-game",
    titleAr: "لعبة تعليمية",
    description: "أسئلة ضرب سريعة مع نقاط ومستوى صعوبة.",
    type: "لعبة",
    difficulty: "مبتدئ",
    icon: "🎓",
    components: ["App", "Guide", "Input", "Button", "Alert", "Badge", "Progress"],
    usageSteps: [
      "اقرأ سؤال الضرب.",
      "أدخل الإجابة وتحقق.",
      "اجمع النقاط ثم انتقل للسؤال التالي.",
    ],
    starterCode: runnableStarter("app-edu-game", "لعبة تعليمية"),
    teacherSolutionId: "app-edu-game",
    tests: ["سؤال جديد", "تحقق", "نقاط", "تقدم"],
  },
  {
    id: "app-number-convert",
    exportSlug: "number-system-converter",
    titleAr: "محول أنظمة العد",
    description: "حوّل الأعداد العشرية إلى ثنائي وعكسه بواجهة واضحة.",
    type: "أداة",
    difficulty: "مبتدئ",
    icon: "↔️",
    components: ["App", "Guide", "Input", "Button", "Alert", "Card"],
    usageSteps: [
      "أدخل عددًا عشريًا.",
      "اضغط تحويل لرؤية الثنائي.",
    ],
    starterCode: runnableStarter("app-number-convert", "محول أنظمة العد"),
    teacherSolutionId: "app-number-convert",
    tests: ["تحويل صحيح", "رسالة خطأ للمدخلات"],
    dayId: "day-03",
    curriculumTopic: "Python — أنظمة العد",
  },
];

export function getSkuiProject(id) {
  return SKUI_PROJECTS.find((p) => p.id === id) ?? null;
}

export function getSkuiProjectOrDefault(id) {
  return getSkuiProject(id) ?? SKUI_PROJECTS[0];
}

/** توافق مع الاستيرادات القديمة */
export const GRAPHIC_APP_PROJECT_IDS = SKUI_PROJECTS.map((p) => p.id);
