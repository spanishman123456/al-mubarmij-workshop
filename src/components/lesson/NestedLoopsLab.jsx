import { useCallback, useEffect, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";

const N = 4;

function expectedGrid() {
  const g = [];
  for (let i = 0; i < N; i += 1) {
    const row = [];
    for (let j = 0; j < N; j += 1) row.push(i * j);
    g.push(row);
  }
  return g;
}

export function NestedLoopsLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "nested-loops-lab",
  });
  const [grid, setGrid] = useState(() => Array.from({ length: N }, () => Array(N).fill("")));
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress?.grid) return;
    setGrid(progress.grid);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { grid, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [grid, persist, markComplete],
  );

  function setCell(i, j, val) {
    const next = grid.map((row, ri) => row.map((c, ci) => (ri === i && ci === j ? val : c)));
    setGrid(next);
    save({ grid: next });
  }

  function fillRow(i) {
    const next = grid.map((row, ri) =>
      ri === i ? row.map((_, j) => String(i * j)) : row,
    );
    setGrid(next);
    save({ grid: next });
  }

  function checkAll() {
    const exp = expectedGrid();
    const ok = exp.every((row, i) => row.every((v, j) => String(v) === String(grid[i][j]).trim()));
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "nested-grid-4",
        answer: JSON.stringify(grid),
        correct: ok,
      });
    }
    if (ok) {
      setFeedback("ممتاز! أكملت جدول i×j لـ 4×4.");
      save({ grid }, true);
    } else {
      setFeedback("تحقق: الصف i يحتوي i×0, i×1, … — مثلاً الصف 2: 0, 2, 4, 6.");
    }
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4" dir="rtl" data-testid="nested-loops-lab">
      <p className="font-bold text-emerald-900">مختبر الحلقات المتداخلة — جدول i×j</p>
      <p className="mt-1 text-sm text-slate-600">املأ كل خلية بالقيمة i×j (i=صف، j=عمود).</p>

      <div className="mt-4 overflow-x-auto">
        <table className="mx-auto border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-300 bg-slate-100 p-2">i\j</th>
              {Array.from({ length: N }, (_, j) => (
                <th key={j} className="border border-slate-300 bg-slate-100 p-2">
                  {j}
                </th>
              ))}
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {grid.map((row, i) => (
              <tr key={i}>
                <th className="border border-slate-300 bg-slate-100 p-2">{i}</th>
                {row.map((cell, j) => (
                  <td key={j} className="border border-slate-300 p-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-12 rounded border px-1 py-1 text-center"
                      value={cell}
                      onChange={(e) => setCell(i, j, e.target.value)}
                      aria-label={`صف ${i} عمود ${j}`}
                    />
                  </td>
                ))}
                <td className="p-1">
                  <button type="button" className="text-xs font-semibold text-violet-700" onClick={() => fillRow(i)}>
                    املأ الصف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" className="edu-btn edu-btn-primary mt-4 text-sm" onClick={checkAll}>
        تحقق من الجدول كاملًا
      </button>
      {feedback ? <p className="mt-3 text-sm font-semibold text-emerald-900">{feedback}</p> : null}
    </div>
  );
}
