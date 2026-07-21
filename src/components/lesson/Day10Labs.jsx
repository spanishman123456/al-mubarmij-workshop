import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";
import { DAY10_CHALLENGES, checkDay10Answer } from "../../lib/algorithms/day10.js";
import { BilingualPrompt } from "../BilingualTextBlocks";

function GenericDay10Lab({ lessonId, userId, testId, titleAr, introAr, challengeList, hintAr }) {
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
    const ok = checkDay10Answer(challenge.id, answer);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `day10-${challenge.id}`,
        answer,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback("إجابة صحيحة ✓ ممتاز.");
      save({ answer, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("الإجابة غير دقيقة — راجع الخطوات ثم أعد المحاولة.");
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
    setFeedback(next === 1 ? hintAr : `تلميح إضافي: فكّر في ${challenge.expected}`);
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4" dir="rtl" data-testid={testId}>
      <p className="font-bold text-violet-900">{titleAr}</p>
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

export function OopFoundationsLab({ lessonId, userId }) {
  return (
    <GenericDay10Lab
      lessonId={lessonId}
      userId={userId}
      testId="oop-foundations-lab"
      titleAr="مختبر البرمجة كائنية التوجه"
      introAr="طبّق مفاهيم class والكائنات عبر مسائل مساحة ومُنشئ الكائن."
      challengeList={DAY10_CHALLENGES.oop}
      hintAr="تذكّر: مساحة الدائرة πr²، ومساحة المربع s²."
    />
  );
}

export function SteganographyLab({ lessonId, userId }) {
  return (
    <GenericDay10Lab
      lessonId={lessonId}
      userId={userId}
      testId="steganography-lab"
      titleAr="مختبر إخفاء المعلومات"
      introAr="استخرج الرسالة وراجع معاملات البت المستخدمة في فك التشفير."
      challengeList={DAY10_CHALLENGES.stego}
      hintAr="قسّم البتات إلى مجموعات 8 بت، وتوقّف عند null."
    />
  );
}

export function FractalTreeLab({ lessonId, userId }) {
  return (
    <GenericDay10Lab
      lessonId={lessonId}
      userId={userId}
      testId="fractal-tree-lab"
      titleAr="مختبر الشجرة المتكررة"
      introAr="احسب عدد القطع/الفروع في النمط المتكرر حسب العمق."
      challengeList={DAY10_CHALLENGES.fractal}
      hintAr="العدد ينمو مثل 2^(d+1)-1."
    />
  );
}

export function LockerPascalLab({ lessonId, userId }) {
  return (
    <GenericDay10Lab
      lessonId={lessonId}
      userId={userId}
      testId="locker-pascal-lab"
      titleAr="مختبر مشكلة الخزانة ومثلث باسكال"
      introAr="حل مسألتين حسابيتين من اليوم العاشر."
      challengeList={DAY10_CHALLENGES.locker}
      hintAr="الخزائن المفتوحة هي المربعات الكاملة فقط."
    />
  );
}
