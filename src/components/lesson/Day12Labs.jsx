import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";
import { DAY12_CHALLENGES, checkDay12Answer } from "../../lib/algorithms/day12.js";

function GenericDay12Lab({ lessonId, userId, testId, titleAr, introAr, challengeList, hintAr }) {
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
    const ok = checkDay12Answer(challenge.id, answer);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `day12-${challenge.id}`,
        answer,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback("إجابة صحيحة ✓ ممتاز.");
      save({ answer, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("الإجابة غير دقيقة — راجع الشرح ثم أعد المحاولة.");
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
    <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4" dir="rtl" data-testid={testId}>
      <p className="font-bold text-sky-900">{titleAr}</p>
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

export function AutomataLab({ lessonId, userId }) {
  return (
    <GenericDay12Lab
      lessonId={lessonId}
      userId={userId}
      testId="automata-lab"
      titleAr="مختبر التعبيرات والآلات"
      introAr="اختبر قبول السلاسل الثنائية وربطها بـ regex."
      challengeList={[...DAY12_CHALLENGES.automata, ...DAY12_CHALLENGES.regex]}
      hintAr="ركّز على النهاية 01."
    />
  );
}

export function ComplexityLab({ lessonId, userId }) {
  return (
    <GenericDay12Lab
      lessonId={lessonId}
      userId={userId}
      testId="complexity-lab"
      titleAr="مختبر P و NP"
      introAr="فرّق بين المسائل القابلة للحل بكفاءة والتحقق بكفاءة."
      challengeList={DAY12_CHALLENGES.complexity}
      hintAr="P تتعلق بزمن حل متعدد الحدود."
    />
  );
}

export function GraphLab({ lessonId, userId }) {
  return (
    <GenericDay12Lab
      lessonId={lessonId}
      userId={userId}
      testId="graph-lab"
      titleAr="مختبر نظرية المخططات"
      introAr="احسب عدد الحواف وراجع شرط مجموع الدرجات."
      challengeList={DAY12_CHALLENGES.graphs}
      hintAr="عدد حواف K_n يساوي n(n-1)/2."
    />
  );
}
