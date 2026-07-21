import { describe, expect, it } from "vitest";
import { checkDay15Answer, percentage, rubricAverage } from "./day15.js";

describe("day15 algorithms", () => {
  it("computes rubric average and percentage", () => {
    expect(rubricAverage([4, 5, 4, 3])).toBe(4);
    expect(percentage(42, 50)).toBe(84);
  });

  it("checks day15 challenges", () => {
    expect(checkDay15Answer("pres-1", "4")).toBe(true);
    expect(checkDay15Answer("close-1", "84")).toBe(true);
    expect(checkDay15Answer("feed-1", "نعم")).toBe(true);
  });
});
