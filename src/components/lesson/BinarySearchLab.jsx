import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { binarySearchSteps } from "../../lib/algorithms/search.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const DEFAULT_ARRAY = [2, 5, 9, 13, 18, 22, 30];
const DEFAULT_TARGET = 13;

export function BinarySearchLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "binary-search-lab",
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
    () => binarySearchSteps(numbers, Number.isFinite(target) ? target : NaN),
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
        exerciseId: "binary-search-index",
        answer: guessText,
        correct,
        hintsUsed: hints,
      });
    }

    if (correct) {
      setFeedback("إجابة صحيحة ✓ استخدمت البحث الثنائي بنجاح.");
      save({ guessText, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("الإجابة غير صحيحة — راجع تحديث low و high في كل خطوة.");
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
      setFeedback("تلميح 1: تأكد أن القائمة مرتبة تصاعديًا قبل البدء.");
    } else {
      setFeedback("تلميح 2: الموضع الصحيح يظهر في السطر الذي يحتوي «تساوي». راقب mid.");
    }
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4" dir="rtl" data-testid="binary-search-lab">
      <p className="font-bold text-violet-900">مختبر البحث الثنائي</p>
      <p className="mt-1 text-sm text-slate-700">
        أدخل قائمة أعداد وهدفًا، ثم توقّع الموضع في القائمة المرتبة الناتجة.
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
            placeholder="2,5,9,13,18,22,30"
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

      <p className="mt-4 rounded bg-white p-2 text-sm text-slate-700" dir="ltr">
        sorted = [{trace.sorted.join(", ")}]
      </p>

      <div className="mt-3 rounded-lg bg-white p-3 text-sm">
        <p className="font-semibold text-slate-800">سجل خطوات البحث الثنائي:</p>
        <ol className="mt-2 list-decimal space-y-1 pr-5 text-slate-700">
          {trace.steps.map((step, idx) => (
            <li key={`${step.low}-${step.high}-${idx}`}>{step.messageAr}</li>
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

      {feedback ? <p className="mt-3 text-sm font-semibold text-violet-900">{feedback}</p> : null}
    </div>
  );
}
