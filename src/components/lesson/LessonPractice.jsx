import { useState } from "react";
import { isValidInBase } from "../../lib/numberSystems/conversions";
import { recordLessonAttemptApi } from "../../lib/platformApi";

function normalizeAnswer(s) {
  return String(s || "").trim().toUpperCase().replace(/\s/g, "");
}

function classifyError(userAnswer, expected, exercise) {
  const u = normalizeAnswer(userAnswer);
  const e = normalizeAnswer(expected);
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

export function LessonPractice({ exercises, mode, lessonId, userId, onStepComplete }) {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState({});

  const ex = exercises[idx];
  if (!ex) return null;

  const expected = ex.answer;
  const hints = ex.hints || [];

  function check() {
    const norm = normalizeAnswer(answer);
    const ok = norm === normalizeAnswer(expected) || norm === String(expected);

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
    if (hintLevel < hints.length) {
      setHintLevel((h) => h + 1);
      setFeedback(`تلميح ${hintLevel + 1}: ${hints[hintLevel]}`);
    } else if (hintLevel < hints.length + 1) {
      setHintLevel((h) => h + 1);
      setFeedback(err.message);
    } else {
      setFeedback(`${err.message} — الإجابة الصحيحة: ${expected}`);
    }

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
    setFeedback("");
    setIdx((i) => Math.min(i + 1, exercises.length - 1));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-violet-700">
        {mode === "guided" ? "تدريب موجّه" : "تدريب مستقل"} — {idx + 1}/{exercises.length}
      </p>
      <p className="mt-2 font-semibold text-slate-900">{ex.promptAr}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          dir="ltr"
          placeholder="إجابتك"
        />
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
