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
import {
  filterSnippets,
  paginateSnippets,
  sortSnippets,
} from "../lib/python/snippetLibraryUi.js";

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

function autoFixIndentationSimple(code) {
  const lines = String(code || "").replace(/\t/g, "    ").split("\n");
  let indentLevel = 0;
  const out = [];
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      out.push("");
      continue;
    }
    if (/^(elif|else|except|finally)\b/.test(trimmed) || trimmed === ")" || trimmed === "]" || trimmed === "}") {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    out.push(`${"    ".repeat(indentLevel)}${trimmed}`);
    if (/:\s*$/.test(trimmed)) {
      indentLevel += 1;
    }
  }
  return out.join("\n");
}

export default function PythonLab() {
  const {
    user,
    myProgress,
    savePythonSnippet,
    updatePythonSnippet,
    deletePythonSnippet,
    saveGraphicProject,
    submitGraphicProject,
    trackPythonRun,
    deleteGraphicProject,
    trackGuiEvent,
  } = usePlatform();
  const [searchParams, setSearchParams] = useSearchParams();
  const exFromUrl = searchParams.get("ex");
  const modeFromUrl = searchParams.get("mode");
  const appFromUrl = searchParams.get("app");
  const panelFromUrl = searchParams.get("panel");

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
  const [assistMode, setAssistMode] = useState(getBuildTimeAssistMode);
  const [assistSaving, setAssistSaving] = useState(false);
  const [teacherSnippets, setTeacherSnippets] = useState([]);
  const [snippetQuery, setSnippetQuery] = useState("");
  const [snippetFilter, setSnippetFilter] = useState("all");
  const [snippetSort, setSnippetSort] = useState("newest");
  const [snippetPage, setSnippetPage] = useState(1);
  const [previewSnippetId, setPreviewSnippetId] = useState(null);
  const [renameSnippetId, setRenameSnippetId] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");

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
  const codeRef = useRef(code);
  codeRef.current = code;
  const [appUi, setAppUi] = useState(null);
  const [appValues, setAppValues] = useState({});
  const [appConsole, setAppConsole] = useState("");
  const savedPanelRef = useRef(null);

  const isTeacher = user?.role === "teacher";
  const stepPlan = useMemo(
    () => getStepPlan(runMode === "app" ? "app" : "console", runMode === "app" ? activeAppId : activeId),
    [runMode, activeAppId, activeId],
  );
  const myGraphicProjects = myProgress?.graphicProjects ?? [];
  const visibleAppTabs = APP_TABS.filter((tab) => !tab.teacherOnly || isTeacher);
  const myStudentSnippets = myProgress?.pythonSnippets ?? [];
  const teacherSnippetsStorageKey = user?.id ? `teacher-python-snippets:${user.id}` : null;
  const snippetsSource = user?.role === "teacher" ? teacherSnippets : myStudentSnippets;
  const visibleSnippets = useMemo(() => {
    const filtered = filterSnippets(snippetsSource, {
      query: snippetQuery,
      type: snippetFilter === "recent" ? "all" : snippetFilter,
    });
    const recentFiltered =
      snippetFilter === "recent"
        ? filtered.filter((s) => {
            const ref = Date.parse(s.updatedAt || s.at || "");
            return Number.isFinite(ref) && ref >= Date.now() - 1000 * 60 * 60 * 24 * 7;
          })
        : filtered;
    return sortSnippets(recentFiltered, snippetSort);
  }, [snippetsSource, snippetQuery, snippetFilter, snippetSort]);

  const pagedSnippets = useMemo(
    () => paginateSnippets(visibleSnippets, snippetPage, 6),
    [visibleSnippets, snippetPage],
  );

  function applyStepReset(plan, { loadCode = true } = {}) {
    const s = resetStepState();
    setStepIndex(s.stepIndex);
    setStepHintLevel(s.stepHintLevel);
    setStepCheckResult(s.stepCheckResult);
    setStepCheckAttempts(s.stepCheckAttempts);
    setSolutionRevealed(s.solutionRevealed);
    if (plan && loadCode) setCode(getInitialCode(plan));
  }

  const persistTeacherSnippets = useCallback(
    (nextSnippets) => {
      setTeacherSnippets(nextSnippets);
      if (!teacherSnippetsStorageKey) return;
      try {
        localStorage.setItem(teacherSnippetsStorageKey, JSON.stringify(nextSnippets));
      } catch {
        /* ignore */
      }
    },
    [teacherSnippetsStorageKey],
  );

  useEffect(() => {
    setSnippetPage(1);
  }, [snippetQuery, snippetFilter, snippetSort]);

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

  const selectProject = useCallback(
    (id, { codeOverride = null, savedId = null, titleOverride = null } = {}) => {
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
      } else {
        setCode(project.studentStarterCode ?? project.starterCode ?? "");
        applyStepReset(getStepPlan("app", project.id), { loadCode: false });
      }
      trackGuiEvent?.("gui_project_started");
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("mode", "app");
        next.set("app", project.id);
        return next;
      });
      setAppTab(codeOverride != null ? "code" : "project");
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

  const pickApp = useCallback(
    (id) => {
      if (!SKUI_PROJECTS.some((project) => project.id === id)) return;
      selectProject(id);
    },
    [selectProject],
  );

  const loadSavedProject = useCallback(
    (project) => {
      const templateId =
        project.templateId && SKUI_PROJECTS.some((candidate) => candidate.id === project.templateId)
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
      if (appFromUrl && SKUI_PROJECTS.some((p) => p.id === appFromUrl)) {
        const tpl = getSkuiProjectOrDefault(appFromUrl);
        setActiveAppId(appFromUrl);
        const plan = getStepPlan("app", appFromUrl);
        setCode(tpl.studentStarterCode ?? tpl.starterCode ?? "");
        applyStepReset(plan, { loadCode: false });
        setProjectTitle(tpl.titleAr);
      }
    }
  }, [exFromUrl, modeFromUrl, appFromUrl]);

  useEffect(() => {
    if (user?.role !== "teacher" || !teacherSnippetsStorageKey) return;
    try {
      const raw = localStorage.getItem(teacherSnippetsStorageKey);
      setTeacherSnippets(raw ? JSON.parse(raw) : []);
    } catch {
      setTeacherSnippets([]);
    }
  }, [user?.role, teacherSnippetsStorageKey]);

  useEffect(() => {
    if (user?.role !== "teacher") return;
    const source = searchParams.get("source");
    if (source !== "teacher-snippet-preview") return;
    try {
      const raw = localStorage.getItem("teacher-snippet-preview");
      if (!raw) return;
      const snippet = JSON.parse(raw);
      if (!snippet?.code) {
        setFeedback({
          headlineAr: "لا يوجد كود للعرض",
          hintAr: "هذا السجل لا يحتوي نص كود فعلي.",
          detail: "",
          line: null,
        });
        return;
      }
      stopAppSession();
      setRunMode("console");
      setCode(String(snippet.code));
      setOut("");
      setFeedback({
        headlineAr: "تم تحميل كود الطالب بنجاح",
        hintAr: `الطالب: ${snippet.studentNameAr || "—"} | الدرس: ${snippet.lessonId || "—"} | النشاط: ${snippet.activityId || "—"}`,
        detail: "",
        line: null,
      });
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("mode", "console");
        next.delete("source");
        return next;
      });
    } catch {
      setFeedback({
        headlineAr: "تعذر تحميل الكود المحفوظ",
        hintAr: "حاول مرة أخرى من لوحة المعلم.",
        detail: "",
        line: null,
      });
    } finally {
      try {
        localStorage.removeItem("teacher-snippet-preview");
      } catch {
        /* ignore */
      }
    }
  }, [user?.role, searchParams, setSearchParams, stopAppSession]);

  useEffect(() => {
    if (panelFromUrl !== "saved") return;
    const id = setTimeout(() => {
      savedPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(id);
  }, [panelFromUrl, user?.role, myStudentSnippets.length, teacherSnippets.length]);

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
    setStepCheckResult({
      ok: false,
      messageAr: "الحل الكامل غير متاح للطلاب — استخدم التلميحات أو اطلب مساعدة المعلم.",
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
      if (user?.role === "student") trackPythonRun();
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
    setLastRunCodeHash(null);
    setReadiness(null);
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
      if (user?.role === "student") trackPythonRun();
      trackGuiEvent?.("gui_project_run");
      const componentCount = Object.keys(result.ui?.nodes || {}).length;
      if (componentCount > 0) trackGuiEvent?.("gui_component_created");
      if (componentCount === 0) {
        setRunStatus({
          kind: "engine-error",
          message: "لا توجد مكونات للعرض — تأكد من app.add(...) وapp.run().",
        });
      } else {
        setRunStatus({ kind: "success", message: "يعمل التطبيق في المعاينة." });
        setLastRunOk(true);
        setLastRunCodeHash(await sha256Hex(code));
      }
    } catch (e) {
      const nextFeedback = e?.feedback ?? formatSkulptError(e, { appMode: true });
      setFeedback(nextFeedback);
      const isEngineError = /worker|timeout|preview|محرك|Skulpt/i.test(
        `${nextFeedback?.headlineAr || ""} ${nextFeedback?.detail || ""} ${e?.message || ""}`,
      );
      setRunStatus({
        kind: isEngineError ? "engine-error" : "code-error",
        message: isEngineError
          ? "حدث خطأ في أداة المعاينة، وليس بالضرورة في كود الطالب."
          : nextFeedback?.line != null
            ? `تعذر تشغيل المشروع بسبب خطأ في السطر رقم ${nextFeedback.line}`
            : nextFeedback?.headlineAr || "تعذر تشغيل المشروع بسبب خطأ في الكود.",
      });
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
    if (runMode === "app") {
      const tpl = getSkuiProjectOrDefault(activeAppId);
      if (tpl && !savedProjectId) {
        const plan = getStepPlan("app", activeAppId);
        setCode(tpl.studentStarterCode ?? tpl.starterCode ?? "");
        applyStepReset(plan, { loadCode: false });
      }
    }
  }

  function handleAutoFixIndentation() {
    const fixed = autoFixIndentationSimple(code);
    setCode(fixed);
    setFeedback({
      headlineAr: "تم إصلاح المسافات تلقائيًا",
      hintAr: "راجع الكود ثم أعد التشغيل للتأكد من النتيجة.",
      detail: fixed,
      line: null,
    });
  }

  function handleSave() {
    if (!user) {
      window.alert("سجّل الدخول أولاً لحفظ الكود.");
      return;
    }
    if (user.role === "teacher") {
      const now = new Date().toISOString();
      const title = runMode === "app" ? (projectTitle.trim() || appTemplate.titleAr) : (exercise?.titleAr || "كود محفوظ");
      const record = {
        id: `tpy-${Date.now()}`,
        title,
        code,
        lessonId: exercise?.lessonId || activeId,
        lessonTitle: exercise?.titleAr || appTemplate?.titleAr || "",
        activityId: exercise?.id || activeAppId,
        snippetType: runMode === "app" ? "project" : "lesson",
        at: now,
        updatedAt: now,
      };
      persistTeacherSnippets([record, ...teacherSnippets]);
      window.alert("تم حفظ الكود في مكتبة المعلم.");
      return;
    }
    if (runMode === "console") {
      savePythonSnippet(exercise?.titleAr || "كود محفوظ", code, {
        lessonId: exercise?.lessonId || activeId,
        lessonTitle: exercise?.titleAr || "",
        activityId: exercise?.id || "",
        snippetType: "lesson",
      });
      window.alert("تم حفظ الكود في حسابك.");
      return;
    }
    const title = projectTitle.trim() || appTemplate.titleAr;
    const id = saveGraphicProject(title, code, savedProjectId, { templateId: activeAppId });
    if (id) setSavedProjectId(id);
    trackGuiEvent?.("gui_project_saved");
    window.alert("تم حفظ المشروع الرسومي في حسابك.");
  }

  function openSnippet(snippet) {
    stopAppSession();
    setRunMode("console");
    setCode(snippet.code || "");
    setOut("");
    setFeedback(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("mode", "console");
      return next;
    });
  }

  function deleteTeacherSnippet(snippetId) {
    if (user?.role !== "teacher") return;
    persistTeacherSnippets(teacherSnippets.filter((s) => s.id !== snippetId));
  }

  function handleRenameStart(snippet) {
    setRenameSnippetId(snippet.id);
    setRenameTitle(snippet.title || "كود محفوظ");
  }

  function handleRenameSave(snippet) {
    const cleanTitle = renameTitle.trim() || "كود محفوظ";
    if (user?.role === "teacher") {
      persistTeacherSnippets(
        teacherSnippets.map((item) =>
          item.id === snippet.id ? { ...item, title: cleanTitle, updatedAt: new Date().toISOString() } : item,
        ),
      );
    } else {
      updatePythonSnippet(snippet.id, { title: cleanTitle });
    }
    setRenameSnippetId(null);
    setRenameTitle("");
  }

  function handleDeleteSnippet(snippet) {
    const ok = window.confirm(`هل تريد حذف الكود "${snippet.title || "كود محفوظ"}"؟`);
    if (!ok) return;
    if (user?.role === "teacher") {
      deleteTeacherSnippet(snippet.id);
      return;
    }
    deletePythonSnippet(snippet.id);
  }

  function handleSaveCopy(snippet) {
    if (user?.role === "teacher") {
      const now = new Date().toISOString();
      const copy = {
        ...snippet,
        id: `tpy-${Date.now()}`,
        title: `${snippet.title || "كود محفوظ"} (نسخة)`,
        at: now,
        updatedAt: now,
      };
      persistTeacherSnippets([copy, ...teacherSnippets]);
      return;
    }
    savePythonSnippet(`${snippet.title || "كود محفوظ"} (نسخة)`, snippet.code || "", {
      lessonId: snippet.lessonId || "",
      lessonTitle: snippet.lessonTitle || "",
      activityId: snippet.activityId || "",
      snippetType: snippet.snippetType || "lesson",
    });
  }

  async function copySnippet(snippet) {
    try {
      await navigator.clipboard?.writeText(snippet.code || "");
      window.alert("تم نسخ الكود.");
    } catch {
      window.alert("تعذر النسخ من المتصفح الحالي.");
    }
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
    const id =
      saveGraphicProject(title, code, savedProjectId, { templateId: activeAppId }) ||
      savedProjectId;
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
      const solutionId = appTemplate.teacherSolutionId || activeAppId;
      const response = await fetch(
        `/api/teacher/skui-projects/${encodeURIComponent(solutionId)}/solution`,
        { headers: { "X-User-Role": "teacher" } },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.code) {
        throw new Error(data?.error || "تعذر جلب الحل النموذجي.");
      }
      setTeacherSolution(data.code);
    } catch (error) {
      setTeacherSolutionError(error.message || "تعذر جلب الحل.");
      setTeacherSolution(null);
    } finally {
      setTeacherSolutionBusy(false);
    }
  }

  function openTeacherSolutionInEditor() {
    if (!isTeacher || !teacherSolution) return;
    stopAppSession();
    clearPreviewState();
    setCode(teacherSolution);
    setSavedProjectId(null);
    setAppTab("code");
    setFeedback({
      headlineAr: "معاينة المعلم",
      hintAr: "تم فتح الحل النموذجي في المحرر. لن يُحفظ كمحاولة طالب.",
      detail: "",
      line: null,
    });
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
  const likelyIndentationIssue = Boolean(
    feedback &&
      /indent|مساف|indentation/i.test(
        `${feedback.headlineAr || ""} ${feedback.hintAr || ""} ${feedback.detail || ""}`,
      ),
  );

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
                استخدم <span dir="ltr" className="font-mono text-cyan-300">import skui as ui</span> — مكتبة
                واجهات أصلية لـ Skulpt تعمل داخل معاينة معزولة.
              </p>
            </div>
            <div className="mb-4 flex flex-wrap gap-2 border-b border-white/10 pb-3">
              {visibleAppTabs.map((tab) => (
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
              <div className="mb-6 space-y-4">
                <SkuiProjectGallery
                  selectedId={activeAppId}
                  onSelect={pickApp}
                  role={user?.role}
                />
                <AppModeHelp
                  variant="dark"
                  onInsertExample={(example) => {
                    if (example?.id) pickApp(example.id);
                    else if (typeof example === "string") {
                      setCode(example);
                      setAppTab("code");
                    }
                  }}
                />
              </div>
            ) : null}
            {user?.role === "student" && myGraphicProjects.length > 0 ? (
              <div className="mb-6 rounded-xl border border-cyan-500/25 bg-cyan-950/20 p-4">
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
                        className="px-2 text-xs text-amber-200"
                        title="إعادة تسمية"
                        onClick={() => {
                          const next = window.prompt("اسم المشروع الجديد", p.title);
                          if (next?.trim()) {
                            saveGraphicProject(next.trim(), p.code, p.id, {
                              templateId: p.templateId || activeAppId,
                            });
                          }
                        }}
                      >
                        تسمية
                      </button>
                      <button
                        type="button"
                        className="px-2 text-xs text-emerald-200"
                        title="إنشاء نسخة"
                        onClick={() =>
                          saveGraphicProject(`${p.title} (نسخة)`, p.code, null, {
                            templateId: p.templateId || activeAppId,
                          })
                        }
                      >
                        نسخ
                      </button>
                      <button
                        type="button"
                        className="px-2 text-xs text-red-200"
                        title="حذف"
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

        {runMode === "console" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-400">الكود</label>
            <PythonCodeEditor
              value={code}
              onChange={setCode}
              assistMode={assistMode}
              unitId={activeUnitId}
              appMode={false}
            />
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              برامج متعددة الأسطر: <span dir="ltr">if</span>، <span dir="ltr">for</span>،{" "}
              <span dir="ltr">while</span>، دوال، وقوائم.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={runConsole}
                disabled={busy}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60"
              >
                {busy ? "جارٍ التشغيل…" : "تشغيل الكود"}
              </button>
              <button
                type="button"
                onClick={handleAutoFixIndentation}
                disabled={busy}
                className="rounded-xl border border-amber-400/50 px-4 py-3 text-sm font-bold text-amber-200 hover:bg-amber-900/30 disabled:opacity-50"
              >
                إصلاح المسافات تلقائيًا
              </button>
            </div>

            {user ? (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 rounded-xl border border-white/20 py-2 text-sm text-slate-200 hover:bg-white/10"
                >
                  حفظ الكود {user.role === "teacher" ? "(المعلم)" : ""}
                </button>
              </div>
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
                allowRevealSolution={false}
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
            {likelyIndentationIssue ? (
              <button
                type="button"
                onClick={handleAutoFixIndentation}
                className="mt-3 rounded-lg border border-amber-400/50 bg-amber-900/20 px-3 py-2 text-xs font-bold text-amber-200 hover:bg-amber-900/30"
              >
                اكتُشف خطأ مسافات — اضغط لإصلاحها تلقائيًا
              </button>
            ) : null}
          </div>
        </div>
        ) : null}

        {runMode === "app" && appTab === "code" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-400">الكود</label>
            <PythonCodeEditor
              value={code}
              onChange={setCode}
              assistMode={assistMode}
              unitId={activeUnitId}
              appMode
            />
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              مثال: <span dir="ltr">ui.Button</span>، <span dir="ltr">on_click</span>،{" "}
              <span dir="ltr">app.run()</span> في نهاية الكود.
            </p>

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
              <button
                type="button"
                onClick={() => {
                  stopAppSession();
                  clearPreviewState();
                }}
                disabled={busy}
                className="rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/10 disabled:opacity-50"
              >
                مسح المعاينة
              </button>
            </div>

            {user ? (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 rounded-xl border border-white/20 py-2 text-sm text-slate-200 hover:bg-white/10"
                >
                  حفظ المشروع {user.role === "teacher" ? "(المعلم)" : ""}
                </button>
                {user.role === "student" ? (
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

            {!savedProjectId ? (
              <p className="mt-3 text-xs text-violet-200/90">{appTemplate.curriculumTopic}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">معاينة سريعة</label>
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
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              مكتبة skui مصممة خصيصًا لـ Skulpt والمتصفح، وليست Tkinter. تعمل الواجهة داخل iframe معزول،
              ويعمل كود Python داخل Web Worker قابل للإيقاف دون الوصول إلى DOM المنصة أو بياناتها.
            </p>
          </div>
        </div>
        ) : null}

        {runMode === "app" && appTab === "preview" ? (
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

        {runMode === "app" && appTab === "export" ? (
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

        {runMode === "app" && appTab === "solution" && isTeacher ? (
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

        <section
          ref={savedPanelRef}
          id="python-saved-library"
          className="mt-8 rounded-2xl border border-violet-500/30 bg-violet-950/20 p-5"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-violet-100">
              {user?.role === "teacher" ? "مكتبة أكواد المعلم" : "مكتبة الأكواد المحفوظة"}
            </h2>
            <span className="rounded-full bg-violet-900/60 px-3 py-1 text-xs font-bold text-violet-200">
              {pagedSnippets.totalItems} عنصر
            </span>
          </div>
          <div className="mb-4 grid gap-2 md:grid-cols-3">
            <input
              type="text"
              value={snippetQuery}
              onChange={(e) => setSnippetQuery(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm text-white"
              placeholder="ابحث باسم الكود أو الدرس أو التاريخ"
            />
            <select
              className="rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm text-white"
              value={snippetFilter}
              onChange={(e) => setSnippetFilter(e.target.value)}
            >
              <option value="all">كل الأكواد</option>
              <option value="lesson">أكواد الدروس</option>
              <option value="project">أكواد المشاريع</option>
              <option value="recent">آخر المحفوظات</option>
            </select>
            <select
              className="rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm text-white"
              value={snippetSort}
              onChange={(e) => setSnippetSort(e.target.value)}
            >
              <option value="newest">الأحدث أولًا</option>
              <option value="oldest">الأقدم أولًا</option>
              <option value="lesson">حسب اسم الدرس</option>
            </select>
          </div>
          {pagedSnippets.totalItems === 0 ? (
            <p className="text-sm text-slate-300">لا توجد أكواد محفوظة حالياً.</p>
          ) : (
            <div className="space-y-2">
              {pagedSnippets.items.map((snippet) => (
                <div
                  key={snippet.id}
                  className="rounded-lg border border-white/10 bg-black/30 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {renameSnippetId === snippet.id ? (
                      <div className="flex flex-1 flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={renameTitle}
                          onChange={(e) => setRenameTitle(e.target.value)}
                          className="rounded-md border border-white/20 bg-black/50 px-2 py-1 text-sm text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRenameSave(snippet)}
                          className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-bold text-white"
                        >
                          حفظ الاسم
                        </button>
                        <button
                          type="button"
                          onClick={() => setRenameSnippetId(null)}
                          className="rounded-md border border-white/20 px-2 py-1 text-xs text-slate-200"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <p className="font-semibold text-white">{snippet.title || "كود محفوظ"}</p>
                    )}
                    <p className="text-xs text-slate-400">
                      {snippet.updatedAt
                        ? `آخر تعديل: ${new Date(snippet.updatedAt).toLocaleString("ar-SA")}`
                        : snippet.at
                          ? new Date(snippet.at).toLocaleString("ar-SA")
                          : "—"}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-violet-200/90">
                    {snippet.lessonTitle || snippet.lessonId || "—"} | النشاط: {snippet.activityId || "—"} | النوع:{" "}
                    {snippet.snippetType || "lesson"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveCopy(snippet)}
                      className="rounded-md border border-emerald-400/40 px-3 py-1 text-xs text-emerald-200"
                    >
                      حفظ كود
                    </button>
                    <button type="button" onClick={() => openSnippet(snippet)} className="rounded-md bg-violet-600 px-3 py-1 text-xs font-bold text-white">
                      فتح في المحرر
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSnippetId(previewSnippetId === snippet.id ? null : snippet.id)}
                      className="rounded-md border border-cyan-400/40 px-3 py-1 text-xs text-cyan-200"
                    >
                      معاينة
                    </button>
                    <button
                      type="button"
                      onClick={() => copySnippet(snippet)}
                      className="rounded-md border border-white/20 px-3 py-1 text-xs text-slate-200"
                    >
                      نسخ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRenameStart(snippet)}
                      className="rounded-md border border-amber-400/40 px-3 py-1 text-xs text-amber-200"
                    >
                      إعادة تسمية
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSnippet(snippet)}
                      className="rounded-md border border-red-400/40 px-3 py-1 text-xs text-red-200"
                    >
                      حذف
                    </button>
                  </div>
                  {previewSnippetId === snippet.id ? (
                    <pre className="mt-3 max-h-48 overflow-auto rounded-lg border border-white/10 bg-slate-950 p-3 text-left font-mono text-xs text-emerald-200" dir="ltr">
                      {snippet.code || ""}
                    </pre>
                  ) : null}
                </div>
              ))}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs text-slate-300">
                <span>
                  صفحة {pagedSnippets.currentPage} من {pagedSnippets.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSnippetPage((p) => Math.max(1, p - 1))}
                    disabled={pagedSnippets.currentPage <= 1}
                    className="rounded-md border border-white/20 px-3 py-1 disabled:opacity-40"
                  >
                    السابق
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnippetPage((p) => Math.min(pagedSnippets.totalPages, p + 1))}
                    disabled={pagedSnippets.currentPage >= pagedSnippets.totalPages}
                    className="rounded-md border border-white/20 px-3 py-1 disabled:opacity-40"
                  >
                    التالي
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
