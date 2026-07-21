import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";

function collatzSteps(n) {
  const steps = [{ n, rule: "start" }];
  let x = n;
  while (x !== 1) {
    if (x % 2 === 0) {
      x = x / 2;
      steps.push({ n: x, rule: "n/2" });
    } else {
      x = 3 * x + 1;
      steps.push({ n: x, rule: "3n+1" });
    }
    if (steps.length > 200) break;
  }
  return steps;
}

export function CollatzSimulator({ lessonId, userId, initialN = 6 }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "collatz-sim",
  });

  const [n, setN] = useState(initialN);
  const [stepIdx, setStepIdx] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const steps = useMemo(() => collatzSteps(n), [n]);
  const current = steps[stepIdx];

  useEffect(() => {
    if (!restored || !progress) return;
    if (typeof progress.n === "number") setN(progress.n);
    if (typeof progress.stepIdx === "number") setStepIdx(progress.stepIdx);
    if (typeof progress.hintsUsed === "number") setHintsUsed(progress.hintsUsed);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { n, stepIdx, hintsUsed, stepCount: steps.length - 1, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [n, stepIdx, hintsUsed, steps.length, persist, markComplete],
  );

  function nextStep() {
    const next = Math.min(stepIdx + 1, steps.length - 1);
    setStepIdx(next);
    save({ stepIdx: next });
  }

  function checkSteps() {
    const ok = steps.length - 1 === 8 && n === 6;
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "collatz-steps",
        answer: String(steps.length - 1),
        correct: ok,
        hintsUsed,
      });
    }
    save({ verified: ok }, ok);
    return ok;
  }

  function hint() {
    const h = hintsUsed + 1;
    setHintsUsed(h);
    save({ hintsUsed: h });
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4" dir="rtl">
      <p className="font-bold text-amber-900">محاكاة Collatz — تتبّع القيم</p>
      <p className="mt-1 text-xs text-slate-600">
        n = {n} · الخطوة {stepIdx + 1}/{steps.length} · عدد الخطوات حتى 1: {steps.length - 1}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <label className="text-sm">
          ابدأ من:
          <input
            type="number"
            min={1}
            max={99}
            className="mr-2 w-20 rounded border px-2 py-1 font-mono"
            value={n}
            onChange={(e) => {
              const v = Number(e.target.value) || 1;
              setN(v);
              setStepIdx(0);
              save({ n: v, stepIdx: 0 });
            }}
          />
        </label>
        <button type="button" className="edu-btn text-sm" onClick={nextStep}>
          خطوة تالية
        </button>
        <button type="button" className="edu-btn text-sm" onClick={hint}>
          تلميح ({hintsUsed})
        </button>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkSteps}>
          تحقق (n=6 → 8 خطوات)
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[240px] text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">#</th>
              <th className="p-2">n</th>
              <th className="p-2">قاعدة</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => (
              <tr key={i} className={i === stepIdx ? "bg-amber-100 font-bold" : i % 2 ? "bg-slate-50" : ""}>
                <td className="p-2 text-center">{i}</td>
                <td className="p-2 text-center font-mono" dir="ltr">
                  {s.n}
                </td>
                <td className="p-2 text-center font-mono" dir="ltr">
                  {s.rule}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {current ? (
        <p className="mt-3 text-sm">
          الحالي: <span className="font-mono font-bold" dir="ltr">{current.n}</span>
          {current.rule !== "start" ? ` (${current.rule})` : ""}
        </p>
      ) : null}
    </div>
  );
}
