import { splitDirectionalParts } from "../lib/bidi/directionalTokens";

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

export function BilingualPrompt({
  promptAr,
  expression,
  values,
  code,
  expressionLabel = "التعبير:",
  valuesLabel = "القيم المعطاة:",
  className = "",
}) {
  const valueRows = normalizeValues(values);
  const promptNodes =
    typeof promptAr === "string"
      ? splitDirectionalParts(promptAr).map((part, idx) =>
          part.dir === "ltr" ? (
            <LtrInlineToken key={`prompt-ltr-${idx}`} token={part.text} />
          ) : (
            <span key={`prompt-rtl-${idx}`}>{part.text}</span>
          ),
        )
      : promptAr;
  return (
    <div dir="rtl" className={`space-y-2 text-right ${className}`.trim()}>
      {promptAr ? <p className="leading-relaxed text-slate-900">{promptNodes}</p> : null}
      {expression ? (
        <div className="rounded-lg bg-white/50 p-2">
          <p className="mb-1 text-xs font-bold text-slate-600">{expressionLabel}</p>
          <LogicExpression expression={expression} />
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
