import { useMemo, useState } from "react";
import {
  fromTwosComplement,
  rangeForBits,
  subtractViaTwosComplement,
  toTwosComplement,
} from "../../lib/numberSystems/twosComplement";
import { recordLessonAttemptApi } from "../../lib/platformApi";

export function TwosComplementLab({ lessonId, userId, bits = 8 }) {
  const [n, setN] = useState("-5");
  const [activeBits, setActiveBits] = useState(bits);
  const [a, setA] = useState("7");
  const [b, setB] = useState("3");
  const [studentResultBits, setStudentResultBits] = useState("");
  const [studentResultValue, setStudentResultValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const range = useMemo(() => rangeForBits(activeBits), [activeBits]);

  function encode() {
    const num = Number(n);
    const r = toTwosComplement(num, activeBits);
    if (!r.ok) {
      setFeedback(
        r.error === "overflow"
          ? `خارج مجال ${activeBits}-bit (${range.min} .. ${range.max})`
          : "خطأ في الإدخال",
      );
      return;
    }
    setFeedback(`${num} → ${r.bits} (${activeBits} bit)`);
    if (userId) recordLessonAttemptApi(userId, { lessonId, exerciseId: "twos-enc", answer: r.bits, correct: true });
  }

  function decode() {
    const r = fromTwosComplement(n.replace(/\s/g, ""));
    setFeedback(r.ok ? `القيمة: ${r.value}` : "pattern غير صالح");
  }

  function verifySubtraction() {
    const left = Number(a);
    const right = Number(b);
    if (!Number.isInteger(left) || !Number.isInteger(right)) {
      setFeedback("أدخل عددين صحيحين في a و b.");
      return;
    }
    const expected = subtractViaTwosComplement(left, right, activeBits);
    if (!expected.ok) {
      setFeedback(`العملية خارج مجال ${activeBits}-bit. راجع الحدود: ${range.min} .. ${range.max}`);
      return;
    }
    const userBits = String(studentResultBits || "").trim().replace(/\s/g, "");
    const userValue = Number(String(studentResultValue || "").trim());
    const bitsOk = userBits === expected.bits;
    const valueOk = Number.isFinite(userValue) && userValue === expected.value;
    const ok = bitsOk && valueOk;
    setFeedback(
      ok
        ? `✓ صحيح: ${left} - ${right} = ${expected.value} ، البتات = ${expected.bits}${
            expected.overflow ? " (overflow signed)" : ""
          }`
        : `غير صحيح. الناتج الصحيح: value=${expected.value} ، bits=${expected.bits}.${
            expected.discardedCarry ? " تم تجاهل carry الخارج من البت الأعلى." : ""
          }`,
    );
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "twos-subtract-check",
        answer: `a=${left},b=${right},bits=${userBits},value=${studentResultValue}`,
        correct: ok,
      });
    }
  }

  return (
    <div className="rounded-xl border border-violet-200 p-4" dir="rtl">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-semibold">عرض البتات:</span>
        {[4, 8].map((w) => (
          <button
            key={w}
            type="button"
            className={`rounded border px-3 py-1 text-xs font-bold ${activeBits === w ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white text-slate-700"}`}
            onClick={() => setActiveBits(w)}
          >
            {w}-bit
          </button>
        ))}
        <span className="text-xs text-slate-500" dir="ltr">
          {range.min} .. {range.max}
        </span>
      </div>

      <input
        className="w-full rounded border px-2 font-mono"
        dir="ltr"
        value={n}
        onChange={(e) => setN(e.target.value)}
        data-testid="twos-main-input"
      />
      <div className="mt-2 flex gap-2">
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={encode} data-testid="twos-encode-btn">
          ترميز عدد
        </button>
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={decode} data-testid="twos-decode-btn">
          فك bit pattern
        </button>
      </div>

      <div className="mt-5 rounded-lg border border-cyan-200 bg-cyan-50/50 p-3">
        <p className="mb-2 text-sm font-bold text-cyan-900">تحقق الطرح بمكمل 2</p>
        <p className="mb-2 text-xs text-slate-600">
          اكتب الناتج النهائي بعد <span dir="ltr">a + (-b)</span> مع تجاهل carry الخارج، وحدد إن كانت هناك overflow.
        </p>
        <div className="grid gap-2 sm:grid-cols-2" dir="ltr">
          <input
            className="rounded border px-2 py-1 font-mono"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="a"
            data-testid="twos-a-input"
          />
          <input
            className="rounded border px-2 py-1 font-mono"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="b"
            data-testid="twos-b-input"
          />
          <input
            className="rounded border px-2 py-1 font-mono"
            value={studentResultBits}
            onChange={(e) => setStudentResultBits(e.target.value)}
            placeholder="result bits"
            data-testid="twos-result-bits-input"
          />
          <input
            className="rounded border px-2 py-1 font-mono"
            value={studentResultValue}
            onChange={(e) => setStudentResultValue(e.target.value)}
            placeholder="result value"
            data-testid="twos-result-value-input"
          />
        </div>
        <button
          type="button"
          className="edu-btn edu-btn-primary mt-3 text-sm"
          onClick={verifySubtraction}
          data-testid="twos-subtraction-check-btn"
        >
          تحقق من حل الطرح
        </button>
      </div>

      {feedback ? <p className="mt-2 text-sm font-semibold">{feedback}</p> : null}
    </div>
  );
}
