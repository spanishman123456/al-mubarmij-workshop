import { describe, it, expect } from "vitest";
import {
  toTwosComplement,
  fromTwosComplement,
  rangeForBits,
  detectOverflow,
  flipBits,
} from "./twosComplement.js";

describe("twosComplement", () => {
  it("encodes -5 8-bit", () => {
    expect(toTwosComplement(-5, 8).bits).toBe("11111011");
  });

  it("encodes +5", () => {
    expect(toTwosComplement(5, 8).bits).toBe("00000101");
  });

  it("decodes -1", () => {
    expect(fromTwosComplement("11111111").value).toBe(-1);
  });

  it("decodes -8 4-bit", () => {
    expect(fromTwosComplement("1000").value).toBe(-8);
  });

  it("range 8-bit", () => {
    const r = rangeForBits(8);
    expect(r.min).toBe(-128);
    expect(r.max).toBe(127);
  });

  it("detectOverflow 127+1", () => {
    expect(detectOverflow(127, 1, 8)).toBe(true);
  });

  it("flipBits", () => {
    expect(flipBits("1010")).toBe("0101");
  });

  it("overflow on large positive", () => {
    expect(toTwosComplement(200, 8).ok).toBe(false);
  });
});
