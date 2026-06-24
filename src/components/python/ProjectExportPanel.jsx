import { useMemo, useState } from "react";
import {
  analyzeExportCapabilities,
  exportProjectZip,
  exportWindowsExeKit,
  exportWebAppHtml,
  exportPwaZip,
} from "../../lib/projectExport";

const EXPORT_ACTIONS = [
  { id: "zip", label: "تصدير ZIP", sub: "الكود + README + Web App + بناء EXE", fn: exportProjectZip, capKey: "zip" },
  { id: "exe", label: "تصدير EXE (Windows)", sub: "حزمة PyInstaller — يُبنى على Windows", fn: exportWindowsExeKit, capKey: "exe" },
  { id: "web", label: "تصدير Web App", sub: "ملف HTML للمتصفح", fn: exportWebAppHtml, capKey: "webApp" },
  { id: "pwa", label: "تصدير PWA", sub: "حزمة للجوال والتابلت", fn: exportPwaZip, capKey: "pwa" },
];

export function ProjectExportPanel({ title, code, mode, authorName, variant = "dark", compact = false }) {
  const [busy, setBusy] = useState(null);
  const [toast, setToast] = useState(null);

  const caps = useMemo(() => analyzeExportCapabilities(code, mode), [code, mode]);

  function showToast(result) {
    setToast(result);
    setTimeout(() => setToast(null), 8000);
  }

  async function handleExport(action) {
    const cap = caps[action.capKey];
    if (!cap?.ok) {
      showToast({ ok: false, message: cap?.message || "التصدير غير متاح لهذا المشروع." });
      return;
    }
    setBusy(action.id);
    try {
      const result = action.fn({ title, code, mode, authorName });
      showToast(result);
    } catch (e) {
      showToast({ ok: false, message: e?.message || "فشل التصدير — حاول مجددًا." });
    } finally {
      setBusy(null);
    }
  }

  const isDark = variant === "dark";
  const boxClass = isDark
    ? "rounded-xl border border-amber-500/30 bg-amber-950/20 p-4"
    : "rounded-xl border border-amber-200 bg-amber-50 p-4";
  const titleClass = isDark ? "text-sm font-bold text-amber-200" : "text-sm font-bold text-amber-900";
  const subClass = isDark ? "text-xs text-slate-400" : "text-xs text-slate-600";
  const btnBase = isDark
    ? "rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs font-bold text-slate-100 hover:bg-white/10 disabled:opacity-40"
    : "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-40";

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {EXPORT_ACTIONS.map((action) => {
          const cap = caps[action.capKey];
          return (
            <button
              key={action.id}
              type="button"
              disabled={!cap?.ok || busy === action.id}
              title={cap?.message}
              onClick={() => handleExport(action)}
              className={btnBase}
            >
              {busy === action.id ? "…" : action.label}
            </button>
          );
        })}
        {toast ? (
          <p className={`w-full text-xs ${toast.ok ? (isDark ? "text-emerald-300" : "text-emerald-700") : isDark ? "text-amber-200" : "text-amber-800"}`}>
            {toast.message}
            {toast.note ? ` — ${toast.note}` : ""}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={boxClass}>
      <h3 className={titleClass}>تصدير المشروع</h3>
      <p className={`mt-1 ${subClass}`}>
        حوّل مشروعك إلى ملف مستقل — ZIP دائمًا متاح؛ EXE لـ Windows؛ Web App / PWA للجوال.
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {EXPORT_ACTIONS.map((action) => {
          const cap = caps[action.capKey];
          return (
            <button
              key={action.id}
              type="button"
              disabled={!cap?.ok || busy === action.id}
              onClick={() => handleExport(action)}
              className={`${btnBase} text-right`}
            >
              <span className="block">{busy === action.id ? "جاري التصدير…" : action.label}</span>
              <span className={`mt-0.5 block font-normal ${subClass}`}>{cap?.ok ? action.sub : cap?.message}</span>
            </button>
          );
        })}
      </div>

      <div className={`mt-3 rounded-lg p-2 text-xs ${isDark ? "bg-black/30 text-slate-400" : "bg-white text-slate-500"}`}>
        <p>📱 <strong>الجوال:</strong> استخدم Web App أو PWA — ملف exe لا يعمل على Android/iOS.</p>
        <p className="mt-1">🖥️ <strong>Windows:</strong> حمّل حزمة EXE وشغّل <span dir="ltr">build_windows.bat</span></p>
        <p className="mt-1 opacity-80">📦 APK: {caps.apk.message}</p>
      </div>

      {toast ? (
        <div
          className={`mt-3 rounded-lg p-3 text-sm ${
            toast.ok
              ? isDark
                ? "border border-emerald-500/30 bg-emerald-950/40 text-emerald-100"
                : "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : isDark
                ? "border border-red-500/30 bg-red-950/40 text-red-100"
                : "border border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {toast.ok ? "✓ " : "✗ "}
          {toast.message}
          {toast.note ? <p className="mt-1 text-xs opacity-90">{toast.note}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
