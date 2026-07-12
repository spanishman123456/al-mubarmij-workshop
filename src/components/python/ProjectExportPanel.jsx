import { useEffect, useMemo, useState } from "react";
import {
  analyzeExportCapabilities,
  exportProjectZip,
  exportWindowsExeKit,
  exportWebAppHtml,
  exportPwaZip,
} from "../../lib/projectExport";

const EXPORT_ACTIONS = [
  { id: "zip", label: "تصدير الكود", sub: "Source ZIP منظم مع WebApp", fn: exportProjectZip, capKey: "zip" },
  {
    id: "exe",
    label: "تصدير Windows",
    sub: "Tauri 2 → EXE وMSI عبر Windows CI",
    fn: exportWindowsExeKit,
    capKey: "exe",
  },
  { id: "web", label: "تصدير WebApp ZIP", sub: "حزمة مستقلة للاستضافة الثابتة", fn: exportWebAppHtml, capKey: "webApp" },
  { id: "pwa", label: "تصدير PWA", sub: "تثبيت وعمل دون اتصال", fn: exportPwaZip, capKey: "pwa" },
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
}) {
  const [busy, setBusy] = useState(null);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
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
          setHistory((prev) => [
            ...data.jobs.map((job) => ({
              id: job.id,
              name: job.metadata?.name || title,
              target: job.target,
              status: job.status,
              at: job.createdAt,
            })),
            ...prev,
          ].slice(0, 10));
        }
      })
      .catch(() => {});
  }, [ownerId, title]);

  const caps = useMemo(
    () => analyzeExportCapabilities(code, mode, { templateId, title }),
    [code, mode, templateId, title],
  );

  function showToast(result) {
    setToast(result);
    setTimeout(() => setToast(null), 8000);
  }

  async function handleExport(action) {
    const cap = caps[action.capKey];
    if (!cap?.ok) {
      showToast({
        ok: false,
        message:
          action.id === "exe"
            ? `${cap?.message || "تعذر إنشاء حزمة EXE."} جرّب تصدير ZIP أو Web App.`
            : cap?.message || "التصدير غير متاح لهذا المشروع.",
        note: action.id === "exe" ? "للمشاريع غير المدعومة، ZIP هو البديل الموصى به." : undefined,
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
        status: result.ok ? (action.id === "exe" ? "queued" : "completed") : "failed",
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
        حوّل مشروعك إلى منتج مستقل يعمل بمحرك Skulpt وskui نفسه.
      </p>

      <ol className={`mt-3 grid gap-1 text-xs sm:grid-cols-3 ${subClass}`}>
        <li>1. اختيار المشروع: <strong>{title || "غير مسمى"}</strong></li>
        <li>2. اختيار الصيغة أدناه</li>
        <li>3. إعداد بيانات التطبيق</li>
        <li>4. فحص الجاهزية: <strong>{Object.values(caps).some((cap) => cap?.ok) ? "جاهز" : "يحتاج تصحيحًا"}</strong></li>
        <li>5. إنشاء الحزمة</li>
        <li>6. التنزيل أو متابعة Windows</li>
      </ol>

      <details className={`mt-3 rounded-lg border p-3 ${isDark ? "border-white/10 bg-black/20" : "border-slate-200 bg-white"}`}>
        <summary className="cursor-pointer text-xs font-bold">إعداد اسم وأيقونة التطبيق</summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input
            value={settings.description}
            onChange={(event) => setSettings((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="وصف التطبيق"
            className="rounded border border-white/20 bg-black/20 px-2 py-1.5 text-xs"
          />
          <input
            dir="ltr"
            value={settings.version}
            onChange={(event) => setSettings((prev) => ({ ...prev, version: event.target.value }))}
            placeholder="1.0.0"
            className="rounded border border-white/20 bg-black/20 px-2 py-1.5 text-xs"
          />
          <select
            value={settings.authorVisibility}
            onChange={(event) => setSettings((prev) => ({ ...prev, authorVisibility: event.target.value }))}
            className="rounded border border-white/20 bg-black/20 px-2 py-1.5 text-xs"
          >
            <option value="hidden">عدم إظهار اسم المطور</option>
            <option value="alias">استخدام اسم مستعار</option>
            <option value="name">إظهار اسمي</option>
          </select>
          <select
            value={settings.direction}
            onChange={(event) => setSettings((prev) => ({ ...prev, direction: event.target.value }))}
            className="rounded border border-white/20 bg-black/20 px-2 py-1.5 text-xs"
          >
            <option value="rtl">العربية — RTL</option>
            <option value="ltr">English — LTR</option>
          </select>
          <select
            value={settings.signingMode}
            onChange={(event) => setSettings((prev) => ({ ...prev, signingMode: event.target.value }))}
            className="rounded border border-white/20 bg-black/20 px-2 py-1.5 text-xs"
          >
            <option value="educational">Windows تعليمي — غير موقّع</option>
            <option value="official">Windows رسمي — يتطلب توقيع Authenticode</option>
          </select>
        </div>
      </details>

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
        <p><strong>الجوال:</strong> استخدم PWA للتثبيت والعمل دون اتصال.</p>
        <p className="mt-1"><strong>Windows:</strong> تطبيق ويب تعليمي مغلف بـTauri 2، وليس تحويلًا إلى CPython.</p>
        <p className="mt-1"><strong>التوقيع:</strong> الوضع الرسمي يفشل بأمان إذا لم تكن شهادة Authenticode مهيأة؛ الوضع التعليمي ينتج حزمة موسومة بوضوح كغير موقّعة.</p>
        <p className="mt-1 opacity-90">لا يُنفذ كود الطالب على خادم البناء، ولا تتضمن الحزم أسرار المنصة.</p>
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
                <span>{item.name} — {item.target}</span>
                <span>{item.status} — {new Date(item.at).toLocaleString("ar-SA")}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
