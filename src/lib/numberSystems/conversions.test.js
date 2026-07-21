import { describe, it, expect } from "vitest";
import {
  fromBaseToDecimalSteps,
  decimalToBaseSteps,
  isValidInBase,
  binaryToOctalDirect,
  binaryToHexDirect,
  convertBetweenBases,
  verifyWorkedExamples,
} from "./conversions.js";

describe("number systems conversions", () => {
  it("10101₂ = 21₁₀", () => {
    const r = fromBaseToDecimalSteps("10101", 2);
    expect(r.ok).toBe(true);
    expect(r.decimal).toBe(21);
    expect(r.rows).toHaveLength(5);
  });

  it("68₁₀ = 1000100₂", () => {
    const r = decimalToBaseSteps(68, 2);
    expect(r.ok).toBe(true);
    expect(r.result).toBe("1000100");
    expect(r.verifyOk).toBe(true);
  });

  it("38₁₀ = 100110₂", () => {
    const r = decimalToBaseSteps(38, 2);
    expect(r.result).toBe("100110");
  });

  it("42₁₀ = 1120₃", () => {
    const r = decimalToBaseSteps(42, 3);
    expect(r.result).toBe("1120");
  });

  it("38₁₀ = 123₅", () => {
    const r = decimalToBaseSteps(38, 5);
    expect(r.result).toBe("123");
  });

  it("rejects digit 2 in binary", () => {
    expect(isValidInBase("102", 2)).toBe(false);
  });

  it("binary to octal direct", () => {
    const r = binaryToOctalDirect("101101");
    expect(r.ok).toBe(true);
    expect(r.octal).toBe("55");
  });

  it("binary to hex direct", () => {
    const r = binaryToHexDirect("101101");
    expect(r.ok).toBe(true);
    expect(r.hex).toBe("2D");
  });

  it("all PDF worked examples verify", () => {
    const all = verifyWorkedExamples();
    expect(all.every((x) => x.ok)).toBe(true);
  });

  it("convert base 5 to decimal via intermediate", () => {
    const r = convertBetweenBases("123", 5, 10);
    expect(r.ok).toBe(true);
    expect(r.viaDecimal).toBe(38);
  });
});
