import { describe, it, expect } from "vitest";
import { simulateRange, simulateForLoop, simulateWhile, listAccess, listSet } from "./loopsAndLists.js";

describe("loopsAndLists", () => {
  it("range(3)", () => {
    expect(simulateRange(0, 3).values).toEqual([0, 1, 2]);
  });

  it("range step", () => {
    expect(simulateRange(0, 10, 2).values).toEqual([0, 2, 4, 6, 8]);
  });

  it("zero step error", () => {
    expect(simulateRange(0, 3, 0).ok).toBe(false);
  });

  it("for trace", () => {
    const r = simulateForLoop(2, 0, 3);
    expect(r.trace.map((t) => t.i)).toEqual([0, 1, 2]);
  });

  it("while countdown", () => {
    const r = simulateWhile(3, (n) => n > 0, (n) => n - 1);
    expect(r.trace).toEqual([3, 2, 1]);
  });

  it("list access", () => {
    expect(listAccess([10, 20], 1).value).toBe(20);
  });

  it("index error", () => {
    expect(listAccess([1], 5).ok).toBe(false);
  });

  it("list set", () => {
    expect(listSet([1, 2, 3], 1, 99).list).toEqual([1, 99, 3]);
  });
});
