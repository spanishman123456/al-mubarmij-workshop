/** أسماء المتغيرات المنطقية المعتمدة في المنهج */
export const LOGIC_VARS = ["p", "q", "r", "s", "t"];

export const LOGIC_OPS = ["AND", "OR", "NOT", "XOR", "NAND", "NOR", "XNOR"];

export function varsForCount(count) {
  return LOGIC_VARS.slice(0, Math.min(Math.max(count, 1), LOGIC_VARS.length));
}
