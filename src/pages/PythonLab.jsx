import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { pythonExercises } from "../data/pythonExercises";
import { getSkuiProjectOrDefault, SKUI_PROJECTS } from "../data/skuiProjectsRegistry";
import { curriculumUnits } from "../data/curriculum";
import { formatSkulptError } from "../lib/pythonErrorHelp";
import { ensureSkulptLoaded, runPythonWithSkulpt } from "../lib/skulptRun";
import { PythonAppSession } from "../lib/skulptAppRun";
import { checkProjectReadiness } from "../lib/projectReadiness";
import { sha256Hex } from "../lib/projectExport";
import { usePlatform } from "../context/PlatformContext";
import { GraphicProjectFrame } from "../components/python/GraphicProjectFrame";
import { PyAppPreview } from "../components/python/PyAppPreview";
import { ProjectExportPanel } from "../components/python/ProjectExportPanel";
import { AppModeHelp } from "../components/python/AppModeHelp";
import { StepLearningPanel } from "../components/python/StepLearningPanel";
import { PythonCodeEditor } from "../components/python/PythonCodeEditor";
import { SkuiProjectGallery } from "../components/python/SkuiProjectGallery";
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

const APP_TABS = [
  { id: "project", label: "المشروع" },
  { id: "code", label: "الكود" },
  { id: "preview", label: "المعاينة" },
  { id: "export", label: "التصدير" },
  { id: "solution", label: "الحل النموذجي", teacherOnly: true },
];

