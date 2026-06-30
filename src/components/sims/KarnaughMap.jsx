import { useMemo, useState } from "react";
import {
  explainGroup,
  isValidGroup,
  kMapLayout,
  randomKMapValues,
  simplifyFromGroups,
  truthTableToKMap,
  unsimplifiedExpression,
} from "../../lib/logic/karnaugh.js";
import { varsForCount } from "../../lib/logic/variables.js";

const DIFF_VARS = { easy: 2, medium: 3, advanced: 4, expert: 5 };

export function KarnaughMapSim() {
  const [varCount, setVarCount] = useState(2);
  const [allowDontCare, setAllowDontCare] = useState(false);
  const [values, setValues] = useState(() => randomKMapValues(2));
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [groups, setGroups] = useState([]);
  const [exprInput, setExprInput] = useState("p AND q");
  const [importError, setImportError] = useState("");

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

  function loadFromTruthTable() {
    const res = truthTableToKMap(exprInput, varCount);
    if (!res.ok) {
      setImportError(res.error);
      return;
    }
    setImportError("");
    setValues(res.values);
    setGroups([]);
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
    setValues(randomKMapValues(2));
    setGroups([]);
    setSelectedGroup([]);
    setImportError("");
  }

  const grid = useMemo(() => {
    const rows = layout.rowLabels.length;
    const cols = layout.colLabels.length;
    /** @type {string[][]} */
    const g = Array.from({ length: rows }, () => Array(cols).fill("0"));
    layout.cells.forEach((cell) => {
      g[cell.row][cell.col] = values[cell.index] ?? "0";
    });
    return g;
  }, [layout, values]);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap gap-2">
        {Object.entries(DIFF_VARS).map(([key, n]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setVarCount(n);
              setValues(randomKMapValues(n, allowDontCare));
              setGroups([]);
            }}
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

      <div className="rounded-xl border border-slate-600 bg-slate-900/40 p-3">
        <p className="lab-label text-cyan-200">إنشاء من جدول حقيقة (تعبير منطقي)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            className="lab-input flex-1 font-mono"
            dir="ltr"
            value={exprInput}
            onChange={(e) => setExprInput(e.target.value)}
            placeholder={`مثال: (${varsForCount(varCount).join(" AND ")})`}
          />
          <button type="button" className="edu-btn edu-btn-primary" onClick={loadFromTruthTable}>
            تطبيق
          </button>
        </div>
        {importError ? <p className="mt-2 text-sm text-red-300">{importError}</p> : null}
      </div>

      <div className="flex flex-wrap items-start gap-8 justify-center">
        <div>
          <div className="mb-2 flex justify-center gap-6 text-xs text-cyan-300">
            {layout.colLabels.map((l) => (
              <span key={l}>
                {layout.colVars.map((v, i) => `${v}=${l[layout.colBits - 1 - i]}`).join(" ")}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col justify-around text-xs text-cyan-300">
              {layout.rowLabels.map((l) => (
                <span key={l}>
                  {layout.rowVars.map((v, i) => `${v}=${l[layout.rowBits - 1 - i]}`).join(" ")}
                </span>
              ))}
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${layout.colLabels.length}, minmax(0, 1fr))` }}
            >
              {grid.flatMap((row, r) =>
                row.map((v, c) => {
                  const cell = layout.cells.find((x) => x.row === r && x.col === c);
                  const idx = cell?.index ?? 0;
                  const selected = selectedGroup.includes(idx);
                  const inGroup = groups.some((g) => g.includes(idx));
                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => toggleSelect(idx)}
                      className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 text-lg font-bold transition sm:h-16 sm:w-16 ${
                        selected || inGroup
                          ? "border-cyan-400 ring-2 ring-cyan-400/50"
                          : v === "1"
                            ? "border-emerald-400 bg-emerald-900/50 text-emerald-300"
                            : v === "X"
                              ? "border-amber-400 bg-amber-900/40 text-amber-200"
                              : "border-slate-600 bg-slate-800 text-slate-500"
                      }`}
                      onDoubleClick={() => cycleCell(idx)}
                      title="نقرة = تحديد مجموعة — نقرتان = تغيير القيمة"
                    >
                      {v}
                    </button>
                  );
                }),
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Gray Code — انقر مرتين لتغيير 0/1/X</p>
        </div>

        <div className="max-w-sm space-y-3">
          <div>
            <p className="font-bold text-violet-300">قبل التبسيط:</p>
            <div className="lab-result mt-1 text-sm" dir="ltr">
              F = {unsimplified}
            </div>
          </div>
          <div>
            <p className="font-bold text-emerald-300">بعد التبسيط:</p>
            <div className="lab-result mt-1 text-sm" dir="ltr">
              F = {simplified}
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
