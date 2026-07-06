import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { sievePrimesUpTo } from "../../lib/algorithms/sieve.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const DEFAULT_LIMIT = 30;

export function SievePrimesLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "sieve-primes-lab",
  });
  const [limitText, setLimitText] = useState(String(DEFAULT_LIMIT));
  const [guessText, setGuessText] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.limitText != null) setLimitText(String(progress.limitText));
    if (progress.guessText != null) setGuessText(String(progress.guessText));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const limit = Number(limitText);
  const run = useMemo(() => sievePrimesUpTo(Number.isFinite(limit) ? limit : 0), [limit]);
  const expected = run.primes.join(",");

  const save = useCallback(
    (patch, done = false) => {
      const payload = { limitText, guessText, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [limitText, guessText, hints, persist, markComplete],
  );

  function checkGuess() {
    const norm = String(guessText || "")
      .split(",")
      .map((x) => String(x).trim())
      .filter(Boolean)
      .join(",");
    const correct = norm === expected;

    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "sieve-primes-list",
        answer: guessText,
        correct,
        hintsUsed: hints,
      });
    }

    if (correct) {
      setFeedback("ممتاز ✓ حددت الأعداد الأولية بشكل صحيح.");
      save({ guessText, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("القائمة غير صحيحة بعد — راجع أعداد الحذف في سجل الغربال.");
      save({ guessText });
    }
  }

  function revealHint() {
    if (hints >= 2) {
      setFeedback(AFTER_MAX_HINTS_AR);
      return;
    }
    const next = hints + 1;
    setHints(next);
    if (next === 1) {
      setFeedback("تلميح 1: ابدأ بالحذف عند 2 ثم 3 ثم 5... وتجاوز الأعداد المحذوفة.");
    } else {
      setFeedback("تلميح 2: لا تنس أن 1 ليس عددًا أوليًا، وابدأ الحذف من p².");
    }
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4" dir="rtl" data-testid="sieve-primes-lab">
      <p className="font-bold text-amber-900">مختبر غربال إراتوستينس</p>
      <p className="mt-1 text-sm text-slate-700">
        حدّد الأعداد الأولية حتى الحد الأعلى، ثم أدخلها مفصولة بفواصل.
      </p>

      <label className="mt-4 block text-sm">
        <span className="font-semibold">الحد الأعلى n</span>
        <input
          type="number"
          value={limitText}
          onChange={(e) => {
            setLimitText(e.target.value);
            save({ limitText: e.target.value });
          }}
          className="mt-1 w-40 rounded border border-slate-300 px-3 py-2"
          min="2"
        />
      </label>

      <div className="mt-4 rounded-lg bg-white p-3 text-sm">
        <p className="font-semibold text-slate-800">سجل خطوات الغربال:</p>
        <ol className="mt-2 list-decimal space-y-1 pr-5 text-slate-700">
          {run.steps.map((step, idx) => (
            <li key={`${step.prime}-${idx}`}>{step.messageAr}</li>
          ))}
        </ol>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="font-semibold">الأعداد الأولية</span>
          <input
            type="text"
            value={guessText}
            onChange={(e) => setGuessText(e.target.value)}
            className="mt-1 w-72 rounded border border-slate-300 px-3 py-2"
            dir="ltr"
            placeholder="2,3,5,7,11"
          />
        </label>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkGuess}>
          تحقق
        </button>
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={revealHint}>
          تلميح ({hints}/2)
        </button>
      </div>

      {feedback ? <p className="mt-3 text-sm font-semibold text-amber-900">{feedback}</p> : null}
    </div>
  );
}
