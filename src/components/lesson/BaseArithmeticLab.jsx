import { useState } from "react";
import { addInBase, subtractBinaryUnsigned } from "../../lib/numberSystems/baseArithmetic";
import { recordLessonAttemptApi } from "../../lib/platformApi";

export function BaseArithmeticLab({ lessonId, userId }) {
  const [a, setA] = useState("1011");
  const [b, setB] = useState("1101");
  const [base, setBase] = useState(2);
  const [mode, setMode] = useState("add");
  const [feedback, setFeedback] = useState("");

  function compute() {
    const r = mode === "add" ? addInBase(a, b, base) : subtractBinaryUnsigned(a, b);
    if (!r.ok) {
      setFeedback(r.error === "negative_unsigned" ? "الطرح: يجب a ≥ b" : "رقم غير صالح");
      return;
    }
    setFeedback(`الناتج: ${r.result} (تحقق عشري: ${r.verified !== false ? "✓" : "?"})`);
    if (userId) {
      recordLessonAttemptApi(userId, { lessonId, exerciseId: "base-arith", answer: r.result, correct: true });
    }
  }

  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4" dir="rtl">
      <div className="flex flex-wrap gap-2">
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="rounded border px-2 py-1 text-sm">
          <option value="add">جمع</option>
          <option value="sub">طرح ثنائي</option>
        </select>
        <select value={base} onChange={(e) => setBase(Number(e.target.value))} className="rounded border px-2 py-1 text-sm" disabled={mode === "sub"}>
          <option value={2}>أساس 2</option>
          <option value={16}>hex</option>
          <option value={5}>أساس 5</option>
        </select>
      </div>
      <div className="mt-2 flex gap-2" dir="ltr">
        <input className="rounded border px-2 font-mono" value={a} onChange={(e) => setA(e.target.value)} />
        <span>{mode === "add" ? "+" : "−"}</span>
        <input className="rounded border px-2 font-mono" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      <button type="button" className="edu-btn edu-btn-primary mt-2 text-sm" onClick={compute}>
        احسب
      </button>
      {feedback ? <p className="mt-2 text-sm font-semibold">{feedback}</p> : null}
    </div>
  );
}
