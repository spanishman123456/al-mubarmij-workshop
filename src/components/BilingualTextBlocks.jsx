import { splitDirectionalParts } from "../lib/bidi/directionalTokens";

const TECH_KEYWORD_RE =
  /\b(AND|OR|NOT|XOR|NAND|NOR|if|else|elif|for|while|range|print|input|return|True|False|binary|decimal|hex|ASCII|Unicode|UTF-8|RGB)\b/i;
const ASSIGNMENT_RE = /\b([A-Za-z_]\w*)\s*=\s*([#A-Za-z0-9_.+-]+)\b/g;
const OPERATOR_RE = /(==|!=|<=|>=|<|>|\+|-|\*|\/|%)/;
const HEX_COLOR_RE = /#[A-Fa-f0-9]{3,8}\b/;

function normalizeValues(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((entry) => {
      if (!entry) return null;
      if (typeof entry === "string") return { name: "", value: entry };
      return { name: entry.name || "", value: entry.value ?? "" };
    })
    .filter(Boolean);
}

function normalizePromptText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([؟?!:;,])/g, "$1")
    .trim();
}

function splitToCandidateSegments(text) {
  return String(text || "")
    .replace(/\u200f|\u200e/g, "")
    .split(/[\n]+|(?<=[؟?.!])/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function isTechnicalSegment(segment) {
  const arabicCount = (segment.match(/[\u0600-\u06FF]/g) || []).length;
  const latinCount = (segment.match(/[A-Za-z]/g) || []).length;
  const digitCount = (segment.match(/[0-9]/g) || []).length;
  const symbolCount = (segment.match(/[=<>+\-*/%()[\]{}:#]/g) || []).length;
  const score = latinCount + digitCount + symbolCount;
  if (HEX_COLOR_RE.test(segment)) return true;
  if (TECH_KEYWORD_RE.test(segment)) return true;
  if (OPERATOR_RE.test(segment) && score >= 2) return true;
  return arabicCount === 0 && score >= 2;
}

function extractValues(text) {
  const rows = [];
  const seen = new Set();
  for (const m of String(text || "").matchAll(ASSIGNMENT_RE)) {
    const name = m[1];
    const value = m[2];
    const key = `${name}=${value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ name, value });
  }
  return rows;
}

function inferPromptStructure(promptAr) {
  const segments = splitToCandidateSegments(promptAr);
  const technicalSegments = segments.filter(isTechnicalSegment);
  const inferredExpression =
    technicalSegments.find((segment) => TECH_KEYWORD_RE.test(segment) || OPERATOR_RE.test(segment)) || "";
  const inferredValues = extractValues(promptAr);
  let arabicOnlyPrompt = String(promptAr || "");
  if (inferredExpression) {
    arabicOnlyPrompt = arabicOnlyPrompt.replace(inferredExpression, "");
  }
  if (inferredValues.length) {
    inferredValues.forEach((row) => {
      arabicOnlyPrompt = arabicOnlyPrompt.replace(new RegExp(`${row.name}\\s*=\\s*${row.value}`, "g"), "");
    });
  }
  arabicOnlyPrompt = normalizePromptText(arabicOnlyPrompt);
  return {
    promptAr: arabicOnlyPrompt || normalizePromptText(promptAr),
    expression: inferredExpression,
    values: inferredValues,
  };
}

export function LtrInlineToken({ token, className = "" }) {
  return (
    <span
      dir="ltr"
      className={`inline-block ${className}`.trim()}
      style={{ unicodeBidi: "isolate", direction: "ltr", textAlign: "left" }}
    >
      {token}
    </span>
  );
}

export function LtrCodeBlock({ code, className = "" }) {
  if (!code) return null;
  return (
    <pre
      dir="ltr"
      className={`overflow-x-auto rounded-lg border border-white/15 bg-slate-950/90 p-3 text-left font-mono text-sm text-emerald-200 ${className}`.trim()}
      style={{ unicodeBidi: "isolate", direction: "ltr", textAlign: "left" }}
    >
      {String(code)}
    </pre>
  );
}

export function CodeExpression({ expression, className = "" }) {
  if (!expression) return null;
  return <LtrCodeBlock code={expression} className={className} />;
}

export function LogicExpression({ expression, className = "" }) {
  if (!expression) return null;
  return <LtrCodeBlock code={expression} className={className} />;
}

export function MathExpression({ expression, className = "" }) {
  if (!expression) return null;
  return <LtrCodeBlock code={expression} className={className} />;
}

export function ArabicText({ text, className = "" }) {
  const nodes =
    typeof text === "string"
      ? splitDirectionalParts(text).map((part, idx) =>
          part.dir === "ltr" ? (
            <LtrInlineToken key={`ar-ltr-${idx}`} token={part.text} />
          ) : (
            <span key={`ar-rtl-${idx}`}>{part.text}</span>
          ),
        )
      : text;
  return (
    <p
      dir="rtl"
      className={`leading-relaxed text-right ${className}`.trim()}
      style={{ direction: "rtl", textAlign: "right", unicodeBidi: "isolate" }}
    >
      {nodes}
    </p>
  );
}

export function BilingualPrompt({
  promptAr,
  expression,
  values,
  code,
  expressionLabel = "التعبير:",
  valuesLabel = "القيم المعطاة:",
  className = "",
}) {
  const inferred = typeof promptAr === "string" ? inferPromptStructure(promptAr) : null;
  const finalPrompt = normalizePromptText(inferred?.promptAr || promptAr || "");
  const finalExpression = expression || inferred?.expression || "";
  const valueRows = normalizeValues(values?.length ? values : inferred?.values || []);

  return (
    <div dir="rtl" className={`space-y-2 text-right ${className}`.trim()}>
      {finalPrompt ? <ArabicText text={finalPrompt} className="text-slate-900" /> : null}
      {finalExpression ? (
        <div className="rounded-lg bg-white/50 p-2">
          <p className="mb-1 text-xs font-bold text-slate-600">{expressionLabel}</p>
          <LogicExpression expression={finalExpression} />
        </div>
      ) : null}
      {code ? (
        <div className="rounded-lg bg-white/50 p-2">
          <p className="mb-1 text-xs font-bold text-slate-600">الكود:</p>
          <LtrCodeBlock code={code} />
        </div>
      ) : null}
      {valueRows.length ? (
        <div className="rounded-lg bg-white/50 p-2">
          <p className="mb-1 text-xs font-bold text-slate-600">{valuesLabel}</p>
          <div className="space-y-1">
            {valueRows.map((row, idx) => (
              <div
                key={`${row.name}-${row.value}-${idx}`}
                dir="ltr"
                className="font-mono text-sm text-slate-800"
                style={{ unicodeBidi: "isolate", direction: "ltr", textAlign: "left" }}
              >
                {row.name ? `${row.name} = ${row.value}` : String(row.value)}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function StructuredPrompt(props) {
  return <BilingualPrompt {...props} />;
}
