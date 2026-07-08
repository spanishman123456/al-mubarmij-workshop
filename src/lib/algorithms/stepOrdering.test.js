import { describe, expect, it } from "vitest";
import { validateAlgorithmStepOrder } from "./stepOrdering.js";

describe("validateAlgorithmStepOrder", () => {
  const pool = ["اطبع max", "اقرأ a و b", "إذا a > b فاجعل max = a وإلا max = b", "max = 0"];
  const correct = ["اقرأ a و b", "إذا a > b فاجعل max = a وإلا max = b", "اطبع max"];

  it("accepts correct selected ordered steps with distractors present", () => {
    const order = [1, 2, 0, 3];
    const selected = new Set([1, 2, 0]);
    const r = validateAlgorithmStepOrder(pool, order, selected, correct);
    expect(r.ok).toBe(true);
  });

  it("rejects wrong order", () => {
    const order = [0, 1, 2, 3];
    const selected = new Set([1, 2, 0]);
    const r = validateAlgorithmStepOrder(pool, order, selected, correct);
    expect(r.ok).toBe(false);
  });
});
