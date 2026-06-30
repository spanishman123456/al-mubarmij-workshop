import { useState } from "react";
import { getCurriculumForGame, getLegacyProjectId } from "./curriculumBridge.js";

/** @typedef {import('../types.js').GameId} GameId */

/**
 * @param {{ gameId: GameId, progress?: object, onSave: (patch: object) => void }} props
 */
export default function GameQuiz({ gameId, progress, onSave }) {
  const curriculum = getCurriculumForGame(gameId);
  const questions = curriculum?.quiz ?? [];
  const [answers, setAnswers] = useState(progress?.quizAnswers ?? {});
  const [result, setResult] = useState(null);

  if (!questions.length) return null;

  function checkQuiz() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (Number(answers[i]) === q.answer) correct += 1;
    });
    const percent = Math.round((correct / questions.length) * 100);
    const passed = percent >= 60;
    setResult({ correct, total: questions.length, percent, passed });
    if (passed) {
      onSave({
        status: "completed",
        quizScore: percent,
        quizAnswers: { ...answers },
      });
    } else {
      onSave({ quizScore: percent, quizAnswers: { ...answers } });
    }
  }

  const legacyId = getLegacyProjectId(gameId);
  const status = progress?.status || "not_started";

  return (
    <div className="mgl-quiz">
      <h4 className="mgl-details__label">اختبر فهمك</h4>
      <p className="mgl-quiz__meta">
        الحالة:{" "}
        <strong>
          {status === "completed" ? "مكتمل" : status === "in_progress" ? "قيد التنفيذ" : "لم يبدأ"}
        </strong>
        {progress?.quizScore != null ? ` — ${progress.quizScore}%` : ""}
      </p>
      <div className="mgl-quiz__questions">
        {questions.map((q, i) => (
          <fieldset key={`${legacyId}-q-${i}`} className="mgl-quiz__question">
            <legend>{q.q}</legend>
            {q.options.map((opt, oi) => (
              <label key={opt} className="mgl-quiz__option">
                <input
                  type="radio"
                  name={`mgl-quiz-${legacyId}-${i}`}
                  checked={Number(answers[i]) === oi}
                  onChange={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                />
                <span>{opt}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <button type="button" className="mgl-code__btn mgl-code__btn--primary" onClick={checkQuiz}>
        تحقق من الإجابات
      </button>
      {result ? (
        <p className={`mgl-quiz__result${result.passed ? " mgl-quiz__result--ok" : ""}`}>
          {result.passed
            ? `ممتاز! ${result.correct}/${result.total} — تم تسجيل المشروع كمكتمل.`
            : `${result.correct}/${result.total} (${result.percent}%) — حاول مرة أخرى (60% للنجاح).`}
        </p>
      ) : null}
    </div>
  );
}
