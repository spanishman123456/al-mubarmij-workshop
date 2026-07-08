import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { FRACTAL_INTRO_CHALLENGES, checkFractalLabAnswer } from "../../lib/algorithms/fractals.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

export function FractalsIntroLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "fractals-intro-lab",
  });
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  const challenge = useMemo(
    () => FRACTAL_INTRO_CHALLENGES[challengeIndex] || FRACTAL_INTRO_CHALLENGES[0],
    [challengeIndex],
  );

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
    const result = checkFractalLabAnswer(challenge.id, answer);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `fractals-intro-${challenge.id}`,
        answer,
        correct: result.ok,
        hintsUsed: hints,
      });
    }
    if (result.ok) {
      setFeedback(`إجابة صحيحة ✓ ${result.explainAr}`);
      save({ answer, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("غير صحيح — فكّر في شكل الكسورية عند التكبير.");
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
      setFeedback("تلميح 1: الكسورية تتكرر في نفسها — الجزء يشبه الكل عند التكبير.");
    } else {
      setFeedback(`تلميح 2: ${checkFractalLabAnswer(challenge.id, "").explainAr}`);
    }
    save({ hints: next });
  }

  return (
    <div
      className="rounded-xl border border-violet-200 bg-violet-50/40 p-4"
      dir="rtl"
      data-testid="fractals-intro-lab"
    >
      <p className="font-bold text-violet-900">مختبر مقدمة الكسوريات</p>
      <p className="mt-1 text-sm text-slate-700">
        اختر الإجابة التي تصف التشابه الذاتي في الأشكال الكسورية.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {FRACTAL_INTRO_CHALLENGES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectChallenge(i)}
            className={`edu-btn text-xs ${i === challengeIndex ? "edu-btn-primary" : "edu-btn-outline"}`}
          >
            التشابه الذاتي
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-white p-3 text-sm">
        <p className="font-semibold text-slate-800">{challenge.promptAr}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {challenge.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              setAnswer(opt.id);
              save({ answer: opt.id });
            }}
            className={`edu-btn text-xs ${answer === opt.id ? "edu-btn-primary" : "edu-btn-outline"}`}
            data-testid={`fractals-intro-option-${opt.id}`}
          >
            {opt.labelAr}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
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
