import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const GAME_BUILD_STEPS = [
  { id: "plan-rules", label: "تخطيط قواعد اللعبة" },
  { id: "draw-board", label: "رسم لوحة اللعب" },
  { id: "write-functions", label: "كتابة الدوال" },
  { id: "test", label: "اختبار اللعب" },
  { id: "demo", label: "عرض التطبيق (Demo)" },
];

const CORRECT_ORDER = GAME_BUILD_STEPS.map((s) => s.id);

function defaultRanks() {
  return Object.fromEntries(GAME_BUILD_STEPS.map((s) => [s.id, ""]));
}

export function GamePlanningLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "game-planning-lab",
  });
  const [ranks, setRanks] = useState(defaultRanks);
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.ranks) setRanks({ ...defaultRanks(), ...progress.ranks });
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const usedRanks = useMemo(
    () => Object.values(ranks).filter((r) => r !== "").map(Number),
    [ranks],
  );
  const hasDuplicates = usedRanks.length !== new Set(usedRanks).size;
  const allFilled = GAME_BUILD_STEPS.every((s) => ranks[s.id] !== "");

  const save = useCallback(
    (patch, done = false) => {
      const payload = { ranks, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [ranks, hints, persist, markComplete],
  );

  function setRank(stepId, value) {
    const next = { ...ranks, [stepId]: value };
    setRanks(next);
    save({ ranks: next });
  }

  function buildUserOrder() {
    return [...GAME_BUILD_STEPS]
      .sort((a, b) => Number(ranks[a.id]) - Number(ranks[b.id]))
      .map((s) => s.id);
  }

  function checkOrder() {
    if (!allFilled) {
      setFeedback("عيّن رقمًا من 1 إلى 5 لكل خطوة.");
      return;
    }
    if (hasDuplicates) {
      setFeedback("كل رقم (1–5) يُستخدم مرة واحدة فقط.");
      return;
    }

    const userOrder = buildUserOrder();
    const ok = userOrder.every((id, i) => id === CORRECT_ORDER[i]);

    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "game-planning-order",
        answer: userOrder.join(" → "),
        correct: ok,
        hintsUsed: hints,
      });
    }

    if (ok) {
      setFeedback("ترتيب صحيح ✓ خطّطت بناء اللعبة بالترتيب المنطقي.");
      save({ ranks, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("الترتيب غير صحيح — ابدأ بالتخطيط، ثم اللوحة، ثم البرمجة والاختبار والعرض.");
      save({ ranks });
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
        ? "تلميح 1: قبل كتابة أي كود، حدّد قواعد اللعبة وارسم اللوحة على الورق."
        : "تلميح 2: الترتيب: تخطيط → رسم → دوال → اختبار → عرض.",
    );
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4" dir="rtl" data-testid="game-planning-lab">
      <p className="font-bold text-cyan-900">مختبر تخطيط اللعبة</p>
      <p className="mt-1 text-sm text-slate-700">
        رتّب خطوات بناء لعبة برمجية — عيّن لكل خطوة رقمًا من 1 (أولًا) إلى 5 (أخيرًا).
      </p>

      <ul className="mt-4 space-y-3">
        {GAME_BUILD_STEPS.map((step) => (
          <li
            key={step.id}
            className="flex flex-wrap items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm"
          >
            <span className="flex-1 font-medium text-slate-800">{step.label}</span>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              الترتيب
              <select
                value={ranks[step.id]}
                onChange={(e) => setRank(step.id, e.target.value)}
                className="rounded border border-slate-300 px-2 py-1"
                data-testid={`rank-${step.id}`}
              >
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={checkOrder} className="edu-btn edu-btn-primary text-sm">
          تحقق من الترتيب
        </button>
        <button type="button" onClick={revealHint} className="edu-btn edu-btn-outline text-sm">
          تلميح ({hints}/2)
        </button>
      </div>
      {feedback ? <p className="mt-3 text-sm font-semibold text-slate-800">{feedback}</p> : null}
    </div>
  );
}
