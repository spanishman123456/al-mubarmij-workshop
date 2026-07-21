import { describe, expect, it } from "vitest";
import { fibIterative, fibRecursive, fibSequence, nextFibTerm } from "./fibonacci.js";

describe("fibonacci", () => {
  it("computes terms iteratively", () => {
    expect(fibIterative(0)).toBe(0);
    expect(fibIterative(1)).toBe(1);
    expect(fibIterative(6)).toBe(8);
    expect(fibIterative(10)).toBe(55);
  });

  it("matches recursive for small n", () => {
    for (let n = 0; n <= 8; n += 1) {
      expect(fibRecursive(n)).toBe(fibIterative(n));
    }
  });

  it("builds sequence", () => {
    expect(fibSequence(7)).toEqual([0, 1, 1, 2, 3, 5, 8]);
  });

  it("predicts next term", () => {
    expect(nextFibTerm([0, 1, 1, 2, 3, 5])).toBe(8);
  });
});
