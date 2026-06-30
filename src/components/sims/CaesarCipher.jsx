import { useMemo, useState } from "react";
import {
  caesarSteps,
  caesarTransform,
  getAlphabetRows,
} from "../../lib/logic/caesarCipher.js";

const LANG_OPTIONS = [
  { id: "ar", label: "العربية", placeholder: "موهبة" },
  { id: "en", label: "English", placeholder: "HELLO" },
  { id: "both", label: "ثنائي اللغة", placeholder: "Hello موهبة" },
];

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
  const placeholder = LANG_OPTIONS.find((o) => o.id === lang)?.placeholder ?? "";

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap gap-2">
        {LANG_OPTIONS.map((opt) => (
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
        placeholder={placeholder}
        aria-label="النص المدخل"
      />

      {lang === "en" ? (
        <p className="text-xs text-cyan-200/90">
          وضع الإنجليزية: A=0 … Z=25 — الحروف الكبيرة والصغيرة مدعومة مع الالتفاف من Z إلى A.
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-600 bg-slate-900/50 p-3">
        <p className="mb-2 text-sm font-bold text-cyan-200">شريط الحروف والمواضع</p>
        <div className="flex flex-wrap gap-1" dir={lang === "en" ? "ltr" : "rtl"}>
          {alphabet.map((item) => (
            <span
              key={item.id}
              className="rounded-md bg-slate-800 px-1.5 py-0.5 text-xs text-slate-200"
              title={item.label}
            >
              <span className="font-bold">{item.chars}</span>
              <span className="mx-0.5 text-slate-500">=</span>
              <span className="text-cyan-300">{item.label.split("=")[1]?.trim()}</span>
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

      <section className="rounded-lg border border-slate-600 bg-slate-900/50 p-3" aria-label="شرح الإزاحة خطوة بخطوة">
        <h3 className="text-sm font-semibold text-violet-300">شرح الإزاحة خطوة بخطوة</h3>

        <div className="mt-3 hidden overflow-x-auto md:block">
          <table className="caesar-steps-table w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-800 text-cyan-200">
                <th className="border border-slate-600">الحرف</th>
                <th className="border border-slate-600">الموضع</th>
                <th className="border border-slate-600">الإزاحة</th>
                <th className="border border-slate-600">موضع جديد</th>
                <th className="border border-slate-600">النتيجة</th>
                <th className="border border-slate-600 min-w-[12rem]">الشرح</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={i} className={`text-slate-200 ${s.wrapped ? "bg-cyan-950/30" : ""}`}>
                  <td className="border border-slate-600 font-bold">{s.original}</td>
                  <td className="border border-slate-600">
                    {s.positionLabel ?? (s.position ?? "—")}
                  </td>
                  <td className="border border-slate-600">{s.shift}</td>
                  <td className="border border-slate-600">
                    {s.resultLabel ?? (s.newPosition ?? "—")}
                  </td>
                  <td className="border border-slate-600 font-bold text-emerald-300">{s.result}</td>
                  <td className="border border-slate-600 text-start text-xs text-slate-300" dir="ltr">
                    {s.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 space-y-2 md:hidden">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`caesar-step-card${s.wrapped ? " caesar-step-card--wrap" : ""}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-bold text-white">
                  {s.original} → <span className="text-emerald-300">{s.result}</span>
                </span>
                {s.wrapped ? (
                  <span className="rounded bg-cyan-900/60 px-2 py-0.5 text-xs text-cyan-200">
                    wrap-around
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                موضع: {s.positionLabel ?? "—"} | إزاحة: {s.shift} | جديد:{" "}
                {s.resultLabel ?? "—"}
              </p>
              <p className="caesar-step-explain">{s.explanation}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
