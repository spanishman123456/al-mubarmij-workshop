/** أسماء المتغيرات المنطقية المعتمدة في المنهج */
export const LOGIC_VARS = ["p", "q", "r", "s", "t"];
export const DISPLAY_LOGIC_VARS = ["A", "B", "C", "D", "E"];

export const LOGIC_OPS = ["AND", "OR", "NOT", "XOR", "NAND", "NOR", "XNOR"];

export function varsForCount(count) {
  return LOGIC_VARS.slice(0, Math.min(Math.max(count, 1), LOGIC_VARS.length));
}

export function displayVarsForCount(count) {
  return DISPLAY_LOGIC_VARS.slice(0, Math.min(Math.max(count, 1), DISPLAY_LOGIC_VARS.length));
}

export function toDisplayLogicExpression(expression) {
  return String(expression || "").replace(/\b([pqrst])\b/gi, (variable) => {
    const index = LOGIC_VARS.indexOf(variable.toLowerCase());
    return DISPLAY_LOGIC_VARS[index] || variable;
  });
}
