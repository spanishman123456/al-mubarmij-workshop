import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { caesarSteps, caesarTransform } from "../../lib/logic/caesarCipher.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const DEFAULT_MSG = "HELLO";
const DEFAULT_SHIFT = 3;

export function CaesarCipherLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "caesar-cipher-lab",
  });
  const [message, setMessage] = useState(DEFAULT_MSG);
  const [shiftText, setShiftText] = useState(String(DEFAULT_SHIFT));
  const [decode, setDecode] = useState(false);
  const [guess, setGuess] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.message) setMessage(progress.message);
    if (progress.shiftText != null) setShiftText(String(progress.shiftText));
    if (progress.decode != null) setDecode(Boolean(progress.decode));
    if (progress.guess != null) setGuess(String(progress.guess));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const shift = Number(shiftText);
  const cipher = useMemo(
    () => caesarTransform(message, Number.isFinite(shift) ? shift : 0, { decode, lang: "en" }),
    [message, shift, decode],
  );
  const steps = useMemo(
    () => caesarSteps(message, Number.isFinite(shift) ? shift : 0, { decode, lang: "en" }),
    [message, shift, decode],
  );

  const save = useCallback(
    (patch, done = false) => {
      const payload = { message, shiftText, decode, guess, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [message, shiftText, decode, guess, hints, persist, markComplete],
  );

  function checkGuess() {
    const expected = cipher.trim();
    const ok = guess.trim().toUpperCase() === expected.toUpperCase();
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "caesar-cipher-output",
        answer: guess,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback("إجابة صحيحة ✓ طبّقت شفرة قيصر بنجاح.");
      save({ guess, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("غير صحيح — راجع جدول الخطوات أو قيمة الإزاحة.");
      save({ guess });
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
        ? "تلميح 1: لكل حرف أضف الإزاحة مع modulo 26."
        : `تلميح 2: الناتج المتوقع يبدأ بـ «${expectedPreview(cipher)}»`,
    );
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4" dir="rtl" data-testid="caesar-cipher-lab">
      <p className="font-bold text-violet-900">مختبر شفرة قيصر</p>
      <p className="mt-1 text-sm text-slate-700">أدخل نصًا وإزاحة، راقب التشفير خطوة بخطوة، ثم أكّد الناتج.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-semibold">النص</span>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              save({ message: e.target.value });
            }}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            dir="ltr"
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold">الإزاحة</span>
          <input
            type="number"
            value={shiftText}
            onChange={(e) => {
              setShiftText(e.target.value);
              save({ shiftText: e.target.value });
            }}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            dir="ltr"
          />
        </label>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={decode}
          onChange={(e) => {
            setDecode(e.target.checked);
            save({ decode: e.target.checked });
          }}
        />
        وضع فك التشفير
      </label>

      <div className="mt-4 rounded-lg bg-white p-3 text-sm" dir="ltr">
        <p className="font-semibold text-slate-800">الناتج المحسوب: {cipher}</p>
      </div>

      <div className="mt-4 max-h-48 overflow-auto rounded border border-slate-200 bg-white p-2 text-xs" dir="ltr">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-1">حرف</th>
              <th className="border p-1">موضع</th>
              <th className="border p-1">نتيجة</th>
            </tr>
          </thead>
          <tbody>
            {steps.slice(0, 12).map((s, i) => (
              <tr key={i}>
                <td className="border p-1">{s.original}</td>
                <td className="border p-1">{s.position ?? "—"}</td>
                <td className="border p-1">{s.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            save({ guess: e.target.value });
          }}
          placeholder="اكتب الناتج المتوقع"
          className="min-w-[200px] flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          dir="ltr"
        />
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

function expectedPreview(text) {
  return String(text || "").slice(0, 3) || "…";
}
