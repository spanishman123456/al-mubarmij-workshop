import { describe, expect, it } from "vitest";
import { STRUCTURED_WORKSHEETS } from "./worksheetsStructured.js";
import { WORKSHEET_MODEL_ANSWERS } from "../teacher/worksheetModelAnswers.js";

describe("day 01 worksheet PDF alignment guards", () => {
  it("keeps correct decimal value for FF0000 red color", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-01"];
    const colorTask = ws.tasks.find((t) => t.n === 6);
    const redPart = colorTask.parts.find((p) => p.id === "red");
    const correctChoice = redPart.choices.find((c) => c.id === redPart.correctAnswer);
    expect(correctChoice.textAr).toBe("16711680");
    expect(redPart.explanationAr).toContain("16711680");
  });

  it("keeps teacher model answer synchronized with worksheet color value", () => {
    const day01Model = WORKSHEET_MODEL_ANSWERS["ws-day-01"];
    const item6 = day01Model.tasks.find((t) => t.n === 6);
    expect(item6.modelAr).toContain("16711680");
  });
});

describe("day 02 worksheet model-answer guards", () => {
  it("keeps model answers synchronized with explicit worksheet keys", () => {
    const day02Model = WORKSHEET_MODEL_ANSWERS["ws-day-02"];
    const n5 = day02Model.tasks.find((t) => t.n === 5);
    const n9 = day02Model.tasks.find((t) => t.n === 9);
    const n10 = day02Model.tasks.find((t) => t.n === 10);
    expect(n5.modelAr).toContain("جيد");
    expect(n9.modelAr).toContain("توليد تسلسل");
    expect(n10.modelAr).toContain("صح");
  });
});

describe("day 03 worksheet coverage guards", () => {
  it("provides structured worksheet and teacher model answers", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-03"];
    const model = WORKSHEET_MODEL_ANSWERS["ws-day-03"];
    expect(ws).toBeTruthy();
    expect(model).toBeTruthy();
    expect(ws.tasks).toHaveLength(10);
    expect(model.tasks).toHaveLength(10);
  });
});

describe("day 04 worksheet coverage guards", () => {
  it("provides structured worksheet and teacher model answers", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-04"];
    const model = WORKSHEET_MODEL_ANSWERS["ws-day-04"];
    expect(ws).toBeTruthy();
    expect(model).toBeTruthy();
    expect(ws.tasks).toHaveLength(10);
    expect(model.tasks).toHaveLength(10);
  });
});

describe("day 05 worksheet coverage guards", () => {
  it("provides structured worksheet and teacher model answers", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-05"];
    const model = WORKSHEET_MODEL_ANSWERS["ws-day-05"];
    expect(ws).toBeTruthy();
    expect(model).toBeTruthy();
    expect(ws.tasks).toHaveLength(10);
    expect(model.tasks).toHaveLength(10);
  });
});

describe("day 06 worksheet parity guards", () => {
  it("keeps worksheet structure and model answers aligned", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-06"];
    const model = WORKSHEET_MODEL_ANSWERS["ws-day-06"];
    expect(ws).toBeTruthy();
    expect(model).toBeTruthy();
    expect(ws.tasks).toHaveLength(10);
    expect(model.tasks).toHaveLength(10);
  });

  it("keeps core numeric/logic keys stable", () => {
    const ws = STRUCTURED_WORKSHEETS["ws-day-06"];
    const waitP2 = ws.tasks.find((t) => t.n === 4);
    const avgWait = ws.tasks.find((t) => t.n === 9);
    const fcfsMeaning = ws.tasks.find((t) => t.n === 6);
    expect(waitP2.acceptedAnswers).toContain("2");
    expect(avgWait.acceptedAnswers).toContain("1.67");
    expect(fcfsMeaning.correctAnswer).toBe("a");
  });
});
