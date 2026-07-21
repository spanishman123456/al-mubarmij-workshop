import { useMemo, useState } from "react";
import {
  generateDrill,
  LOGIC_OPS,
  validateDrillAnswers,
} from "../../lib/logic/truthTableDrills.js";
import { displayVarsForCount, toDisplayLogicExpression } from "../../lib/logic/variables.js";
import { TechnicalTable } from "../BilingualTextBlocks.jsx";
import { LogicExpression, LogicTableHeader } from "./LogicNotation.jsx";

const LEVEL_LABELS = { easy: "سهل", medium: "متوسط", advanced: "متقدم" };

export function TruthTableExercises() {
  const [level, setLevel] = useState("easy");
  const [mode, setMode] = useState("random");
  const [chosenOp, setChosenOp] = useState("AND");
  const [drill, setDrill] = useState(() => generateDrill("easy"));
  const [answers, setAnswers] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const result = useMemo(
    () => (attempted ? validateDrillAnswers(drill, answers) : null),
    [attempted, drill, answers],
  );

  function newDrill(nextLevel = level, nextMode = mode) {
    setDrill(
      generateDrill(nextLevel, {
        mode: nextMode,
        op: nextMode === "manual" ? chosenOp : undefined,
      }),
    );
    setAnswers({});
    setAttempted(false);
    setHintsUsed(0);
  }

  function check() {
    setAttempted(true);
    setAttempts((a) => a + 1);
  }

  const answerCols = drill.answerColumns;
  const displayVariables = displayVarsForCount(drill.variables.length);
  const colLabels = {
    ...Object.fromEntries(
      drill.intermediateColumns.map((column) => [
        column.id,
        toDisplayLogicExpression(column.label),
      ]),
    ),
    result: "V",
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-wrap gap-2">
        {Object.keys(LEVEL_LABELS).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLevel(l);
              newDrill(l, mode);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
              level === l ? "bg-violet-600 text-white" : "bg-slate-700 text-slate-100 hover:bg-slate-600"
            }`}
          >
            {LEVEL_LABELS[l]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-600 bg-slate-900/50 p-4">
        <label className="block">
          <span className="lab-label text-cyan-200">نوع التمرين</span>
          <select
            className="lab-select mt-1"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              newDrill(level, e.target.value);
            }}
          >
            <option value="random">سؤال عشوائي</option>
            <option value="manual">اختيار يدوي</option>
          </select>
        </label>
        {mode === "manual" ? (
          <label className="block">
            <span className="lab-label text-cyan-200">العملية</span>
            <select
              className="lab-select mt-1"
              value={chosenOp}
              onChange={(e) => setChosenOp(e.target.value)}
            >
              {LOGIC_OPS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button type="button" className="edu-btn edu-btn-outline" onClick={() => newDrill()}>
          تمرين جديد
        </button>
        {mode === "manual" ? (
          <button
            type="button"
            className="edu-btn edu-btn-primary"
            onClick={() => newDrill(level, "manual")}
          >
            تطبيق الاختيار
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border border-violet-500/40 bg-violet-950/30 p-4">
        <p className="text-lg font-bold text-white">
          أكمل جدول الحقيقة للتعبير:
        </p>
        <div className="mt-1 text-base text-cyan-200">
          <LogicExpression expr={toDisplayLogicExpression(drill.expr)} />
        </div>
        <p className="mt-2 text-sm text-slate-300">
          المتغيرات: <span dir="ltr">{displayVariables.join(", ")}</span> — {drill.rows.length} صف
        </p>
      </div>

      <div className="overflow-x-auto">
        <TechnicalTable className="w-full min-w-[320px] border-collapse text-center text-sm">
          <thead>
            <tr className="bg-slate-800">
              {drill.variables.map((v, index) => (
                <th key={v} className="border border-slate-600 px-3 py-2 text-cyan-300">
                  {displayVariables[index]}
                </th>
              ))}
              {answerCols.map((col) => (
                <th key={col} className="border border-slate-600 px-3 py-2 text-violet-300">
                  <LogicTableHeader label={colLabels[col] ?? col} size="sm" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drill.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 ? "bg-slate-900/60" : "bg-slate-900/30"}>
                {drill.variables.map((v) => (
                  <td key={v} className="border border-slate-600 px-3 py-2 font-mono text-white">
                    {row[v]}
                  </td>
                ))}
                {answerCols.map((col) => {
                  const key = `${rowIdx}-${col}`;
                  const expected = String(row[col]);
                  const given = answers[key] ?? "";
                  const showResult = attempted && given !== "";
                  const ok = given === expected;
                  return (
                    <td key={col} className="border border-slate-600 px-2 py-2">
                      <select
                        className="edu-select edu-select-compact w-full min-w-[4rem] bg-slate-800 text-white"
                        value={given}
                        onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.value }))}
                        disabled={attempted}
                        aria-label={`صف ${rowIdx + 1} عمود ${colLabels[col] ?? col}`}
                      >
                        <option value="">؟</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                      </select>
                      {showResult ? (
                        <span className={`mt-1 block text-xs ${ok ? "text-emerald-400" : "text-red-400"}`}>
                          {ok ? "✓" : "✗"}
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </TechnicalTable>
      </div>

      <div className="flex flex-wrap gap-2">
        {!attempted ? (
          <>
            <button type="button" className="edu-btn edu-btn-primary" onClick={check}>
              تحقق من الإجابة
            </button>
            <button
              type="button"
              className="edu-btn edu-btn-outline"
              disabled={hintsUsed >= drill.hints.length}
              onClick={() => setHintsUsed((h) => h + 1)}
            >
              تلميح ({hintsUsed}/{drill.hints.length})
            </button>
          </>
        ) : (
          <button type="button" className="edu-btn edu-btn-primary" onClick={() => newDrill()}>
            تمرين جديد
          </button>
        )}
      </div>

      {hintsUsed > 0 && !attempted ? (
        <ul className="list-disc space-y-1 pr-5 text-sm text-amber-200">
          {drill.hints.slice(0, hintsUsed).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ) : null}

      {attempted && result ? (
        <div className="rounded-xl border border-slate-600 bg-slate-900/60 p-4 text-sm">
          <p className={`text-base font-bold ${result.allCorrect ? "text-emerald-400" : "text-amber-300"}`}>
            {result.allCorrect
              ? "ممتاز! جميع الإجابات صحيحة."
              : `صحيح: ${result.correct} — خطأ: ${result.wrong}`}
          </p>
          <p className="mt-2 text-slate-300">عدد المحاولات: {attempts}</p>
          <details className="mt-3">
            <summary className="cursor-pointer font-semibold text-violet-300">شرح الحل</summary>
            <div className="mt-2 text-slate-300">
              <LogicExpression expr={toDisplayLogicExpression(drill.expr)} />
            </div>
            <ul className="mt-2 list-disc pr-5 text-slate-400">
              {drill.hints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </details>
        </div>
      ) : null}
    </div>
  );
}
