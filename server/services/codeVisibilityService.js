/**
 * خدمة سياسة ظهور الكود — تحلّ المستوى الفعّال، تُحدّث السياسة مع سجل تغييرات،
 * تدعم التراجع والاسترجاع، وتبني «المحتوى المسموح» للطالب دون تسريب الحل الكامل.
 */
import {
  getCodeVisibilitySettings,
  setCodeVisibilitySettings,
} from "../repositories/platformSettingsRepository.js";
import {
  resolveEffectiveLevel,
  getLevelDef,
  normalizeLevel,
  isValidLevel,
  DEFAULT_CODE_VISIBILITY_LEVEL,
  FALLBACK_CODE_VISIBILITY_LEVEL,
} from "../../src/config/codeVisibilityPolicy.js";
import { getResourceMeta, isKnownProjectId } from "../../src/data/codeVisibilityCatalog.js";
import { getStepPlan } from "../../src/data/stepLearningPlans.js";
import { getSkuiTeacherSolution } from "../teacher/skuiSolutions.js";
import { getSkuiProjectOrDefault } from "../../src/data/skuiProjectsRegistry.js";

/** عدد المحاولات الكافية لكشف الحل عند المستوى «بعد إكمال المحاولة». */
export const MIN_ATTEMPTS_FOR_FULL = 3;

const VALID_SCOPES = new Set(["general", "project", "day"]);

export function getCodeVisibilityConfig() {
  const settings = getCodeVisibilitySettings();
  return {
    ...settings,
    source: settings.updatedAt ? "database" : "default",
  };
}

/**
 * يحسب المستوى الفعّال لمورد.
 * @param {"console"|"app"} mode
 * @param {string} resourceId
 */
export function resolveLevelForResource(mode, resourceId, config = getCodeVisibilityConfig()) {
  const meta = getResourceMeta(mode, resourceId);
  const { level, scope } = resolveEffectiveLevel(
    { projectId: meta.projectId, dayId: meta.dayId },
    config,
  );
  return { level, scope, meta };
}

/**
 * تفكيك السياسة الفعّالة لمورد عبر كل النطاقات — لأغراض تشخيص المعلم.
 * لا يكشف الحل الكامل، فقط توفره من عدمه.
 * @param {"console"|"app"} mode
 * @param {string} resourceId
 */
export function diagnoseResource(mode, resourceId, config = getCodeVisibilityConfig()) {
  const meta = getResourceMeta(mode, resourceId);
  const generalLevel = normalizeLevel(config.general);
  const dayLevel =
    meta.dayId && isValidLevel(config.days?.[meta.dayId]) ? normalizeLevel(config.days[meta.dayId]) : null;
  const projectLevel = isValidLevel(config.projects?.[meta.projectId])
    ? normalizeLevel(config.projects[meta.projectId])
    : null;
  const { level, scope } = resolveEffectiveLevel(
    { projectId: meta.projectId, dayId: meta.dayId },
    config,
  );
  return {
    resourceId: meta.resourceId,
    mode,
    projectId: meta.projectId,
    dayId: meta.dayId,
    titleAr: meta.titleAr,
    generalLevel,
    dayLevel,
    projectLevel,
    resolvedLevel: level,
    resolvedScope: scope,
    catalogMatch: mode === "console" ? true : isKnownProjectId(meta.projectId),
    fullSolutionAvailable: Boolean(getServerFullSolution(mode, meta)),
    fetchedAt: new Date().toISOString(),
  };
}

function cloneMap(map) {
  return { ...(map || {}) };
}

/**
 * يطبّق تغييرًا على نطاق واحد ويعيد {policy, before}.
 * @param {object} config
 * @param {"general"|"project"|"day"} scope
 * @param {string|null} target
 * @param {number|null} level  (null = حذف/إعادة للافتراضي)
 */
function applyScopeChange(config, scope, target, level) {
  const next = {
    ...config,
    projects: cloneMap(config.projects),
    days: cloneMap(config.days),
  };
  let before = null;
  if (scope === "general") {
    before = isValidLevel(config.general) ? normalizeLevel(config.general) : null;
    next.general = level == null ? DEFAULT_CODE_VISIBILITY_LEVEL : normalizeLevel(level);
  } else if (scope === "project") {
    before = isValidLevel(config.projects?.[target]) ? normalizeLevel(config.projects[target]) : null;
    if (level == null) delete next.projects[target];
    else next.projects[target] = normalizeLevel(level);
  } else if (scope === "day") {
    before = isValidLevel(config.days?.[target]) ? normalizeLevel(config.days[target]) : null;
    if (level == null) delete next.days[target];
    else next.days[target] = normalizeLevel(level);
  }
  return { policy: next, before };
}

