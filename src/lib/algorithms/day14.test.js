import { describe, expect, it } from "vitest";
import { checkDay14Answer, completionPercent, passRatePercent } from "./day14.js";

describe("day14 algorithms", () => {
  it("computes completion and pass rates", () => {
    expect(completionPercent(6, 8)).toBe(75);
    expect(passRatePercent(12, 9)).toBe(75);
  });

  it("checks challenge answers", () => {
    expect(checkDay14Answer("build-1", "75")).toBe(true);
    expect(checkDay14Answer("test-1", "75")).toBe(true);
    expect(checkDay14Answer("demo-1", "المشكلة")).toBe(true);
  });
});
