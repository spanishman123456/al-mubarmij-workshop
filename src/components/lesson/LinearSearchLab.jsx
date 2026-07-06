import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { linearSearchSteps } from "../../lib/algorithms/search.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const DEFAULT_ARRAY = [7, 3, 12, 5, 9, 4];
const DEFAULT_TARGET = 9;

export function LinearSearchLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "linear-search-lab",
  });
  const [arrayText, setArrayText] = useState(DEFAULT_ARRAY.join(","));
  const [targetText, setTargetText] = useState(String(DEFAULT_TARGET));
  const [guessText, setGuessText] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.arrayText) setArrayText(progress.arrayText);
    if (progress.targetText != null) setTargetText(String(progress.targetText));
    if (progress.guessText != null) setGuessText(String(progress.guessText));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const numbers = useMemo(
    () =>
      arrayText
        .split(",")
        .map((x) => Number(String(x).trim()))
        .filter((n) => Number.isFinite(n)),
    [arrayText],
  );
  const target = Number(targetText);
  const trace = useMemo(
    () => linearSearchSteps(numbers, Number.isFinite(target) ? target : NaN),
    [numbers, target],
  );

  const save = useCallback(
    (patch, done = false) => {
      const payload = { arrayText, targetText, guessText, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [arrayText, targetText, guessText, hints, persist, markComplete],
  );

  function checkGuess() {
    const guess = Number(guessText);
    if (!Number.isFinite(guess)) {
      setFeedback("أدخل موضعًا صحيحًا (أو -1).");
      return;
    }

    const correct = guess === trace.foundIndex;
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "linear-search-index",
        answer: guessText,
        correct,
        hintsUsed: hints,
      });
    }

    if (correct) {
      setFeedback("إجابة صحيحة ✓ تتبعت البحث الخطي بشكل ممتاز.");
      save({ guessText, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("الإجابة غير صحيحة — راجع ترتيب الفحص من اليسار إلى اليمين.");
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
      setFeedback("تلميح 1: ابدأ الفحص من الموضع 0 وسجّل كل مقارنة.");
    } else {
      setFeedback("تلميح 2: ابحث في سجل الخطوات عن أول سطر يحتوي «وجدنا».");
    }
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4" dir="rtl" data-testid="linear-search-lab">
      <p className="font-bold text-cyan-900">مختبر البحث الخطي</p>
      <p className="mt-1 text-sm text-slate-700">
        أدخل قائمة أعداد وهدفًا، ثم توقّع موضع الهدف (أو <span dir="ltr">-1</span> إن لم يوجد).
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-semibold">القائمة</span>
          <input
            type="text"
            value={arrayText}
            onChange={(e) => {
              setArrayText(e.target.value);
              save({ arrayText: e.target.value });
            }}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            dir="ltr"
            placeholder="7,3,12,5,9,4"
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold">الهدف</span>
          <input
            type="number"
            value={targetText}
            onChange={(e) => {
              setTargetText(e.target.value);
              save({ targetText: e.target.value });
            }}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="mt-4 rounded-lg bg-white p-3 text-sm">
        <p className="font-semibold text-slate-800">سجل الخطوات:</p>
        <ol className="mt-2 list-decimal space-y-1 pr-5 text-slate-700">
          {trace.steps.map((step, idx) => (
            <li key={`${step.index}-${idx}`}>{step.messageAr}</li>
          ))}
        </ol>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="font-semibold">توقعي للموضع</span>
          <input
            type="number"
            value={guessText}
            onChange={(e) => setGuessText(e.target.value)}
            className="mt-1 w-28 rounded border border-slate-300 px-3 py-2"
            placeholder="-1"
          />
        </label>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkGuess}>
          تحقق
        </button>
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={revealHint}>
          تلميح ({hints}/2)
        </button>
      </div>

      {feedback ? <p className="mt-3 text-sm font-semibold text-cyan-900">{feedback}</p> : null}
    </div>
  );
}
