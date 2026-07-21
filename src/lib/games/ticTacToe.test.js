import { describe, expect, it } from "vitest";
import { applyMove, checkWinner, createBoard, isValidMove } from "./ticTacToe.js";

describe("ticTacToe", () => {
  it("detects row win", () => {
    const b = ["X", "X", "X", "O", "", "", "", "", ""];
    expect(checkWinner(b)).toBe("X");
  });

  it("rejects invalid move", () => {
    const b = createBoard();
    expect(isValidMove(b, 0)).toBe(true);
    expect(isValidMove(applyMove(b, 0, "X"), 0)).toBe(false);
  });

  it("detects draw", () => {
    const b = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    expect(checkWinner(b)).toBe("draw");
  });
});
