/**
 * سياسة ظهور الكود والتلميحات للطلاب — منطق مشترك (بناء الواجهة + تشغيل الخادم).
 *
 * ثمانية مستويات لظهور الكود، يتحكم بها المعلم ديناميكيًا لكل نطاق:
 * عام / مشروع محدد / يوم تدريبي محدد. الأولوية عند الحل:
 *   طالب > مجموعة > مشروع/نشاط > يوم > عام (طالب/مجموعة مؤجلان للمرحلة الثانية).
 *
 * لا يحتوي هذا الملف على أي حل نموذجي — فقط قواعد ما يُسمح بعرضه.
 */

/** المستوى الافتراضي الآمن: كود ابتدائي + تلميحات تدريجية (بدون حل كامل). */
export const DEFAULT_CODE_VISIBILITY_LEVEL = 4;

/** المستوى الاحتياطي عند فشل تحميل السياسة: إخفاء الحل الكامل تمامًا. */
export const FALLBACK_CODE_VISIBILITY_LEVEL = 1;

/**
 * @typedef {Object} CodeVisibilityLevelDef
 * @property {number} id
 * @property {string} key
 * @property {string} labelAr
 * @property {string} descriptionAr
 * @property {boolean} showsTask       هل يُعرض وصف المهمة؟
 * @property {boolean} showsHints      هل تُعرض التلميحات؟
 * @property {boolean} showsStarter    هل يُعرض الكود الابتدائي؟
 * @property {boolean} showsPartial    هل يُعرض كود جزئي بفراغات؟
 * @property {boolean} showsSteps      هل تُعرض الخطوات التدريجية؟
 * @property {"never"|"after"|"immediate"} fullSolution  متى يُكشف الحل الكامل؟
 */

/** @type {CodeVisibilityLevelDef[]} */
export const CODE_VISIBILITY_LEVELS = [
  {
    id: 1,
    key: "hide",
    labelAr: "إخفاء الكود كليًا",
    descriptionAr: "لا يُعرض أي كود أو تلميح — يبدأ الطالب من صفحة فارغة.",
    showsTask: false,
    showsHints: false,
    showsStarter: false,
    showsPartial: false,
    showsSteps: false,
    fullSolution: "never",
  },
  {
    id: 2,
    key: "task-only",
    labelAr: "عرض وصف المهمة فقط",
    descriptionAr: "يُعرض وصف المطلوب فقط دون أي كود أو تلميحات.",
    showsTask: true,
    showsHints: false,
    showsStarter: false,
    showsPartial: false,
    showsSteps: false,
    fullSolution: "never",
  },
  {
    id: 3,
    key: "hints-only",
    labelAr: "عرض التلميحات فقط",
    descriptionAr: "يُعرض وصف المهمة والتلميحات التدريجية دون كود جاهز.",
    showsTask: true,
    showsHints: true,
    showsStarter: false,
    showsPartial: false,
    showsSteps: false,
    fullSolution: "never",
  },
  {
    id: 4,
    key: "starter",
    labelAr: "عرض الكود الابتدائي (Starter)",
    descriptionAr: "يُعرض الكود الابتدائي مع التلميحات التدريجية، دون الحل الكامل.",
    showsTask: true,
    showsHints: true,
    showsStarter: true,
    showsPartial: false,
    showsSteps: false,
    fullSolution: "never",
  },
  {
    id: 5,
    key: "partial",
    labelAr: "عرض كود جزئي بفراغات",
    descriptionAr: "يُعرض كود جزئي فيه فراغات ليملأها الطالب، مع التلميحات.",
    showsTask: true,
    showsHints: true,
    showsStarter: true,
    showsPartial: true,
    showsSteps: false,
    fullSolution: "never",
  },
  {
    id: 6,
    key: "steps",
    labelAr: "عرض الكود خطوة بخطوة",
    descriptionAr: "يبني الطالب المشروع تدريجيًا عبر خطوات موجّهة مع تلميحات.",
    showsTask: true,
    showsHints: true,
    showsStarter: true,
    showsPartial: false,
    showsSteps: true,
    fullSolution: "never",
  },
  {
    id: 7,
    key: "full-after",
    labelAr: "عرض الكود الكامل بعد إكمال المحاولة",
    descriptionAr: "يُكشف الحل الكامل للطالب بعد إتمام الخطوات أو عدد كافٍ من المحاولات.",
    showsTask: true,
    showsHints: true,
    showsStarter: true,
    showsPartial: false,
    showsSteps: true,
    fullSolution: "after",
  },
  {
    id: 8,
    key: "full-immediate",
    labelAr: "عرض الكود الكامل مباشرة",
    descriptionAr: "يُعرض الحل الكامل مباشرة للطالب دون شرط محاولة.",
    showsTask: true,
    showsHints: true,
    showsStarter: true,
    showsPartial: false,
    showsSteps: true,
    fullSolution: "immediate",
  },
];

