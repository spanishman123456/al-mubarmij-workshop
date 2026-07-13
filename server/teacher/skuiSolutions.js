/**
 * حلول skui الكاملة — للمعلمين عبر API محمي.
 * لا يستورد مسار الطالب skuiAdvancedApps كي لا تدخل الحلول المتقدمة في حزمته.
 */
import { SKUI_DEMO_APPS } from "../../src/data/skuiDemoApps.js";
import { SKUI_ADVANCED_APPS } from "../../src/data/skuiAdvancedApps.js";

export const SKUI_TEACHER_SOLUTIONS = Object.freeze({
  ...SKUI_DEMO_APPS,
  ...SKUI_ADVANCED_APPS,
});

export function getSkuiTeacherSolution(projectId) {
  const code = SKUI_TEACHER_SOLUTIONS[projectId];
  if (!code) return null;
  return { id: projectId, code };
}
