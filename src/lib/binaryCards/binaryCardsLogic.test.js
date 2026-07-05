import { describe, expect, it } from "vitest";
import {
  BINARY_CARD_VALUES,
  cardSum,
  cardsForTarget,
  checkTarget,
  getGraduatedHint,
  getWrongFeedback,
  initialCardState,
  solutionBinary,
  toBinaryString,
  toggleCard,
} from "./binaryCardsLogic.js";

describe("binaryCardsLogic", () => {
  it("starts all hidden", () => {
    const s = initialCardState(false);
    expect(cardSum(s)).toBe(0);
    expect(toBinaryString(s)).toBe("00000");
  });

  it("toggles card visible/hidden", () => {
    let s = initialCardState(false);
    s = toggleCard(s, 4);
    expect(s[4]).toBe(true);
    s = toggleCard(s, 4);
    expect(s[4]).toBe(false);
  });

  it("computes sum and binary for 5", () => {
    const s = cardsForTarget(5);
    expect(cardSum(s)).toBe(5);
    expect(toBinaryString(s)).toBe("00101");
  });

  it("validates answer for 5", () => {
    expect(checkTarget(cardsForTarget(5), 5)).toBe(true);
    expect(checkTarget(cardsForTarget(7), 5)).toBe(false);
  });

  it("builds correct binary for 0..31 samples", () => {
    for (let n = 0; n <= 31; n += 1) {
      expect(cardSum(cardsForTarget(n))).toBe(n);
      expect(solutionBinary(n)).toBe(n.toString(2).padStart(5, "0"));
    }
  });

  it("provides graduated hints", () => {
    expect(getGraduatedHint(5, 0)).toContain("4");
    expect(getGraduatedHint(5, 1)).toContain("2");
    expect(getGraduatedHint(5, 2)).toContain("4");
  });

  it("wrong feedback when sum too high", () => {
    const s = cardsForTarget(7);
    const msg = getWrongFeedback(s, 5);
    expect(msg).toContain("7");
    expect(msg).toContain("5");
  });

  it("card order is MSB to LSB", () => {
    expect(BINARY_CARD_VALUES).toEqual([16, 8, 4, 2, 1]);
    expect(toBinaryString(cardsForTarget(31))).toBe("11111");
  });
});
