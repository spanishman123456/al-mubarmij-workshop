/**
 * توافق خلفي: يُشتق من السجل الموحّد skuiProjectsRegistry.
 */
import { SKUI_PROJECTS } from "./skuiProjectsRegistry.js";

export const GRAPHIC_APP_PROJECTS = SKUI_PROJECTS.map((project) => ({
  id: project.id,
  exportSlug: project.exportSlug,
  titleAr: project.titleAr,
  curriculumTopic: project.curriculumTopic || `${project.type} — ${project.difficulty}`,
  dayId: project.dayId || null,
  starter: project.starterCode,
  edu: {
    subtitle: project.description,
    description: project.description,
    usageSteps: project.usageSteps,
  },
  type: project.type,
  difficulty: project.difficulty,
  icon: project.icon,
  components: project.components,
  tests: project.tests,
  teacherSolutionId: project.teacherSolutionId,
}));

export function getGraphicProject(id) {
  return GRAPHIC_APP_PROJECTS.find((p) => p.id === id) ?? null;
}
