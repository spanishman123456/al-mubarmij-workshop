import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { pythonExercises } from "../data/pythonExercises";
import { curriculumUnits } from "../data/curriculum";
import { ensureSkulptLoaded, runPythonWithSkulpt } from "../lib/skulptRun";

export default function PythonLab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const exFromUrl = searchParams.get("ex");

  const [activeId, setActiveId] = useState(pythonExercises[0].id);
  const [unitFilter, setUnitFilter] = useState("all");

  const exercise = useMemo(
    () => pythonExercises.find((e) => e.id === activeId) ?? pythonExercises[0],
    [activeId]
  );

  const [code, setCode] = useState(exercise.starter);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const filteredExercises = useMemo(() => {
    if (unitFilter === "all") return pythonExercises;
    return pythonExercises.filter((e) => e.unitId === unitFilter);
  }, [unitFilter]);

  const pick = useCallback((id) => {
    const ex = pythonExercises.find((e) => e.id === id);
    if (!ex) return;
    setActiveId(id);
    setCode(ex.starter);
    setOut("");
    setErr("");
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("ex", id);
      return next;
    });
  }, [setSearchParams]);

  useEffect(() => {
    ensureSkulptLoaded().catch(() => {});
  }, []);

  useEffect(() => {
    if (exFromUrl && pythonExercises.some((e) => e.id === exFromUrl)) {
      const ex = pythonExercises.find((e) => e.id === exFromUrl);
      setActiveId(exFromUrl);
      setCode(ex.starter);
      setOut("");
      setErr("");
      if (ex?.unitId) setUnitFilter(ex.unitId);
    }
  }, [exFromUrl]);

  function onUnitFilterChange(next) {
    setUnitFilter(next);
    if (next === "all") return;
    const list = pythonExercises.filter((e) => e.unitId === next);
    if (list.length && !list.some((e) => e.id === activeId)) {
      const first = list[0];
      setActiveId(first.id);
      setCode(first.starter);
      setOut("");
      setErr("");
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set("ex", first.id);
        return p;
      });
    }
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
            تمارين مرتبطة بوحدات المسار — صفوف 4–8. استخدم الفلتر أدناه لتضييق القائمة حسب الموضوع.
          </p>
        </motion.div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-400">فلتر الوحدة:</label>
          <select
            dir="ltr"
            value={unitFilter}
            onChange={(e) => onUnitFilterChange(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
          >
            <option value="all">كل الوحدات</option>
            {curriculumUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.titleAr}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {filteredExercises.map((ex) => (
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
            <p className="mt-3 text-xs text-amber-200/90">{exercise.hintAr}</p>
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
              التشغيل يتم في المتصفح عبر Skulpt — مناسب للورشة دون تثبيت بايثون على كل جهاز.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
