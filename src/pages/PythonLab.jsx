import { useState } from "react";
import { motion } from "framer-motion";
import { pythonExercises } from "../data/pythonExercises";
import { runPythonWithSkulpt } from "../lib/skulptRun";

export default function PythonLab() {
  const [activeId, setActiveId] = useState(pythonExercises[0].id);
  const exercise = pythonExercises.find((e) => e.id === activeId) ?? pythonExercises[0];
  const [code, setCode] = useState(exercise.starter);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function pick(id) {
    const ex = pythonExercises.find((e) => e.id === id);
    setActiveId(id);
    setCode(ex.starter);
    setOut("");
    setErr("");
  }

  async function run() {
    setBusy(true);
    setOut("");
    setErr("");
    try {
      const text = await runPythonWithSkulpt(code);
      setOut(text);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-16 pt-24 font-ar text-white">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">مختبر بايثون</h1>
          <p className="mt-2 text-slate-400">
            تمارين متنوعة للصفوف 4–8 — مرتبطة بمسار مقرر «برمجة الحاسب» (تعليمات، حلقات، شروط، قوائم)
          </p>
        </motion.div>

        <div className="mb-6 flex flex-wrap gap-2">
          {pythonExercises.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => pick(ex.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                ex.id === activeId ? "bg-emerald-600 text-white" : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              {ex.titleAr}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-400">الكود</label>
            <textarea
              dir="ltr"
              className="code-editor min-h-[280px] w-full resize-y"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 font-bold text-white shadow-lg disabled:opacity-60"
            >
              {busy ? "جارٍ التشغيل…" : "تشغيل الكود"}
            </button>
            <p className="mt-3 text-xs text-amber-200/90">{ex.hintAr}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">المخرجات</label>
            <pre
              dir="ltr"
              className="min-h-[200px] whitespace-pre-wrap rounded-xl border border-white/10 bg-black/50 p-4 text-left font-mono text-sm text-emerald-200"
            >
              {err ? `خطأ:\n${err}` : out || "اضغط «تشغيل الكود»"}
            </pre>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              التشغيل يتم محلياً في المتصفح عبر Skulpt — مناسب للورشة دون الحاجة لتثبيت بايثون على كل جهاز.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
