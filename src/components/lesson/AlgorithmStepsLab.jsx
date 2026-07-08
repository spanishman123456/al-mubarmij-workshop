import { useState } from "react";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { validateAlgorithmStepOrder } from "../../lib/algorithms/stepOrdering";

const PRESETS = {
  "max-two": {
    label: "أكبر عددين",
    correct: ["اقرأ a و b", "إذا a > b فاجعل max = a وإلا max = b", "اطبع max"],
    pool: [
      "اطبع max",
      "اقرأ a و b",
      "إذا a > b فاجعل max = a وإلا max = b",
      "اقرأ c",
      "max = 0",
    ],
  },
};

export function AlgorithmStepsLab({ lessonId, userId, preset = "max-two" }) {
  const cfg = PRESETS[preset] || PRESETS["max-two"];
  const [order, setOrder] = useState(cfg.pool.map((_, i) => i));
  const [selected, setSelected] = useState(() => new Set(cfg.correct.map((step) => cfg.pool.indexOf(step)).filter((i) => i >= 0)));
  const [feedback, setFeedback] = useState("");

  function move(idx, dir) {
    const next = [...order];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setOrder(next);
    setFeedback("");
  }

  function check() {
    const { ok, picked } = validateAlgorithmStepOrder(cfg.pool, order, selected, cfg.correct);
    setFeedback(
      ok
        ? "ترتيب صحيح ✓"
        : "الترتيب غير صحيح. اختر الخطوات الصحيحة فقط ثم رتّبها: اقرأ → قرر → اطبع.",
    );
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "algorithm-steps-order",
        answer: picked.join(" | "),
        correct: ok,
      });
    }
  }

  function toggleStep(poolIdx) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(poolIdx)) next.delete(poolIdx);
      else next.add(poolIdx);
      return next;
    });
    setFeedback("");
  }

  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4" dir="rtl">
      <p className="font-semibold text-cyan-900">{cfg.label} — رتّب الخطوات (↑↓)</p>
      <p className="mt-1 text-xs text-slate-600">
        اختر أولًا الخطوات الصحيحة فقط، ثم رتّبها بالترتيب المنطقي.
      </p>
      <ul className="mt-3 space-y-2">
        {order.map((poolIdx, displayIdx) => (
          <li key={poolIdx} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={selected.has(poolIdx)}
              onChange={() => toggleStep(poolIdx)}
              className="mt-0.5"
              data-testid={`algorithm-step-pick-${poolIdx}`}
            />
            <span className="font-bold text-violet-700">{displayIdx + 1}.</span>
            <span className="flex-1">{cfg.pool[poolIdx]}</span>
            <button type="button" className="text-xs font-bold text-slate-600" onClick={() => move(displayIdx, -1)}>
              ↑
            </button>
            <button type="button" className="text-xs font-bold text-slate-600" onClick={() => move(displayIdx, 1)}>
              ↓
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="edu-btn edu-btn-primary mt-3 text-sm" onClick={check}>
        تحقق من الإجابة
      </button>
      {feedback ? <p className="mt-2 text-sm font-semibold text-slate-800">{feedback}</p> : null}
    </div>
  );
}
