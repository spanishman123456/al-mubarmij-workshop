import { describe, it, expect } from "vitest";
import { runSimpleIf, validateAlgorithmStepOrder, MAX_TWO_STEPS } from "./ifInterpreter.js";

describe("ifInterpreter", () => {
  it("pass score", () => {
    const r = runSimpleIf("score = 75\nif score >= 50:\n    print('x')");
    expect(r.outputs).toContain("ناجح");
  });

  it("fail score", () => {
    const r = runSimpleIf("score = 40\nif score >= 50:\n    print('x')");
    expect(r.outputs).toContain("راسب");
  });

  it("dice player 2", () => {
    const r = runSimpleIf("d1, d2 = 3, 5\nif d1 > d2:\n    print('1')");
    expect(r.outputs).toContain("2");
  });

  it("tie", () => {
    const r = runSimpleIf("d1, d2 = 4, 4");
    expect(r.outputs).toContain("تعادل");
  });

  it("SyntaxError = in if", () => {
    const r = runSimpleIf("if x = 5:\n    print(1)");
    expect(r.errors.some((e) => e.includes("SyntaxError"))).toBe(true);
  });

  it("missing colon", () => {
    const r = runSimpleIf("if True\n    print(1)");
    expect(r.errors.length).toBeGreaterThan(0);
  });

  it("elif grade B", () => {
    const r = runSimpleIf("g = 85");
    expect(r.outputs).toContain("B");
  });

  it("even n", () => {
    const r = runSimpleIf("n = 14");
    expect(r.outputs).toContain("زوجي");
  });

  it("algorithm step order valid", () => {
    expect(validateAlgorithmStepOrder(MAX_TWO_STEPS, MAX_TWO_STEPS)).toBe(true);
  });

  it("algorithm step order invalid", () => {
    expect(validateAlgorithmStepOrder(["اطبع max", "اقرأ a و b"], MAX_TWO_STEPS)).toBe(false);
  });
});
