import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";
import {
  isValidGroup,
  kMapLayout,
  simplifyFromGroups,
  unsimplifiedExpression,
} from "../../lib/logic/karnaugh.js";

const TASK_VALUES = ["0", "0", "0", "1"];
const CORRECT_GROUP = [3];

export function KarnaughMapLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "karnaugh-lab",
  });
  const [values, setValues] = useState(TASK_VALUES);
  const [selected, setSelected] = useState([]);
  const [groups, setGroups] = useState([]);
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  const layout = useMemo(() => kMapLayout(2), []);
  const unsimplified = useMemo(() => unsimplifiedExpression(values, layout), [values, layout]);
  const simplified = useMemo(() => simplifyFromGroups(groups, layout, values), [groups, layout, values]);

  useEffect(() => {
    if (!restored || !progress) return;
    if (Array.isArray(progress.values)) setValues(progress.values);
    if (Array.isArray(progress.groups)) setGroups(progress.groups);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { values, groups, selected, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [values, groups, selected, persist, markComplete],
  );

  function toggleCell(i) {
    setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  function addGroup() {
    if (!isValidGroup(selected, layout, values)) {
      setFeedback("اختر مجموعة مستطيلة من خلايا 1 فقط (حجم 1، 2، أو 4).");
      return;
    }
    const next = [...groups, [...selected].sort((a, b) => a - b)];
    setGroups(next);
    setSelected([]);
    setFeedback("تمت إضافة المجموعة.");
    save({ groups: next, selected: [] });
  }

  function checkTask() {
    const hasCorrect =
      groups.some((g) => g.length === 1 && g[0] === 3) ||
      (groups.length === 1 && groups[0].join() === CORRECT_GROUP.join());
    const ok = hasCorrect;
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "karnaugh-group-ab",
        answer: simplified,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback("ممتاز! بسّطت التعبير من الخريطة (p AND q).");
      save({ completedTask: true }, true);
    } else {
      setFeedback("جمّع الخلية الوحيدة التي قيمتها 1 (A=1,B=1) ثم تحقق من التعبير A·B.");
    }
  }

  function revealHint() {
    if (hints >= 2) {
      setFeedback(AFTER_MAX_HINTS_AR);
      return;
    }
    setHints((h) => h + 1);
    setFeedback(hints === 0 ? "هناك 1 واحدة فقط في الخريطة — عند الزاوية السفلية اليمنى (11)." : "اختر الخلية 11 واضغط «أضف مجموعة».");
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4" dir="rtl" data-testid="karnaugh-map-lab">
      <p className="font-bold text-violet-900">مختبر كارنوف — A AND B</p>
      <p className="mt-1 text-sm text-slate-600">المهمة: جمّع الخلايا ذات القيمة 1 واكتب التعبير المبسّط.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="mx-auto border-collapse text-center text-sm">
          <thead>
            <tr>
              <th className="border border-slate-300 bg-slate-100 p-2">A\B</th>
              <th className="border border-slate-300 bg-slate-100 p-2">0</th>
              <th className="border border-slate-300 bg-slate-100 p-2">1</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1].map((r) => (
              <tr key={r}>
                <th className="border border-slate-300 bg-slate-100 p-2">{r}</th>
                {[0, 1].map((c) => {
                  const idx = r * 2 + c;
                  const on = selected.includes(idx);
                  return (
                    <td key={c} className="border border-slate-300 p-1">
                      <button
                        type="button"
                        data-testid={`kmap-cell-${idx}`}
                        aria-pressed={on}
                        onClick={() => toggleCell(idx)}
                        className={`min-h-[3rem] min-w-[3rem] rounded-lg font-bold transition ${
                          on ? "bg-violet-600 text-white" : values[idx] === "1" ? "bg-emerald-100 text-emerald-900" : "bg-white"
                        }`}
                      >
                        {values[idx]}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-600" dir="ltr">
        غير مبسّط: {unsimplified} → مبسّط: {simplified}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={addGroup}>
          أضف مجموعة
        </button>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkTask}>
          تحقق من التبسيط
        </button>
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={revealHint}>
          تلميح ({hints}/2)
        </button>
      </div>
      {feedback ? <p className="mt-3 text-sm font-semibold text-violet-800">{feedback}</p> : null}
    </div>
  );
}
