import { useState } from "react";
import { toTwosComplement, fromTwosComplement } from "../../lib/numberSystems/twosComplement";
import { recordLessonAttemptApi } from "../../lib/platformApi";

export function TwosComplementLab({ lessonId, userId, bits = 8 }) {
  const [n, setN] = useState("-5");
  const [feedback, setFeedback] = useState("");

  function encode() {
    const num = Number(n);
    const r = toTwosComplement(num, bits);
    if (!r.ok) {
      setFeedback(r.error === "overflow" ? "خارج مجال n bits" : "خطأ");
      return;
    }
    setFeedback(`${num} → ${r.bits} (${bits} bit)`);
    if (userId) recordLessonAttemptApi(userId, { lessonId, exerciseId: "twos-enc", answer: r.bits, correct: true });
  }

  function decode() {
    const r = fromTwosComplement(n.replace(/\s/g, ""));
    setFeedback(r.ok ? `القيمة: ${r.value}` : "pattern غير صالح");
  }

  return (
    <div className="rounded-xl border border-violet-200 p-4" dir="rtl">
      <input className="w-full rounded border px-2 font-mono" dir="ltr" value={n} onChange={(e) => setN(e.target.value)} />
      <div className="mt-2 flex gap-2">
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={encode}>
          ترميز عدد
        </button>
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={decode}>
          فك bit pattern
        </button>
      </div>
      {feedback ? <p className="mt-2 text-sm font-semibold">{feedback}</p> : null}
    </div>
  );
}
