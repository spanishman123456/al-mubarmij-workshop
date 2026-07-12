import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SkuiPreviewFrame } from "../components/python/SkuiPreviewFrame";
import { PythonAppSession } from "../lib/skulptAppRun";
import { loadWebAppPreview } from "../lib/webAppPreview";

export default function WebAppPreviewPage() {
  const [searchParams] = useSearchParams();
  const [project] = useState(() => loadWebAppPreview(searchParams.get("id")));
  const [ui, setUi] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(Boolean(project));
  const sessionRef = useRef(null);

  const run = useCallback(async () => {
    if (!project) return;
    sessionRef.current?.destroy();
    setLoading(true);
    setFeedback(null);
    setUi(null);
    const session = new PythonAppSession();
    session.onSnapshot = setUi;
    session.onError = setFeedback;
    sessionRef.current = session;
    try {
      const result = await session.load(project.code);
      setUi(result.ui);
    } catch (error) {
      setFeedback(error?.feedback || { headlineAr: error?.message || "تعذر تشغيل المشروع." });
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    queueMicrotask(run);
    return () => sessionRef.current?.destroy();
  }, [run]);

  async function handleEvent(id, eventName, value, values) {
    if (!sessionRef.current) return;
    try {
      const result = await sessionRef.current.event(id, eventName, value, values);
      if (result.ui) setUi(result.ui);
    } catch (error) {
      setFeedback(error?.feedback || { headlineAr: error?.message || "تعذر تنفيذ الحدث." });
    }
  }

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-white" dir="rtl">
        <section className="max-w-lg rounded-3xl border border-red-400/25 bg-red-950/30 p-8">
          <h1 className="text-2xl font-black">انتهت معاينة WebApp أو تعذر فتحها</h1>
          <p className="mt-3 text-slate-300">ارجع إلى المشروع واضغط «فتح WebApp مباشرة» مرة أخرى.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070b18] p-3 text-white sm:p-6" dir="rtl">
      <header className="mx-auto mb-4 flex max-w-6xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div>
          <p className="text-xs font-bold text-cyan-300">معاينة WebApp مباشرة</p>
          <h1 className="text-xl font-black">{project.title}</h1>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-xl bg-gradient-to-l from-violet-600 to-indigo-600 px-5 py-2 text-sm font-black disabled:opacity-50"
        >
          {loading ? "جاري التشغيل…" : "إعادة التشغيل"}
        </button>
      </header>
      <section className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-violet-400/20 shadow-2xl shadow-violet-950/40">
        {feedback ? (
          <div className="border-b border-red-400/20 bg-red-950/60 p-3 text-sm text-red-100">
            {feedback.headlineAr}
          </div>
        ) : null}
        <SkuiPreviewFrame
          ui={ui}
          loading={loading}
          onEvent={handleEvent}
          title={`WebApp — ${project.title}`}
          minHeight="calc(100vh - 150px)"
        />
      </section>
    </main>
  );
}
