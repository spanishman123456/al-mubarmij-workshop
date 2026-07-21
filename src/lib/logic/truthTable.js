import { LOGIC_OPS, varsForCount } from "./variables.js";

const BINARY_OPS = {
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  XOR: (a, b) => a !== b,
  NAND: (a, b) => !(a && b),
  NOR: (a, b) => !(a || b),
  XNOR: (a, b) => a === b,
};

/** @typedef {{ type: 'var', name: string }} VarNode */
/** @typedef {{ type: 'unary', op: 'NOT', arg: AstNode }} UnaryNode */
/** @typedef {{ type: 'binary', op: string, left: AstNode, right: AstNode }} BinaryNode */
/** @typedef {VarNode | UnaryNode | BinaryNode} AstNode */

function normalizeExpr(raw) {
  return String(raw || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/⋀/g, " AND ")
    .replace(/⋁/g, " OR ")
    .replace(/∧/g, " AND ")
    .replace(/∨/g, " OR ")
    .replace(/⊕/g, " XOR ")
    .replace(/¬/g, "NOT ")
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ");
}

function tokenize(expr) {
  const normalized = normalizeExpr(expr);
  const tokens = [];
  let i = 0;
  while (i < normalized.length) {
    if (normalized[i] === " ") {
      i += 1;
      continue;
    }
    if (normalized[i] === "(" || normalized[i] === ")") {
      tokens.push(normalized[i]);
      i += 1;
      continue;
    }
    const rest = normalized.slice(i);
    const op = LOGIC_OPS.find((name) => rest.toUpperCase().startsWith(name));
    if (op && (rest.length === op.length || rest[op.length] === " ")) {
      tokens.push(op.toUpperCase());
      i += op.length;
      continue;
    }
    const varMatch = rest.match(/^([pqrst])/i);
    if (varMatch) {
      tokens.push(varMatch[1].toLowerCase());
      i += 1;
      continue;
    }
    throw new Error(`رمز غير معروف عند: ${normalized.slice(i, i + 12)}`);
  }
  return tokens;
}

/** @param {string[]} tokens @param {number} pos */
function parsePrimary(tokens, pos) {
  const token = tokens[pos.i];
  if (token === "(") {
    pos.i += 1;
    const node = parseOr(tokens, pos);
    if (tokens[pos.i] !== ")") throw new Error("قوس إغلاق مفقود");
    pos.i += 1;
    return node;
  }
  if (token === "NOT") {
    pos.i += 1;
    return { type: "unary", op: "NOT", arg: parsePrimary(tokens, pos) };
  }
  if (/^[pqrst]$/.test(token)) {
    pos.i += 1;
    return { type: "var", name: token };
  }
  throw new Error(`تعبير غير مكتمل عند: ${token ?? "النهاية"}`);
}

/** @param {string[]} tokens @param {{ i: number }} pos */
function parseUnary(tokens, pos) {
  if (tokens[pos.i] === "NOT") {
    pos.i += 1;
    return { type: "unary", op: "NOT", arg: parseUnary(tokens, pos) };
  }
  return parsePrimary(tokens, pos);
}

/** @param {string[]} tokens @param {{ i: number }} pos */
function parseAnd(tokens, pos) {
  let left = parseUnary(tokens, pos);
  while (tokens[pos.i] === "AND" || tokens[pos.i] === "NAND") {
    const op = tokens[pos.i];
    pos.i += 1;
    left = { type: "binary", op, left, right: parseUnary(tokens, pos) };
  }
  return left;
}

/** @param {string[]} tokens @param {{ i: number }} pos */
function parseXor(tokens, pos) {
  let left = parseAnd(tokens, pos);
  while (tokens[pos.i] === "XOR" || tokens[pos.i] === "XNOR") {
    const op = tokens[pos.i];
    pos.i += 1;
    left = { type: "binary", op, left, right: parseAnd(tokens, pos) };
  }
  return left;
}

/** @param {string[]} tokens @param {{ i: number }} pos */
function parseOr(tokens, pos) {
  let left = parseXor(tokens, pos);
  while (tokens[pos.i] === "OR" || tokens[pos.i] === "NOR") {
    const op = tokens[pos.i];
    pos.i += 1;
    left = { type: "binary", op, left, right: parseXor(tokens, pos) };
  }
  return left;
}

