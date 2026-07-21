import { describe, expect, it } from "vitest";
import { checkComplexityAnswer, linearSteps, quadraticSteps } from "./complexity.js";

describe("complexity", () => {
  it("grades Big-O answers", () => {
    expect(checkComplexityAnswer("single-loop", "O(n)").ok).toBe(true);
    expect(checkComplexityAnswer("nested-loop", "O(n)").ok).toBe(false);
  });

  it("counts steps", () => {
    expect(linearSteps(5)).toBe(5);
    expect(quadraticSteps(4)).toBe(16);
  });
});
