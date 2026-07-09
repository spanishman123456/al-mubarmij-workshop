import { describe, expect, it } from "vitest";
import { caesarTransform, caesarSteps } from "./caesarCipher.js";
import {
  createInitialTowers,
  isHanoiSolved,
  validateHanoiMove,
} from "./hanoi.js";
import { grayCode, isValidGroup, kMapLayout, truthTableToKMap } from "./karnaugh.js";
import { buildTruthTable, parseLogicalExpression } from "./truthTable.js";
import { generateDrill, validateDrillAnswers } from "./truthTableDrills.js";

describe("truthTable", () => {
  it("parses p AND q", () => {
    const p = parseLogicalExpression("p AND q", ["p", "q"]);
    expect(p.ok).toBe(true);
  });

  it("builds 4 rows for two variables", () => {
    const t = buildTruthTable("p AND q", 2);
    expect(t.ok).toBe(true);
    expect(t.rows).toHaveLength(4);
    expect(t.rows[3].result).toBe(1);
  });

  it("builds 8 rows for three variables", () => {
    const t = buildTruthTable("(p AND q) OR r", 3);
    expect(t.ok).toBe(true);
    expect(t.rows).toHaveLength(8);
    expect(t.intermediateColumns.length).toBeGreaterThan(0);
  });

  it("rejects invalid expression", () => {
    const p = parseLogicalExpression("p AND", ["p", "q"]);
    expect(p.ok).toBe(false);
  });
});

describe("truthTableDrills", () => {
  it("generates easy drill", () => {
    const d = generateDrill("easy");
    expect(d.rows.length).toBeLessThanOrEqual(4);
  });

  it("validates answers", () => {
    const d = generateDrill("easy", { mode: "manual", op: "AND" });
    const answers = {};
    d.rows.forEach((row, i) => {
      d.answerColumns.forEach((col) => {
        answers[`${i}-${col}`] = String(row[col]);
      });
    });
    const res = validateDrillAnswers(d, answers);
    expect(res.allCorrect).toBe(true);
  });
});

import { parseLogicMinterm } from "./notationFormat.js";

describe("notationFormat", () => {
  it("parses negated variables in minterm", () => {
    const t = parseLogicMinterm("p̄q");
    expect(t).toEqual([
      { name: "p", negated: true },
      { name: "q", negated: false },
    ]);
  });

  it("parses double negation marks", () => {
    const t = parseLogicMinterm("pq̄");
    expect(t[1]).toEqual({ name: "q", negated: true });
  });
});

describe("caesarCipher", () => {
  it("wraps English Z with shift", () => {
    expect(caesarTransform("Z", 1, { lang: "en" })).toBe("A");
  });

  it("preserves spaces", () => {
    expect(caesarTransform("A B", 1, { lang: "en" })).toBe("B C");
  });

  it("produces steps with positions", () => {
    const steps = caesarSteps("A", 3, { lang: "en" });
    expect(steps[0].position).toBe(0);
    expect(steps[0].newPosition).toBe(3);
    expect(steps[0].result).toBe("D");
    expect(steps[0].explanation).toContain("mod 26");
  });

  it("explains wrap-around for Z", () => {
    const steps = caesarSteps("Z", 1, { lang: "en" });
    expect(steps[0].result).toBe("A");
    expect(steps[0].wrapped).toBe(true);
  });
});

describe("hanoi", () => {
  it("blocks big on small", () => {
    const towers = [[3, 2], [1], []];
    expect(validateHanoiMove(towers, 0, 1).ok).toBe(false);
  });

  it("detects solved state", () => {
    const towers = [[], [], [3, 2, 1]];
    expect(isHanoiSolved(towers, 3)).toBe(true);
    expect(isHanoiSolved(createInitialTowers(3), 3)).toBe(false);
  });

  it("keeps compatibility with legacy solved ordering", () => {
    expect(isHanoiSolved([[], [], [1, 2, 3]], 3)).toBe(true);
  });
});

describe("karnaugh", () => {
  it("uses gray code for 2 bits", () => {
    expect(grayCode(2)).toEqual(["00", "01", "11", "10"]);
  });

  it("layout sizes match variable count", () => {
    expect(kMapLayout(2).size).toBe(4);
    expect(kMapLayout(3).size).toBe(8);
    expect(kMapLayout(4).size).toBe(16);
  });

  it("validates group size", () => {
    const layout = kMapLayout(2);
    const values = ["1", "1", "0", "0"];
    expect(isValidGroup([0, 1], layout, values)).toBe(true);
    expect(isValidGroup([0, 2], layout, values)).toBe(false);
  });

  it("imports from truth table", () => {
    const res = truthTableToKMap("p AND q", 2);
    expect(res.ok).toBe(true);
    expect(res.values.filter((v) => v === "1")).toHaveLength(1);
  });
});
