/**
 * التحقق من توافق كود المشروع مع appkit سطح المكتب قبل التصدير
 */

const APPKIT_ARG_BOUNDS = {
  title: [1, 1],
  text: [1, 1],
  input: [2, 4],
  number_input: [2, 4],
  output: [2, 2],
  button: [2, 2],
  get: [1, 1],
  set: [2, 2],
  on_click: [2, 2],
  canvas: [3, 3],
  draw_rect: [6, 6],
  draw_text: [5, 5],
  clear_canvas: [1, 1],
  build: [0, 0],
};

function countTopLevelArgs(argStr) {
  let s = argStr.trim();
  if (!s) return 0;
  while (s.endsWith(",")) s = s.slice(0, -1).trimEnd();
  if (!s) return 0;
  let depth = 0;
  let inStr = null;
  let escape = false;
  let commas = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === inStr) inStr = null;
    } else if (c === '"' || c === "'") {
      inStr = c;
    } else if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (c === "," && depth === 0) commas++;
  }
  return commas + 1;
}

export function extractAppkitCalls(code) {
  const calls = [];
  const re = /appkit\.(\w+)\s*\(/g;
  let m;
  while ((m = re.exec(code)) !== null) {
    const func = m[1];
    const start = m.index + m[0].length;
    let depth = 1;
    let i = start;
    let inStr = null;
    let escape = false;
    while (i < code.length && depth > 0) {
      const c = code[i];
      if (inStr) {
        if (escape) escape = false;
        else if (c === "\\") escape = true;
        else if (c === inStr) inStr = null;
      } else if (c === '"' || c === "'") {
        inStr = c;
      } else if (c === "(") depth++;
      else if (c === ")") depth--;
      i++;
    }
    if (depth !== 0) continue;
    const argStr = code.slice(start, i - 1);
    calls.push({ func, argCount: countTopLevelArgs(argStr), line: code.slice(0, m.index).split("\n").length });
  }
  return calls;
}

export function validateDesktopAppkitCode(code) {
  if (!/import\s+appkit\b/.test(code)) {
    return "التصدير كـ EXE متاح للمشاريع الرسومية (appkit) فقط.";
  }

  const calls = extractAppkitCalls(code);
  const errors = [];

  for (const call of calls) {
    const bounds = APPKIT_ARG_BOUNDS[call.func];
    if (!bounds) {
      errors.push(`السطر ${call.line}: الدالة appkit.${call.func} غير مدعومة في نسخة سطح المكتب.`);
      continue;
    }
    const [min, max] = bounds;
    if (call.argCount < min || call.argCount > max) {
      errors.push(
        `السطر ${call.line}: appkit.${call.func}() يستقبل من ${min} إلى ${max} معاملات، لكن الكود يمرّر ${call.argCount}.`,
      );
    }
  }

  if (!calls.some((c) => c.func === "build")) {
    errors.push("يجب استدعاء appkit.build() في نهاية المشروع.");
  }

  if (errors.length) {
    return `لا يمكن تصدير المشروع قبل إصلاح الأخطاء البرمجية:\n${errors.slice(0, 4).join("\n")}`;
  }
  return null;
}
