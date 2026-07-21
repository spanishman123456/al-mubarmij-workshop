import { buildSimpleExpression, buildTruthTable, parseLogicalExpression } from "./truthTable.js";
import { LOGIC_OPS, varsForCount } from "./variables.js";

const SINGLE_OPS = ["AND", "OR", "NOT", "XOR", "NAND", "NOR", "XNOR"];

const COMPOUND_TEMPLATES = {
  medium: [
    (vars) => `(${vars[0]} AND ${vars[1]}) OR ${vars[2]}`,
    (vars) => `NOT ${vars[0]} AND ${vars[1]}`,
    (vars) => `(${vars[0]} OR ${vars[1]}) AND ${vars[2]}`,
    (vars) => `${vars[0]} XOR ${vars[1]} AND ${vars[2]}`,
  ],
  advanced: [
    (vars) => `((${vars[0]} AND ${vars[1]}) OR (NOT ${vars[2]} AND ${vars[3]})) XOR ${vars[4] ?? vars[3]}`,
    (vars) => `NOT (${vars[0]} OR ${vars[1]}) AND (${vars[2]} XOR ${vars[3]})`,
    (vars) => `((${vars[0]} NAND ${vars[1]}) OR ${vars[2]}) AND (NOT ${vars[3]})`,
    (vars) => `${vars[0]} XNOR ${vars[1]} OR (${vars[2]} AND NOT ${vars[3]})`,
  ],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @param {'easy'|'medium'|'advanced'} level
 * @param {{ op?: string, mode?: 'manual'|'random', varCount?: number }} [opts]
 */
export function generateDrill(level, opts = {}) {
  const mode = opts.mode ?? "random";

  if (level === "easy") {
    const varCount = opts.varCount ?? (Math.random() > 0.5 ? 2 : 1);
    const vars = varsForCount(varCount);
    const op = opts.op && SINGLE_OPS.includes(opts.op) ? opts.op : pick(SINGLE_OPS);
    let expr;
    if (op === "NOT") {
      expr = `NOT ${vars[0]}`;
    } else if (varCount === 1) {
      expr = vars[0];
    } else {
      expr = buildSimpleExpression(op, vars[0], vars[1]);
    }
    return buildDrillFromExpr(expr, level, op, vars);
  }

  if (level === "medium") {
    const vars = varsForCount(3);
    const expr =
      mode === "manual" && opts.op
        ? buildSimpleExpression(opts.op, vars[0], vars[1]) + ` OR ${vars[2]}`
        : pick(COMPOUND_TEMPLATES.medium)(vars);
    return buildDrillFromExpr(expr, level);
  }

  const varCount = opts.varCount ?? (Math.random() > 0.5 ? 5 : 4);
  const vars = varsForCount(varCount);
  const expr =
    mode === "manual" && opts.op
      ? `(${vars[0]} ${opts.op} ${vars[1]}) AND (${vars[2]} OR ${vars[3]})`
      : pick(COMPOUND_TEMPLATES.advanced)(vars);
  return buildDrillFromExpr(expr, level);
}

/** @param {string} expr @param {string} level @param {string} [opLabel] @param {string[]} [varsHint] */
function buildDrillFromExpr(expr, level, opLabel, varsHint) {
  const varCount = level === "easy" ? varsHint?.length ?? 2 : level === "medium" ? 3 : 5;
  const table = buildTruthTable(expr, varCount);
  if (!table.ok) {
    return generateDrill("easy", { mode: "random" });
  }

  const answerColumns = [
    ...table.intermediateColumns.map((c) => c.id),
    "result",
  ];

  return {
    id: `${level}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    level,
    expr: table.expr,
    displayExpr: opLabel ?? table.expr,
    variables: table.variables,
    intermediateColumns: table.intermediateColumns,
    answerColumns,
    rows: table.rows,
    hints: buildHints(table.expr, level),
  };
}

function buildHints(expr, level) {
  const hints = [];
  if (level === "easy") {
    hints.push("ابدأ بتطبيق العملية على كل صف على حدة.");
    hints.push("تذكّر: AND يعطي 1 فقط عندما يكون كلا المدخلين 1.");
  } else if (level === "medium") {
    hints.push("احسب العمليات داخل الأقواس أولًا.");
    hints.push("استخدم الأعمدة الوسيطة لتتبع خطوات الحل.");
  } else {
    hints.push("قسّم التعبير إلى أجزاء فرعية وحلّ كل جزء.");
    hints.push("انتبه لأولوية NOT ثم AND ثم OR/XOR.");
  }
  return hints;
}

/** @param {string} expr */
export function validateDrillAnswers(drill, userAnswers) {
  let correct = 0;
  let wrong = 0;
  const details = [];

  drill.rows.forEach((row, rowIdx) => {
    drill.answerColumns.forEach((col) => {
      const expected = String(row[col]);
      const given = userAnswers[`${rowIdx}-${col}`] ?? "";
      if (given === "") return;
      if (given === expected) correct += 1;
      else {
        wrong += 1;
        details.push({ rowIdx, col, expected, given });
      }
    });
  });

  const totalCells = drill.rows.length * drill.answerColumns.length;
  const filled = correct + wrong;
  return { correct, wrong, totalCells, filled, details, allCorrect: wrong === 0 && filled === totalCells };
}

export { LOGIC_OPS, SINGLE_OPS };
