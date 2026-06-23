import { useMemo, useState } from "react";

const AR = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";

function caesar(text, shift, decode = false) {
  const s = decode ? -shift : shift;
  return String(text || "")
    .split("")
    .map((ch) => {
      const i = AR.indexOf(ch);
      if (i >= 0) return AR[(i + s + AR.length) % AR.length];
      const ei = "abcdefghijklmnopqrstuvwxyz".indexOf(ch.toLowerCase());
      if (ei >= 0) {
        const base =
          ch === ch.toUpperCase()
            ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            : "abcdefghijklmnopqrstuvwxyz";
        return base[(ei + s + 26) % 26];
      }
      return ch;
    })
    .join("");
}

function caesarSteps(text, shift, decode) {
  const s = decode ? -shift : shift;
  const steps = [];
  for (const ch of text) {
    const i = AR.indexOf(ch);
    if (i >= 0) {
      const ni = (i + s + AR.length) % AR.length;
      steps.push(`${ch} (موضع ${i}) + ${s} → ${AR[ni]} (موضع ${ni})`);
    } else {
      const ei = "abcdefghijklmnopqrstuvwxyz".indexOf(ch.toLowerCase());
      if (ei >= 0) {
        const base =
          ch === ch.toUpperCase()
            ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            : "abcdefghijklmnopqrstuvwxyz";
        const ni = (ei + s + 26) % 26;
        steps.push(`${ch} → ${base[ni]}`);
      } else {
        steps.push(`${ch} → (بدون تغيير)`);
      }
    }
  }
  return steps;
}

export function CaesarCipherSim() {
  const [msg, setMsg] = useState("موهبة");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState("encode");

  const out = mode === "encode" ? caesar(msg, shift) : caesar(msg, shift, true);
  const steps = useMemo(() => caesarSteps(msg, shift, mode === "decode"), [msg, shift, mode]);

  return (
    <div className="space-y-4" dir="rtl">
      <textarea
        className="lab-input"
        rows={2}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm text-slate-300">
          الإزاحة: <strong className="text-cyan-300">{shift}</strong>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="flex-1 accent-cyan-500"
        />
        <select className="lab-select" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="encode">تشفير</option>
          <option value="decode">فك تشفير</option>
        </select>
      </div>
      <div className="lab-result text-lg">{out}</div>
      <details className="rounded-lg border border-slate-600 bg-slate-900/50 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-violet-300">
          شرح الإزاحة خطوة بخطوة
        </summary>
        <ol className="lab-steps mt-2 list-decimal">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
