import { describe, expect, it } from "vitest";
import {
  bitsToAscii,
  checkDay10Answer,
  circleArea,
  extractStegoBits,
  fractalTreeSegmentCount,
  lockerOpenNumbers,
  pascalRow,
  squareArea,
} from "./day10.js";

describe("day10 algorithms", () => {
  it("computes OOP areas", () => {
    expect(circleArea(3)).toBeCloseTo(28.274, 3);
    expect(squareArea(5)).toBe(25);
  });

  it("extracts and decodes stego bits", () => {
    expect(extractStegoBits("AbC")).toBe("010");
    expect(bitsToAscii("010101000110010101100001011000110110100000000000")).toBe("Teach");
  });

  it("calculates fractal tree segment counts", () => {
    expect(fractalTreeSegmentCount(2)).toBe(7);
    expect(fractalTreeSegmentCount(4)).toBe(31);
  });

  it("solves locker problem with perfect squares", () => {
    expect(lockerOpenNumbers(10)).toEqual([1, 4, 9]);
    expect(lockerOpenNumbers(30)).toEqual([1, 4, 9, 16, 25]);
  });

  it("builds pascal rows", () => {
    expect(pascalRow(0)).toEqual([1]);
    expect(pascalRow(4)).toEqual([1, 4, 6, 4, 1]);
  });

  it("grades day10 lab answers", () => {
    expect(checkDay10Answer("oop-area-square-5", "25")).toBe(true);
    expect(checkDay10Answer("stego-msg-1", "Teach")).toBe(true);
    expect(checkDay10Answer("locker-10", "1,4,9")).toBe(true);
    expect(checkDay10Answer("locker-10", "1,9")).toBe(false);
  });
});
