/**
 * كتالوج موحّد لموارد مختبر بايثون لأغراض سياسة ظهور الكود.
 *
 * يربط معرّف المورد (resourceId) بوصف موحّد: المشروع، اليوم، وصف المهمة،
 * التلميحات، الكود الابتدائي الآمن، الكود الجزئي، وهل يوجد حل كامل.
 *
 * لا يحتوي على أي حل نموذجي كامل — الحل الكامل يبقى على الخادم فقط
 * (server/teacher/skuiSolutions.js) ولا يُصدَّر إلى حزمة الطالب.
 */
import { SKUI_PROJECTS, getSkuiProjectOrDefault } from "./skuiProjectsRegistry.js";
import { pythonExercises } from "./pythonExercises.js";
import { getStepPlan } from "./stepLearningPlans.js";
import { LESSON_ID_TO_DAY } from "../config/publicationPolicy.js";

function dayIdFromNumber(n) {
  if (!Number.isFinite(n) || n < 1) return null;
  return n <= 9 ? `day-0${n}` : `day-${n}`;
}

function collectHints(plan) {
  if (!plan) return [];
  const fromSteps = (plan.steps || []).flatMap((s) => s.hints || []).filter(Boolean);
  if (fromSteps.length) return fromSteps;
  return (plan.stepsOverviewAr || []).filter(Boolean);
}

/**
 * وصف مورد موحّد.
 * @param {"console"|"app"} mode
 * @param {string} resourceId
 */
export function getResourceMeta(mode, resourceId) {
  if (mode === "app") {
    const project = getSkuiProjectOrDefault(resourceId);
    const plan = getStepPlan("app", project.id);
    const starter = project.studentStarterCode ?? plan?.steps?.[0]?.initialCode ?? "";
    return {
      resourceId: project.id,
      mode: "app",
      projectId: project.id,
      dayId: project.dayId || null,
      titleAr: project.titleAr,
      taskDescriptionAr: project.description || plan?.ideaAr || project.titleAr,
      hints: collectHints(plan),
      starterCode: starter,
      partialCode: plan?.steps?.[0]?.initialCode ?? starter,
      steps: plan?.steps ?? [],
      hasFullSolution: true,
    };
  }

  const ex = pythonExercises.find((e) => e.id === resourceId) ?? pythonExercises[0];
  const plan = getStepPlan("console", ex.id);
  const dayNum = LESSON_ID_TO_DAY[ex.lessonId] ?? null;
  return {
    resourceId: ex.id,
    mode: "console",
    projectId: ex.id,
    dayId: dayIdFromNumber(dayNum),
    titleAr: ex.titleAr,
    taskDescriptionAr: ex.hintAr || ex.titleAr,
    hints: collectHints(plan),
    starterCode: plan?.steps?.[0]?.initialCode ?? ex.starter ?? "",
    partialCode: plan?.steps?.[0]?.initialCode ?? ex.starter ?? "",
    steps: plan?.steps ?? [],
    hasFullSolution: Boolean(plan?.fullSolution),
  };
}

/**
 * قائمة المشاريع القابلة للتخصيص في صفحة المعلم (نطاق «مشروع»).
 * تقتصر على المشاريع الرسومية/skui لأنها موضع طلب الطلاب.
 */
export function listCatalogProjects() {
  return SKUI_PROJECTS.map((p) => ({
    id: p.id,
    titleAr: p.titleAr,
    dayId: p.dayId || null,
    category: p.category || "training",
    type: p.type || "تطبيق",
  }));
}

/** قائمة الأيام التدريبية (نطاق «يوم»). */
export function listCatalogDays() {
  const out = [];
  for (let d = 1; d <= 15; d += 1) {
    out.push({ dayId: dayIdFromNumber(d), dayNumber: d });
  }
  return out;
}

/** التحقق من وجود مشروع بالمعرّف. */
export function isKnownProjectId(projectId) {
  return SKUI_PROJECTS.some((p) => p.id === projectId);
}
