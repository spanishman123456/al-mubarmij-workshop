import { describe, expect, it } from "vitest";
import {
  kochSegmentCount,
  sierpinskiSmallTriangles,
  kochPerimeterMultiplier,
  checkFractalLabAnswer,
} from "./fractals.js";

describe("fractals", () => {
  it("counts koch segments", () => {
    expect(kochSegmentCount(3, 0)).toBe(3);
    expect(kochSegmentCount(3, 1)).toBe(12);
    expect(kochSegmentCount(3, 2)).toBe(48);
  });

  it("counts sierpinski triangles", () => {
    expect(sierpinskiSmallTriangles(0)).toBe(1);
    expect(sierpinskiSmallTriangles(2)).toBe(9);
    expect(sierpinskiSmallTriangles(3)).toBe(27);
  });

  it("koch perimeter multiplier", () => {
    expect(kochPerimeterMultiplier(0)).toBe(1);
    expect(kochPerimeterMultiplier(1)).toBeCloseTo(4 / 3);
  });

  it("grades fractal lab", () => {
    expect(checkFractalLabAnswer("koch-seg-2", "48").ok).toBe(true);
    expect(checkFractalLabAnswer("sierp-3", "27").ok).toBe(true);
  });
});
