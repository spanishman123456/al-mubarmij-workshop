import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";

const DEFAULT_GRID = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export function MultiDimGridLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "multi-dim-grid",
  });

  const [grid, setGrid] = useState(DEFAULT_GRID);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [editVal, setEditVal] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (Array.isArray(progress.grid)) setGrid(progress.grid);
    if (typeof progress.row === "number") setRow(progress.row);
    if (typeof progress.col === "number") setCol(progress.col);
  }, [restored, progress]);

  const selected = grid[row]?.[col];

  const save = useCallback(
    (patch, done = false) => {
      const payload = { grid, row, col, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [grid, row, col, persist, markComplete],
  );

  function applyEdit() {
    const val = Number(editVal);
    if (Number.isNaN(val)) return;
    const next = grid.map((r, ri) => r.map((c, ci) => (ri === row && ci === col ? val : c)));
    setGrid(next);
    setEditVal("");
    save({ grid: next });
  }

  function checkAccess() {
    const ok = selected === grid[0][1];
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "multi-dim-access",
        answer: `m[${row}][${col}]=${selected}`,
        correct: ok,
      });
    }
    save({ lastCheck: ok ? "correct" : "wrong" }, ok);
    return ok;
  }

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4" dir="rtl">
      <p className="font-bold text-indigo-900">مصفوفة ثنائية الأبعاد — اختر صفاً وعموداً</p>
      <p className="mt-1 text-xs text-slate-600">
        الصف {row + 1} من {rows} · العمود {col + 1} من {cols} · القيمة: <strong dir="ltr">{selected}</strong>
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="mx-auto border-collapse text-center" role="grid" aria-label="مصفوفة ثنائية الأبعاد">
          <thead>
            <tr>
              <th className="p-1 text-xs text-slate-500">#</th>
              {grid[0].map((_, ci) => (
                <th key={ci} className="p-1 text-xs text-slate-500" scope="col">
                  col {ci}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((r, ri) => (
              <tr key={ri}>
                <th className="p-1 text-xs text-slate-500" scope="row">
                  row {ri}
                </th>
                {r.map((val, ci) => {
                  const active = ri === row && ci === col;
                  return (
                    <td key={ci} className="p-1">
                      <button
                        type="button"
                        aria-pressed={active}
                        aria-label={`صف ${ri} عمود ${ci} قيمة ${val}`}
                        className={`h-10 w-10 rounded-lg border-2 font-mono text-sm font-bold ${
                          active ? "border-indigo-600 bg-indigo-100" : "border-slate-200 bg-white"
                        }`}
                        onClick={() => {
                          setRow(ri);
                          setCol(ci);
                          save({ row: ri, col: ci });
                        }}
                      >
                        {val}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-sm">
          تعديل m[row][col]:
          <input
            className="mr-2 rounded border px-2 py-1 font-mono text-sm"
            dir="ltr"
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            placeholder={String(selected)}
          />
        </label>
        <button type="button" className="edu-btn text-sm" onClick={applyEdit}>
          تطبيق
        </button>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkAccess}>
          هل m[0][1] = {grid[0][1]}؟
        </button>
      </div>
      {progress?.lastCheck ? (
        <p className="mt-2 text-sm font-semibold">{progress.lastCheck === "correct" ? "✓ صحيح" : "جرّب m[0][1]"}</p>
      ) : null}
    </div>
  );
}
