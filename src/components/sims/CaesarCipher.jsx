import { useMemo, useState } from "react";
import {
  caesarSteps,
  caesarTransform,
  getAlphabetRows,
} from "../../lib/logic/caesarCipher.js";

export function CaesarCipherSim() {
  const [msg, setMsg] = useState("موهبة");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState("encode");
  const [lang, setLang] = useState("both");

  const decode = mode === "decode";
  const out = useMemo(
    () => caesarTransform(msg, shift, { decode, lang }),
    [msg, shift, decode, lang],
  );
  const steps = useMemo(
    () => caesarSteps(msg, shift, { decode, lang }),
    [msg, shift, decode, lang],
  );
  const alphabet = useMemo(() => getAlphabetRows(lang), [lang]);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap gap-2">
        {[
          { id: "ar", label: "العربية" },
          { id: "en", label: "English" },
          { id: "both", label: "ثنائي اللغة" },
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLang(opt.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
              lang === opt.id ? "bg-violet-600 text-white" : "bg-slate-700 text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <textarea
        className="lab-input"
        rows={2}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        aria-label="النص المدخل"
      />

      <div className="overflow-x-auto rounded-xl border border-slate-600 bg-slate-900/50 p-3">
        <p className="mb-2 text-sm font-bold text-cyan-200">شريط الحروف والمواضع</p>
        <div className="flex flex-wrap gap-1" dir={lang === "en" ? "ltr" : "rtl"}>
          {alphabet.map((item) => (
            <span
              key={item.id}
              className="rounded-md bg-slate-800 px-1.5 py-0.5 text-xs text-slate-200"
              title={item.label}
            >
              {item.chars}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm text-slate-300">
          الإزاحة: <strong className="text-cyan-300">{shift}</strong>
          <span className="mr-2 text-xs text-slate-500">(سالب = عكس الاتجاه)</span>
        </label>
        <input
          type="range"
          min={-25}
          max={25}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="min-w-[12rem] flex-1 accent-cyan-500"
        />
        <select className="lab-select" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="encode">تشفير</option>
          <option value="decode">فك التشفير</option>
        </select>
      </div>

      <div className="lab-result text-lg">{out}</div>

      <details className="rounded-lg border border-slate-600 bg-slate-900/50 p-3" open>
        <summary className="cursor-pointer text-sm font-semibold text-violet-300">
          شرح الإزاحة خطوة بخطوة
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-800 text-cyan-200">
                <th className="border border-slate-600 px-2 py-1">الحرف</th>
                <th className="border border-slate-600 px-2 py-1">الموضع</th>
                <th className="border border-slate-600 px-2 py-1">الإزاحة</th>
                <th className="border border-slate-600 px-2 py-1">موضع جديد</th>
                <th className="border border-slate-600 px-2 py-1">النتيجة</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={i} className="text-slate-200">
                  <td className="border border-slate-600 px-2 py-1 text-center">{s.original}</td>
                  <td className="border border-slate-600 px-2 py-1 text-center">
                    {s.position ?? "—"}
                  </td>
                  <td className="border border-slate-600 px-2 py-1 text-center">{s.shift}</td>
                  <td className="border border-slate-600 px-2 py-1 text-center">
                    {s.newPosition ?? "—"}
                  </td>
                  <td className="border border-slate-600 px-2 py-1 text-center font-bold text-emerald-300">
                    {s.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
