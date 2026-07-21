import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { rollTwoDice, diceSum, sumCategory } from "../../lib/games/diceRoll.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function DieFace({ value }) {
  const face = DICE_FACES[(value || 1) - 1] || "?";
  return (
    <span
      className="inline-flex h-16 w-16 items-center justify-center rounded-xl border-2 border-rose-300 bg-white text-4xl shadow-sm"
      aria-label={`نرد ${value}`}
      data-testid={`die-${value}`}
    >
      {face}
    </span>
  );
}

export function DiceRandomLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "dice-random-lab",
  });
  const [dice, setDice] = useState(null);
  const [mode, setMode] = useState("sum");
  const [guess, setGuess] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.dice) setDice(progress.dice);
    if (progress.mode) setMode(progress.mode);
    if (progress.guess != null) setGuess(String(progress.guess));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const sum = useMemo(() => (dice ? diceSum(dice[0], dice[1]) : null), [dice]);
  const category = useMemo(() => (sum != null ? sumCategory(sum) : null), [sum]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { dice, mode, guess, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [dice, mode, guess, hints, persist, markComplete],
  );

  function rollDice() {
    const next = rollTwoDice();
    setDice(next);
    setGuess("");
    setFeedback("");
    save({ dice: next, guess: "" });
  }

  function checkGuess() {
    if (!dice) {
      setFeedback("ارمِ النردين أولًا.");
      return;
    }
    const expected = mode === "sum" ? String(sum) : category;
    const ok =
      mode === "sum"
        ? Number(guess) === sum
        : normalizeAnswer(guess) === normalizeAnswer(expected);

    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `dice-random-${mode}`,
        answer: guess,
        correct: ok,
        hintsUsed: hints,
      });
    }

    if (ok) {
      setFeedback(
        mode === "sum"
          ? `إجابة صحيحة ✓ المجموع = ${sum} (${category}).`
          : `إجابة صحيحة ✓ التصنيف «${category}» للمجموع ${sum}.`,
      );
      save({ guess, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback(
        mode === "sum"
          ? "المجموع غير صحيح — اجمع قيمتي النردين."
          : "التصنيف غير صحيح — منخفض (≤6)، متوسط (7–9)، مرتفع (≥10).",
      );
      save({ guess });
    }
  }

  function revealHint() {
    if (hints >= 2) {
      setFeedback(AFTER_MAX_HINTS_AR);
      return;
    }
    if (!dice) {
      setFeedback("ارمِ النردين أولًا للحصول على تلميح.");
      return;
    }
    const next = hints + 1;
    setHints(next);
    setFeedback(
      next === 1
        ? `تلميح 1: ${dice[0]} + ${dice[1]} = ؟`
        : mode === "sum"
          ? `تلميح 2: المجموع بين 2 و 12 — هنا ${sum}.`
          : `تلميح 2: المجموع ${sum} يقع في فئة «${category}».`,
    );
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4" dir="rtl" data-testid="dice-random-lab">
      <p className="font-bold text-rose-900">مختبر النرد والعشوائية</p>
      <p className="mt-1 text-sm text-slate-700">ارمِ نردين، ثم توقّع المجموع أو التصنيف قبل التحقق.</p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {dice ? (
          <>
            <DieFace value={dice[0]} />
            <span className="text-2xl font-bold text-slate-500">+</span>
            <DieFace value={dice[1]} />
            {sum != null ? (
              <span className="text-sm text-slate-600" dir="ltr">
                = {sum} ({category})
              </span>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-slate-600">لم تُرمَ النرد بعد.</p>
        )}
      </div>

      <button type="button" onClick={rollDice} className="edu-btn edu-btn-primary mt-4 text-sm">
        ارمِ النردين
      </button>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("sum");
            setGuess("");
            save({ mode: "sum", guess: "" });
          }}
          className={`edu-btn text-sm ${mode === "sum" ? "edu-btn-primary" : "edu-btn-outline"}`}
        >
          توقّع المجموع
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("category");
            setGuess("");
            save({ mode: "category", guess: "" });
          }}
          className={`edu-btn text-sm ${mode === "category" ? "edu-btn-primary" : "edu-btn-outline"}`}
        >
          توقّع التصنيف
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {mode === "sum" ? (
          <input
            type="number"
            min={2}
            max={12}
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              save({ guess: e.target.value });
            }}
            placeholder="المجموع (2–12)"
            className="min-w-[140px] rounded border border-slate-300 px-3 py-2 text-sm"
            dir="ltr"
            data-testid="dice-sum-guess"
          />
        ) : (
          <select
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              save({ guess: e.target.value });
            }}
            className="min-w-[140px] rounded border border-slate-300 px-3 py-2 text-sm"
            data-testid="dice-category-guess"
          >
            <option value="">اختر التصنيف</option>
            <option value="منخفض">منخفض (≤6)</option>
            <option value="متوسط">متوسط (7–9)</option>
            <option value="مرتفع">مرتفع (≥10)</option>
          </select>
        )}
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

function normalizeAnswer(text) {
  return String(text || "").trim();
}
