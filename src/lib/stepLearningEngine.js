/**
 * محرك التعلّم التدريجي — خطوات، تلميحات، تحقق، وإظهار الحل.
 */

/** @typedef {{
 *   titleAr: string,
 *   instructionAr: string,
 *   commandsLearned?: string[],
 *   initialCode?: string,
 *   appendCode?: string,
 *   hints: string[],
 *   check: (code: string) => { ok: boolean, messageAr: string, fixHintAr?: string },
 *   runnable?: boolean,
 * }} LearningStep */

/** @typedef {{
 *   ideaAr: string,
 *   commandsAr: string[],
 *   stepsOverviewAr: string[],
 *   expectedOutputAr: string,
 *   steps: LearningStep[],
 *   fullSolution: string,
 * }} StepPlan */

/**
 * @param {string} code
 * @param {Array<{ check: (c: string) => boolean, messageAr: string }>} checks
 */
export function runChecks(code, checks) {
  const failed = checks.filter((c) => !c.check(code));
  if (failed.length === 0) {
    return { ok: true, messageAr: "ممتاز! أكملت هذه الخطوة بنجاح." };
  }
  return {
    ok: false,
    messageAr: `تحتاج تعديلاً: ${failed.map((f) => f.messageAr).join(" · ")}`,
    fixHintAr: failed[0].messageAr,
  };
}

/** @param {StepPlan|null} plan */
export function getInitialCode(plan) {
  if (!plan?.steps?.length) return plan?.fullSolution ?? "";
  const s0 = plan.steps[0];
  return s0.initialCode ?? s0.appendCode ?? "";
}

/** @param {StepPlan} plan @param {number} stepIndex */
export function getAppendForStep(plan, stepIndex) {
  return plan.steps[stepIndex]?.appendCode ?? "";
}

/**
 * @param {StepPlan} plan
 * @param {number} stepIndex
 * @param {string} code
 */
export function checkStep(plan, stepIndex, code) {
  const step = plan.steps[stepIndex];
  if (!step) return { ok: true, messageAr: "انتهيت من جميع الخطوات." };
  return step.check(code);
}

export function isStepRunnable(plan, stepIndex) {
  if (!plan) return true;
  if (stepIndex >= plan.steps.length) return true;
  const step = plan.steps[stepIndex];
  if (stepIndex === plan.steps.length - 1) return step?.runnable !== false;
  return step?.runnable === true;
}

export const MIN_ATTEMPTS_BEFORE_SOLUTION = 3;

export function resetStepState() {
  return {
    stepIndex: 0,
    stepHintLevel: 0,
    stepCheckResult: null,
    stepCheckAttempts: 0,
    solutionRevealed: false,
  };
}
