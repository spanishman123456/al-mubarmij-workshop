import { describe, expect, it } from "vitest";
import {
  grayCode,
  kMapLayout,
  kMapToTruthTableValues,
  simplifyFromGroups,
  truthTableToKMap,
} from "./karnaugh.js";

describe("Karnaugh map layout and direction", () => {
  it("uses canonical Gray ordering and display variables", () => {
    const layout = kMapLayout(4);

    expect(grayCode(2)).toEqual(["00", "01", "11", "10"]);
    expect(layout.rowLabels).toEqual(["00", "01", "11", "10"]);
    expect(layout.colLabels).toEqual(["00", "01", "11", "10"]);
    expect(layout.rowVars).toEqual(["A", "B"]);
    expect(layout.colVars).toEqual(["C", "D"]);
    expect(layout.vars).toEqual(["A", "B", "C", "D"]);
  });

  it("maps Gray-positioned cells to truth-table indices without reordering values", () => {
    const layout = kMapLayout(3);

    expect(layout.cells.map((cell) => cell.truthTableIndex)).toEqual([0, 1, 3, 2, 4, 5, 7, 6]);
    expect(kMapToTruthTableValues(["0", "1", "2", "3", "4", "5", "6", "7"], layout))
      .toEqual(["0", "1", "3", "2", "4", "5", "7", "6"]);
  });

  it("keeps truth-table results attached to their Gray cells", () => {
    const result = truthTableToKMap("p XOR q", 2);

    expect(result.ok).toBe(true);
    expect(result.values).toEqual(["0", "1", "1", "0"]);
    expect(result.layout.cells.map((cell) => cell.minterm)).toEqual(["ĀB̄", "ĀB", "AB̄", "AB"]);
  });

  it("simplifies groups with the displayed row and column variables", () => {
    const layout = kMapLayout(2);
    const values = ["0", "0", "1", "1"];

    expect(simplifyFromGroups([[2, 3]], layout, values)).toBe("A");
  });
});
