import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";
import { DAY15_CHALLENGES, checkDay15Answer } from "../../lib/algorithms/day15.js";
import { BilingualPrompt } from "../BilingualTextBlocks";

function GenericDay15Lab({ lessonId, userId, testId, titleAr, introAr, challengeList, hintAr }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: `${lessonId}-lab`,
  });
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  const challenge = useMemo(
    () => challengeList[challengeIndex] || challengeList[0],
    [challengeIndex, challengeList],
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
    const ok = checkDay15Answer(challenge.id, answer);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `day15-${challenge.id}`,
        answer,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback("إجابة صحيحة ✓ رائع.");
      save({ answer, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("الإجابة غير مكتملة — راجع المعايير وأعد المحاولة.");
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
    setFeedback(next === 1 ? hintAr : `تلميح إضافي: إجابة قريبة: ${challenge.expected}`);
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4" dir="rtl" data-testid={testId}>
      <p className="font-bold text-rose-900">{titleAr}</p>
      <p className="mt-1 text-sm text-slate-700">{introAr}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {challengeList.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectChallenge(i)}
            className={`edu-btn text-xs ${i === challengeIndex ? "edu-btn-primary" : "edu-btn-outline"}`}
          >
            تحدي {i + 1}
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
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            save({ answer: e.target.value });
          }}
          placeholder="اكتب الإجابة"
          className="min-w-[180px] flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          dir="ltr"
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

export function FinalPresentationLab({ lessonId, userId }) {
  return (
    <GenericDay15Lab
      lessonId={lessonId}
      userId={userId}
      testId="final-presentation-lab"
      titleAr="مختبر العرض النهائي"
      introAr="تدرب على rubric العرض والتسلسل المنطقي."
      challengeList={DAY15_CHALLENGES.presentation}
      hintAr="ابدأ العرض بالمشكلة ثم الحل."
    />
  );
}

export function PeerFeedbackLab({ lessonId, userId }) {
  return (
    <GenericDay15Lab
      lessonId={lessonId}
      userId={userId}
      testId="peer-feedback-lab"
      titleAr="مختبر التغذية الراجعة"
      introAr="صغ ملاحظات بناءة قابلة للتطبيق."
      challengeList={DAY15_CHALLENGES.feedback}
      hintAr="اجعل الملاحظة محددة وقابلة للتنفيذ."
    />
  );
}

export function FinalEvaluationLab({ lessonId, userId }) {
  return (
    <GenericDay15Lab
      lessonId={lessonId}
      userId={userId}
      testId="final-evaluation-lab"
      titleAr="مختبر التقييم الختامي"
      introAr="احسب النتائج النهائية وحدد الخطوة القادمة."
      challengeList={DAY15_CHALLENGES.closure}
      hintAr="النسبة = الدرجة / الدرجة الكلية * 100."
    />
  );
}
