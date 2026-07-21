import { describe, expect, it } from "vitest";
import { linearSearchSteps, binarySearchSteps } from "./search.js";

describe("linearSearchSteps", () => {
  it("returns found index with step trace", () => {
    const result = linearSearchSteps([9, 4, 7, 12], 7);
    expect(result.foundIndex).toBe(2);
    expect(result.steps.length).toBe(3);
    expect(result.steps[2].match).toBe(true);
  });

  it("returns -1 when target missing", () => {
    const result = linearSearchSteps([2, 3, 4], 8);
    expect(result.foundIndex).toBe(-1);
    expect(result.steps.at(-1)?.messageAr).toMatch(/لم نجد/);
  });
});

describe("binarySearchSteps", () => {
  it("sorts input and finds target", () => {
    const result = binarySearchSteps([14, 3, 8, 5], 8);
    expect(result.sorted).toEqual([3, 5, 8, 14]);
    expect(result.foundIndex).toBe(2);
    expect(result.steps.some((s) => s.relation === "equal")).toBe(true);
  });

  it("returns -1 when target missing", () => {
    const result = binarySearchSteps([1, 2, 3, 4, 5], 6);
    expect(result.foundIndex).toBe(-1);
    expect(result.steps.at(-1)?.relation).toBe("not_found");
  });
});
