import { describe, expect, it } from "vitest";
import { DAY_LESSON_ROUTES, getDayLessonRoutes } from "./dayLessonRoutes";
import { caesarCipherLesson } from "./day06/caesarCipherLesson";
import { memoryHierarchyLesson } from "./day06/memoryHierarchyLesson";
import { cpuSchedulingLesson } from "./day06/cpuSchedulingLesson";
import { pythonScopeLesson } from "./day07/pythonScopeLesson";
import { diceRandomLesson } from "./day07/diceRandomLesson";
import { ticTacToeLesson } from "./day07/ticTacToeLesson";
import { gamePlanningLesson } from "./day07/gamePlanningLesson";
import { fibonacciSequenceLesson } from "./day08/fibonacciSequenceLesson";
import { algorithmComplexityLesson } from "./day08/algorithmComplexityLesson";
import { towerOfHanoiLesson } from "./day08/towerOfHanoiLesson";
import { pythonFilesIoLesson } from "./day08/pythonFilesIoLesson";
import { pythonRecursionLesson } from "./day09/pythonRecursionLesson";
import { fractalsIntroLesson } from "./day09/fractalsIntroLesson";
import { kochSnowflakeLesson } from "./day09/kochSnowflakeLesson";
import { sierpinskiTriangleLesson } from "./day09/sierpinskiTriangleLesson";

const REQUIRED_SECTION_KEYS = [
  "learningObjectives",
  "whyLearn",
  "prerequisites",
  "conceptSimple",
  "deepSections",
  "workedExamples",
  "guidedPractice",
  "independentPractice",
  "quickCheck",
  "summary",
];

const DETAILED_DAY_LESSONS = {
  "day-06": [caesarCipherLesson, memoryHierarchyLesson, cpuSchedulingLesson],
  "day-07": [pythonScopeLesson, diceRandomLesson, ticTacToeLesson, gamePlanningLesson],
  "day-08": [fibonacciSequenceLesson, algorithmComplexityLesson, towerOfHanoiLesson, pythonFilesIoLesson],
  "day-09": [pythonRecursionLesson, fractalsIntroLesson, kochSnowflakeLesson, sierpinskiTriangleLesson],
};

describe("day lesson routes continuity", () => {
  it("provides explicit lesson routes for days 06-09", () => {
    for (const dayId of ["day-06", "day-07", "day-08", "day-09"]) {
      const routes = getDayLessonRoutes(dayId);
      expect(routes.length).toBeGreaterThan(0);
      expect(routes.every((r) => r.to.startsWith("/lessons/"))).toBe(true);
    }
  });

  it("marks days 10-15 as missing detailed lesson routes", () => {
    for (const dayId of ["day-10", "day-11", "day-12", "day-13", "day-14", "day-15"]) {
      expect(getDayLessonRoutes(dayId)).toHaveLength(0);
    }
  });

  it("keeps detailed day lessons structurally complete (days 06-09)", () => {
    for (const lessons of Object.values(DETAILED_DAY_LESSONS)) {
      for (const lesson of lessons) {
        for (const key of REQUIRED_SECTION_KEYS) {
          expect(lesson[key], `${lesson.id} missing ${key}`).toBeTruthy();
        }
        expect(lesson.learningObjectives.length, `${lesson.id} objectives`).toBeGreaterThan(0);
        expect(lesson.deepSections.length, `${lesson.id} deepSections`).toBeGreaterThan(0);
        expect(lesson.workedExamples.length, `${lesson.id} workedExamples`).toBeGreaterThan(0);
        expect(lesson.guidedPractice.length, `${lesson.id} guidedPractice`).toBeGreaterThan(0);
        expect(lesson.independentPractice.length, `${lesson.id} independentPractice`).toBeGreaterThan(0);
        expect(lesson.quickCheck.questions?.length, `${lesson.id} quickCheck`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps day route registry populated for days 1-9", () => {
    for (const dayId of ["day-01", "day-02", "day-03", "day-04", "day-05", "day-06", "day-07", "day-08", "day-09"]) {
      expect(DAY_LESSON_ROUTES[dayId].length).toBeGreaterThan(0);
    }
  });
});
