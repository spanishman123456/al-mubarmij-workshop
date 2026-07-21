import { describe, expect, it } from "vitest";
import { comprehensiveReviewLesson } from "./comprehensiveReviewLesson.js";
import { postAssessmentLesson } from "./postAssessmentLesson.js";
import { projectIdeationLesson } from "./projectIdeationLesson.js";
import { projectPlanningLesson } from "./projectPlanningLesson.js";

const LESSONS = [comprehensiveReviewLesson, postAssessmentLesson, projectIdeationLesson, projectPlanningLesson];

describe("day13 lesson depth", () => {
  it("keeps all day13 lessons structurally complete", () => {
    for (const lesson of LESSONS) {
      expect(Array.isArray(lesson.learningObjectives) && lesson.learningObjectives.length > 0).toBe(true);
      expect(typeof lesson.whyLearn).toBe("string");
      expect(Array.isArray(lesson.prerequisites) && lesson.prerequisites.length > 0).toBe(true);
      expect(typeof lesson.conceptSimple).toBe("string");
      expect(Array.isArray(lesson.deepSections) && lesson.deepSections.length > 0).toBe(true);
      expect(Array.isArray(lesson.workedExamples) && lesson.workedExamples.length > 0).toBe(true);
      expect(Array.isArray(lesson.guidedPractice) && lesson.guidedPractice.length > 0).toBe(true);
      expect(Array.isArray(lesson.independentPractice) && lesson.independentPractice.length > 0).toBe(true);
      expect(lesson.quickCheck?.questions?.length > 0).toBe(true);
      expect(typeof lesson.summary).toBe("string");
    }
  });
});
