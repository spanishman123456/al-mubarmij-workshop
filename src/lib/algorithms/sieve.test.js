import { describe, expect, it } from "vitest";
import { sievePrimesUpTo } from "./sieve.js";

describe("sievePrimesUpTo", () => {
  it("builds primes up to 30", () => {
    const result = sievePrimesUpTo(30);
    expect(result.primes).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it("handles limits below 2", () => {
    const result = sievePrimesUpTo(1);
    expect(result.primes).toEqual([]);
    expect(result.steps[0].messageAr).toMatch(/لا توجد/);
  });
});