export default function PythonLab() {
  const {
    user,
    myProgress,
    savePythonSnippet,
    saveGraphicProject,
    submitGraphicProject,
    deleteGraphicProject,
    trackGuiEvent,
  } = usePlatform();
  const [searchParams, setSearchParams] = useSearchParams();
  const exFromUrl = searchParams.get("ex");
  const modeFromUrl = searchParams.get("mode");
  const appFromUrl = searchParams.get("app");

  const [runMode, setRunMode] = useState(modeFromUrl === "app" ? "app" : "console");
  const [activeId, setActiveId] = useState(pythonExercises[0].id);
  const [activeAppId, setActiveAppId] = useState(SKUI_PROJECTS[0].id);
  const [unitFilter, setUnitFilter] = useState("all");
  const [savedProjectId, setSavedProjectId] = useState(null);
  const [projectTitle, setProjectTitle] = useState(SKUI_PROJECTS[0].titleAr);
  const [appTab, setAppTab] = useState("project");
  const [runStatus, setRunStatus] = useState(null);
  const [lastRunOk, setLastRunOk] = useState(false);
  const [lastRunCodeHash, setLastRunCodeHash] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [teacherSolution, setTeacherSolution] = useState(null);
  const [teacherSolutionBusy, setTeacherSolutionBusy] = useState(false);
  const [teacherSolutionError, setTeacherSolutionError] = useState(null);

  const exercise = useMemo(
    () => pythonExercises.find((e) => e.id === activeId) ?? pythonExercises[0],
    [activeId],
  );
  const appTemplate = useMemo(() => getSkuiProjectOrDefault(activeAppId), [activeAppId]);

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
  const previewRef = useRef(null);
  const draftRestoredRef = useRef(false);
  const urlSyncedRef = useRef(false);
  const codeRef = useRef(code);
  codeRef.current = code;
  const [appUi, setAppUi] = useState(null);
  const [appValues, setAppValues] = useState({});
  const [appConsole, setAppConsole] = useState("");

  const isTeacher = user?.role === "teacher";
  const stepPlan = useMemo(
    () => getStepPlan(runMode === "app" ? "app" : "console", runMode === "app" ? activeAppId : activeId),
    [runMode, activeAppId, activeId],
  );
  const myGraphicProjects = myProgress?.graphicProjects ?? [];
  const visibleTabs = APP_TABS.filter((tab) => !tab.teacherOnly || isTeacher);

  function applyStepReset(plan, { loadCode = true } = {}) {
    const s = resetStepState();
    setStepIndex(s.stepIndex);
    setStepHintLevel(s.stepHintLevel);
    setStepCheckResult(s.stepCheckResult);
    setStepCheckAttempts(s.stepCheckAttempts);
    setSolutionRevealed(s.solutionRevealed);
    if (plan && loadCode) setCode(getInitialCode(plan));
  }

  const filteredExercises = useMemo(() => {
    if (unitFilter === "all") return pythonExercises;
    return pythonExercises.filter((e) => e.unitId === unitFilter);
  }, [unitFilter]);

  const stopAppSession = useCallback(() => {
    sessionRef.current?.destroy();
    sessionRef.current = null;
  }, []);

  const clearPreviewState = useCallback(() => {
    setAppUi(null);
    setAppValues({});
    setAppConsole("");
    setRunStatus(null);
    setLastRunOk(false);
    setLastRunCodeHash(null);
    setReadiness(null);
    setTeacherSolution(null);
    setTeacherSolutionError(null);
  }, []);

  /** مصدر حقيقة واحد لاختيار المشروع */
  const selectProject = useCallback(
    (id, { keepCode = false, codeOverride = null, savedId = null, titleOverride = null } = {}) => {
      const project = getSkuiProjectOrDefault(id);
      stopAppSession();
      clearPreviewState();
      setActiveAppId(project.id);
      setProjectTitle(titleOverride ?? project.titleAr);
      setSavedProjectId(savedId);
      setFeedback(null);
      setRunMode("app");
      if (codeOverride != null) {
        setCode(codeOverride);
        applyStepReset(null);
      } else if (!keepCode) {
        // افتح تطبيقًا قابلاً للتشغيل فورًا — لا هيكلًا مكسورًا
        setCode(project.starterCode);
        applyStepReset(getStepPlan("app", project.id), { loadCode: false });
      }
      trackGuiEvent?.("gui_project_started");
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("mode", "app");
        next.set("app", project.id);
        return next;
      });
      setAppTab(keepCode || codeOverride ? "code" : "project");
    },
    [clearPreviewState, setSearchParams, stopAppSession, trackGuiEvent],
  );

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

  const loadSavedProject = useCallback(
    (project) => {
      const templateId =
        project.templateId && SKUI_PROJECTS.some((p) => p.id === project.templateId)
          ? project.templateId
          : activeAppId;
      selectProject(templateId, {
        codeOverride: project.code,
        savedId: project.id,
        titleOverride: project.title,
      });
      setAppTab("code");
    },
    [activeAppId, selectProject],
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
      selectProject(activeAppId);
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
    if (urlSyncedRef.current) return;
    urlSyncedRef.current = true;
    if (exFromUrl && pythonExercises.some((e) => e.id === exFromUrl)) {
      const ex = pythonExercises.find((e) => e.id === exFromUrl);
      setActiveId(exFromUrl);
      if (modeFromUrl !== "app") {
        setRunMode("console");
        applyStepReset(getStepPlan("console", exFromUrl));
      }
      setOut("");
      setFeedback(null);
      if (ex?.unitId) setUnitFilter(ex.unitId);
    }
    if (modeFromUrl === "app") {
      const id =
        appFromUrl && SKUI_PROJECTS.some((p) => p.id === appFromUrl) ? appFromUrl : SKUI_PROJECTS[0].id;
      selectProject(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot URL hydrate
  }, []);

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
    if (!stepPlan?.fullSolution) return;
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
    stopAppSession();
    setBusy(true);
    setFeedback(null);
    setAppConsole("");
    setAppUi(null);
    setLastRunOk(false);
    setRunStatus({ kind: "loading", message: "جاري بناء واجهة التطبيق..." });
    setAppTab("preview");
    try {
      const session = new PythonAppSession();
      session.onSnapshot = (nextUi) => setAppUi(nextUi);
      session.onError = (nextFeedback) => {
        setFeedback(nextFeedback);
        setRunStatus({
          kind: "code-error",
          message:
            nextFeedback?.line != null
              ? `تعذر تشغيل المشروع بسبب خطأ في السطر رقم ${nextFeedback.line}`
              : nextFeedback?.headlineAr || "تعذر تشغيل المشروع بسبب خطأ في الكود.",
        });
      };
      sessionRef.current = session;
      const result = await session.load(code);
      setAppUi(result.ui);
      setAppValues(result.ui.values || {});
      if (result.console) setAppConsole(result.console);
      trackGuiEvent?.("gui_project_run");
      const componentCount = Object.keys(result.ui?.nodes || {}).length;
      if (componentCount > 0) trackGuiEvent?.("gui_component_created");
      if (componentCount === 0) {
        setRunStatus({
          kind: "engine-error",
          message: "لا توجد مكونات للعرض — تأكد من app.add(...) وapp.run().",
        });
        setLastRunOk(false);
      } else {
        setRunStatus({ kind: "success", message: "يعمل التطبيق في المعاينة." });
        setLastRunOk(true);
        setLastRunCodeHash(await sha256Hex(code));
      }
    } catch (e) {
      const fb = e?.feedback ?? formatSkulptError(e, { appMode: true });
      setFeedback(fb);
      const isEngine = /worker|timeout|preview|محرك|Skulpt/i.test(
        `${fb?.headlineAr || ""} ${fb?.detail || ""} ${e?.message || ""}`,
      );
      setRunStatus({
        kind: isEngine ? "engine-error" : "code-error",
        message: isEngine
          ? "حدث خطأ في أداة المعاينة، وليس بالضرورة في كود الطالب."
          : fb?.line != null
            ? `تعذر تشغيل المشروع بسبب خطأ في السطر رقم ${fb.line}`
            : fb?.headlineAr || "تعذر تشغيل المشروع بسبب خطأ في الكود.",
      });
      setLastRunOk(false);
    } finally {
      setBusy(false);
    }
  }

  async function onAppButton(btnId, currentValues = appValues, value = undefined) {
    if (!sessionRef.current) return;
    setBusy(true);
    setFeedback(null);
    try {
      const result = await sessionRef.current.click(btnId, currentValues, value);
      setAppUi(result.ui);
      setAppValues(result.ui.values || {});
      if (result.console) setAppConsole((prev) => prev + result.console);
    } catch (e) {
      setFeedback(e?.feedback ?? formatSkulptError(e, { appMode: true }));
    } finally {
      setBusy(false);
    }
  }

  async function onAppEvent(id, eventName, value, currentValues) {
    if (!sessionRef.current || eventName === "on_click") return;
    setAppValues((prev) => ({ ...prev, [id]: value }));
    setFeedback(null);
    try {
      const result = await sessionRef.current.event(id, eventName, value, currentValues);
      setAppUi(result.ui);
      if (result.console) setAppConsole((prev) => prev + result.console);
    } catch (e) {
      setFeedback(e?.feedback ?? formatSkulptError(e, { appMode: true }));
    }
  }

  function resetApp() {
    stopAppSession();
    clearPreviewState();
    setFeedback(null);
    if (runMode === "app" && !savedProjectId) {
      applyStepReset(getStepPlan("app", activeAppId));
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
    const id = saveGraphicProject(title, code, savedProjectId, { templateId: activeAppId });
    if (id) setSavedProjectId(id);
    trackGuiEvent?.("gui_project_saved");
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
    const id = saveGraphicProject(title, code, savedProjectId, { templateId: activeAppId }) || savedProjectId;
    if (!id) return;
    setSavedProjectId(id);
    const ok = submitGraphicProject(id);
    if (ok) trackGuiEvent?.("gui_project_completed");
    window.alert(ok ? "تم إرسال المشروع للمعلم بنجاح." : "تعذر الإرسال — احفظ المشروع أولاً.");
  }

  async function handleReadinessCheck() {
    const result = await checkProjectReadiness({
      title: projectTitle.trim() || appTemplate.titleAr,
      code,
      mode: "app",
      lastRunOk,
      lastRunCodeHash,
    });
    setReadiness(result);
    setAppTab("export");
  }

  async function loadTeacherSolution() {
    if (!isTeacher) return;
    setTeacherSolutionBusy(true);
    setTeacherSolutionError(null);
    try {
      const res = await fetch(`/api/teacher/skui-projects/${encodeURIComponent(activeAppId)}/solution`, {
        headers: { "X-User-Role": "teacher" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.code) {
        throw new Error(data?.error || "تعذر جلب الحل النموذجي.");
      }
      setTeacherSolution(data.code);
    } catch (e) {
      setTeacherSolutionError(e.message || "تعذر جلب الحل.");
      setTeacherSolution(null);
    } finally {
      setTeacherSolutionBusy(false);
    }
  }

  function openTeacherSolutionInEditor() {
    if (!teacherSolution || !isTeacher) return;
    setCode(teacherSolution);
    setSavedProjectId(null);
    setAppTab("code");
    setFeedback({
      headlineAr: "معاينة المعلم",
      hintAr: "تم فتح الحل النموذجي في المحرر. لن يُحفظ كمحاولة طالب.",
      detail: "",
    });
  }

  const errorPanel = feedback ? (
    <div
      className="min-h-[120px] space-y-3 rounded-xl border border-amber-500/35 bg-amber-950/25 p-4 text-right"
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
      {feedback.detail ? (
        <pre
          dir="ltr"
          className="max-h-[160px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/50 p-3 text-left font-mono text-xs text-slate-300"
        >
          {feedback.detail}
        </pre>
      ) : null}
      {feedback.hintAr ? (
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-950/30 p-3 text-sm text-emerald-50">
          <span className="font-semibold text-emerald-300">كيف تصحّح؟ </span>
          {feedback.hintAr}
        </div>
      ) : null}
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
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-400">الكود</label>
                <PythonCodeEditor value={code} onChange={setCode} appMode={false} />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={runConsole}
                    disabled={busy}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60"
                  >
                    {busy ? "جارٍ التشغيل…" : "تشغيل الكود"}
                  </button>
                </div>
                {user?.role === "student" ? (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="mt-2 w-full rounded-xl border border-white/20 py-2 text-sm text-slate-200 hover:bg-white/10"
                  >
                    حفظ الكود
                  </button>
                ) : null}
                <div className="mt-4">
                  <ProjectExportPanel
                    title={exercise?.titleAr || "كود بايثون"}
                    code={code}
                    mode="console"
                    authorName={user?.nameAr}
                    ownerId={user?.id}
                    projectId={activeId}
                    variant="dark"
                  />
                </div>
                {stepPlan ? (
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
                    allowRevealSolution
                  />
                ) : null}
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">المخرجات والملاحظات</label>
                {errorPanel || (
                  <pre
                    dir="ltr"
                    className="min-h-[280px] whitespace-pre-wrap rounded-xl border border-white/10 bg-black/50 p-4 text-left font-mono text-sm text-emerald-200"
                  >
                    {out || "اضغط «تشغيل الكود»"}
                  </pre>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 rounded-xl border border-violet-500/30 bg-violet-950/20 p-4 text-sm text-violet-100">
              <p className="font-bold text-violet-200">وضع المشروع الرسومي</p>
              <p className="mt-1 text-slate-300">
                استخدم <span dir="ltr" className="font-mono text-cyan-300">import skui as ui</span> — مكتبة
                واجهات أصلية لـ Skulpt تعمل داخل معاينة معزولة.
              </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2 border-b border-white/10 pb-3">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  data-testid={`app-tab-${tab.id}`}
                  onClick={() => {
                    setAppTab(tab.id);
                    if (tab.id === "solution" && !teacherSolution) loadTeacherSolution();
                  }}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                    appTab === tab.id
                      ? "bg-violet-600 text-white"
                      : "bg-white/10 text-slate-300 hover:bg-white/15"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mb-4 rounded-xl border border-violet-500/25 bg-violet-950/30 px-4 py-3 text-center">
              <p className="text-lg font-bold text-violet-100" data-testid="skui-project-title">
                {appTemplate.icon} {projectTitle.trim() || appTemplate.titleAr}
              </p>
              <p className="mt-1 text-xs text-slate-400">{appTemplate.description}</p>
            </div>

            {appTab === "project" ? (
              <div className="space-y-4">
                <SkuiProjectGallery
                  selectedId={activeAppId}
                  onSelect={(id) => selectProject(id)}
                  role={user?.role}
                />
                <AppModeHelp
                  variant="dark"
                  onInsertExample={(example) => {
                    if (example?.id) selectProject(example.id, { keepCode: false });
                    else if (typeof example === "string") setCode(example);
                  }}
                />
                {user?.role === "student" && myGraphicProjects.length > 0 ? (
                  <div className="rounded-xl border border-cyan-500/25 bg-cyan-950/20 p-4">
                    <p className="mb-2 text-sm font-bold text-cyan-200">مشاريعي المحفوظة</p>
                    <div className="flex flex-wrap gap-2">
                      {myGraphicProjects.map((p) => (
                        <div key={p.id} className="flex items-center overflow-hidden rounded-lg border border-white/10">
                          <button
                            type="button"
                            onClick={() => loadSavedProject(p)}
                            className={`px-3 py-1.5 text-xs ${
                              savedProjectId === p.id ? "bg-cyan-600 text-white" : "bg-white/10 text-slate-200"
                            }`}
                          >
                            {p.title} {p.status === "submitted" ? "مرسل" : p.status === "reviewed" ? "✓" : ""}
                          </button>
                          <button
                            type="button"
                            className="px-2 text-xs text-red-200"
                            onClick={() => {
                              if (window.confirm(`حذف المشروع «${p.title}»؟`)) {
                                deleteGraphicProject?.(p.id);
                                if (savedProjectId === p.id) resetApp();
                              }
                            }}
                          >
                            حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {appTab === "code" ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">عنوان المشروع</label>
                  <input
                    className="mb-3 w-full max-w-md rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder={appTemplate.titleAr}
                  />
                  <label className="mb-2 block text-sm text-slate-400">الكود</label>
                  <PythonCodeEditor value={code} onChange={setCode} appMode />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={runApp}
                      disabled={busy}
                      className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60"
                    >
                      {busy ? "جارٍ التشغيل…" : "تشغيل المشروع"}
                    </button>
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
                      إعادة تشغيل
                    </button>
                  </div>
                  {user?.role === "student" ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 rounded-xl border border-white/20 py-2 text-sm text-slate-200 hover:bg-white/10"
                      >
                        حفظ المشروع
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 rounded-xl border border-violet-500/40 bg-violet-950/30 py-2 text-sm font-bold text-violet-200 hover:bg-violet-900/40"
                      >
                        إرسال للمعلم
                      </button>
                    </div>
                  ) : null}
                  {stepPlan && !savedProjectId && !isTeacher ? (
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
                      allowRevealSolution={false}
                    />
                  ) : isTeacher ? (
                    <p className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 text-sm text-cyan-100">
                      وضع المعلم: يمكنك فتح الحل النموذجي من تبويب «الحل النموذجي» دون نظام الخطوات.
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-400">معاينة سريعة</label>
                  {errorPanel}
                  <GraphicProjectFrame project={appTemplate} runStatus={runStatus}>
                    <PyAppPreview
                      ui={appUi}
                      values={appValues}
                      onChange={(id, v) => setAppValues((prev) => ({ ...prev, [id]: v }))}
                      onButton={onAppButton}
                      onEvent={onAppEvent}
                      loading={busy}
                    />
                  </GraphicProjectFrame>
                </div>
              </div>
            ) : null}

            {appTab === "preview" ? (
              <div className="space-y-4">
                {errorPanel}
                <div ref={previewRef}>
                  <GraphicProjectFrame project={appTemplate} runStatus={runStatus}>
                    <PyAppPreview
                      ui={appUi}
                      values={appValues}
                      onChange={(id, v) => setAppValues((prev) => ({ ...prev, [id]: v }))}
                      onButton={onAppButton}
                      onEvent={onAppEvent}
                      loading={busy}
                    />
                  </GraphicProjectFrame>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={runApp}
                    disabled={busy}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {busy ? "جاري بناء واجهة التطبيق..." : "تشغيل المشروع"}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-cyan-500/40 px-3 py-2 text-xs font-bold text-cyan-200"
                    onClick={() => previewRef.current?.requestFullscreen?.()}
                  >
                    فتح بملء الشاشة
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopAppSession();
                      clearPreviewState();
                    }}
                    className="rounded-lg border border-white/20 px-3 py-2 text-xs font-bold text-slate-200"
                  >
                    مسح المعاينة
                  </button>
                </div>
                {appConsole ? (
                  <pre
                    dir="ltr"
                    className="max-h-32 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/50 p-3 text-left font-mono text-xs text-emerald-200"
                  >
                    {appConsole}
                  </pre>
                ) : null}
              </div>
            ) : null}

            {appTab === "export" ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-emerald-200">فحص جاهزية المشروع</h3>
                    <button
                      type="button"
                      data-testid="project-readiness-check"
                      onClick={handleReadinessCheck}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
                    >
                      فحص جاهزية المشروع
                    </button>
                  </div>
                  {readiness ? (
                    <ul className="mt-3 space-y-1 text-sm text-slate-200">
                      {Object.entries(readiness.statuses).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-bold text-emerald-300">{key}: </span>
                          {value}
                        </li>
                      ))}
                      {readiness.issues?.length ? (
                        <li className="text-amber-200">مشكلات: {readiness.issues.join(" — ")}</li>
                      ) : null}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">شغّل المشروع ثم افحص الجاهزية قبل التصدير.</p>
                  )}
                </div>
                <ProjectExportPanel
                  title={projectTitle.trim() || appTemplate.titleAr}
                  code={code}
                  mode="app"
                  templateId={activeAppId}
                  authorName={user?.nameAr}
                  ownerId={user?.id}
                  projectId={savedProjectId || activeAppId}
                  variant="dark"
                  lastRunOk={lastRunOk}
                  lastRunCodeHash={lastRunCodeHash}
                />
              </div>
            ) : null}

            {appTab === "solution" && isTeacher ? (
              <div className="space-y-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <h3 className="text-base font-bold text-cyan-100">الحل النموذجي — {appTemplate.titleAr}</h3>
                <p className="text-sm text-slate-300">
                  معاينة المعلم فقط. لن تُحفظ كمحاولة طالب ولن تظهر في تقدّم الطلاب.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={loadTeacherSolution}
                    disabled={teacherSolutionBusy}
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {teacherSolutionBusy ? "جاري التحميل…" : "تحميل الحل من الخادم"}
                  </button>
                  <button
                    type="button"
                    onClick={openTeacherSolutionInEditor}
                    disabled={!teacherSolution}
                    className="rounded-xl border border-violet-400/50 px-4 py-2 text-sm font-bold text-violet-100 disabled:opacity-40"
                  >
                    فتح الحل الكامل في المحرر
                  </button>
                  <button
                    type="button"
                    onClick={runApp}
                    disabled={!code || busy}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    معاينة المعلم
                  </button>
                </div>
                {teacherSolutionError ? <p className="text-sm text-amber-200">{teacherSolutionError}</p> : null}
                {teacherSolution ? (
                  <pre
                    dir="ltr"
                    className="max-h-96 overflow-auto rounded-xl border border-white/10 bg-black/50 p-3 text-left font-mono text-xs text-emerald-100"
                  >
                    {teacherSolution}
                  </pre>
                ) : (
                  <p className="text-xs text-slate-400">اضغط تحميل الحل لجلب الكود النموذجي الآمن من API المعلم.</p>
                )}
                <div>
                  <p className="mb-2 text-xs font-bold text-slate-400">مكونات skui المستخدمة</p>
                  <div className="flex flex-wrap gap-1">
                    {(appTemplate.components || []).map((c) => (
                      <span key={c} dir="ltr" className="rounded bg-black/40 px-2 py-0.5 font-mono text-[11px] text-cyan-200">
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-400">اختبارات المشروع</p>
                  <ul className="mt-1 list-inside list-disc text-xs text-slate-300">
                    {(appTemplate.tests || []).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
