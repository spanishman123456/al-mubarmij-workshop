import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";

function divisorsOf(n) {
  const out = [];
  for (let i = 1; i <= n; i += 1) {
    if (n % i === 0) out.push(i);
  }
  return out;
}

export function DivisorsLab({ lessonId, userId, defaultN = 12 }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "divisors-lab",
  });

  const [n, setN] = useState(defaultN);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);

  const expected = useMemo(() => divisorsOf(n), [n]);

  useEffect(() => {
    if (!restored || !progress) return;
    if (typeof progress.n === "number") setN(progress.n);
    if (progress.studentAnswer) setStudentAnswer(progress.studentAnswer);
    if (typeof progress.hintsUsed === "number") setHintsUsed(progress.hintsUsed);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { n, studentAnswer, hintsUsed, expected, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [n, studentAnswer, hintsUsed, expected, persist, markComplete],
  );

  function check() {
    const parsed = studentAnswer
      .split(/[,،\s]+/)
      .map((x) => Number(x.trim()))
      .filter((x) => !Number.isNaN(x));
    const ok =
      parsed.length === expected.length && expected.every((d, i) => parsed[i] === d);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "divisors-list",
        answer: studentAnswer,
        correct: ok,
        hintsUsed,
      });
    }
    save({ lastResult: ok ? "correct" : "wrong", parsed }, ok);
    return ok;
  }

  function hint() {
    setHintsUsed((h) => h + 1);
    save({ hintsUsed: hintsUsed + 1, hintShown: expected.slice(0, Math.min(hintsUsed + 1, expected.length)) });
  }

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4" dir="rtl">
      <p className="font-bold text-teal-900">نشاط المقسومات — n = {n}</p>
      <p className="mt-1 text-xs text-slate-600">اكتب المقسومات مفصولة بفاصلة (مثال: 1,2,3,4,6,12)</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          type="number"
          min={2}
          max={100}
          className="w-24 rounded border px-2 py-1 font-mono"
          value={n}
          onChange={(e) => {
            const v = Number(e.target.value) || 2;
            setN(v);
            save({ n: v });
          }}
        />
        <input
          className="min-w-[200px] flex-1 rounded border px-2 py-1 font-mono text-sm"
          dir="ltr"
          value={studentAnswer}
          onChange={(e) => {
            setStudentAnswer(e.target.value);
            save({ studentAnswer: e.target.value });
          }}
          placeholder="1,2,3,..."
        />
        <button type="button" className="edu-btn text-sm" onClick={hint}>
          تلميح
        </button>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={check}>
          تحقق
        </button>
      </div>

      {progress?.hintShown ? (
        <p className="mt-2 text-sm text-teal-800">تلميح: {progress.hintShown.join("، ")} …</p>
      ) : null}
      {progress?.lastResult ? (
        <p className="mt-2 text-sm font-semibold">{progress.lastResult === "correct" ? "✓ صحيح" : "✗ راجع القائمة"}</p>
      ) : null}
    </div>
  );
}
