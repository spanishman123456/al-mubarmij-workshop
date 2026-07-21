import { describe, expect, it } from "vitest";
import {
  getDayPublicationMap,
  isLessonIdPublished,
  isPathPublished,
  parsePublishedDays,
  PublicationStatus,
} from "./publicationPolicy.js";

describe("publicationPolicy", () => {
  it("parsePublishedDays defaults to 15 when unset", () => {
    expect(parsePublishedDays(undefined)).toBe(15);
    expect(parsePublishedDays("")).toBe(15);
  });

  it("parsePublishedDays clamps to 1..15", () => {
    expect(parsePublishedDays("1")).toBe(1);
    expect(parsePublishedDays("3")).toBe(3);
    expect(parsePublishedDays("99")).toBe(15);
    expect(parsePublishedDays("0")).toBe(15);
  });

  it("maps day01 published and day02-day05 draft when PUBLISHED_DAYS=1", () => {
    const map = getDayPublicationMap(1);
    expect(map).toMatchObject({
      day01: PublicationStatus.PUBLISHED,
      day02: PublicationStatus.DRAFT,
      day03: PublicationStatus.DRAFT,
      day04: PublicationStatus.DRAFT,
      day05: PublicationStatus.DRAFT,
    });
  });

  it("blocks day 2 lesson routes for students", () => {
    expect(isPathPublished("/lessons/conversions-intro", 1, "student")).toBe(false);
    expect(isPathPublished("/lessons/number-systems", 1, "student")).toBe(true);
    expect(isPathPublished("/onboarding/bingo", 1, "student")).toBe(true);
    expect(isPathPublished("/quizzes/run/quiz-pre", 1, "student")).toBe(true);
    expect(isPathPublished("/quizzes/run/quiz-day-02", 1, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-02", 1, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-01", 1, "student")).toBe(true);
  });

  it("teacher can preview all teacher answer routes", () => {
    expect(isPathPublished("/teacher/day-01-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-02-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-06-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-07-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-08-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-09-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-10-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-11-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-12-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-13-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-14-answers", 1, "teacher")).toBe(true);
    expect(isPathPublished("/teacher/day-15-answers", 1, "teacher")).toBe(true);
  });

  it("blocks day 6 lesson routes for students when PUBLISHED_DAYS=5", () => {
    expect(isPathPublished("/lessons/caesar-cipher", 5, "student")).toBe(false);
    expect(isPathPublished("/lessons/memory-hierarchy", 5, "student")).toBe(false);
    expect(isPathPublished("/lessons/cpu-scheduling", 5, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-06", 5, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-06", 5, "student")).toBe(false);
  });

  it("blocks day 7 lesson routes for students when PUBLISHED_DAYS=6", () => {
    expect(isPathPublished("/lessons/python-scope", 6, "student")).toBe(false);
    expect(isPathPublished("/lessons/dice-random", 6, "student")).toBe(false);
    expect(isPathPublished("/lessons/tic-tac-toe", 6, "student")).toBe(false);
    expect(isPathPublished("/lessons/game-planning", 6, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-07", 6, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-07", 6, "student")).toBe(false);
  });

  it("blocks day 8 lesson routes for students when PUBLISHED_DAYS=7", () => {
    expect(isPathPublished("/lessons/fibonacci-sequence", 7, "student")).toBe(false);
    expect(isPathPublished("/lessons/algorithm-complexity", 7, "student")).toBe(false);
    expect(isPathPublished("/lessons/tower-of-hanoi", 7, "student")).toBe(false);
    expect(isPathPublished("/lessons/python-files-io", 7, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-08", 7, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-08", 7, "student")).toBe(false);
  });

  it("rejects unpublished lesson ids on server save", () => {
    expect(isLessonIdPublished("number-systems", 1)).toBe(true);
    expect(isLessonIdPublished("conversions-intro", 1)).toBe(false);
    expect(isLessonIdPublished("python-constants", 1)).toBe(false);
    expect(isLessonIdPublished("linear-search", 1)).toBe(false);
    expect(isLessonIdPublished("python-scope", 2)).toBe(false);
    expect(isLessonIdPublished("fibonacci-sequence", 2)).toBe(false);
    expect(isLessonIdPublished("python-recursion", 2)).toBe(false);
    expect(isLessonIdPublished("oop-foundations", 2)).toBe(false);
    expect(isLessonIdPublished("ai-foundations", 2)).toBe(false);
    expect(isLessonIdPublished("regex-automata", 2)).toBe(false);
    expect(isLessonIdPublished("comprehensive-review", 2)).toBe(false);
    expect(isLessonIdPublished("project-architecture", 2)).toBe(false);
    expect(isLessonIdPublished("final-project-presentation", 2)).toBe(false);
  });

  it("blocks day 9 lesson routes for students when PUBLISHED_DAYS=8", () => {
    expect(isPathPublished("/lessons/python-recursion", 8, "student")).toBe(false);
    expect(isPathPublished("/lessons/fractals-intro", 8, "student")).toBe(false);
    expect(isPathPublished("/lessons/koch-snowflake", 8, "student")).toBe(false);
    expect(isPathPublished("/lessons/sierpinski-triangle", 8, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-09", 8, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-09", 8, "student")).toBe(false);
  });

  it("blocks day 10 lesson routes for students when PUBLISHED_DAYS=9", () => {
    expect(isPathPublished("/lessons/oop-foundations", 9, "student")).toBe(false);
    expect(isPathPublished("/lessons/steganography-python", 9, "student")).toBe(false);
    expect(isPathPublished("/lessons/fractal-tree-recursion", 9, "student")).toBe(false);
    expect(isPathPublished("/lessons/locker-pascal-problem", 9, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-10", 9, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-10", 9, "student")).toBe(false);
  });

  it("blocks day 11 lesson routes for students when PUBLISHED_DAYS=10", () => {
    expect(isPathPublished("/lessons/ai-foundations", 10, "student")).toBe(false);
    expect(isPathPublished("/lessons/machine-learning-basics", 10, "student")).toBe(false);
    expect(isPathPublished("/lessons/ai-ethics-safety", 10, "student")).toBe(false);
    expect(isPathPublished("/lessons/ai-research-presentation", 10, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-11", 10, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-11", 10, "student")).toBe(false);
  });

  it("blocks day 12 lesson routes for students when PUBLISHED_DAYS=11", () => {
    expect(isPathPublished("/lessons/regex-automata", 11, "student")).toBe(false);
    expect(isPathPublished("/lessons/dfa-nfa-design", 11, "student")).toBe(false);
    expect(isPathPublished("/lessons/p-vs-np-intro", 11, "student")).toBe(false);
    expect(isPathPublished("/lessons/graph-theory-basics", 11, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-12", 11, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-12", 11, "student")).toBe(false);
  });

  it("blocks day 13 lesson routes for students when PUBLISHED_DAYS=12", () => {
    expect(isPathPublished("/lessons/comprehensive-review", 12, "student")).toBe(false);
    expect(isPathPublished("/lessons/post-assessment-readiness", 12, "student")).toBe(false);
    expect(isPathPublished("/lessons/project-ideation", 12, "student")).toBe(false);
    expect(isPathPublished("/lessons/project-planning", 12, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-13", 12, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-13", 12, "student")).toBe(false);
  });

  it("blocks day 14 lesson routes for students when PUBLISHED_DAYS=13", () => {
    expect(isPathPublished("/lessons/project-architecture", 13, "student")).toBe(false);
    expect(isPathPublished("/lessons/project-implementation-sprint", 13, "student")).toBe(false);
    expect(isPathPublished("/lessons/project-testing-debugging", 13, "student")).toBe(false);
    expect(isPathPublished("/lessons/project-presentation-rehearsal", 13, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-14", 13, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-14", 13, "student")).toBe(false);
  });

  it("blocks day 15 lesson routes for students when PUBLISHED_DAYS=14", () => {
    expect(isPathPublished("/lessons/final-project-presentation", 14, "student")).toBe(false);
    expect(isPathPublished("/lessons/peer-feedback-and-refinement", 14, "student")).toBe(false);
    expect(isPathPublished("/lessons/final-evaluation", 14, "student")).toBe(false);
    expect(isPathPublished("/lessons/program-closure-next-steps", 14, "student")).toBe(false);
    expect(isPathPublished("/path/day/day-15", 14, "student")).toBe(false);
    expect(isPathPublished("/worksheets/ws-day-15", 14, "student")).toBe(false);
  });
});
