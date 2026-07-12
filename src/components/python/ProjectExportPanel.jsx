import { useEffect, useMemo, useState } from "react";
import {
  analyzeExportCapabilities,
  exportProjectZip,
  exportWindowsExeKit,
  exportWebAppHtml,
  exportPwaZip,
} from "../../lib/projectExport";
import { openWebAppPreview } from "../../lib/webAppPreview";
import { checkProjectReadiness } from "../../lib/projectReadiness";

const EXPORT_ACTIONS = [
  { id: "zip", label: "تصدير الكود", sub: "Source ZIP منظم مع WebApp", fn: exportProjectZip, capKey: "zip" },
  {
    id: "web",
    label: "فتح WebApp في تبويب جديد",
    sub: "معاينة مباشرة دون فك ZIP",
    fn: openWebAppPreview,
    capKey: "webApp",
  },
  {
    id: "webzip",
    label: "تنزيل WebApp ZIP",
    sub: "حزمة مستقلة للاستضافة الثابتة",
    fn: exportWebAppHtml,
    capKey: "webApp",
  },
  {
    id: "pwa",
    label: "تصدير PWA",
    sub: "قيد التطوير — لم يُثبت التثبيت الفعلي",
    fn: exportPwaZip,
    capKey: "pwa",
    disabled: true,
    disabledReason: "قيد التطوير — لا تُعرض كميزة مكتملة حتى نجاح اختبار التثبيت.",
  },
  {
    id: "exe",
    label: "تصدير Windows",
    sub: "غير متاح حاليًا — قيد استكمال نظام البناء",
    fn: exportWindowsExeKit,
    capKey: "exe",
    disabled: true,
    disabledReason: "تصدير Windows غير متاح حاليًا — قيد استكمال التحقق من التثبيت.",
  },
];

function exportPayload(props, settings) {
  const { title, code, mode, authorName, templateId, ownerId, projectId } = props;
  return { title, code, mode, authorName, templateId, ownerId, projectId, ...settings };
}

export function ProjectExportPanel({
  title,
  code,
  mode,
  authorName,
  templateId = null,
  ownerId = null,
  projectId = null,
  variant = "dark",
  compact = false,
  lastRunOk = false,
  lastRunCodeHash = null,
}) {
  const [busy, setBusy] = useState(null);
  const [toast, setToast] = useState(null);
  const [settings] = useState({
    description: "",
    version: "1.0.0",
    projectType: "application",
    lang: "ar",
    direction: "rtl",
    orientation: "any",
    authorVisibility: "hidden",
    themeColor: "#7c3aed",
    signingMode: "educational",
  });
  const [history, setHistory] = useState([]);
  const [readinessNote, setReadinessNote] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    try {
      const local = JSON.parse(localStorage.getItem(`skui-export-history:${ownerId}`) || "[]");
      setHistory(Array.isArray(local) ? local.slice(0, 10) : []);
    } catch {
      setHistory([]);
    }
    fetch(`/api/exports?ownerId=${encodeURIComponent(ownerId)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.jobs?.length) {
          setHistory((prev) =>
            [
              ...data.jobs.map((job) => ({
                id: job.id,
                name: job.metadata?.name || title,
                target: job.target,
                status: job.status,
                at: job.createdAt,
              })),
              ...prev,
            ].slice(0, 10),
          );
        }
      })
      .catch(() => {});
  }, [ownerId, title]);

  const caps = useMemo(
    () => analyzeExportCapabilities(code, mode, { templateId, title }),
    [code, mode, templateId, title],
  );

  useEffect(() => {
    let cancelled = false;
    checkProjectReadiness({ title, code, mode, lastRunOk, lastRunCodeHash }).then((result) => {
      if (!cancelled) setReadinessNote(result);
    });
    return () => {
      cancelled = true;
    };
  }, [title, code, mode, lastRunOk, lastRunCodeHash]);

  function showToast(result) {
    setToast(result);
    setTimeout(() => setToast(null), 8000);
  }

  async function handleExport(action) {
    if (action.disabled) {
      showToast({ ok: false, message: action.disabledReason });
      return;
    }
    const cap = caps[action.capKey];
    if (!cap?.ok) {
      showToast({
        ok: false,
        message: cap?.message || "التصدير غير متاح لهذا المشروع.",
      });
      return;
    }
    setBusy(action.id);
    try {
      const result = await action.fn(
        exportPayload({ title, code, mode, authorName, templateId, ownerId, projectId }, settings),
      );
      showToast(result);
      const record = {
        id: result.job?.id || `${Date.now()}-${action.id}`,
        name: title,
        target: action.id,
        status: result.ok ? "completed" : "failed",
        at: new Date().toISOString(),
      };
      setHistory((prev) => {
        const next = [record, ...prev.filter((item) => item.id !== record.id)].slice(0, 10);
        if (ownerId) {
          try {
            localStorage.setItem(`skui-export-history:${ownerId}`, JSON.stringify(next));
          } catch {
            /* storage is optional */
          }
        }
        return next;
      });
    } catch (e) {
      showToast({
        ok: false,
        message: "تعذر إنشاء ملف التصدير. يرجى مراجعة الكود أو استخدام خيار ZIP.",
        note: e?.message || undefined,
      });
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
        {EXPORT_ACTIONS.filter((action) => !action.disabled).map((action) => {
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
        افتح WebApp مباشرة أو نزّل ZIP — نفس محرك Skulpt وskui المستخدم في المعاينة.
      </p>

      {readinessNote ? (
        <div className={`mt-3 rounded-lg border p-2 text-xs ${isDark ? "border-white/10 bg-black/20 text-slate-300" : "border-slate-200 bg-white text-slate-700"}`}>
          <p>{readinessNote.statuses.preview}</p>
          <p>{readinessNote.statuses.webApp}</p>
          <p>{readinessNote.statuses.pwa}</p>
          <p>{readinessNote.statuses.windows}</p>
        </div>
      ) : null}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {EXPORT_ACTIONS.map((action) => {
          const cap = caps[action.capKey];
          const blocked = action.disabled || !cap?.ok;
          return (
            <button
              key={action.id}
              type="button"
              disabled={blocked || busy === action.id}
              onClick={() => handleExport(action)}
              className={`${btnBase} text-right`}
              data-testid={`export-action-${action.id}`}
            >
              <span className="block">{busy === action.id ? "جاري التصدير…" : action.label}</span>
              <span className={`mt-0.5 block font-normal ${subClass}`}>
                {action.disabled ? action.disabledReason : cap?.ok ? action.sub : cap?.message}
              </span>
            </button>
          );
        })}
      </div>

      <div className={`mt-3 rounded-lg p-2 text-xs ${isDark ? "bg-black/30 text-slate-400" : "bg-white text-slate-500"}`}>
        <p>
          <strong>WebApp:</strong> خياران منفصلان — فتح تبويب جديد أو تنزيل ZIP.
        </p>
        <p className="mt-1">
          <strong>PWA / Windows:</strong> معروضان كقيد التطوير حتى يكتمل التحقق الفعلي من التثبيت والتشغيل.
        </p>
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
      {history.length ? (
        <details className={`mt-3 rounded-lg p-3 text-xs ${isDark ? "bg-black/30 text-slate-300" : "bg-white text-slate-700"}`}>
          <summary className="cursor-pointer font-bold">سجل صادراتي ({history.length})</summary>
          <ul className="mt-2 space-y-1">
            {history.map((item) => (
              <li key={item.id} className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-1">
                <span>
                  {item.name} — {item.target}
                </span>
                <span>
                  {item.status} — {new Date(item.at).toLocaleString("ar-SA")}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
