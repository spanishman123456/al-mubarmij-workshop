import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { pythonExercises } from "../data/pythonExercises";
import { GRAPHIC_APP_PROJECTS } from "../data/graphicAppProjects";
import { curriculumUnits } from "../data/curriculum";
import { formatSkulptError } from "../lib/pythonErrorHelp";
import { getExerciseGuidance } from "../lib/pythonExerciseGuidance";
import { ensureSkulptLoaded, runPythonWithSkulpt } from "../lib/skulptRun";
import { PythonAppSession } from "../lib/skulptAppRun";
import { usePlatform } from "../context/PlatformContext";
import { PyAppPreview } from "../components/python/PyAppPreview";
import { ProjectExportPanel } from "../components/python/ProjectExportPanel";
import { AppModeHelp } from "../components/python/AppModeHelp";

const MODES = [
  { id: "console", label: "تشغيل نصي (Console)" },
  { id: "app", label: "مشروع رسومي (App)" },
];

export default function PythonLab() {
  const { user, myProgress, savePythonSnippet, saveGraphicProject, submitGraphicProject } = usePlatform();
  const [searchParams, setSearchParams] = useSearchParams();
  const exFromUrl = searchParams.get("ex");
  const modeFromUrl = searchParams.get("mode");
  const appFromUrl = searchParams.get("app");

  const [runMode, setRunMode] = useState(modeFromUrl === "app" ? "app" : "console");
  const [activeId, setActiveId] = useState(pythonExercises[0].id);
  const [activeAppId, setActiveAppId] = useState(GRAPHIC_APP_PROJECTS[0].id);
  const [unitFilter, setUnitFilter] = useState("all");
  const [savedProjectId, setSavedProjectId] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");

  const exercise = useMemo(
    () => pythonExercises.find((e) => e.id === activeId) ?? pythonExercises[0],
    [activeId],
  );
  const appTemplate = useMemo(
    () => GRAPHIC_APP_PROJECTS.find((p) => p.id === activeAppId) ?? GRAPHIC_APP_PROJECTS[0],
    [activeAppId],
  );

  const [code, setCode] = useState(exercise.starter);
  const [out, setOut] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [checkResults, setCheckResults] = useState(null);

  const sessionRef = useRef(null);
  const [appUi, setAppUi] = useState(null);
  const [appValues, setAppValues] = useState({});
  const [appConsole, setAppConsole] = useState("");

  const guidance = useMemo(() => getExerciseGuidance(exercise.id), [exercise.id]);
  const myGraphicProjects = myProgress?.graphicProjects ?? [];

  const filteredExercises = useMemo(() => {
    if (unitFilter === "all") return pythonExercises;
    return pythonExercises.filter((e) => e.unitId === unitFilter);
  }, [unitFilter]);

  const stopAppSession = useCallback(() => {
    sessionRef.current?.destroy();
    sessionRef.current = null;
  }, []);

  const pick = useCallback(
    (id) => {
      const ex = pythonExercises.find((e) => e.id === id);
      if (!ex) return;
      setActiveId(id);
      setCode(ex.starter);
      setOut("");
      setFeedback(null);
      setHintLevel(0);
      setCheckResults(null);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("ex", id);
        next.set("mode", "console");
        return next;
      });
    },
    [setSearchParams],
  );

  const pickApp = useCallback(
    (id) => {
      const tpl = GRAPHIC_APP_PROJECTS.find((p) => p.id === id);
      if (!tpl) return;
      stopAppSession();
      setActiveAppId(id);
      setCode(tpl.starter);
      setProjectTitle(tpl.titleAr);
      setSavedProjectId(null);
      setAppUi(null);
      setAppValues({});
      setAppConsole("");
      setFeedback(null);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("mode", "app");
        next.set("app", id);
        return next;
      });
    },
    [setSearchParams, stopAppSession],
  );

  const loadSavedProject = useCallback(
    (project) => {
      stopAppSession();
      setRunMode("app");
      setCode(project.code);
      setProjectTitle(project.title);
      setSavedProjectId(project.id);
      setAppUi(null);
      setAppValues({});
      setAppConsole("");
      setFeedback(null);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("mode", "app");
        return next;
      });
    },
    [setSearchParams, stopAppSession],
  );

  function switchMode(next) {
    if (next === runMode) return;
    stopAppSession();
    setFeedback(null);
    if (next === "console") {
      const ex = pythonExercises.find((e) => e.id === activeId) ?? pythonExercises[0];
      setCode(ex.starter);
      setOut("");
    } else {
      pickApp(activeAppId);
    }
    setRunMode(next);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("mode", next);
      return p;
    });
  }

  useEffect(() => {
    ensureSkulptLoaded().catch(() => {});
    return () => stopAppSession();
  }, [stopAppSession]);

  useEffect(() => {
    if (exFromUrl && pythonExercises.some((e) => e.id === exFromUrl)) {
      const ex = pythonExercises.find((e) => e.id === exFromUrl);
      setActiveId(exFromUrl);
      if (modeFromUrl !== "app") {
        setRunMode("console");
        setCode(ex.starter);
      }
      setOut("");
      setFeedback(null);
      setHintLevel(0);
      setCheckResults(null);
      if (ex?.unitId) setUnitFilter(ex.unitId);
    }
    if (modeFromUrl === "app") {
      setRunMode("app");
      if (appFromUrl && GRAPHIC_APP_PROJECTS.some((p) => p.id === appFromUrl)) {
        const tpl = GRAPHIC_APP_PROJECTS.find((p) => p.id === appFromUrl);
        setActiveAppId(appFromUrl);
        setCode(tpl.starter);
        setProjectTitle(tpl.titleAr);
      }
    }
  }, [exFromUrl, modeFromUrl, appFromUrl]);

  function onUnitFilterChange(next) {
    setUnitFilter(next);
    if (next === "all" || runMode !== "console") return;
    const list = pythonExercises.filter((e) => e.unitId === next);
    if (list.length && !list.some((e) => e.id === activeId)) {
      pick(list[0].id);
    }
  }

  function revealHint() {
    setHintLevel((h) => Math.min(h + 1, guidance.hints.length));
  }

  function checkProgress() {
    const results = guidance.checks.map((ch) => ({
      ...ch,
      passed: ch.check(code),
    }));
    setCheckResults(results);
  }

  async function runConsole() {
    setBusy(true);
    setOut("");
    setFeedback(null);
    setHintLevel(0);
    setCheckResults(null);
    try {
      const text = await runPythonWithSkulpt(code);
      setOut(text);
    } catch (e) {
      setFeedback(e?.feedback ?? formatSkulptError(e, { appMode: true }));
    } finally {
      setBusy(false);
    }
  }

  async function runApp() {
    stopAppSession();
    setBusy(true);
    setFeedback(null);
    setAppConsole("");
    setAppUi(null);
    try {
      const session = new PythonAppSession();
      sessionRef.current = session;
      const result = await session.load(code);
      setAppUi(result.ui);
      setAppValues(result.ui.values || {});
      if (result.console) setAppConsole(result.console);
    } catch (e) {
      setFeedback(e?.feedback ?? formatSkulptError(e, { appMode: true }));
    } finally {
      setBusy(false);
    }
  }

  async function onAppButton(btnId) {
    if (!sessionRef.current) return;
    setBusy(true);
    setFeedback(null);
    try {
      const result = await sessionRef.current.click(btnId, appValues);
      setAppUi(result.ui);
      setAppValues(result.ui.values || {});
      if (result.console) setAppConsole((prev) => prev + result.console);
    } catch (e) {
      setFeedback(e?.feedback ?? formatSkulptError(e, { appMode: true }));
    } finally {
      setBusy(false);
    }
  }

  function resetApp() {
    stopAppSession();
    setAppUi(null);
    setAppValues({});
    setAppConsole("");
    setFeedback(null);
    if (runMode === "app") {
      const tpl = GRAPHIC_APP_PROJECTS.find((p) => p.id === activeAppId);
      if (tpl && !savedProjectId) setCode(tpl.starter);
    }
  }

  function handleSave() {
    if (!user || user.role !== "student") {
      window.alert("سجّل الدخول كطالب لحفظ المشروع.");
      return;
    }
    if (runMode === "console") {
      savePythonSnippet(exercise?.titleAr || "كود محفوظ", code);
      window.alert("تم حفظ الكود في حسابك.");
      return;
    }
    const title = projectTitle.trim() || appTemplate.titleAr;
    const id = saveGraphicProject(title, code, savedProjectId);
    if (id) setSavedProjectId(id);
    window.alert("تم حفظ المشروع الرسومي في حسابك.");
  }

  function handleSubmit() {
    if (!user || user.role !== "student") {
      window.alert("سجّل الدخول كطالب لإرسال المشروع.");
      return;
    }
    if (runMode !== "app") {
      window.alert("إرسال للمعلم متاح لمشاريع الوضع الرسومي فقط.");
      return;
    }
    const title = projectTitle.trim() || appTemplate.titleAr;
    const id = saveGraphicProject(title, code, savedProjectId) || savedProjectId;
    if (!id) return;
    setSavedProjectId(id);
    const ok = submitGraphicProject(id);
    window.alert(ok ? "تم إرسال المشروع للمعلم بنجاح." : "تعذر الإرسال — احفظ المشروع أولاً.");
  }

  const errorPanel = feedback ? (
    <div
      className="min-h-[180px] space-y-3 rounded-xl border border-amber-500/35 bg-amber-950/25 p-4 text-right"
      dir="rtl"
    >
      <p className="text-base font-bold text-amber-100">{feedback.headlineAr}</p>
      {feedback.line != null && (
        <p className="text-sm text-slate-300">
          رقم السطر:{" "}
          <span dir="ltr" className="rounded bg-white/10 px-2 py-0.5 font-mono text-amber-200">
            {feedback.line}
          </span>
        </p>
      )}
      <pre
        dir="ltr"
        className="max-h-[160px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/50 p-3 text-left font-mono text-xs text-slate-300"
      >
        {feedback.detail}
      </pre>
      <div className="rounded-lg border border-emerald-500/25 bg-emerald-950/30 p-3 text-sm text-emerald-50">
        <span className="font-semibold text-emerald-300">كيف تصحّح؟ </span>
        {feedback.hintAr}
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-16 pt-24 font-ar text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">مختبر بايثون</h1>
          <p className="mt-2 text-slate-400">
            تمارين نصية ومشاريع رسومية تفاعلية — صفوف 4–8. اختر وضع التشغيل ثم ابدأ البرمجة.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => switchMode(m.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                runMode === m.id
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {runMode === "console" ? (
          <>
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
          </>
        ) : (
          <>
            <div className="mb-4 rounded-xl border border-violet-500/30 bg-violet-950/20 p-4 text-sm text-violet-100">
              <p className="font-bold text-violet-200">وضع المشروع الرسومي</p>
              <p className="mt-1 text-slate-300">
                استخدم <span dir="ltr" className="font-mono text-cyan-300">import appkit</span> — وحدة مدمجة
                في المختبر لبناء واجهات تفاعلية (أزرار، مدخلات، Canvas).
              </p>
            </div>
            <AppModeHelp variant="dark" onInsertExample={(ex) => setCode(ex)} />
            <div className="mb-4 flex flex-wrap gap-2">
              {GRAPHIC_APP_PROJECTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pickApp(p.id)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    p.id === activeAppId ? "bg-violet-600 text-white" : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  {p.titleAr}
                </button>
              ))}
            </div>
            {user?.role === "student" && myGraphicProjects.length > 0 ? (
              <div className="mb-6 rounded-xl border border-cyan-500/25 bg-cyan-950/20 p-4">
                <p className="mb-2 text-sm font-bold text-cyan-200">مشاريعي المحفوظة</p>
                <div className="flex flex-wrap gap-2">
                  {myGraphicProjects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => loadSavedProject(p)}
                      className={`rounded-lg px-3 py-1.5 text-xs ${
                        savedProjectId === p.id ? "bg-cyan-600 text-white" : "bg-white/10 text-slate-200"
                      }`}
                    >
                      {p.title}{" "}
                      {p.status === "submitted" ? "📤" : p.status === "reviewed" ? "✓" : ""}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {runMode === "app" ? (
              <label className="mb-4 block">
                <span className="mb-1 block text-sm text-slate-400">عنوان المشروع</span>
                <input
                  className="w-full max-w-md rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder={appTemplate.titleAr}
                />
              </label>
            ) : null}
          </>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-400">الكود</label>
            <textarea
              dir="ltr"
              className="code-editor min-h-[min(70vh,480px)] w-full resize-y"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
            {runMode === "console" ? (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                برامج متعددة الأسطر: <span dir="ltr">if</span>، <span dir="ltr">for</span>،{" "}
                <span dir="ltr">while</span>، دوال، وقوائم.
              </p>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                مثال: <span dir="ltr">appkit.button</span>، <span dir="ltr">appkit.on_click</span>،{" "}
                <span dir="ltr">appkit.build()</span> في نهاية الكود.
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={runMode === "console" ? runConsole : runApp}
                disabled={busy}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60"
              >
                {busy ? "جارٍ التشغيل…" : runMode === "console" ? "تشغيل الكود" : "تشغيل المشروع"}
              </button>
              {runMode === "app" ? (
                <>
                  <button
                    type="button"
                    onClick={stopAppSession}
                    disabled={busy}
                    className="rounded-xl border border-red-500/40 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-950/30 disabled:opacity-50"
                  >
                    إيقاف
                  </button>
                  <button
                    type="button"
                    onClick={resetApp}
                    disabled={busy}
                    className="rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/10 disabled:opacity-50"
                  >
                    إعادة
                  </button>
                </>
              ) : null}
            </div>

            {user?.role === "student" ? (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 rounded-xl border border-white/20 py-2 text-sm text-slate-200 hover:bg-white/10"
                >
                  حفظ {runMode === "app" ? "المشروع" : "الكود"}
                </button>
                {runMode === "app" ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 rounded-xl border border-violet-500/40 bg-violet-950/30 py-2 text-sm font-bold text-violet-200 hover:bg-violet-900/40"
                  >
                    إرسال للمعلم
                  </button>
                ) : null}
              </div>
            ) : null}

            {runMode === "app" ? (
              <div className="mt-4">
                <ProjectExportPanel
                  title={projectTitle.trim() || appTemplate.titleAr}
                  code={code}
                  mode="app"
                  templateId={activeAppId}
                  authorName={user?.nameAr}
                  variant="dark"
                />
              </div>
            ) : (
              <div className="mt-4">
                <ProjectExportPanel
                  title={exercise?.titleAr || "كود بايثون"}
                  code={code}
                  mode="console"
                  authorName={user?.nameAr}
                  variant="dark"
                />
              </div>
            )}

            {runMode === "console" ? (
              <div className="mt-4 rounded-xl border border-violet-500/30 bg-violet-950/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-violet-200">تلميحات تعليمية</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={revealHint}
                      disabled={hintLevel >= guidance.hints.length}
                      className="rounded-lg bg-violet-600/80 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                    >
                      تلميح {hintLevel}/{guidance.hints.length}
                    </button>
                    <button
                      type="button"
                      onClick={checkProgress}
                      className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs font-bold text-cyan-200"
                    >
                      تحقق من تقدمي
                    </button>
                  </div>
                </div>
                {hintLevel > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-violet-100">
                    {guidance.hints.slice(0, hintLevel).map((h, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-bold text-violet-400">{i + 1}.</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {checkResults ? (
                  <ul className="mt-3 space-y-1 border-t border-white/10 pt-3 text-xs">
                    {checkResults.map((r) => (
                      <li key={r.id} className={r.passed ? "text-emerald-300" : "text-amber-200"}>
                        {r.passed ? "✓" : "○"} {r.messageAr}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {runMode === "console" ? (
              <p className="mt-3 text-xs text-amber-200/90">{exercise.hintAr}</p>
            ) : (
              <p className="mt-3 text-xs text-violet-200/90">{appTemplate.curriculumTopic}</p>
            )}
          </div>

          <div>
            {runMode === "console" ? (
              <>
                <label className="mb-2 block text-sm text-slate-400">المخرجات والملاحظات</label>
                {errorPanel || (
                  <pre
                    dir="ltr"
                    className="min-h-[280px] whitespace-pre-wrap rounded-xl border border-white/10 bg-black/50 p-4 text-left font-mono text-sm text-emerald-200"
                  >
                    {out || "اضغط «تشغيل الكود»"}
                  </pre>
                )}
              </>
            ) : (
              <>
                <label className="mb-2 block text-sm text-slate-400">معاينة المشروع (Preview)</label>
                {errorPanel}
                <PyAppPreview
                  ui={appUi}
                  values={appValues}
                  onChange={(id, v) => setAppValues((prev) => ({ ...prev, [id]: v }))}
                  onButton={onAppButton}
                  loading={busy}
                />
                {appConsole ? (
                  <pre
                    dir="ltr"
                    className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/50 p-3 text-left font-mono text-xs text-emerald-200"
                  >
                    {appConsole}
                  </pre>
                ) : null}
              </>
            )}
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              التشغيل في المتصفح عبر Skulpt داخل بيئة آمنة. الوضع الرسومي يستخدم وحدة{" "}
              <span dir="ltr">appkit</span> لبناء واجهات تفاعلية دون الوصول لملفات النظام أو بيانات المستخدمين.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
