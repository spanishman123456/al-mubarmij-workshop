import { useState } from "react";
import { recordLessonAttemptApi } from "../../lib/platformApi";

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
    const selected = order.map((i) => cfg.pool[i]);
    const ok =
      selected.length === cfg.correct.length && selected.every((s, i) => s === cfg.correct[i]);
    setFeedback(ok ? "ترتيب صحيح ✓" : "الترتيب غير صحيح — راجع: اقرأ → قرر → اطبع");
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "algorithm-steps-order",
        answer: selected.join(" | "),
        correct: ok,
      });
    }
  }

  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4" dir="rtl">
      <p className="font-semibold text-cyan-900">{cfg.label} — رتّب الخطوات (↑↓)</p>
      <ul className="mt-3 space-y-2">
        {order.map((poolIdx, displayIdx) => (
          <li key={poolIdx} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm">
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
        تحقق من الترتيب
      </button>
      {feedback ? <p className="mt-2 text-sm font-semibold text-slate-800">{feedback}</p> : null}
    </div>
  );
}
