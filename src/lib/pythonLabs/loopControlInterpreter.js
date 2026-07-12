import { normalizeExecutablePythonCode } from "../text/codeNormalization";

const INDENT_STEP = 4;
const IDENT_RE = /^[A-Za-z_]\w*$/;
const INT_RE = /^-?\d+$/;

function parseIntToken(token) {
  const trimmed = String(token || "").trim();
  if (!INT_RE.test(trimmed)) return null;
  return Number(trimmed);
}

function computeIndent(line) {
  let spaces = 0;
  for (const ch of line) {
    if (ch === " ") spaces += 1;
    else break;
  }
  return spaces;
}

function parseCodeLines(code) {
  const normalized = normalizeExecutablePythonCode(code);
  return normalized
    .split(/\r?\n/)
    .map((raw, index) => {
      const withoutTabs = raw.replace(/\t/g, " ".repeat(INDENT_STEP));
      return {
        lineNo: index + 1,
        raw: withoutTabs,
        indent: computeIndent(withoutTabs),
        text: withoutTabs.trim(),
      };
    })
    .filter((line) => line.text.length > 0);
}

function parseRangeArgs(argsText) {
  const tokens = String(argsText || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (tokens.length < 1 || tokens.length > 3) return null;
  const numbers = tokens.map(parseIntToken);
  if (numbers.some((n) => n == null)) return null;
  if (numbers.length === 1) return { start: 0, stop: numbers[0], step: 1 };
  if (numbers.length === 2) return { start: numbers[0], stop: numbers[1], step: 1 };
  return { start: numbers[0], stop: numbers[1], step: numbers[2] };
}

function buildRangeValues({ start, stop, step }) {
  if (step === 0) return null;
  const out = [];
  if (step > 0) {
    for (let i = start; i < stop; i += step) out.push(i);
  } else {
    for (let i = start; i > stop; i += step) out.push(i);
  }
  return out;
}

function parsePrintArg(text) {
  const m = text.match(/^print\s*\((.+)\)\s*$/);
  return m ? m[1].trim() : null;
}

function evalPrintExpr(expr, vars) {
  if (!expr) return { ok: false, error: "تعذر قراءة دالة print بصورة صحيحة." };
  if (/^(['"]).*\1$/.test(expr)) {
    return { ok: true, value: expr.slice(1, -1) };
  }
  const num = parseIntToken(expr);
  if (num != null) return { ok: true, value: String(num) };
  if (IDENT_RE.test(expr) && Object.prototype.hasOwnProperty.call(vars, expr)) {
    return { ok: true, value: String(vars[expr]) };
  }
  return { ok: false, error: `تعذر تقييم التعبير داخل print: ${expr}` };
}

function evalCondition(text, vars) {
  const m = text.match(/^if\s+([A-Za-z_]\w*)\s*(==|!=|<=|>=|<|>)\s*(-?\d+)\s*:\s*$/);
  if (!m) return { ok: false, error: "تعذر تحليل شرط if. تأكد من الصيغة: if i == 2:" };
  const [, varName, op, rhsToken] = m;
  if (!Object.prototype.hasOwnProperty.call(vars, varName)) {
    return { ok: false, error: `لم أتعرف على المتغير ${varName} داخل الحلقة.` };
  }
  const lhs = Number(vars[varName]);
  const rhs = Number(rhsToken);
  let value = false;
  if (op === "==") value = lhs === rhs;
  if (op === "!=") value = lhs !== rhs;
  if (op === "<") value = lhs < rhs;
  if (op === "<=") value = lhs <= rhs;
  if (op === ">") value = lhs > rhs;
  if (op === ">=") value = lhs >= rhs;
  return { ok: true, value, detail: `${varName} ${op} ${rhs}` };
}

function parseIfAction(line) {
  if (line === "continue") return { kind: "continue" };
  if (line === "break") return { kind: "break" };
  if (line === "pass") return { kind: "pass" };
  const printArg = parsePrintArg(line);
  if (printArg != null) return { kind: "print", expr: printArg };
  return null;
}

function buildParseError(line, message, normalizedCode) {
  return {
    outputs: [],
    trace: [],
    errors: [message],
    normalizedCode,
    parserIssue: true,
    line: line?.lineNo ?? null,
  };
}

function parseLoopProgram(code) {
  const lines = parseCodeLines(code);
  const normalizedCode = normalizeExecutablePythonCode(code);
  if (lines.length === 0) {
    return buildParseError(null, "لا يوجد كود للتنفيذ.", normalizedCode);
  }

  const forLine = lines[0];
  const forMatch = forLine.text.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\s*\((.*)\)\s*:\s*$/);
  if (!forMatch) {
    return buildParseError(forLine, "تعذر تحليل الحلقة. تأكد من كتابة for ... in range(...) بالشكل الصحيح.", normalizedCode);
  }
  const loopVar = forMatch[1];
  const rangeArgs = parseRangeArgs(forMatch[2]);
  if (!rangeArgs) {
    return buildParseError(forLine, "تعذر تحليل range. اكتب القيم كأعداد صحيحة مثل range(5) أو range(1, 6).", normalizedCode);
  }
  if (rangeArgs.step === 0) {
    return buildParseError(forLine, "قيمة step لا يمكن أن تكون 0 في range.", normalizedCode);
  }

  const loopIndent = forLine.indent;
  const bodyLines = [];
  let i = 1;
  while (i < lines.length && lines[i].indent > loopIndent) {
    bodyLines.push(lines[i]);
    i += 1;
  }

  if (bodyLines.length === 0) {
    return buildParseError(forLine, "الحلقة لا تحتوي جسمًا داخليًا. أضف تعليمات داخل الحلقة مع إزاحة صحيحة.", normalizedCode);
  }

  const loopBody = [];
  for (let j = 0; j < bodyLines.length; j += 1) {
    const line = bodyLines[j];
    const isIf = /^if\s+.+:\s*$/.test(line.text);
    if (isIf) {
      const nested = bodyLines[j + 1];
      if (!nested || nested.indent <= line.indent) {
        return buildParseError(line, "تعذر تحليل if: أضف تعليمة داخل if مع إزاحة صحيحة.", normalizedCode);
      }
      const action = parseIfAction(nested.text);
      if (!action) {
        return buildParseError(nested, "تعليمة غير مدعومة داخل if. استخدم break أو continue أو pass أو print().", normalizedCode);
      }
      loopBody.push({ kind: "if", condition: line.text, action, conditionLine: line.lineNo, actionLine: nested.lineNo });
      j += 1;
      continue;
    }

    if (line.indent !== bodyLines[0].indent) {
      return buildParseError(line, "تعذر تحليل الإزاحة داخل الحلقة. تحقق من المسافات البادئة.", normalizedCode);
    }

    if (line.text === "continue" || line.text === "break" || line.text === "pass") {
      loopBody.push({ kind: line.text, line: line.lineNo });
      continue;
    }
    const printArg = parsePrintArg(line.text);
    if (printArg != null) {
      loopBody.push({ kind: "print", expr: printArg, line: line.lineNo });
      continue;
    }
    return buildParseError(line, "تعليمة غير مدعومة داخل الحلقة. استخدم if / break / continue / pass / print.", normalizedCode);
  }

  let elseBlock = [];
  if (i < lines.length) {
    const elseLine = lines[i];
    if (!/^else\s*:\s*$/.test(elseLine.text) || elseLine.indent !== loopIndent) {
      return buildParseError(elseLine, "بعد انتهاء الحلقة يُسمح فقط بكتلة else بالصيغة else: أو لا شيء.", normalizedCode);
    }
    i += 1;
    while (i < lines.length && lines[i].indent > elseLine.indent) {
      const line = lines[i];
      const printArg = parsePrintArg(line.text);
      if (printArg == null) {
        return buildParseError(line, "كتلة else تدعم print(...) فقط في هذا النشاط.", normalizedCode);
      }
      elseBlock.push({ kind: "print", expr: printArg, line: line.lineNo });
      i += 1;
    }
  }

  if (i < lines.length) {
    return buildParseError(lines[i], "يوجد كود إضافي غير مدعوم بعد الحلقة. راجع ترتيب الأسطر.", normalizedCode);
  }

  return {
    ok: true,
    normalizedCode,
    loopVar,
    rangeArgs,
    loopBody,
    elseBlock,
  };
}

export function runLoopControlTrace(code) {
  const parsed = parseLoopProgram(code);
  if (!parsed.ok) return parsed;

  const values = buildRangeValues(parsed.rangeArgs);
  if (!values) {
    return {
      outputs: [],
      trace: [],
      errors: ["تعذر تنفيذ range لأن قيمة step غير صالحة."],
      normalizedCode: parsed.normalizedCode,
      parserIssue: true,
      line: 1,
    };
  }

  const outputs = [];
  const trace = [];
  const errors = [];
  let broke = false;

  for (const value of values) {
    const vars = { [parsed.loopVar]: value };
    let skipRestOfIteration = false;

    for (const stmt of parsed.loopBody) {
      if (stmt.kind === "if") {
        const cond = evalCondition(stmt.condition, vars);
        if (!cond.ok) {
          errors.push(cond.error);
          return { outputs, trace, errors, normalizedCode: parsed.normalizedCode, parserIssue: true, line: stmt.conditionLine };
        }
        if (!cond.value) continue;
        const action = stmt.action;
        if (action.kind === "continue") {
          trace.push(`${parsed.loopVar} = ${value} → تنفيذ continue وتجاوز print`);
          skipRestOfIteration = true;
          break;
        }
        if (action.kind === "break") {
          trace.push(`${parsed.loopVar} = ${value} → تنفيذ break والخروج من الحلقة`);
          broke = true;
          skipRestOfIteration = true;
          break;
        }
        if (action.kind === "pass") {
          trace.push(`${parsed.loopVar} = ${value} → تنفيذ pass (لا تغيير)`);
          continue;
        }
        if (action.kind === "print") {
          const evaled = evalPrintExpr(action.expr, vars);
          if (!evaled.ok) {
            errors.push(evaled.error);
            return { outputs, trace, errors, normalizedCode: parsed.normalizedCode, parserIssue: true, line: stmt.actionLine };
          }
          outputs.push(evaled.value);
          trace.push(`${parsed.loopVar} = ${value} → طباعة ${evaled.value}`);
        }
        continue;
      }

      if (stmt.kind === "continue") {
        trace.push(`${parsed.loopVar} = ${value} → تنفيذ continue وتجاوز بقية الأسطر`);
        skipRestOfIteration = true;
        break;
      }
      if (stmt.kind === "break") {
        trace.push(`${parsed.loopVar} = ${value} → تنفيذ break والخروج من الحلقة`);
        broke = true;
        skipRestOfIteration = true;
        break;
      }
      if (stmt.kind === "pass") {
        trace.push(`${parsed.loopVar} = ${value} → تنفيذ pass`);
        continue;
      }
      if (stmt.kind === "print") {
        const evaled = evalPrintExpr(stmt.expr, vars);
        if (!evaled.ok) {
          errors.push(evaled.error);
          return { outputs, trace, errors, normalizedCode: parsed.normalizedCode, parserIssue: true, line: stmt.line };
        }
        outputs.push(evaled.value);
        trace.push(`${parsed.loopVar} = ${value} → طباعة ${evaled.value}`);
      }
    }

    if (broke) break;
    if (skipRestOfIteration) continue;
  }

  if (!broke && parsed.elseBlock.length) {
    for (const stmt of parsed.elseBlock) {
      const evaled = evalPrintExpr(stmt.expr, {});
      if (!evaled.ok) {
        errors.push(evaled.error);
        return { outputs, trace, errors, normalizedCode: parsed.normalizedCode, parserIssue: true, line: stmt.line };
      }
      outputs.push(evaled.value);
      trace.push(`else → طباعة ${evaled.value}`);
    }
  }

  return {
    outputs,
    trace,
    errors,
    normalizedCode: parsed.normalizedCode,
    parserIssue: false,
    meta: {
      loopVar: parsed.loopVar,
      rangeArgs: parsed.rangeArgs,
      broke,
    },
  };
}
