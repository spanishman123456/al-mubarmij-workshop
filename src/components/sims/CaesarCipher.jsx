import { useState } from "react";

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
        const base = ch === ch.toUpperCase() ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "abcdefghijklmnopqrstuvwxyz";
        return base[(ei + s + 26) % 26];
      }
      return ch;
    })
    .join("");
}

export function CaesarCipherSim() {
  const [msg, setMsg] = useState("موهبة");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState("encode");

  const out = mode === "encode" ? caesar(msg, shift) : caesar(msg, shift, true);

  return (
    <div className="space-y-4 font-ar text-right" dir="rtl">
      <p className="text-sm text-slate-400">شيفرة الإزاحة — جرّب التشفير وفك التشفير بنفسك.</p>
      <textarea className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white" rows={2} value={msg} onChange={(e) => setMsg(e.target.value)} />
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-sm">الإزاحة: {shift}</label>
        <input type="range" min={1} max={10} value={shift} onChange={(e) => setShift(Number(e.target.value))} className="flex-1" />
        <select className="rounded-lg border border-white/10 bg-[#1a2038] px-3 py-2 text-white" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="encode">تشفير</option>
          <option value="decode">فك تشفير</option>
        </select>
      </div>
      <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-lg">{out}</div>
      <p className="text-xs text-slate-500">تلميح: كل حرف يُزاح بعدد مواضع ثابت في الأبجدية.</p>
    </div>
  );
}
