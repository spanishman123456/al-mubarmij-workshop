import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { COMPLEXITY_SCENARIOS, BIG_O_OPTIONS, checkComplexityAnswer } from "../../lib/algorithms/complexity.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

export function ComplexityLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "algorithm-complexity-lab",
  });
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  const scenario = useMemo(
    () => COMPLEXITY_SCENARIOS[scenarioIndex] || COMPLEXITY_SCENARIOS[0],
    [scenarioIndex],
  );

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.scenarioIndex != null) setScenarioIndex(Number(progress.scenarioIndex) || 0);
    if (progress.guess != null) setGuess(String(progress.guess));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { scenarioIndex, guess, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [scenarioIndex, guess, hints, persist, markComplete],
  );

  function selectScenario(idx) {
    setScenarioIndex(idx);
    setGuess("");
    setFeedback("");
    setHints(0);
    save({ scenarioIndex: idx, guess: "", hints: 0 });
  }

  function checkAnswer() {
    const result = checkComplexityAnswer(scenario.id, guess);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `complexity-${scenario.id}`,
        answer: guess,
        correct: result.ok,
        hintsUsed: hints,
      });
    }
    if (result.ok) {
      setFeedback(`إجابة صحيحة ✓ ${scenario.explainAr}`);
      save({ guess, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("غير صحيح — عد الحلقات والعمليات المتكررة في المقطع.");
      save({ guess });
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
      setFeedback("تلميح 1: اسأل — هل هناك حلقة واحدة، حلقتان متداخلتان، أم تقسيم متكرر؟");
    } else {
      setFeedback(`تلميح 2: ${scenario.explainAr}`);
    }
    save({ hints: next });
  }

  return (
    <div
      className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4"
      dir="rtl"
      data-testid="algorithm-complexity-lab"
    >
      <p className="font-bold text-indigo-900">مختبر تعقيد الخوارزميات (Big-O)</p>
      <p className="mt-1 text-sm text-slate-700">اقرأ مقطع الكود واختر التعقيد الزمني الأنسب.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {COMPLEXITY_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => selectScenario(i)}
            className={`edu-btn text-xs ${i === scenarioIndex ? "edu-btn-primary" : "edu-btn-outline"}`}
          >
            مثال {i + 1}
          </button>
        ))}
      </div>

      <pre
        className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-sm leading-relaxed text-indigo-200"
        dir="ltr"
      >
        {scenario.snippetAr}
      </pre>

      <p className="mt-3 text-sm font-semibold text-slate-800">ما التعقيد الزمني؟</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {BIG_O_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              setGuess(opt);
              save({ guess: opt });
            }}
            className={`edu-btn text-xs ${guess === opt ? "edu-btn-primary" : "edu-btn-outline"}`}
            data-testid={`complexity-option-${opt.replace(/\s+/g, "")}`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
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
