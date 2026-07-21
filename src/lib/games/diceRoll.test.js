import { describe, expect, it } from "vitest";
import { diceSum, rollDie, rollTwoDice, sumCategory } from "./diceRoll.js";

describe("diceRoll", () => {
  it("rolls in range 1-6", () => {
    expect(rollDie(() => 0)).toBe(1);
    expect(rollDie(() => 0.999)).toBe(6);
  });

  it("sums two dice", () => {
    let i = 0;
    const seq = [0, 0.4];
    const rng = () => seq[i++ % seq.length];
    const [a, b] = rollTwoDice(rng);
    expect(diceSum(a, b)).toBe(4);
  });

  it("categorizes sum", () => {
    expect(sumCategory(5)).toBe("منخفض");
    expect(sumCategory(8)).toBe("متوسط");
    expect(sumCategory(11)).toBe("مرتفع");
  });
});
