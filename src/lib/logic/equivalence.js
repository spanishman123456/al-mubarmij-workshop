import { buildTruthTable } from "./truthTable.js";

/** @param {string} exprA @param {string} exprB @param {number} [varCount] */
export function compareLogicalEquivalence(exprA, exprB, varCount = 2) {
  const a = buildTruthTable(exprA, varCount);
  const b = buildTruthTable(exprB, varCount);
  if (!a.ok) return { ok: false, error: a.error, side: "A" };
  if (!b.ok) return { ok: false, error: b.error, side: "B" };
  const equivalent = a.rows.every((row, i) => row.result === b.rows[i].result);
  const diffRow = equivalent
    ? null
    : a.rows.find((row, i) => row.result !== b.rows[i].result);
  return {
    ok: true,
    equivalent,
    tableA: a,
    tableB: b,
    diffRow,
  };
}
