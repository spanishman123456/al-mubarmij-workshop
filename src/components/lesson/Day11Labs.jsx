import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";
import { DAY11_CHALLENGES, checkDay11Answer } from "../../lib/algorithms/day11.js";
import { BilingualPrompt } from "../BilingualTextBlocks";

function GenericDay11Lab({ lessonId, userId, testId, titleAr, introAr, challengeList, hintAr }) {
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
    const ok = checkDay11Answer(challenge.id, answer);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `day11-${challenge.id}`,
        answer,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback("إجابة صحيحة ✓ أحسنت.");
      save({ answer, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("الإجابة تحتاج ضبط أكثر — راجع الفكرة الأساسية ثم حاول مرة أخرى.");
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
    setFeedback(next === 1 ? hintAr : `تلميح إضافي: إجابة نموذجية قريبة هي: ${challenge.expected}`);
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4" dir="rtl" data-testid={testId}>
      <p className="font-bold text-cyan-900">{titleAr}</p>
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

export function AiFoundationsLab({ lessonId, userId }) {
  return (
    <GenericDay11Lab
      lessonId={lessonId}
      userId={userId}
      testId="ai-foundations-lab"
      titleAr="مختبر مفاهيم الذكاء الاصطناعي"
      introAr="فرّق بين AI التقليدي واستخداماته اليومية."
      challengeList={DAY11_CHALLENGES.ai}
      hintAr="فكّر في البيانات والأنماط واتخاذ القرار."
    />
  );
}

export function MachineLearningLab({ lessonId, userId }) {
  return (
    <GenericDay11Lab
      lessonId={lessonId}
      userId={userId}
      testId="machine-learning-lab"
      titleAr="مختبر التعلم الآلي"
      introAr="احسب الدقة وتعرّف الفئة الأغلبية."
      challengeList={DAY11_CHALLENGES.ml}
      hintAr="الدقة = (TP+TN) / جميع الحالات."
    />
  );
}

export function AiEthicsLab({ lessonId, userId }) {
  return (
    <GenericDay11Lab
      lessonId={lessonId}
      userId={userId}
      testId="ai-ethics-lab"
      titleAr="مختبر أخلاقيات الذكاء الاصطناعي"
      introAr="حلل مواقف الانحياز والخصوصية في أنظمة AI."
      challengeList={DAY11_CHALLENGES.ethics}
      hintAr="العدالة والخصوصية شرطان أساسيان قبل نشر أي نموذج."
    />
  );
}

export function AiPresentationLab({ lessonId, userId }) {
  return (
    <GenericDay11Lab
      lessonId={lessonId}
      userId={userId}
      testId="ai-presentation-lab"
      titleAr="مختبر إعداد العرض البحثي"
      introAr="تدرب على بنية عرض AI القصير قبل تقديمه."
      challengeList={DAY11_CHALLENGES.presentation}
      hintAr="ابدأ بالمشكلة ثم الحل ثم المثال والأثر."
    />
  );
}