const LEVEL_BY_ID = new Map(CODE_VISIBILITY_LEVELS.map((l) => [l.id, l]));

/** المستويات التي تكشف الحل الكامل للطالب (تحتاج نافذة تأكيد). */
export const FULL_SOLUTION_LEVELS = CODE_VISIBILITY_LEVELS.filter(
  (l) => l.fullSolution !== "never",
).map((l) => l.id);

/** @param {unknown} value */
export function isValidLevel(value) {
  return LEVEL_BY_ID.has(Number(value));
}

/**
 * يعيد قيمة مستوى صالحة أو الافتراضي.
 * @param {unknown} value
 * @param {number} [fallback]
 */
export function normalizeLevel(value, fallback = DEFAULT_CODE_VISIBILITY_LEVEL) {
  const n = Number(value);
  return LEVEL_BY_ID.has(n) ? n : fallback;
}

/** @param {number} id */
export function getLevelDef(id) {
  return LEVEL_BY_ID.get(Number(id)) || LEVEL_BY_ID.get(DEFAULT_CODE_VISIBILITY_LEVEL);
}

/**
 * الحالة الافتراضية للسياسة (بلا أي تخصيص).
 * حقول studentScope/groupScope/schedule محفوظة كعناصر خاملة للمرحلة الثانية.
 */
export function defaultCodeVisibilityPolicy() {
  return {
    general: DEFAULT_CODE_VISIBILITY_LEVEL,
    projects: {},
    days: {},
    // عناصر خاملة — لا تُستخدم في المرحلة الأولى:
    students: {},
    groups: {},
    schedules: {},
  };
}

/**
 * يحسب المستوى الفعّال لمورد وفق أولوية النطاقات.
 * المرحلة الأولى: مشروع > يوم > عام. (طالب/مجموعة عناصر خاملة.)
 *
 * @param {{ projectId?: string|null, dayId?: string|null, studentId?: string|null, groupId?: string|null }} target
 * @param {ReturnType<typeof defaultCodeVisibilityPolicy>} policy
 * @returns {{ level: number, scope: "student"|"group"|"project"|"day"|"general" }}
 */
export function resolveEffectiveLevel(target = {}, policy = defaultCodeVisibilityPolicy()) {
  const p = policy || defaultCodeVisibilityPolicy();
  const { projectId, dayId, studentId, groupId } = target;

  if (studentId && p.students && isValidLevel(p.students[studentId])) {
    return { level: normalizeLevel(p.students[studentId]), scope: "student" };
  }
  if (groupId && p.groups && isValidLevel(p.groups[groupId])) {
    return { level: normalizeLevel(p.groups[groupId]), scope: "group" };
  }
  if (projectId && p.projects && isValidLevel(p.projects[projectId])) {
    return { level: normalizeLevel(p.projects[projectId]), scope: "project" };
  }
  if (dayId && p.days && isValidLevel(p.days[dayId])) {
    return { level: normalizeLevel(p.days[dayId]), scope: "day" };
  }
  return { level: normalizeLevel(p.general), scope: "general" };
}
