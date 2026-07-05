import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";

function countdownSteps(n) {
  const rows = [{ step: 0, n, action: "start" }];
  let x = n;
  let s = 0;
  while (x > 0) {
    s += 1;
    x -= 1;
    rows.push({ step: s, n: x, action: "n -= 1" });
  }
  return rows;
}

export function NumbersStepsLab({ lessonId, userId, defaultN = 8 }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "numbers-steps-lab",
  });

  const [n, setN] = useState(defaultN);
  const [guess, setGuess] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState("");

  const rows = useMemo(() => countdownSteps(n), [n]);
  const expectedSteps = n;

  useEffect(() => {
    if (!restored || !progress) return;
    if (typeof progress.n === "number") setN(progress.n);
    if (progress.guess) setGuess(progress.guess);
    if (typeof progress.hintsUsed === "number") setHintsUsed(progress.hintsUsed);
    if (progress.feedback) setFeedback(progress.feedback);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { n, guess, hintsUsed, expectedSteps, feedback, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [n, guess, hintsUsed, expectedSteps, feedback, persist, markComplete],
  );

  function check() {
    const val = Number(guess);
    const ok = val === expectedSteps;
    const msg = ok ? `✓ ${expectedSteps} خطوات` : `✗ المتوقع ${expectedSteps} خطوات`;
    setFeedback(msg);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "numbers-steps-count",
        answer: guess,
        correct: ok,
        hintsUsed,
      });
    }
    save({ feedback: msg, guess, lastOk: ok }, ok);
    return ok;
  }

  function hint() {
    const h = hintsUsed + 1;
    setHintsUsed(h);
    const msg =
      h === 1
        ? "تلميح: كل تكرار يطرح 1 من n."
        : h === 2
          ? `تلميح: n=${n} يعني ${n} خطوات.`
          : `الإجابة: ${expectedSteps}`;
    setFeedback(msg);
    save({ hintsUsed: h, feedback: msg });
  }

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4" dir="rtl">
      <p className="font-bold text-sky-900">نشاط الأرقام والخطوات — عدّ تنازلي (ليس Collatz)</p>
      <p className="mt-1 text-xs text-slate-600">من n إلى 0 بطرح 1 في كل خطوة</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <label className="text-sm">
          n =
          <input
            type="number"
            min={1}
            max={20}
            className="mr-2 w-20 rounded border px-2 py-1 font-mono"
            value={n}
            onChange={(e) => {
              const v = Number(e.target.value) || 1;
              setN(v);
              save({ n: v });
            }}
          />
        </label>
        <input
          className="w-24 rounded border px-2 py-1 font-mono"
          placeholder="عدد الخطوات"
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            save({ guess: e.target.value });
          }}
        />
        <button type="button" className="edu-btn text-sm" onClick={hint}>
          تلميح ({hintsUsed})
        </button>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={check}>
          تحقق
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">#</th>
              <th className="p-2">n</th>
              <th className="p-2">عملية</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.step}>
                <td className="p-2 text-center">{r.step}</td>
                <td className="p-2 text-center font-mono" dir="ltr">
                  {r.n}
                </td>
                <td className="p-2 text-center font-mono" dir="ltr">
                  {r.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {feedback ? <p className="mt-2 text-sm font-semibold">{feedback}</p> : null}
    </div>
  );
}
