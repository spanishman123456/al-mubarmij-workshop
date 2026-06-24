/**
 * بيانات تعليمية موحدة لكل مشروع رسومي — تظهر في المعاينة والتصدير
 */

export const GRAPHIC_PROJECT_EDU_FIELDS = [
  "subtitle",
  "description",
  "learningObjectives",
  "usageSteps",
  "curriculumLink",
  "codeHowItWorks",
  "reflectionQuestions",
];

export function buildDefaultEdu(project) {
  return {
    subtitle: project.subtitleAr || "",
    description: project.descriptionAr || "",
    learningObjectives: project.learningObjectives || [],
    usageSteps: project.usageSteps || [],
    curriculumLink: project.curriculumLinkAr || project.curriculumTopic || "",
    codeHowItWorks: project.codeHowItWorks || [],
    reflectionQuestions: project.reflectionQuestions || [],
  };
}
