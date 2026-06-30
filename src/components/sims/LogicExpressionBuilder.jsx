import { useMemo, useState } from "react";
import {
  buildSimpleExpression,
  parseLogicalExpression,
} from "../../lib/logic/truthTable.js";
import { LOGIC_OPS, varsForCount } from "../../lib/logic/variables.js";

const OP_OPTIONS = ["AND", "OR", "NOT", "XOR", "NAND", "NOR", "XNOR"];

/**
 * @param {number} [initialVarCount]
 * @param {{ minVarCount?: number, maxVarCount?: number }} [opts]
 */
export function useLogicExpressionBuilder(initialVarCount = 2, opts = {}) {
  const minVarCount = opts.minVarCount ?? 1;
  const maxVarCount = opts.maxVarCount ?? 5;

  const [mode, setMode] = useState("builder");
  const [varCount, setVarCountInternal] = useState(
    Math.min(maxVarCount, Math.max(minVarCount, initialVarCount)),
  );
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

  function setVarCount(n) {
    const clamped = Math.min(maxVarCount, Math.max(minVarCount, n));
    setVarCountInternal(clamped);
    const nextVars = varsForCount(clamped);
    setLeft(nextVars[0]);
    setRight(nextVars[1] ?? nextVars[0]);
    setPart2Var(nextVars[2] ?? nextVars[0]);
    if (clamped < 3) setUseCompound(false);
  }

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

  return {
    mode,
    setMode,
    varCount,
    setVarCount,
    op,
    setOp,
    left,
    setLeft,
    right,
    setRight,
    notLeft,
    setNotLeft,
    notRight,
    setNotRight,
    part2Op,
    setPart2Op,
    part2Var,
    setPart2Var,
    useCompound,
    setUseCompound,
    advancedExpr,
    setAdvancedExpr,
    vars,
    builderExpr,
    validation,
    minVarCount,
    maxVarCount,
  };
}

/**
 * @param {{
 *   builder: ReturnType<typeof useLogicExpressionBuilder>,
 *   showVarCount?: boolean,
 *   applyLabel?: string,
 *   onApply?: () => void,
 *   applyDisabled?: boolean,
 * }} props
 */
export function LogicExpressionBuilderPanel({
  builder,
  showVarCount = true,
  applyLabel = "تطبيق",
  onApply,
  applyDisabled,
}) {
  if (!builder) {
    console.error("[LogicExpressionBuilderPanel] missing builder prop");
    return (
      <p className="rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-200" role="alert">
        تعذّر تحميل منشئ التعبير.
      </p>
    );
  }

  const {
    mode,
    setMode,
    varCount,
    setVarCount,
    op,
    setOp,
    left,
    setLeft,
    right,
    setRight,
    notLeft,
    setNotLeft,
    notRight,
    setNotRight,
    part2Op,
    setPart2Op,
    part2Var,
    setPart2Var,
    useCompound,
    setUseCompound,
    advancedExpr,
    setAdvancedExpr,
    vars,
    builderExpr,
    validation,
    minVarCount,
    maxVarCount,
  } = builder;

  const varOptions = [];
  for (let n = minVarCount; n <= maxVarCount; n += 1) varOptions.push(n);

  return (
    <div className="space-y-4">
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

      {showVarCount ? (
        <label className="block">
          <span className="lab-label">عدد المتغيرات</span>
          <select
            className="lab-select mt-1"
            value={varCount}
            onChange={(e) => setVarCount(Number(e.target.value))}
          >
            {varOptions.map((n) => (
              <option key={n} value={n}>
                {n} — ({varsForCount(n).join(", ")})
              </option>
            ))}
          </select>
        </label>
      ) : null}

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

      {!validation?.ok ? (
        <p className="rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-200" role="alert">
          {validation?.error ?? "تعبير غير صالح."}
        </p>
      ) : null}

      {onApply ? (
        <button
          type="button"
          className="edu-btn edu-btn-primary"
          onClick={onApply}
          disabled={applyDisabled ?? !validation?.ok}
        >
          {applyLabel}
        </button>
      ) : null}
    </div>
  );
}
