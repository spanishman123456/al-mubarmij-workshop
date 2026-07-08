import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { fibIterative, fibSequence, nextFibTerm } from "../../lib/algorithms/fibonacci.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

/** @type {Array<{ id: string, mode: "fn" | "next", n?: number, showCount?: number }>} */
const FIB_CHALLENGES = [
  { id: "fn-6", mode: "fn", n: 6 },
  { id: "fn-9", mode: "fn", n: 9 },
  { id: "fn-12", mode: "fn", n: 12 },
  { id: "next-8", mode: "next", showCount: 8 },
  { id: "next-10", mode: "next", showCount: 10 },
];

function expectedAnswer(challenge) {
  if (challenge.mode === "fn") return fibIterative(challenge.n ?? 0);
  const seq = fibSequence(challenge.showCount ?? 2);
  return nextFibTerm(seq);
}

export function FibonacciLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "fibonacci-sequence-lab",
  });
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  const challenge = useMemo(
    () => FIB_CHALLENGES[challengeIndex] || FIB_CHALLENGES[0],
    [challengeIndex],
  );
  const expected = useMemo(() => expectedAnswer(challenge), [challenge]);
  const sequencePreview = useMemo(() => {
    if (challenge.mode !== "next") return [];
    return fibSequence(challenge.showCount ?? 2);
  }, [challenge]);

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.challengeIndex != null) setChallengeIndex(Number(progress.challengeIndex) || 0);
    if (progress.answer != null) setAnswer(String(progress.answer));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { challengeIndex, answer, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [challengeIndex, answer, hints, persist, markComplete],
  );

  function selectChallenge(idx) {
    setChallengeIndex(idx);
    setAnswer("");
    setFeedback("");
    setHints(0);
    save({ challengeIndex: idx, answer: "", hints: 0 });
  }

  function checkAnswer() {
    const guess = Number(String(answer || "").trim());
    const ok = Number.isFinite(guess) && guess === expected;
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `fibonacci-${challenge.id}`,
        answer,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback("إجابة صحيحة ✓ فهمت متتالية فيبوناتشي والتكرار.");
      save({ answer, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("غير صحيح — كل حد يساوي مجموع الحدين السابقين (0، 1، 1، 2، …).");
      save({ answer });
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
      setFeedback(
        challenge.mode === "fn"
          ? "تلميح 1: ابدأ من F(0)=0 و F(1)=1 ثم أضف الحدين السابقين."
          : "تلميح 1: الحد التالي = آخر حد + ما قبله في القائمة.",
      );
    } else if (challenge.mode === "fn") {
      const prev = fibIterative((challenge.n ?? 1) - 1);
      setFeedback(`تلميح 2: F(${challenge.n}) = F(${challenge.n - 1}) + F(${challenge.n - 2})؛ F(${challenge.n - 1}) = ${prev}.`);
    } else {
      const seq = sequencePreview;
      setFeedback(`تلميح 2: ${seq[seq.length - 1]} + ${seq[seq.length - 2]} = ؟`);
    }
    save({ hints: next });
  }

  return (
    <div
      className="rounded-xl border border-orange-200 bg-orange-50/40 p-4"
      dir="rtl"
      data-testid="fibonacci-sequence-lab"
    >
      <p className="font-bold text-orange-900">مختبر متتالية فيبوناتشي</p>
      <p className="mt-1 text-sm text-slate-700">
        توقّع F(n) أو الحد التالي في المتتالية باستخدام الحلقة التكرارية.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {FIB_CHALLENGES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectChallenge(i)}
            className={`edu-btn text-xs ${i === challengeIndex ? "edu-btn-primary" : "edu-btn-outline"}`}
          >
            {c.mode === "fn" ? `F(${c.n})` : `التالي ${c.showCount}`}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-white p-3 text-sm">
        {challenge.mode === "fn" ? (
          <p className="font-semibold text-slate-800">
            ما قيمة <span dir="ltr">F({challenge.n})</span> في متتالية فيبوناتشي؟
          </p>
        ) : (
          <>
            <p className="font-semibold text-slate-800">ما الحد التالي في المتتالية؟</p>
            <p className="mt-2 font-mono text-base text-slate-700" dir="ltr">
              [{sequencePreview.join(", ")}, ?]
            </p>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="number"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            save({ answer: e.target.value });
          }}
          placeholder="اكتب الرقم"
          className="min-w-[120px] flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          dir="ltr"
          data-testid="fibonacci-answer-input"
        />
        <button type="button" onClick={checkAnswer} className="edu-btn edu-btn-primary text-sm">
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
