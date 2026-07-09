import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";
import { DAY13_CHALLENGES, checkDay13Answer } from "../../lib/algorithms/day13.js";

function GenericDay13Lab({ lessonId, userId, testId, titleAr, introAr, challengeList, hintAr }) {
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
    const ok = checkDay13Answer(challenge.id, answer);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `day13-${challenge.id}`,
        answer,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback("إجابة صحيحة ✓ أحسنت.");
      save({ answer, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("الإجابة تحتاج تحسين — راجع الدرس ثم حاول مجددًا.");
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
    setFeedback(next === 1 ? hintAr : `تلميح إضافي: إجابة نموذجية: ${challenge.expected}`);
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4" dir="rtl" data-testid={testId}>
      <p className="font-bold text-indigo-900">{titleAr}</p>
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
        <p className="font-semibold text-slate-800">{challenge.promptAr}</p>
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

export function ReviewLab({ lessonId, userId }) {
  return (
    <GenericDay13Lab
      lessonId={lessonId}
      userId={userId}
      testId="review-lab"
      titleAr="مختبر المراجعة الشاملة"
      introAr="اختبر سرعة الاسترجاع وفهمك للنقاط الأساسية."
      challengeList={DAY13_CHALLENGES.review}
      hintAr="استخدم طريقة المتوسط + مراجعة أسبوعية."
    />
  );
}

export function PostAssessmentLab({ lessonId, userId }) {
  return (
    <GenericDay13Lab
      lessonId={lessonId}
      userId={userId}
      testId="post-assessment-lab"
      titleAr="مختبر التقويم البعدي"
      introAr="احسب التحسن وفسّر نتائج quiz-post."
      challengeList={DAY13_CHALLENGES.assessment}
      hintAr="نسبة التحسن = (post - pre) / pre * 100."
    />
  );
}

export function ProjectPrepLab({ lessonId, userId }) {
  return (
    <GenericDay13Lab
      lessonId={lessonId}
      userId={userId}
      testId="project-prep-lab"
      titleAr="مختبر تجهيز المشروع"
      introAr="تحقق من صياغة الهدف وخطوات بدء المشروع."
      challengeList={DAY13_CHALLENGES.project}
      hintAr="ابدأ دائمًا بتعريف المشكلة وصياغة هدف SMART."
    />
  );
}
