import { describe, it, expect } from "vitest";
import { addInBase, subtractBinaryUnsigned, parseInBase } from "./baseArithmetic.js";

describe("baseArithmetic", () => {
  it("adds binary", () => {
    const r = addInBase("1011", "1101", 2);
    expect(r.ok).toBe(true);
    expect(r.result).toBe("11000");
    expect(r.verified).toBe(true);
  });

  it("adds hex A3+5D", () => {
    const r = addInBase("A3", "5D", 16);
    expect(r.ok).toBe(true);
    expect(r.result).toBe("100");
  });

  it("adds base 5", () => {
    const r = addInBase("23", "14", 5);
    expect(r.ok).toBe(true);
    expect(r.result).toBe("42");
  });

  it("rejects invalid digit", () => {
    expect(addInBase("102", "1", 2).ok).toBe(false);
  });

  it("subtracts binary unsigned", () => {
    const r = subtractBinaryUnsigned("1101", "101");
    expect(r.ok).toBe(true);
    expect(r.result).toBe("1000");
  });

  it("rejects negative unsigned sub", () => {
    expect(subtractBinaryUnsigned("101", "1101").ok).toBe(false);
  });

  it("parseInBase hex", () => {
    expect(parseInBase("FF", 16).value).toBe(255);
  });
});
