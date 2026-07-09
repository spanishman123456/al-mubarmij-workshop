import { describe, expect, it } from "vitest";
import { STRUCTURED_WORKSHEETS } from "./worksheetsStructured.js";
import { WORKSHEET_MODEL_ANSWERS } from "../teacher/worksheetModelAnswers.js";

describe("worksheets structured", () => {
  it("includes ws-day-10 with 10 structured tasks", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-10"];
    expect(ws).toBeTruthy();
    expect(Array.isArray(ws.tasks)).toBe(true);
    expect(ws.tasks.length).toBe(10);
    for (const task of ws.tasks) {
      expect(typeof task.n).toBe("number");
      expect(typeof task.type).toBe("string");
      expect(typeof task.textAr).toBe("string");
    }
  });

  it("keeps ws-day-10 model answers aligned", () => {
    const models = WORKSHEET_MODEL_ANSWERS["ws-day-10"];
    expect(models?.teacherDayRoute).toBe("/teacher/day-10-answers");
    expect(models?.tasks?.length).toBe(10);
    expect(models.tasks.find((t) => t.n === 6)?.modelAr).toMatch(/1,4,9/);
    expect(models.tasks.find((t) => t.n === 7)?.modelAr).toMatch(/1,4,6,4,1/);
  });

  it("includes ws-day-11 and aligned model answers", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-11"];
    expect(ws).toBeTruthy();
    expect(ws.tasks.length).toBe(10);
    const models = WORKSHEET_MODEL_ANSWERS["ws-day-11"];
    expect(models?.teacherDayRoute).toBe("/teacher/day-11-answers");
    expect(models?.tasks?.length).toBe(10);
    expect(models.tasks.find((t) => t.n === 3)?.modelAr).toBe("70");
  });

  it("includes ws-day-12 and aligned model answers", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-12"];
    expect(ws).toBeTruthy();
    expect(ws.tasks.length).toBe(10);
    const models = WORKSHEET_MODEL_ANSWERS["ws-day-12"];
    expect(models?.teacherDayRoute).toBe("/teacher/day-12-answers");
    expect(models?.tasks?.length).toBe(10);
    expect(models.tasks.find((t) => t.n === 6)?.modelAr).toBe("10");
  });

  it("includes ws-day-13 and aligned model answers", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-13"];
    expect(ws).toBeTruthy();
    expect(ws.tasks.length).toBe(10);
    const models = WORKSHEET_MODEL_ANSWERS["ws-day-13"];
    expect(models?.teacherDayRoute).toBe("/teacher/day-13-answers");
    expect(models?.tasks?.length).toBe(10);
    expect(models.tasks.find((t) => t.n === 3)?.modelAr).toBe("30");
  });

  it("includes ws-day-14 and aligned model answers", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-14"];
    expect(ws).toBeTruthy();
    expect(ws.tasks.length).toBe(10);
    const models = WORKSHEET_MODEL_ANSWERS["ws-day-14"];
    expect(models?.teacherDayRoute).toBe("/teacher/day-14-answers");
    expect(models?.tasks?.length).toBe(10);
    expect(models.tasks.find((t) => t.n === 1)?.modelAr).toBe("75");
  });
});