/** @param {string} expr @param {string[]} [allowedVars] */
export function parseLogicalExpression(expr, allowedVars = null) {
  try {
    const tokens = tokenize(expr);
    if (!tokens.length) return { ok: false, error: "أدخل تعبيرًا منطقيًا." };
    const pos = { i: 0 };
    const ast = parseOr(tokens, pos);
    if (pos.i !== tokens.length) {
      return { ok: false, error: `محتوى زائد بعد التعبير: ${tokens.slice(pos.i).join(" ")}` };
    }
    const used = collectVars(ast);
    const allowed = allowedVars ?? varsForCount(5);
    const unknown = used.filter((v) => !allowed.includes(v));
    if (unknown.length) {
      return { ok: false, error: `متغيرات غير مسموحة: ${unknown.join(", ")}` };
    }
    return { ok: true, ast, usedVars: used };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "تعبير غير صالح." };
  }
}

/** @param {AstNode} node */
function collectVars(node) {
  if (node.type === "var") return [node.name];
  if (node.type === "unary") return collectVars(node.arg);
  return [...new Set([...collectVars(node.left), ...collectVars(node.right)])];
}

/** @param {AstNode} node */
function formatNode(node) {
  if (node.type === "var") return node.name;
  if (node.type === "unary") return `NOT ${formatNode(node.arg)}`;
  return `(${formatNode(node.left)} ${node.op} ${formatNode(node.right)})`;
}

/** @param {AstNode} node @param {Record<string, boolean>} env @param {Map<AstNode, string>} colMap */
function evalWithSteps(node, env, colMap) {
  if (node.type === "var") return Boolean(env[node.name]);
  if (node.type === "unary") {
    const val = !evalWithSteps(node.arg, env, colMap);
    if (colMap.has(node)) return val;
    return val;
  }
  const left = evalWithSteps(node.left, env, colMap);
  const right = evalWithSteps(node.right, env, colMap);
  const fn = BINARY_OPS[node.op];
  const val = fn ? fn(left, right) : false;
  if (colMap.has(node)) return val;
  return val;
}

/** @param {AstNode} root */
function buildIntermediateColumns(root) {
  /** @type {{ id: string, label: string, node: AstNode }[]} */
  const columns = [];
  let seq = 1;

  function walk(node) {
    if (node.type === "var") return;
    walk(node.type === "unary" ? node.arg : node.left);
    if (node.type === "binary") walk(node.right);
    columns.push({ id: `step${seq}`, label: formatNode(node), node });
    seq += 1;
  }

  walk(root);
  return columns;
}

/**
 * @param {string} expr
 * @param {number} [varCount]
 */
export function buildTruthTable(expr, varCount = 5) {
  const vars = varsForCount(varCount);
  const parsed = parseLogicalExpression(expr, vars);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const used = parsed.usedVars.length
    ? vars.filter((v) => parsed.usedVars.includes(v))
    : vars.slice(0, 1);

  const intermediates = buildIntermediateColumns(parsed.ast);
  const colMap = new Map(intermediates.map((c) => [c.node, c.id]));
  const n = used.length;
  const total = 2 ** n;
  const rows = [];

  for (let i = 0; i < total; i++) {
    /** @type {Record<string, number>} */
    const row = {};
    used.forEach((v, j) => {
      row[v] = (i >> (n - 1 - j)) & 1;
    });
    const env = Object.fromEntries(used.map((v) => [v, Boolean(row[v])]));

    for (const col of intermediates) {
      row[col.id] = evalWithSteps(col.node, env, colMap) ? 1 : 0;
    }
    row.result = evalWithSteps(parsed.ast, env, colMap) ? 1 : 0;
    rows.push(row);
  }

  return {
    ok: true,
    expr: formatNode(parsed.ast),
    variables: used,
    intermediateColumns: intermediates.map(({ id, label }) => ({ id, label })),
    rows,
  };
}

/** @param {string} op @param {string} [left] @param {string} [right] @param {boolean} [notLeft] @param {boolean} [notRight] */
export function buildSimpleExpression(op, left = "p", right = "q", notLeft = false, notRight = false) {
  const l = notLeft ? `NOT ${left}` : left;
  if (op === "NOT") return `NOT ${left}`;
  const r = notRight ? `NOT ${right}` : right;
  return `(${l} ${op} ${r})`;
}

export { BINARY_OPS, formatNode };
