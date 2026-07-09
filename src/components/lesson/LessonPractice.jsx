import { useState } from "react";
import { isValidInBase } from "../../lib/numberSystems/conversions";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { feedbackAfterFailedAttempt } from "../../lib/exerciseFeedbackPolicy.js";
import { gradeStructuredItem } from "../../lib/assessment/unifiedAssessment.js";
import { areEquivalentLessonAnswers, normalizeLessonAnswer } from "../../lib/assessment/lessonAnswerEquivalence";
import { renderMixedDirectionText } from "../MixedDirectionText";
import { BilingualPrompt } from "../BilingualTextBlocks";

function normalizeLegacyAnswer(s) {
  return normalizeLessonAnswer(s);
}

function isStructuredExercise(exercise) {
  const type = exercise?.type;
  return type && type !== "numeric" && !exercise.kind;
}

function classifyError(userAnswer, expected, exercise) {
  const u = normalizeLegacyAnswer(userAnswer);
  const e = normalizeLegacyAnswer(expected);
  if (!u) return { type: "empty", message: "أدخل إجابة قبل التحقق." };
  if (exercise.base && !isValidInBase(u, exercise.base)) {
    return {
      type: "invalid_digit",
      message: `رقم غير صالح للأساس ${exercise.base}. راجع الرموز المسموحة.`,
    };
  }
  if (u.length !== e.length && exercise.kind === "toDecimal") {
    return { type: "wrong_length", message: "عدد الخانات لا يطابق المتوقع — تحقق من جمع المنازل." };
  }
  if (u === e.split("").reverse().join("") && exercise.kind === "fromDecimal") {
    return {
      type: "remainder_order",
      message: "قرأت البواقي بالترتيب الخاطئ. اقرأ من آخر باقٍ إلى الأول.",
    };
  }
  return { type: "wrong_answer", message: "الإجابة غير صحيحة. راجع الخطوة الحالية في الجدول." };
}

function StructuredExerciseInput({ exercise, value, onChange, disabled }) {
  const type = exercise.type;
  if (type === "multiple_choice" || type === "mcq") {
    return (
      <div className="space-y-2">
        {(exercise.choices || []).map((c) => {
          const picked = String(value) === String(c.id);
          return (
            <label
              key={c.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                picked ? "border-violet-500 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-200"
              }`}
            >
              <input
                type="radio"
                name={exercise.id}
                checked={picked}
                onChange={() => onChange(c.id)}
                disabled={disabled}
                className="mt-1"
              />
              <span>{renderMixedDirectionText(c.textAr || c.text)}</span>
            </label>
          );
        })}
      </div>
    );
  }
  if (type === "true_false" || type === "truefalse") {
    return (
      <div className="flex flex-wrap gap-2">
        {[
          { v: true, label: "صح" },
          { v: false, label: "خطأ" },
        ].map(({ v, label }) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onChange(v)}
            className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
              value === v
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-violet-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }
  const isNumeric = type === "numeric_answer" || type === "fill";
  return (
    <input
      type="text"
      inputMode={isNumeric ? "numeric" : "text"}
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      dir="ltr"
      placeholder="إجابتك"
    />
  );
}

export function LessonPractice({ exercises, mode, lessonId, userId, onStepComplete }) {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState({});
  const [failAttempts, setFailAttempts] = useState(0);

  const ex = exercises[idx];
  if (!ex) return null;

  const expected = ex.answer;
  const hints = ex.hints || [];

  function check() {
    if (isStructuredExercise(ex)) {
      const graded = gradeStructuredItem(ex, answer);
      if (graded.gradingStatus === "unanswered") {
        setFeedback("أدخل إجابة قبل التحقق.");
        return;
      }
      if (graded.correct) {
        setFeedback("إجابة صحيحة ✓");
        setDone((d) => ({ ...d, [ex.id]: true }));
        if (userId) {
          recordLessonAttemptApi(userId, {
            lessonId,
            exerciseId: `${mode}-${ex.id}`,
            answer,
            correct: true,
            hintsUsed: hintLevel,
          });
        }
        onStepComplete?.(ex.id);
        return;
      }
      const nextFail = failAttempts + 1;
      setFailAttempts(nextFail);
      setFeedback(feedbackAfterFailedAttempt(nextFail, hints, ex.feedback?.incorrect || "الإجابة غير صحيحة."));
      if (userId) {
        recordLessonAttemptApi(userId, {
          lessonId,
          exerciseId: `${mode}-${ex.id}`,
          answer,
          correct: false,
          hintsUsed: hintLevel,
          errorType: "wrong_answer",
        });
      }
      return;
    }

    const accepted = Array.isArray(ex.acceptedAnswers) ? ex.acceptedAnswers : [];
    const ok =
      areEquivalentLessonAnswers(answer, expected) ||
      accepted.some((candidate) => areEquivalentLessonAnswers(answer, candidate));

    if (ok) {
      setFeedback("إجابة صحيحة ✓");
      setDone((d) => ({ ...d, [ex.id]: true }));
      if (userId) {
        recordLessonAttemptApi(userId, {
          lessonId,
          exerciseId: `${mode}-${ex.id}`,
          answer,
          correct: true,
          hintsUsed: hintLevel,
        });
      }
      onStepComplete?.(ex.id);
      return;
    }

    const err = classifyError(answer, expected, ex);
    const nextFail = failAttempts + 1;
    setFailAttempts(nextFail);
    setFeedback(feedbackAfterFailedAttempt(nextFail, hints, err.message));

    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `${mode}-${ex.id}`,
        answer,
        correct: false,
        hintsUsed: hintLevel,
        errorType: err.type,
      });
    }
  }

  function next() {
    setAnswer("");
    setHintLevel(0);
    setFailAttempts(0);
    setFeedback("");
    setIdx((i) => Math.min(i + 1, exercises.length - 1));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-violet-700">
        {mode === "guided" ? "تدريب موجّه" : "تدريب مستقل"} — {idx + 1}/{exercises.length}
      </p>
      <div className="mt-2">
        <BilingualPrompt
          promptAr={ex.promptAr}
          expression={ex.expression}
          values={ex.values}
          code={ex.code}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-start gap-2">
        {isStructuredExercise(ex) ? (
          <StructuredExerciseInput
            exercise={ex}
            value={answer}
            onChange={setAnswer}
            disabled={Boolean(done[ex.id])}
          />
        ) : (
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            dir="ltr"
            placeholder="إجابتك"
          />
        )}
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={check}>
          تحقق
        </button>
        {mode === "guided" && idx < exercises.length - 1 ? (
          <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={next}>
            التالي
          </button>
        ) : null}
      </div>
      {feedback ? <p className="mt-2 text-sm text-slate-700">{feedback}</p> : null}
      {done[ex.id] ? <p className="mt-1 text-xs text-emerald-600">✓ مكتمل</p> : null}
    </div>
  );
}
