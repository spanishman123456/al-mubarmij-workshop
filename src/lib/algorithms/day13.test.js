import { describe, expect, it } from "vitest";
import {
  averageScore,
  checkDay13Answer,
  isSmartGoal,
  learningGainPercent,
} from "./day13.js";

describe("day13 algorithms", () => {
  it("computes average score", () => {
    expect(averageScore([60, 70, 80])).toBe(70);
    expect(averageScore([])).toBe(0);
  });

  it("computes learning gain", () => {
    expect(learningGainPercent(50, 65)).toBe(30);
  });

  it("detects SMART goal features", () => {
    expect(isSmartGoal("أطور النموذج إلى 80% خلال أسبوع")).toBe(true);
    expect(isSmartGoal("أريد مشروعًا جيدًا")).toBe(false);
  });

  it("checks day13 challenge answers", () => {
    expect(checkDay13Answer("rev-1", "70")).toBe(true);
    expect(checkDay13Answer("assess-1", "30")).toBe(true);
    expect(checkDay13Answer("proj-2", "تعريف المشكلة")).toBe(true);
  });
});
