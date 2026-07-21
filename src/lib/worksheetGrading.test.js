import { describe, expect, it } from "vitest";
import {
  gradeMultipleChoice,
  gradeShortAnswer,
  gradeTrueFalse,
  gradeWorksheetTask,
  isStructuredTask,
  normalizeAnswer,
  taskAnswerComplete,
} from "./worksheetGrading.js";
import { STRUCTURED_WORKSHEETS } from "../content/worksheets/worksheetsStructured.js";

describe("worksheetGrading", () => {
  it("normalizes binary answers", () => {
    expect(normalizeAnswer(" 10110 ", "binary")).toBe("10110");
    expect(normalizeAnswer("10110₂", "binary")).toBe("10110");
  });

  it("grades short answer with accepted variants", () => {
    expect(gradeShortAnswer("10110", { acceptedAnswers: ["010110", "10110"], normalize: "binary" }).correct).toBe(
      true,
    );
    expect(gradeShortAnswer("11111", { acceptedAnswers: ["10110"], normalize: "binary" }).status).toBe("incorrect");
  });

  it("grades multiple choice", () => {
    expect(gradeMultipleChoice("b", "b").correct).toBe(true);
    expect(gradeMultipleChoice("a", "b").correct).toBe(false);
  });

  it("grades true false", () => {
    expect(gradeTrueFalse(true, true).correct).toBe(true);
    expect(gradeTrueFalse(false, true).correct).toBe(false);
  });

  it("grades ws-day-01 task 3 numeric", () => {
    const task = STRUCTURED_WORKSHEETS["ws-day-01"].tasks.find((t) => t.n === 3);
    const g = gradeWorksheetTask(task, "127");
    expect(g.allCorrect).toBe(true);
  });

  it("grades multi_part partial answers", () => {
    const task = STRUCTURED_WORKSHEETS["ws-day-01"].tasks.find((t) => t.n === 2);
    const g = gradeWorksheetTask(task, { b1: "45", b2: "63", b3: "59", b4: "26" });
    expect(g.allCorrect).toBe(true);
  });

  it("structured tasks are not essay", () => {
    const task = STRUCTURED_WORKSHEETS["ws-day-01"].tasks[0];
    expect(isStructuredTask(task)).toBe(true);
    expect(isStructuredTask({ n: 1, textAr: "x" })).toBe(false);
  });

  it("task complete when all parts filled", () => {
    const task = STRUCTURED_WORKSHEETS["ws-day-01"].tasks[0];
    expect(taskAnswerComplete(task, { d2: "10" })).toBe(false);
    expect(
      taskAnswerComplete(task, {
        d2: "10",
        d11: "1011",
        d24: "11000",
        d50: "110010",
        d616: "1001101000",
        d22: "10110",
      }),
    ).toBe(true);
  });
});
