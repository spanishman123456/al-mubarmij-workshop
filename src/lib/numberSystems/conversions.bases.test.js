import { describe, it, expect } from "vitest";
import {
  fromBaseToDecimalSteps,
  decimalToBaseSteps,
  isValidInBase,
  digitsForBase,
} from "./conversions.js";

const BASES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

describe("all bases 2–16", () => {
  for (const base of BASES) {
    it(`digits for base ${base}`, () => {
      const d = digitsForBase(base);
      expect(d.length).toBe(base);
    });

    it(`round-trip decimal 100 in base ${base}`, () => {
      const encoded = decimalToBaseSteps(100, base);
      expect(encoded.ok).toBe(true);
      const decoded = fromBaseToDecimalSteps(encoded.result, base);
      expect(decoded.ok).toBe(true);
      expect(decoded.decimal).toBe(100);
    });
  }

  it("rejects invalid digit for each base", () => {
    expect(isValidInBase("2", 2)).toBe(false);
    expect(isValidInBase("5", 5)).toBe(false);
    expect(isValidInBase("G", 16)).toBe(false);
    expect(isValidInBase("A", 10)).toBe(false);
  });
});
