import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { fcfsSchedule, roundMetric } from "../../lib/algorithms/cpuScheduling.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const PRESET = [
  { id: "P1", arrival: 0, burst: 3 },
  { id: "P2", arrival: 1, burst: 2 },
  { id: "P3", arrival: 2, burst: 1 },
];

export function CpuSchedulingLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "cpu-scheduling-lab",
  });
  const [guessWait, setGuessWait] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.guessWait != null) setGuessWait(String(progress.guessWait));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const schedule = useMemo(() => fcfsSchedule(PRESET), []);
  const expectedWait = roundMetric(schedule.avgWait, 2);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { guessWait, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [guessWait, hints, persist, markComplete],
  );

  function checkGuess() {
    const guess = Number(guessWait);
    const ok = Number.isFinite(guess) && Math.abs(guess - expectedWait) < 0.05;
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "fcfs-avg-wait",
        answer: guessWait,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback(`صحيح ✓ متوسط الانتظار FCFS = ${expectedWait}`);
      save({ guessWait, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("راجع جدول التتبع — احسب انتظار كل عملية ثم المتوسط.");
      save({ guessWait });
    }
  }

  function revealHint() {
    if (hints >= 2) {
      setFeedback(AFTER_MAX_HINTS_AR);
      return;
    }
    const next = hints + 1;
    setHints(next);
    setFeedback(
      next === 1
        ? "تلميح 1: انتظار = وقت البداية − وقت الوصول."
        : `تلميح 2: أوقات انتظار P1,P2,P3 هي ${schedule.results.map((r) => r.wait).join("، ")}`,
    );
    save({ hints: next });
  }

  return (
    <div id="lab" className="rounded-xl border border-amber-200 bg-amber-50/40 p-4" dir="rtl" data-testid="cpu-scheduling-lab">
      <p className="font-bold text-amber-900">مختبر جدولة FCFS</p>
      <p className="mt-1 text-sm text-slate-700">
        العمليات: P1(وصول 0، خدمة 3) · P2(1، 2) · P3(2، 1). احسب متوسط وقت الانتظار.
      </p>

      <div className="mt-4 overflow-x-auto rounded-lg bg-white p-2 text-sm" dir="ltr">
        <table className="w-full min-w-[420px] border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-2">Process</th>
              <th className="border p-2">Arrival</th>
              <th className="border p-2">Burst</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">Finish</th>
              <th className="border p-2">Wait</th>
            </tr>
          </thead>
          <tbody>
            {schedule.results.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.id}</td>
                <td className="border p-2">{r.arrival}</td>
                <td className="border p-2">{r.burst}</td>
                <td className="border p-2">{r.start}</td>
                <td className="border p-2">{r.finish}</td>
                <td className="border p-2 font-semibold">{r.wait}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap gap-1 text-xs" dir="ltr">
        {schedule.timeline.map((t, i) => (
          <span key={i} className="rounded bg-amber-100 px-2 py-1">
            t={t.time}:{t.processId ?? "idle"}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="font-semibold">متوسط الانتظار</span>
          <input
            type="text"
            value={guessWait}
            onChange={(e) => {
              setGuessWait(e.target.value);
              save({ guessWait: e.target.value });
            }}
            className="mt-1 block w-32 rounded border border-slate-300 px-3 py-2"
            dir="ltr"
            placeholder="1.67"
          />
        </label>
        <button type="button" onClick={checkGuess} className="edu-btn edu-btn-primary text-sm">
          تحقق
        </button>
        <button type="button" onClick={revealHint} className="edu-btn edu-btn-outline text-sm">
          تلميح ({hints}/2)
        </button>
      </div>
      {feedback ? <p className="mt-3 text-sm font-semibold text-slate-800">{feedback}</p> : null}
    </div>
  );
}