function appendAudit(policy, entry) {
  const audit = Array.isArray(policy.audit) ? [...policy.audit] : [];
  audit.push({
    at: new Date().toISOString(),
    teacherId: entry.teacherId || null,
    scope: entry.scope || null,
    target: entry.target || null,
    before: isValidLevel(entry.before) ? normalizeLevel(entry.before) : null,
    after: isValidLevel(entry.after) ? normalizeLevel(entry.after) : null,
    action: entry.action || "update",
    reason: entry.reason || null,
  });
  return audit;
}

/**
 * يحدّث السياسة لنطاق واحد ويسجّل التغيير.
 * @param {{ scope: string, target?: string|null, level: number, reason?: string }} patch
 * @param {string} teacherId
 */
export function updateCodeVisibility(patch, teacherId) {
  const scope = String(patch?.scope || "");
  if (!VALID_SCOPES.has(scope)) {
    throw new Error("invalid_scope");
  }
  const target = scope === "general" ? null : String(patch?.target || "");
  if (scope !== "general" && !target) {
    throw new Error("missing_target");
  }
  if (!isValidLevel(patch?.level)) {
    throw new Error("invalid_level");
  }

  const config = getCodeVisibilityConfig();
  const { policy, before } = applyScopeChange(config, scope, target, patch.level);
  policy.audit = appendAudit(policy, {
    teacherId,
    scope,
    target,
    before,
    after: normalizeLevel(patch.level),
    action: "update",
    reason: patch.reason,
  });
  policy.updatedBy = teacherId || policy.updatedBy || "teacher";
  policy.updatedAt = new Date().toISOString();
  setCodeVisibilitySettings(policy);
  return getCodeVisibilityConfig();
}

/**
 * يعيد نطاقًا إلى الافتراضي (حذف التخصيص).
 * @param {{ scope: string, target?: string|null, reason?: string }} patch
 */
export function resetCodeVisibility(patch, teacherId) {
  const scope = String(patch?.scope || "");
  if (!VALID_SCOPES.has(scope)) {
    throw new Error("invalid_scope");
  }
  const target = scope === "general" ? null : String(patch?.target || "");
  if (scope !== "general" && !target) {
    throw new Error("missing_target");
  }
  const config = getCodeVisibilityConfig();
  const { policy, before } = applyScopeChange(config, scope, target, null);
  policy.audit = appendAudit(policy, {
    teacherId,
    scope,
    target,
    before,
    after: scope === "general" ? DEFAULT_CODE_VISIBILITY_LEVEL : null,
    action: "reset",
    reason: patch.reason,
  });
  policy.updatedBy = teacherId || policy.updatedBy || "teacher";
  policy.updatedAt = new Date().toISOString();
  setCodeVisibilitySettings(policy);
  return getCodeVisibilityConfig();
}

/** يتراجع عن آخر تغيير فعلي (update/reset) ويعيد الحالة السابقة. */
export function undoLastCodeVisibility(teacherId) {
  const config = getCodeVisibilityConfig();
  const audit = Array.isArray(config.audit) ? [...config.audit] : [];
  const lastReal = [...audit].reverse().find((e) => e.action === "update" || e.action === "reset");
  if (!lastReal) {
    throw new Error("nothing_to_undo");
  }
  const { policy } = applyScopeChange(config, lastReal.scope, lastReal.target, lastReal.before);
  policy.audit = appendAudit(policy, {
    teacherId,
    scope: lastReal.scope,
    target: lastReal.target,
    before: lastReal.after,
    after: lastReal.before,
    action: "undo",
    reason: "تراجع عن آخر تغيير",
  });
  policy.updatedBy = teacherId || policy.updatedBy || "teacher";
  policy.updatedAt = new Date().toISOString();
  setCodeVisibilitySettings(policy);
  return getCodeVisibilityConfig();
}

/** استرجاع = تراجع عن آخر تغيير (المرحلة الأولى). */
export function revertCodeVisibility(teacherId) {
  return undoLastCodeVisibility(teacherId);
}

function getServerFullSolution(mode, meta) {
  if (mode === "app") {
    const project = getSkuiProjectOrDefault(meta.resourceId);
    const solution =
      getSkuiTeacherSolution(project.teacherSolutionId || meta.resourceId) ||
      getSkuiTeacherSolution(meta.resourceId);
    return solution?.code || null;
  }
  const plan = getStepPlan("console", meta.resourceId);
  return plan?.fullSolution || null;
}

