const LOGIC_VARS = new Set(["p", "q", "r", "s", "t"]);
const NEG_SUFFIX = /[̄¯ˉ′']/u;

/** @typedef {{ name: string, negated: boolean }} LogicVarToken */

/**
 * @param {string} term مثل p̄q أو pq̄
 * @returns {LogicVarToken[]}
 */
export function parseLogicMinterm(term) {
  const tokens = [];
  let i = 0;
  const s = String(term || "");
  while (i < s.length) {
    const ch = s[i];
    if (LOGIC_VARS.has(ch)) {
      let negated = false;
      let j = i + 1;
      while (j < s.length && NEG_SUFFIX.test(s[j])) {
        negated = true;
        j += 1;
      }
      tokens.push({ name: ch, negated });
      i = j;
      continue;
    }
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    i += 1;
  }
  return tokens;
}

/**
 * @param {string} expr
 * @returns {string[]}
 */
export function splitLogicSum(expr) {
  if (!expr || expr === "0" || expr === "1") return expr ? [expr] : [];
  return expr.split(/\s*\+\s*/).filter(Boolean);
}

/** @param {string} expr */
export function isMintermStyle(expr) {
  const cleaned = expr.replace(/\s*\+\s*/g, "");
  return /^[pqrst\u0304\u00af\u02c9\u2032'\s]+$/u.test(cleaned);
}

/**
 * @param {string} expr
 */
export function normalizeNotForDisplay(expr) {
  return String(expr || "")
    .replace(/\bNOT\s+([pqrst])\b/gi, "$1̄")
    .replace(/\b([pqrst])'\b/g, "$1̄");
}
