import { describe, expect, it } from "vitest";
import { accuracyPercent, checkDay11Answer, majorityClass } from "./day11.js";

describe("day11 algorithms", () => {
  it("calculates accuracy percent", () => {
    expect(accuracyPercent(8, 6, 2, 4)).toBe(70);
    expect(accuracyPercent(0, 0, 0, 0)).toBe(0);
  });

  it("picks majority class", () => {
    expect(majorityClass([1, 1, 0, 1, 0])).toBe(1);
    expect(majorityClass([])).toBe(null);
  });

  it("checks day11 challenge answers", () => {
    expect(checkDay11Answer("ml-accuracy", "70")).toBe(true);
    expect(checkDay11Answer("ethics-bias", "نعم")).toBe(true);
    expect(checkDay11Answer("pres-slide", "3")).toBe(true);
    expect(checkDay11Answer("ml-majority", "0")).toBe(false);
  });
});
