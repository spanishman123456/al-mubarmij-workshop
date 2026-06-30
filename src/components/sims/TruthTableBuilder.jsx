import { useMemo, useState } from "react";
import {
  buildSimpleExpression,
  buildTruthTable,
  parseLogicalExpression,
} from "../../lib/logic/truthTable.js";
import { LOGIC_OPS, varsForCount } from "../../lib/logic/variables.js";

const OP_OPTIONS = ["AND", "OR", "NOT", "XOR", "NAND", "NOR", "XNOR"];

function TruthTableView({ table }) {
  if (!table?.ok) return null;
  const cols = [
    ...table.variables,
    ...table.intermediateColumns.map((c) => c.id),
    "result",
  ];
  const labels = {
    ...Object.fromEntries(table.variables.map((v) => [v, v])),
    ...Object.fromEntries(table.intermediateColumns.map((c) => [c.id, c.label])),
    result: "الناتج",
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-600">
      <table className="w-full min-w-[280px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-800">
            {cols.map((col) => (
              <th
                key={col}
                className="border border-slate-600 px-3 py-2 text-cyan-300"
                title={labels[col]}
              >
                <span className="block max-w-[8rem] truncate text-xs" dir="ltr">
                  {labels[col]}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className={i % 2 ? "bg-slate-900/50" : ""}>
              {cols.map((col) => (
                <td key={col} className="border border-slate-600 px-3 py-2 text-center font-mono">
                  <span className={row[col] ? "text-emerald-400" : "text-slate-500"}>
                    {row[col]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TruthTableBuilder() {
  const [mode, setMode] = useState("builder");
  const [varCount, setVarCount] = useState(2);
  const [op, setOp] = useState("AND");
  const [left, setLeft] = useState("p");
  const [right, setRight] = useState("q");
  const [notLeft, setNotLeft] = useState(false);
  const [notRight, setNotRight] = useState(false);
  const [part2Op, setPart2Op] = useState("OR");
  const [part2Var, setPart2Var] = useState("r");
  const [useCompound, setUseCompound] = useState(false);
  const [advancedExpr, setAdvancedExpr] = useState("p AND q");

  const vars = varsForCount(varCount);

  const builderExpr = useMemo(() => {
    if (mode === "advanced") return advancedExpr;
    if (useCompound && varCount >= 3) {
      const part1 = buildSimpleExpression(op, left, right, notLeft, notRight);
      return `(${part1}) ${part2Op} ${part2Var}`;
    }
    return buildSimpleExpression(op, left, right, notLeft, notRight);
  }, [
    mode,
    advancedExpr,
    useCompound,
    varCount,
    op,
    left,
    right,
    notLeft,
    notRight,
    part2Op,
    part2Var,
  ]);

  const validation = useMemo(
    () => parseLogicalExpression(builderExpr, vars),
    [builderExpr, vars],
  );

  const table = useMemo(
    () => (validation.ok ? buildTruthTable(builderExpr, varCount) : null),
    [builderExpr, varCount, validation.ok],
  );

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm font-bold ${mode === "builder" ? "bg-violet-700 text-white" : "bg-slate-700 text-slate-200"}`}
          onClick={() => setMode("builder")}
        >
          منشئ التعبير
        </button>
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm font-bold ${mode === "advanced" ? "bg-violet-700 text-white" : "bg-slate-700 text-slate-200"}`}
          onClick={() => setMode("advanced")}
        >
          إدخال متقدم
        </button>
      </div>

      <label className="block">
        <span className="lab-label">عدد المتغيرات</span>
        <select
          className="lab-select mt-1"
          value={varCount}
          onChange={(e) => {
            const n = Number(e.target.value);
            setVarCount(n);
            setLeft(varsForCount(n)[0]);
            setRight(varsForCount(n)[1] ?? varsForCount(n)[0]);
            setPart2Var(varsForCount(n)[2] ?? varsForCount(n)[0]);
          }}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} — ({varsForCount(n).join(", ")})
            </option>
          ))}
        </select>
      </label>

      {mode === "builder" ? (
        <div className="grid gap-3 rounded-xl border border-slate-600 bg-slate-900/40 p-4 md:grid-cols-2">
          <label>
            <span className="lab-label">العملية</span>
            <select className="lab-select mt-1 w-full" value={op} onChange={(e) => setOp(e.target.value)}>
              {OP_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="lab-label">المتغير الأول</span>
            <select className="lab-select mt-1 w-full" value={left} onChange={(e) => setLeft(e.target.value)}>
              {vars.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          {op !== "NOT" ? (
            <label>
              <span className="lab-label">المتغير الثاني</span>
              <select className="lab-select mt-1 w-full" value={right} onChange={(e) => setRight(e.target.value)}>
                {vars.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" checked={notLeft} onChange={(e) => setNotLeft(e.target.checked)} />
              NOT على الأول
            </label>
            {op !== "NOT" ? (
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input type="checkbox" checked={notRight} onChange={(e) => setNotRight(e.target.checked)} />
                NOT على الثاني
              </label>
            ) : null}
          </div>
          {varCount >= 3 ? (
            <div className="md:col-span-2 space-y-2 border-t border-slate-700 pt-3">
              <label className="flex items-center gap-2 text-sm text-cyan-200">
                <input
                  type="checkbox"
                  checked={useCompound}
                  onChange={(e) => setUseCompound(e.target.checked)}
                />
                تعبير مركّب (جزء ثانٍ)
              </label>
              {useCompound ? (
                <div className="flex flex-wrap gap-2">
                  <select className="lab-select" value={part2Op} onChange={(e) => setPart2Op(e.target.value)}>
                    {["OR", "AND", "XOR", "NOR", "NAND", "XNOR"].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <select className="lab-select" value={part2Var} onChange={(e) => setPart2Var(e.target.value)}>
                    {vars.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <input
            className="lab-input font-mono"
            value={advancedExpr}
            onChange={(e) => setAdvancedExpr(e.target.value)}
            placeholder="مثال: (p AND q) OR NOT r"
            dir="ltr"
          />
          <p className="lab-hint mt-1">
            العمليات: {LOGIC_OPS.join(", ")} — المتغيرات: {vars.join(", ")}
          </p>
        </div>
      )}

      <div className="rounded-lg border border-violet-500/30 bg-violet-950/30 px-3 py-2 text-sm" dir="ltr">
        <span className="text-violet-300">التعبير: </span>
        <span className="font-mono text-white">{builderExpr}</span>
      </div>

      {!validation.ok ? (
        <p className="rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-200" role="alert">
          {validation.error}
        </p>
      ) : null}

      {table?.ok ? (
        <>
          <p className="text-sm text-cyan-200">
            {table.rows.length} صف — {table.intermediateColumns.length > 0 ? "مع أعمدة وسيطة" : "نتيجة مباشرة"}
          </p>
          <TruthTableView table={table} />
        </>
      ) : null}
    </div>
  );
}

export { TruthTableView };
