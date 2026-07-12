import { APPKIT_COMMANDS } from "../../data/appkitReference";
import { SKUI_EXAMPLES } from "../../data/skuiExamples";

export function AppModeHelp({ onInsertExample, variant = "dark" }) {
  const isDark = variant === "dark";
  const box = isDark
    ? "rounded-xl border border-cyan-500/25 bg-cyan-950/20 p-4"
    : "rounded-xl border border-cyan-200 bg-cyan-50 p-4";
  const title = isDark ? "text-sm font-bold text-cyan-200" : "text-sm font-bold text-cyan-900";
  const text = isDark ? "text-xs text-slate-300" : "text-xs text-slate-700";
  const code = isDark ? "font-mono text-cyan-300" : "font-mono text-cyan-800";
  const btn = isDark
    ? "rounded-lg border border-cyan-500/40 bg-cyan-900/40 px-3 py-1.5 text-xs font-bold text-cyan-100 hover:bg-cyan-900/60"
    : "rounded-lg border border-cyan-300 bg-white px-3 py-1.5 text-xs font-bold text-cyan-900 hover:bg-cyan-50";

  return (
    <div className={box}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className={title}>أوامر مشروع الواجهة الرسومية (skui)</h3>
        {onInsertExample ? (
          <button type="button" className={btn} onClick={() => onInsertExample(SKUI_EXAMPLES[0].code)}>
            إدراج مثال جاهز
          </button>
        ) : null}
      </div>
      <p className={`mt-2 ${text}`}>
        ابدأ دائمًا بـ <span dir="ltr" className={code}>import skui as ui</span> — مكتبة مدمجة أصلًا
        لـ Skulpt والمتصفح. ليست Tkinter ولا تعتمد على CPython.
      </p>
      {onInsertExample ? (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="أمثلة skui المختبرة">
          {SKUI_EXAMPLES.slice(1).map((example) => (
            <button
              key={example.id}
              type="button"
              className={btn}
              onClick={() => onInsertExample(example.code)}
            >
              {example.titleAr}
            </button>
          ))}
        </div>
      ) : null}
      <ul className={`mt-3 max-h-48 space-y-1.5 overflow-y-auto ${text}`}>
        {APPKIT_COMMANDS.map((c) => (
          <li key={c.sig} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <span dir="ltr" className={`shrink-0 ${code}`}>
              {c.sig}
            </span>
            <span className="opacity-90">— {c.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
