import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { SIERPINSKI_CHALLENGES, checkFractalLabAnswer } from "../../lib/algorithms/fractals.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";
import { BilingualPrompt } from "../BilingualTextBlocks";

const CHALLENGE_LABELS = {
  "sierp-2": "عمق 2",
  "sierp-3": "عمق 3",
};

export function SierpinskiLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "sierpinski-triangle-lab",
  });
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  const challenge = useMemo(
    () => SIERPINSKI_CHALLENGES[challengeIndex] || SIERPINSKI_CHALLENGES[0],
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
        exerciseId: `sierpinski-${challenge.id}`,
        answer,
        correct: result.ok,
        hintsUsed: hints,
      });
    }
    if (result.ok) {
      setFeedback(`إجابة صحيحة ✓ ${result.explainAr}`);
      save({ answer, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("غير صحيح — في كل عمق يُقسّم كل مثلث إلى 3 مثلثات أصغر.");
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
      setFeedback("تلميح 1: عدد المثلثات الصغيرة = 3 مرفوع لأسم العمق.");
    } else {
      setFeedback(`تلميح 2: ${checkFractalLabAnswer(challenge.id, "").explainAr}`);
    }
    save({ hints: next });
  }

  return (
    <div
      className="rounded-xl border border-violet-200 bg-violet-50/40 p-4"
      dir="rtl"
      data-testid="sierpinski-triangle-lab"
    >
      <p className="font-bold text-violet-900">مختبر مثلث Sierpinski</p>
      <p className="mt-1 text-sm text-slate-700">
        احسب عدد أصغر المثلثات المملوءة بعد تكرارات تقسيم مثلث Sierpinski.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {SIERPINSKI_CHALLENGES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectChallenge(i)}
            className={`edu-btn text-xs ${i === challengeIndex ? "edu-btn-primary" : "edu-btn-outline"}`}
          >
            {CHALLENGE_LABELS[c.id] || `سؤال ${i + 1}`}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-white p-3 text-sm">
        <BilingualPrompt
          promptAr={challenge.promptAr}
          expression={challenge.expression}
          values={challenge.values}
          code={challenge.code}
        />
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
          data-testid="sierpinski-answer-input"
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
