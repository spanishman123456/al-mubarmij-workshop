import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const DEFAULT_ARRAY = [8, 3, 6, 1, 9];

function selectionSortTrace(list) {
  const arr = [...list];
  const steps = [];
  for (let i = 0; i < arr.length - 1; i += 1) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j += 1) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    steps.push({
      pass: i + 1,
      minIdx,
      snapshot: [...arr],
      messageAr: `الدورة ${i + 1}: وضعنا أصغر عنصر في الموضع ${i} → [${arr.join(", ")}]`,
    });
  }
  return { sorted: arr, steps };
}

export function SelectionSortLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "selection-sort-lab",
  });
  const [arrayText, setArrayText] = useState(DEFAULT_ARRAY.join(","));
  const [guessText, setGuessText] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.arrayText) setArrayText(progress.arrayText);
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
  const trace = useMemo(() => selectionSortTrace(numbers), [numbers]);
  const expected = trace.sorted.join(",");

  const save = useCallback(
    (patch, done = false) => {
      const payload = { arrayText, guessText, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [arrayText, guessText, hints, persist, markComplete],
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
        exerciseId: "selection-sort-result",
        answer: guessText,
        correct,
        hintsUsed: hints,
      });
    }

    if (correct) {
      setFeedback("إجابة صحيحة ✓ فرز الاختيار مكتمل.");
      save({ guessText, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("الترتيب غير صحيح بعد — راجع خطوات كل دورة في السجل.");
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
      setFeedback("تلميح 1: في كل دورة ثبت عنصرًا واحدًا فقط في بدايات القائمة.");
    } else {
      setFeedback("تلميح 2: الناتج النهائي يجب أن يكون تصاعديًا من الأصغر إلى الأكبر.");
    }
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4" dir="rtl" data-testid="selection-sort-lab">
      <p className="font-bold text-emerald-900">مختبر فرز الاختيار</p>
      <p className="mt-1 text-sm text-slate-700">
        أدخل قائمة أعداد، ثم توقّع الناتج النهائي بعد تطبيق <span dir="ltr">Selection Sort</span>.
      </p>

      <label className="mt-4 block text-sm">
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
          placeholder="8,3,6,1,9"
        />
      </label>

      <div className="mt-4 rounded-lg bg-white p-3 text-sm">
        <p className="font-semibold text-slate-800">سجل الدورات:</p>
        <ol className="mt-2 list-decimal space-y-1 pr-5 text-slate-700">
          {trace.steps.map((step) => (
            <li key={step.pass}>{step.messageAr}</li>
          ))}
        </ol>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="font-semibold">الناتج النهائي (مفصول بفواصل)</span>
          <input
            type="text"
            value={guessText}
            onChange={(e) => setGuessText(e.target.value)}
            className="mt-1 w-64 rounded border border-slate-300 px-3 py-2"
            dir="ltr"
            placeholder="1,3,6,8,9"
          />
        </label>
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkGuess}>
          تحقق
        </button>
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={revealHint}>
          تلميح ({hints}/2)
        </button>
      </div>

      {feedback ? <p className="mt-3 text-sm font-semibold text-emerald-900">{feedback}</p> : null}
    </div>
  );
}
