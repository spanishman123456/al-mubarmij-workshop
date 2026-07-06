import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { pythonExercises } from "../data/pythonExercises";
import { GRAPHIC_APP_PROJECTS } from "../data/graphicAppProjects";
import { curriculumUnits } from "../data/curriculum";
import { formatSkulptError } from "../lib/pythonErrorHelp";
import { ensureSkulptLoaded, runPythonWithSkulpt } from "../lib/skulptRun";
import { PythonAppSession } from "../lib/skulptAppRun";
import { usePlatform } from "../context/PlatformContext";
import { GraphicProjectFrame } from "../components/python/GraphicProjectFrame";
import { PyAppPreview } from "../components/python/PyAppPreview";
import { ProjectExportPanel } from "../components/python/ProjectExportPanel";
import { AppModeHelp } from "../components/python/AppModeHelp";
import { StepLearningPanel } from "../components/python/StepLearningPanel";
import { PythonCodeEditor } from "../components/python/PythonCodeEditor";
import {
  CODE_ASSIST_LABELS_AR,
  getBuildTimeAssistMode,
  parseAssistMode,
} from "../config/pythonLabSettings.js";
import { fetchPlatformSettingsPublic, savePythonAssistMode } from "../lib/platformSettingsApi.js";
import { getStepPlan } from "../data/stepLearningPlans.js";
import {
  checkStep,
  getAppendForStep,
  getInitialCode,
  isStepRunnable,
  MIN_ATTEMPTS_BEFORE_SOLUTION,
  resetStepState,
} from "../lib/stepLearningEngine.js";
import {
  clearInactivityDraft,
  loadInactivityDraft,
  registerDraftSaver,
  saveInactivityDraft,
} from "../lib/draftFlush.js";

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
  const [assistMode, setAssistMode] = useState(getBuildTimeAssistMode);
  const [assistSaving, setAssistSaving] = useState(false);

  const exercise = useMemo(
    () => pythonExercises.find((e) => e.id === activeId) ?? pythonExercises[0],
    [activeId],
  );
  const appTemplate = useMemo(
    () => GRAPHIC_APP_PROJECTS.find((p) => p.id === activeAppId) ?? GRAPHIC_APP_PROJECTS[0],
    [activeAppId],
  );

  const [code, setCode] = useState(() =>
    getInitialCode(getStepPlan("console", pythonExercises[0].id)),
  );
  const [out, setOut] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepHintLevel, setStepHintLevel] = useState(0);
  const [stepCheckResult, setStepCheckResult] = useState(null);
  const [stepCheckAttempts, setStepCheckAttempts] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);

  const sessionRef = useRef(null);
  const draftRestoredRef = useRef(false);
  const codeRef = useRef(code);
  codeRef.current = code;
  const [appUi, setAppUi] = useState(null);
  const [appValues, setAppValues] = useState({});
  const [appConsole, setAppConsole] = useState("");

  const stepPlan = useMemo(
    () => getStepPlan(runMode === "app" ? "app" : "console", runMode === "app" ? activeAppId : activeId),
    [runMode, activeAppId, activeId],
  );
  const myGraphicProjects = myProgress?.graphicProjects ?? [];

  function applyStepReset(plan) {
    const s = resetStepState();
    setStepIndex(s.stepIndex);
    setStepHintLevel(s.stepHintLevel);
    setStepCheckResult(s.stepCheckResult);
    setStepCheckAttempts(s.stepCheckAttempts);
    setSolutionRevealed(s.solutionRevealed);
    if (plan) setCode(getInitialCode(plan));
  }

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
      const plan = getStepPlan("console", id);
      applyStepReset(plan);
      setOut("");
      setFeedback(null);
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
      const plan = getStepPlan("app", id);
      applyStepReset(plan);
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
      const plan = getStepPlan("console", ex.id);
      applyStepReset(plan);
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
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPlatformSettingsPublic();
        if (!cancelled && data.pythonCodeAssist) {
          setAssistMode(parseAssistMode(data.pythonCodeAssist));
        }
      } catch {
        /* fallback to build-time default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || user.role !== "student" || draftRestoredRef.current) return;
    const draft = loadInactivityDraft(`python-${user.id}`);
    if (!draft?.code) return;
    draftRestoredRef.current = true;
    setCode(draft.code);
    if (draft.activeId) setActiveId(draft.activeId);
    if (draft.activeAppId) setActiveAppId(draft.activeAppId);
    if (draft.runMode === "app" || draft.runMode === "console") setRunMode(draft.runMode);
    clearInactivityDraft(`python-${user.id}`);
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (!user?.id || user.role !== "student") return undefined;
    return registerDraftSaver(() => {
      const currentCode = codeRef.current?.trim();
      if (!currentCode) return;
      saveInactivityDraft(`python-${user.id}`, {
        code: currentCode,
        activeId,
        activeAppId,
        runMode,
      });
    });
  }, [user?.id, user?.role, activeId, activeAppId, runMode]);

  useEffect(() => {
    if (exFromUrl && pythonExercises.some((e) => e.id === exFromUrl)) {
      const ex = pythonExercises.find((e) => e.id === exFromUrl);
      setActiveId(exFromUrl);
      if (modeFromUrl !== "app") {
        setRunMode("console");
        const plan = getStepPlan("console", exFromUrl);
        applyStepReset(plan);
      }
      setOut("");
      setFeedback(null);
      if (ex?.unitId) setUnitFilter(ex.unitId);
    }
    if (modeFromUrl === "app") {
      setRunMode("app");
      if (appFromUrl && GRAPHIC_APP_PROJECTS.some((p) => p.id === appFromUrl)) {
        const tpl = GRAPHIC_APP_PROJECTS.find((p) => p.id === appFromUrl);
        setActiveAppId(appFromUrl);
        const plan = getStepPlan("app", appFromUrl);
        applyStepReset(plan);
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

  function handleStepHint() {
    const step = stepPlan?.steps[stepIndex];
    if (!step) return;
    setStepHintLevel((h) => Math.min(h + 1, step.hints.length));
  }

  function handleStepCheck() {
    if (!stepPlan) return;
    setStepCheckAttempts((n) => n + 1);
    const result = checkStep(stepPlan, stepIndex, code);
    setStepCheckResult(result);
    if (result.ok && stepIndex < stepPlan.steps.length - 1) {
      const next = stepIndex + 1;
      const append = getAppendForStep(stepPlan, next);
      if (append.trim()) {
        setCode((prev) => `${prev.trimEnd()}\n${append}`.trim());
      }
      setStepIndex(next);
      setStepHintLevel(0);
      setTimeout(() => setStepCheckResult(null), 2500);
    }
  }

  function handleRevealSolution() {
    if (!stepPlan) return;
    if (stepCheckAttempts < MIN_ATTEMPTS_BEFORE_SOLUTION && !solutionRevealed) {
      const ok = window.confirm(
        "الأفضل أن تحاول بنفسك أولاً! هل تريد عرض الحل الكامل على أي حال؟",
      );
      if (!ok) return;
    }
    setSolutionRevealed(true);
    setCode(stepPlan.fullSolution);
    setStepCheckResult({
      ok: true,
      messageAr: "تم عرض الحل الكامل. حاول فهم كل سطر ثم اكتبه بنفسك في محاولة لاحقة.",
    });
  }

  function clearStepCheck() {
    setStepCheckResult(null);
  }

  async function runConsole() {
    if (stepPlan && !isStepRunnable(stepPlan, stepIndex) && !solutionRevealed) {
      setFeedback({
        headlineAr: "أكمل الخطوات أولاً",
        hintAr: "استخدم «تحقق من الحل» لإتمام الخطوة الحالية قبل التشغيل.",
        detail: "",
      });
      return;
    }
    setBusy(true);
    setOut("");
    setFeedback(null);
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
    if (stepPlan && !isStepRunnable(stepPlan, stepIndex) && !solutionRevealed) {
      setFeedback({
        headlineAr: "أكمل الخطوات أولاً",
        hintAr: "أكمل بناء المشروع خطوة بخطوة ثم شغّله.",
        detail: "",
      });
      return;
    }
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
      if (tpl && !savedProjectId) {
        const plan = getStepPlan("app", activeAppId);
        applyStepReset(plan);
      }
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

  async function handleAssistModeChange(next) {
    const mode = parseAssistMode(next);
    setAssistMode(mode);
    if (user?.role !== "teacher") return;
    setAssistSaving(true);
    try {
      await savePythonAssistMode(mode);
    } catch {
      window.alert("تعذر حفظ إعداد المساعدة — حاول لاحقًا.");
    } finally {
      setAssistSaving(false);
    }
  }

  const activeUnitId = runMode === "console" ? exercise?.unitId : appTemplate?.unitId;

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
    <div className="python-lab-page min-h-screen animate-fade-in bg-[#0a0e1a] pb-16 pt-24 font-ar text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">مختبر بايثون</h1>
          <p className="mt-2 text-slate-400">
            تمارين ومشاريع تفاعلية — اكتب الكود بنفسك خطوة بخطوة (مناسب للصف الأول متوسط).
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
                className="edu-select-dark w-auto max-w-md text-sm"
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

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-sm text-slate-300">
            المساعدة أثناء كتابة الكود:{" "}
            <span className="font-bold text-violet-200">{CODE_ASSIST_LABELS_AR[assistMode]}</span>
          </p>
          {user?.role === "teacher" ? (
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <span>إعداد المعلم:</span>
              <select
                className="edu-select-dark text-sm"
                value={assistMode}
                disabled={assistSaving}
                onChange={(e) => handleAssistModeChange(e.target.value)}
                data-testid="python-assist-mode-select"
              >
                <option value="full">مفعّلة</option>
                <option value="reduced">مخفّضة</option>
                <option value="off">متوقفة</option>
              </select>
            </label>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-400">الكود</label>
            <PythonCodeEditor
              value={code}
              onChange={setCode}
              assistMode={assistMode}
              unitId={activeUnitId}
              appMode={runMode === "app"}
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

            {stepPlan && !savedProjectId ? (
              <StepLearningPanel
                plan={stepPlan}
                stepIndex={stepIndex}
                hintLevel={stepHintLevel}
                checkResult={stepCheckResult}
                checkAttempts={stepCheckAttempts}
                solutionRevealed={solutionRevealed}
                onHint={handleStepHint}
                onCheck={handleStepCheck}
                onRevealSolution={handleRevealSolution}
                onClearCheck={clearStepCheck}
              />
            ) : null}

            {runMode === "app" && !savedProjectId ? (
              <p className="mt-3 text-xs text-violet-200/90">{appTemplate.curriculumTopic}</p>
            ) : null}
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
                <GraphicProjectFrame project={appTemplate}>
                  <PyAppPreview
                    ui={appUi}
                    values={appValues}
                    onChange={(id, v) => setAppValues((prev) => ({ ...prev, [id]: v }))}
                    onButton={onAppButton}
                    loading={busy}
                  />
                </GraphicProjectFrame>
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
