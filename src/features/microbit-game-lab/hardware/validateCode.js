/** @typedef {import('../types.js').CodeValidationResult} CodeValidationResult */

const FORBIDDEN = [
  { re: /^\s*import\s/m, msg: "import غير مسموح" },
  { re: /^\s*from\s+/m, msg: "from ... import غير مسموح" },
  { re: /from\s+microbit/mi, msg: "from microbit غير مسموح" },
  { re: /\bos\./m, msg: "os غير مسموح" },
  { re: /\btime\./m, msg: "time غير مسموح — استخدم basic.pause" },
  { re: /\bthreading\b/m, msg: "threading غير مسموح" },
  { re: /i2c_lcd/i, msg: "مكتبات LCD خارجية غير مسموحة" },
  { re: /hd44780/i, msg: "Extensions LCD غير مسموحة — استخدم driver الداخلي" },
];

/**
 * @param {string} code
 * @returns {CodeValidationResult}
 */
export function validateMakeCodePython(code) {
  const errors = [];
  const warnings = [];
  const src = String(code || "");

  for (const rule of FORBIDDEN) {
    if (rule.re.test(src)) errors.push(rule.msg);
  }

  if (!/\bpins\./m.test(src)) {
    warnings.push("لم يُعثر على pins.*");
  }
  if (!/\bbasic\./m.test(src)) {
    warnings.push("لم يُعثر على basic.*");
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * @param {string} code
 * @param {string} [context]
 */
export function assertValidMakeCodePython(code, context = "generated code") {
  const result = validateMakeCodePython(code);
  if (!result.valid) {
    throw new Error(`${context}: ${result.errors.join("; ")}`);
  }
  return result;
}
