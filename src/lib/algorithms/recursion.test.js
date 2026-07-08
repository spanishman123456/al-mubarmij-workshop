import { describe, expect, it } from "vitest";
import {
  factorial,
  sumToN,
  countDownSteps,
  factorialWithTrace,
  checkRecursionLabAnswer,
} from "./recursion.js";

describe("recursion", () => {
  it("computes factorial", () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(5)).toBe(120);
  });

  it("sums to n", () => {
    expect(sumToN(0)).toBe(0);
    expect(sumToN(6)).toBe(21);
    expect(sumToN(10)).toBe(55);
  });

  it("counts down steps", () => {
    expect(countDownSteps(4)).toBe(4);
    expect(countDownSteps(0)).toBe(0);
  });

  it("traces factorial calls", () => {
    const t = factorialWithTrace(4);
    expect(t.result).toBe(24);
    expect(t.calls).toBe(4);
  });

  it("grades lab answers", () => {
    expect(checkRecursionLabAnswer("fact-5", "120").ok).toBe(true);
    expect(checkRecursionLabAnswer("sum-6", "20").ok).toBe(false);
  });
});
