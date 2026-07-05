import { describe, expect, it } from "vitest";
import {
  gradeCardFlip,
  gradeCardSheet,
  gradeTruthTable,
  truthTableModelAnswer,
} from "./grading.js";

describe("quiz grading", () => {
  it("grades truth table pre-04", () => {
    const q = { logicExpr: "(NOT p AND q) OR r", varCount: 3 };
    const key = truthTableModelAnswer(q);
    expect(key).toHaveLength(8);
    const answers = {};
    for (let i = 0; i < 8; i += 1) answers[`${i}:result`] = key[i];
    expect(gradeTruthTable(q, JSON.stringify(answers))).toBe(true);
  });

  it("grades binary cards target 5", () => {
    const q = { target: 5, cardValues: [16, 8, 4, 2, 1] };
    const state = { 16: false, 8: false, 4: true, 2: false, 1: true };
    expect(gradeCardFlip(q, JSON.stringify(state))).toBe(true);
  });

  it("grades binary cards sheet", () => {
    const q = { targets: [13, 27], cardValues: [16, 8, 4, 2, 1] };
    const sheet = {
      13: { 16: false, 8: true, 4: true, 2: false, 1: true },
      27: { 16: true, 8: true, 4: false, 2: true, 1: true },
    };
    expect(gradeCardSheet(q, JSON.stringify(sheet))).toBe(true);
  });
});
