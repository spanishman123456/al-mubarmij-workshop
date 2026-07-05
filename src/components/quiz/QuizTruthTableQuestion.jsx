import { buildTruthTable } from "../../lib/logic/truthTable.js";

function parseTableAnswer(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function QuizTruthTableQuestion({ question, value, onChange, disabled }) {
  const expr = question.logicExpr || "(NOT p AND q) OR r";
  const table = buildTruthTable(expr, question.varCount || 3);
  const answers = parseTableAnswer(value) || {};
  const cols = question.resultOnly ? ["result"] : [...(table.variables || []), "result"];

  if (!table.ok) {
    return <p className="text-sm text-rose-300">تعذر تحميل جدول الحقيقة.</p>;
  }

  function setCell(rowIdx, col, val) {
    if (disabled) return;
    const next = { ...answers, [`${rowIdx}:${col}`]: val.replace(/[^01]/g, "") };
    onChange(JSON.stringify(next));
  }

  return (
    <div className="space-y-3" dir="rtl">
      {question.instructionAr ? (
        <p className="rounded-lg bg-violet-950/40 px-3 py-2 text-sm text-violet-100">{question.instructionAr}</p>
      ) : null}
      <p className="text-xs text-slate-400" dir="ltr">
        {question.logicExprDisplay || expr}
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[320px] text-center text-sm" dir="ltr">
          <thead>
            <tr className="bg-white/10 text-violet-200">
              {table.variables.map((v) => (
                <th key={v} className="px-2 py-2 font-bold">
                  {v}
                </th>
              ))}
              {cols.includes("result") ? <th className="px-2 py-2 font-bold">F</th> : null}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className="border-t border-white/5">
                {table.variables.map((v) => (
                  <td key={v} className="px-2 py-1 text-slate-300">
                    {row[v]}
                  </td>
                ))}
                {cols.includes("result") ? (
                  <td className="px-1 py-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 rounded border border-white/20 bg-black/40 text-center text-white"
                      value={answers[`${ri}:result`] ?? ""}
                      onChange={(e) => setCell(ri, "result", e.target.value)}
                      disabled={disabled}
                      aria-label={`نتيجة الصف ${ri + 1}`}
                    />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function gradeTruthTableAnswer(question, userAnswer) {
  const expr = question.logicExpr || "(NOT p AND q) OR r";
  const table = buildTruthTable(expr, question.varCount || 3);
  if (!table.ok) return false;
  const answers = parseTableAnswer(userAnswer);
  if (!answers) return false;
  return table.rows.every((row, ri) => String(answers[`${ri}:result`]) === String(row.result));
}

export function buildTruthTableKey(question) {
  const expr = question.logicExpr || "(NOT p AND q) OR r";
  const table = buildTruthTable(expr, question.varCount || 3);
  if (!table.ok) return null;
  const key = {};
  table.rows.forEach((row, ri) => {
    key[`${ri}:result`] = String(row.result);
  });
  return key;
}
