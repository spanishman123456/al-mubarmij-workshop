import { describe, it, expect } from "vitest";
import { compareLogicalEquivalence } from "./equivalence.js";

describe("compareLogicalEquivalence", () => {
  it("detects De Morgan equivalence", () => {
    const r = compareLogicalEquivalence("NOT (p AND q)", "(NOT p) OR (NOT q)", 2);
    expect(r.ok).toBe(true);
    expect(r.equivalent).toBe(true);
  });

  it("detects non-equivalence", () => {
    const r = compareLogicalEquivalence("p AND q", "p OR q", 2);
    expect(r.ok).toBe(true);
    expect(r.equivalent).toBe(false);
    expect(r.diffRow).toBeTruthy();
  });
});
