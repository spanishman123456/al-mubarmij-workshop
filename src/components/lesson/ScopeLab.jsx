import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { SCOPE_SCENARIOS } from "../../lib/python/scopeTrace.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

function normalizeAnswer(text) {
  return String(text || "").trim();
}

export function ScopeLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "python-scope-lab",
  });
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  const scenario = useMemo(
    () => SCOPE_SCENARIOS[scenarioIndex] || SCOPE_SCENARIOS[0],
    [scenarioIndex],
  );

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.scenarioIndex != null) setScenarioIndex(Number(progress.scenarioIndex) || 0);
    if (progress.answer != null) setAnswer(String(progress.answer));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { scenarioIndex, answer, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [scenarioIndex, answer, hints, persist, markComplete],
  );

  function selectScenario(idx) {
    setScenarioIndex(idx);
    setAnswer("");
    setFeedback("");
    setHints(0);
    save({ scenarioIndex: idx, answer: "", hints: 0 });
  }

  function checkAnswer() {
    const ok = normalizeAnswer(answer) === normalizeAnswer(scenario.answer);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `python-scope-${scenario.id}`,
        answer,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback(`إجابة صحيحة ✓ ${scenario.explainAr}`);
      save({ answer, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("غير صحيح — تتبّع المتغيرات المحلية والعامة في الكود.");
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
    setFeedback(
      next === 1
        ? "تلميح 1: ابحث أين يُعرَّف المتغير — داخل الدالة (محلي) أم خارجها (عام)."
        : `تلميح 2: ${scenario.explainAr}`,
    );
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4" dir="rtl" data-testid="python-scope-lab">
      <p className="font-bold text-amber-900">مختبر نطاق المتغيرات (Scope)</p>
      <p className="mt-1 text-sm text-slate-700">اقرأ الكود، تتبّع النطاق، ثم اكتب مخرج print أو قيمة المتغير.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {SCOPE_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => selectScenario(i)}
            className={`edu-btn text-xs ${i === scenarioIndex ? "edu-btn-primary" : "edu-btn-outline"}`}
          >
            سيناريو {i + 1}
          </button>
        ))}
      </div>

      <pre
        className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-sm leading-relaxed text-emerald-300"
        dir="ltr"
      >
        {scenario.codeAr}
      </pre>

      <p className="mt-3 text-sm font-semibold text-slate-800">{scenario.questionAr}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            save({ answer: e.target.value });
          }}
          placeholder="اكتب الإجابة"
          className="min-w-[200px] flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          dir="ltr"
          data-testid="scope-answer-input"
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
