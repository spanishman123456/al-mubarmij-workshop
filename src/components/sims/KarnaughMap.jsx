import { useMemo, useState } from "react";
import { LogicExpression } from "./LogicNotation.jsx";
import {
  explainGroup,
  isValidGroup,
  kMapLayout,
  randomKMapValues,
  simplifyFromGroups,
  truthTableToKMap,
  unsimplifiedExpression,
} from "../../lib/logic/karnaugh.js";
import {
  LogicExpressionBuilderPanel,
  useLogicExpressionBuilder,
} from "./LogicExpressionBuilder.jsx";
import { KarnaughGrid } from "../logic/KarnaughGrid.jsx";

const DIFF_VARS = { easy: 2, medium: 3, advanced: 4, expert: 5 };

export function KarnaughMapSim() {
  const [varCount, setVarCount] = useState(2);
  const [allowDontCare, setAllowDontCare] = useState(false);
  const [values, setValues] = useState(() => randomKMapValues(2));
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [groups, setGroups] = useState([]);
  const [importError, setImportError] = useState("");

  const builder = useLogicExpressionBuilder(2, { minVarCount: 2, maxVarCount: 5 });

  const layout = useMemo(() => kMapLayout(varCount), [varCount]);

  const unsimplified = useMemo(
    () => unsimplifiedExpression(values, layout),
    [values, layout],
  );

  const simplified = useMemo(
    () => simplifyFromGroups(groups, layout, values),
    [groups, layout, values],
  );

  function cycleCell(index) {
    setValues((prev) => {
      const next = [...prev];
      const order = allowDontCare ? ["0", "1", "X"] : ["0", "1"];
      const cur = next[index];
      next[index] = order[(order.indexOf(cur) + 1) % order.length];
      return next;
    });
  }

  function randomize() {
    setValues(randomKMapValues(varCount, allowDontCare));
    setGroups([]);
    setSelectedGroup([]);
  }

  function loadFromExpression() {
    const res = truthTableToKMap(builder.builderExpr, varCount);
    if (!res.ok) {
      setImportError(res.error);
      return;
    }
    setImportError("");
    setValues(res.values);
    setGroups([]);
    setSelectedGroup([]);
  }

  function toggleSelect(index) {
    setSelectedGroup((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }

  function addGroup() {
    if (!isValidGroup(selectedGroup, layout, values)) return;
    setGroups((g) => [...g, [...selectedGroup].sort((a, b) => a - b)]);
    setSelectedGroup([]);
  }

  function resetAll() {
    setVarCount(2);
    builder.setVarCount(2);
    setValues(randomKMapValues(2));
    setGroups([]);
    setSelectedGroup([]);
    setImportError("");
  }

  function selectVarCount(n) {
    setVarCount(n);
    builder.setVarCount(n);
    setValues(randomKMapValues(n, allowDontCare));
    setGroups([]);
    setSelectedGroup([]);
    setImportError("");
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap gap-2">
        {Object.entries(DIFF_VARS).map(([key, n]) => (
          <button
            key={key}
            type="button"
            onClick={() => selectVarCount(n)}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
              varCount === n ? "bg-violet-600 text-white" : "bg-slate-700 text-slate-200"
            }`}
          >
            {key === "easy" ? "متغيران" : key === "medium" ? "3" : key === "advanced" ? "4" : "5"}
          </button>
        ))}
        <label className="flex items-center gap-2 text-sm text-cyan-200">
          <input
            type="checkbox"
            checked={allowDontCare}
            onChange={(e) => setAllowDontCare(e.target.checked)}
          />
          Don't Care (X) — متقدم
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="edu-btn edu-btn-outline" onClick={randomize}>
          توليد عشوائي
        </button>
        <button type="button" className="edu-btn edu-btn-outline" onClick={resetAll}>
          إعادة ضبط
        </button>
      </div>

      <div className="rounded-xl border border-slate-600 bg-slate-900/40 p-4">
        <p className="lab-label text-cyan-200">إنشاء من تعبير منطقي</p>
        <div className="mt-3">
          <LogicExpressionBuilderPanel
            builder={builder}
            showVarCount={false}
            applyLabel="تطبيق على الخريطة"
            onApply={loadFromExpression}
          />
        </div>
        {importError ? <p className="mt-2 text-sm text-red-300" role="alert">{importError}</p> : null}
      </div>

      <div className="flex flex-wrap items-start gap-8 justify-center">
        <div>
          <div className="overflow-x-auto">
            <KarnaughGrid
              layout={layout}
              values={values}
              renderCell={({ cell, value }) => {
                const selected = selectedGroup.includes(cell.index);
                const inGroup = groups.some((group) => group.includes(cell.index));
                return (
                  <button
                    type="button"
                    onClick={() => toggleSelect(cell.index)}
                    className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 text-lg font-bold transition sm:h-16 sm:w-16 ${
                      selected || inGroup
                        ? "border-cyan-400 ring-2 ring-cyan-400/50"
                        : value === "1"
                          ? "border-emerald-400 bg-emerald-900/50 text-emerald-300"
                          : value === "X"
                            ? "border-amber-400 bg-amber-900/40 text-amber-200"
                            : "border-slate-600 bg-slate-800 text-slate-500"
                    }`}
                    onDoubleClick={() => cycleCell(cell.index)}
                    title="نقرة = تحديد مجموعة — نقرتان = تغيير القيمة"
                  >
                    {value}
                  </button>
                );
              }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">Gray Code — انقر مرتين لتغيير 0/1/X</p>
        </div>

        <div className="max-w-sm space-y-3">
          <div>
            <p className="font-bold text-violet-300">قبل التبسيط:</p>
            <div className="lab-result mt-1 text-sm">
              <span className="logic-kmap-result">
                <span className="logic-kmap-result__prefix">F =</span>
                <LogicExpression expr={unsimplified} size="lg" />
              </span>
            </div>
          </div>
          <div>
            <p className="font-bold text-emerald-300">بعد التبسيط:</p>
            <div className="lab-result mt-1 text-sm">
              <span className="logic-kmap-result">
                <span className="logic-kmap-result__prefix">F =</span>
                <LogicExpression expr={simplified} size="lg" />
              </span>
            </div>
          </div>
          <button
            type="button"
            className="edu-btn edu-btn-outline w-full"
            disabled={!selectedGroup.length}
            onClick={addGroup}
          >
            إضافة مجموعة ({selectedGroup.length} خلايا)
          </button>
          {groups.length ? (
            <ul className="space-y-1 text-sm text-slate-300">
              {groups.map((g, i) => (
                <li key={i} className="rounded-lg bg-slate-800/60 px-2 py-1">
                  {explainGroup(g, layout)}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