/**
 * يبني «المحتوى المسموح» لمتلقٍّ ما وفق المستوى الفعّال.
 * جوهر الحماية: لا يعيد الحل الكامل إلا عند المستوى 8 (فوري)
 * أو المستوى 7 (بعد إكمال المحاولة) مع تحقق شرط المحاولات/الخطوات.
 *
 * @param {"console"|"app"} mode
 * @param {string} resourceId
 * @param {{ role?: string, attemptsCompleted?: number, stepsCompleted?: boolean }} ctx
 */
export function buildAllowedContent(mode, resourceId, ctx = {}) {
  let level;
  let scope;
  let meta;
  let policyFailed = false;
  const config = (() => {
    try {
      return getCodeVisibilityConfig();
    } catch {
      policyFailed = true;
      return null;
    }
  })();

  try {
    if (policyFailed) throw new Error("policy_load_failed");
    const resolved = resolveLevelForResource(mode, resourceId, config);
    level = resolved.level;
    scope = resolved.scope;
    meta = resolved.meta;
  } catch {
    // فشل تحميل السياسة → المستوى الاحتياطي الآمن (إخفاء الحل).
    policyFailed = true;
    level = FALLBACK_CODE_VISIBILITY_LEVEL;
    scope = "general";
    meta = getResourceMeta(mode, resourceId);
  }

  const def = getLevelDef(level);
  const isTeacher = String(ctx.role || "").toLowerCase() === "teacher";

  const attempts = Number(ctx.attemptsCompleted) || 0;
  const stepsCompleted = Boolean(ctx.stepsCompleted);
  const meetsAfterCondition = stepsCompleted || attempts >= MIN_ATTEMPTS_FOR_FULL;

  let fullSolutionAllowed = false;
  if (def.fullSolution === "immediate") fullSolutionAllowed = true;
  else if (def.fullSolution === "after" && meetsAfterCondition) fullSolutionAllowed = true;

  const serverSolution = fullSolutionAllowed && !isTeacher ? getServerFullSolution(mode, meta) : null;
  // المستوى يسمح بالحل لكن لا يوجد حل مربوط بالمشروع → رسالة آمنة، دون كشف تفاصيل.
  const fullSolutionMissing = fullSolutionAllowed && !isTeacher && !serverSolution;

  // تشخيص per-scope (غير حسّاس) لتوضيح أي نطاق حسم المستوى.
  const cfg = config || {};
  const generalLevel = normalizeLevel(cfg.general);
  const dayLevel =
    meta.dayId && isValidLevel(cfg.days?.[meta.dayId]) ? normalizeLevel(cfg.days[meta.dayId]) : null;
  const projectLevel = isValidLevel(cfg.projects?.[meta.projectId])
    ? normalizeLevel(cfg.projects[meta.projectId])
    : null;

  const payload = {
    resourceId: meta.resourceId,
    mode,
    level,
    levelKey: def.key,
    scope,
    resolvedScope: scope,
    generalLevel: policyFailed ? null : generalLevel,
    dayLevel: policyFailed ? null : dayLevel,
    projectLevel: policyFailed ? null : projectLevel,
    catalogMatch: mode === "console" ? true : isKnownProjectId(meta.projectId),
    policyFailed,
    titleAr: meta.titleAr,
    taskDescriptionAr: def.showsTask ? meta.taskDescriptionAr : null,
    hints: def.showsHints ? meta.hints : [],
    starterCode: def.showsStarter ? meta.starterCode : null,
    partialCode: def.showsPartial ? meta.partialCode : null,
    stepsEnabled: def.showsSteps,
    fullSolutionAvailable: fullSolutionAllowed,
    fullSolutionMissing,
    fullSolution: serverSolution,
    notice: fullSolutionMissing
      ? "المحتوى الكامل غير متاح لهذا المشروع حاليًا. تم إبقاء كود البداية."
      : null,
  };

  // سجل تشخيصي على الخادم عند تعذّر تطبيق الحل الكامل رغم السماح به.
  if (fullSolutionMissing && typeof ctx.logDiagnostic === "function") {
    ctx.logDiagnostic("codeVisibility.fullSolutionMissing", {
      resourceId: meta.resourceId,
      projectId: meta.projectId,
      resolvedLevel: level,
      resolvedScope: scope,
      catalogMatch: payload.catalogMatch,
      reason: "no_server_full_solution",
    });
  }

  return payload;
}

/**
 * معاينة كطالب — نفس منطق buildAllowedContent لكن بدور طالب دائمًا
 * ودون أي تأثير على التقدم أو المحاولات.
 */
export function previewAsStudent(mode, resourceId, ctx = {}) {
  return buildAllowedContent(mode, resourceId, {
    ...ctx,
    role: "student",
  });
}
