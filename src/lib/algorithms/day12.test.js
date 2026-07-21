import { describe, expect, it } from "vitest";
import {
  acceptsBinaryEndsWith01,
  checkDay12Answer,
  completeGraphEdges,
  isValidUndirectedDegreeSequence,
} from "./day12.js";

describe("day12 algorithms", () => {
  it("computes complete graph edges", () => {
    expect(completeGraphEdges(5)).toBe(10);
  });

  it("checks DFA-like acceptance for ending 01", () => {
    expect(acceptsBinaryEndsWith01("1101")).toBe(true);
    expect(acceptsBinaryEndsWith01("1110")).toBe(false);
  });

  it("validates undirected degree parity", () => {
    expect(isValidUndirectedDegreeSequence([3, 3, 2, 2, 2])).toBe(true);
    expect(isValidUndirectedDegreeSequence([1, 1, 1])).toBe(false);
  });

  it("checks day12 challenges", () => {
    expect(checkDay12Answer("graph-1", "10")).toBe(true);
    expect(checkDay12Answer("comp-1", "P")).toBe(true);
    expect(checkDay12Answer("auto-accept-2", "لا")).toBe(true);
  });
});
