import { describe, expect, it } from "vitest";
import { BINGO_CELLS } from "./onboardingContent.js";
import {
  assertValidBingoContent,
  computeBingoProgress,
  createInitialBingoStudentState,
  listCompletedBingoLines,
  normalizeBingoStudentState,
  validateBingoCells,
} from "./validateBingoContent.js";

describe("validateBingoContent", () => {
  it("validates shipped BINGO grid (25 cells, 1 free, 24 fillable)", () => {
    const result = validateBingoCells(BINGO_CELLS);
    expect(result.ok, result.errors.join("; ")).toBe(true);
    assertValidBingoContent(BINGO_CELLS);
  });

  it("rejects incomplete grid that crashes column iteration", () => {
    const broken = BINGO_CELLS.slice(0, 24);
    const result = validateBingoCells(broken);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("25"))).toBe(true);
  });

  it("creates safe initial state for new student", () => {
    const state = createInitialBingoStudentState();
    expect(state.status).toBe("not_started");
    expect(state.cells).toEqual({});
    expect(normalizeBingoStudentState(null)).toEqual(state);
    expect(normalizeBingoStudentState({ status: "in_progress", cells: { c0: "أحمد" } }).cells.c0).toBe("أحمد");
  });

  it("computes progress and completed lines without undefined access", () => {
    const cells = Object.fromEntries(
      BINGO_CELLS.filter((c) => !c.free).map((c, i) => [c.id, i < 5 ? `زميل ${i}` : ""]),
    );
    const { filledCount, totalFillable } = computeBingoProgress(BINGO_CELLS, cells);
    expect(totalFillable).toBe(24);
    expect(filledCount).toBe(5);
    expect(() => listCompletedBingoLines(BINGO_CELLS, cells)).not.toThrow();
  });

  it("detects duplicate ids", () => {
    const dup = [...BINGO_CELLS.slice(0, 24), { ...BINGO_CELLS[0], id: "c0" }];
    expect(validateBingoCells(dup).ok).toBe(false);
  });
});
