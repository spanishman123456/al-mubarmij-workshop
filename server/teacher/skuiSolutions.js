/**
 * حلول skui الكاملة — للمعلمين عبر API محمي.
 * المصدر التشغيلي الموحّد: src/data/skuiDemoApps.js
 */
import { SKUI_DEMO_APPS } from "../../src/data/skuiDemoApps.js";

export const SKUI_TEACHER_SOLUTIONS = SKUI_DEMO_APPS;

export function getSkuiTeacherSolution(projectId) {
  const code = SKUI_TEACHER_SOLUTIONS[projectId];
  if (!code) return null;
  return { id: projectId, code };
}
