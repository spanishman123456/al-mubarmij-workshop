/** خريطة كارنوف — Gray Code والتبسيط */

import { buildTruthTable } from "./truthTable.js";
import { displayVarsForCount, varsForCount } from "./variables.js";

/** @param {number} bits */
export function grayCode(bits) {
  const n = 2 ** bits;
  const result = [];
  for (let i = 0; i < n; i += 1) {
    const g = i ^ (i >> 1);
    result.push(g.toString(2).padStart(bits, "0"));
  }
  return result;
}

/** @param {number} varCount */
export function kMapLayout(varCount) {
  const rowBits = Math.floor(varCount / 2);
  const colBits = Math.ceil(varCount / 2);
  const rowGray = grayCode(rowBits || 1);
  const colGray = grayCode(colBits || 1);
  const rowLabels = rowBits ? rowGray : ["0"];
  const colLabels = colBits ? colGray : ["0"];
  const sourceVars = varsForCount(varCount);
  const vars = displayVarsForCount(varCount);
  const rowVars = vars.slice(0, rowBits);
  const colVars = vars.slice(rowBits);

  /** @type {{ index: number, truthTableIndex: number, row: number, col: number, rowLabel: string, colLabel: string, minterm: string }[]} */
  const cells = [];
  let idx = 0;
  for (let r = 0; r < rowLabels.length; r += 1) {
    for (let c = 0; c < colLabels.length; c += 1) {
      const rowVal = rowBits ? parseInt(rowLabels[r], 2) : 0;
      const colVal = colBits ? parseInt(colLabels[c], 2) : 0;
      const truthTableIndex = (rowVal << colBits) | colVal;
      const bits = truthTableIndex.toString(2).padStart(varCount, "0");
      const minterm = vars.map((v, i) => (bits[i] === "1" ? v : `${v}̄`)).join("");
      cells.push({
        index: idx,
        truthTableIndex,
        row: r,
        col: c,
        rowLabel: rowLabels[r],
        colLabel: colLabels[c],
        minterm,
      });
      idx += 1;
    }
  }

  return {
    varCount,
    rowBits: rowBits || 1,
    colBits: colBits || 1,
    rowVars,
    colVars,
    sourceVars,
    vars,
    rowLabels,
    colLabels,
    cells,
    size: rowLabels.length * colLabels.length,
  };
}

/** @param {number} varCount @param {boolean} [allowDontCare] */
export function randomKMapValues(varCount, allowDontCare = false) {
  const { size } = kMapLayout(varCount);
  return Array.from({ length: size }, () => {
    const r = Math.random();
    if (allowDontCare && r < 0.12) return "X";
    return r > 0.55 ? "1" : "0";
  });
}

/** @param {string} expr @param {number} varCount */
export function truthTableToKMap(expr, varCount) {
  const table = buildTruthTable(expr, varCount);
  if (!table.ok) return { ok: false, error: table.error };
  const layout = kMapLayout(varCount);
  const values = layout.cells.map((cell) => {
    const row = table.rows[cell.truthTableIndex];
    return row ? String(row.result) : "0";
  });
  return { ok: true, layout, values, expr: table.expr };
}

/** @param {string[]} values @param {ReturnType<typeof kMapLayout>} layout */
export function kMapToTruthTableValues(values, layout) {
  const ordered = Array(layout.size).fill("0");
  layout.cells.forEach((cell) => {
    ordered[cell.truthTableIndex] = values[cell.index] ?? "0";
  });
  return ordered;
}

/** @param {string[]} values */
export function unsimplifiedExpression(values, layout) {
  const terms = layout.cells
    .map((cell, i) => (values[i] === "1" ? cell.minterm : null))
    .filter(Boolean);
  if (!terms.length) return "0";
  if (terms.length === layout.size) return "1";
  return terms.join(" + ");
}

/** @param {number[]} indices @param {ReturnType<typeof kMapLayout>} layout @param {string[]} values */
export function isValidGroup(indices, layout, values) {
  if (!indices.length || ![1, 2, 4, 8, 16].includes(indices.length)) return false;
  const rows = new Set();
  const cols = new Set();
  for (const i of indices) {
    const v = values[i];
    if (v !== "1" && v !== "X") return false;
    const cell = layout.cells[i];
    rows.add(cell.row);
    cols.add(cell.col);
  }
  const rowSpan = rows.size;
  const colSpan = cols.size;
  return indices.length === rowSpan * colSpan;
}

/** تبسيط مبدئي بالمجموعات المحددة يدويًا */
export function simplifyFromGroups(groups, layout, values) {
  if (!groups.length) return unsimplifiedExpression(values, layout);
  const terms = groups.map((group) => {
    const cells = group.map((i) => layout.cells[i]);
    let rowLabel = cells[0].rowLabel;
    let colLabel = cells[0].colLabel;
    for (const c of cells) {
      if (c.rowLabel !== rowLabel) rowLabel = null;
      if (c.colLabel !== colLabel) colLabel = null;
    }
    const parts = [];
    if (colLabel !== null && layout.colVars.length) {
      layout.colVars.forEach((v, i) => {
        const bit = colLabel[i];
        if (bit === "0") parts.push(`${v}̄`);
        else if (bit === "1") parts.push(v);
      });
    }
    if (rowLabel !== null && layout.rowVars.length) {
      layout.rowVars.forEach((v, i) => {
        const bit = rowLabel[i];
        if (bit === "0") parts.push(`${v}̄`);
        else if (bit === "1") parts.push(v);
      });
    }
    return parts.length ? parts.join("") : "1";
  });
  return [...new Set(terms)].join(" + ") || "0";
}

/** @param {number[]} group @param {ReturnType<typeof kMapLayout>} layout */
export function explainGroup(group, layout) {
  const size = group.length;
  const wrap =
    group.some((i) => layout.cells[i].col === 0) &&
    group.some((i) => layout.cells[i].col === layout.colLabels.length - 1);
  return `مجموعة من ${size} خلية — ${wrap ? "تتضمن التفافًا عبر طرف الخريطة." : "خلايا متجاورة."}`;
}

export { varsForCount };
