import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { findTeacherProfileByNationalId, findTeacherById } from "../data/demoUsers";
import {
  findStudentByNationalId,
  rosterStudentToUser,
  getAllRosterStudents,
} from "../data/studentsRoster";
import { createDemoStudentProfile } from "../lib/demo/demoStudentProfile";
import {
  savePlatformState,
  getStudentProgress,
  getStudentAnalytics,
  computeProgressStats,
  defaultProgressForStudent,
  ensureStudentRecords,
} from "../lib/platformStore";
import {
  recordLogin,
  recordPageView,
  recordSimRun,
  recordPythonRun,
  recordGuiEvent,
  recordActivityStart,
  recordActivityComplete,
  defaultAnalytics,
  mergeRemoteAnalytics,
} from "../lib/platformAnalytics";
import { reportLoginEvent, reportActivityPatch, fetchAllAnalytics } from "../lib/analyticsApi";
import { loginStudentApi, loginTeacherApi, loginDemoStudentApi, logoutApi, fetchAuthMeApi, savePreAssessmentApi, syncProgressApi, fetchComputedProgressMe, fetchTeacherRosterProgress, completeStudentDayApi, fetchPublicationConfigApi } from "../lib/platformApi";
import { setCachedPublicationConfig } from "../lib/publicationConfigStore.js";
import {
  loadValidatedPlatformState,
  resolveSessionUser,
  createSessionPatch,
  clearSessionPatch,
  hardRedirectToLogin,
} from "../lib/session";
import { INACTIVITY_LOGOUT_REASON } from "../lib/inactivityConfig.js";
import { clearActivityTracking, resetActivityTracking } from "../lib/inactivitySync.js";
import { PRE_ASSESSMENT_STATUS } from "../content/onboarding/onboardingPolicy.js";

const PlatformContext = createContext(null);

const LOGIN_SESSION_KEY = "mubarmij-login-session-id";
let activitySyncTimer = null;

function mapComputedToStats(computed) {
  if (!computed) return null;
  return {
    overallPercent: computed.availableProgressPercent ?? computed.overallPercent ?? 0,
    completedDays: computed.completedDays ?? 0,
    totalDays: computed.totalDays ?? 15,
    totalPublishedLessons: computed.totalPublishedLessons ?? 0,
    completedLessons: computed.completedLessons ?? 0,
    worksheetsDone: computed.worksheetsDone ?? computed.completedWorksheets ?? 0,
    quizCount: computed.completedQuizzes ?? 0,
    drillsDone: 0,
    microbitDone: computed.microbitDone ?? 0,
    preTest: computed.preTest ?? null,
    postTest: computed.postTest ?? null,
    projectStatus: computed.projectStatus ?? "not_started",
    completedRequiredItems: computed.completedRequiredItems ?? 0,
    requiredItems: computed.requiredItems ?? 0,
    pathProgress: computed.pathProgress ?? null,
    calculatedAt: computed.calculatedAt ?? null,
    progressVersion: computed.progressVersion ?? "v2",
    preAssessmentStatus: computed.preAssessmentStatus,
    preAssessmentLabelAr: computed.preAssessmentLabelAr,
    preAssessmentDiagnosticPercent: computed.preAssessmentDiagnosticPercent ?? computed.assessmentSummary?.preAssessment?.scorePercent ?? null,
    assessmentSummary: computed.assessmentSummary ?? null,
    attendanceStatus: computed.attendanceStatus,
    details: computed.details ?? null,
    pythonRuns: computed.pythonRuns ?? 0,
    pythonSnippetsCount: computed.pythonSnippetsCount ?? 0,
    lastPythonRunAt: computed.lastPythonRunAt ?? null,
    pythonActivityNoteAr: computed.pythonActivityNoteAr ?? null,
    dayUnlock: computed.dayUnlock ?? null,
    publishedDays: computed.publishedDays ?? computed.dayUnlock?.publishedDays ?? null,
  };
}

function shouldHydrateFromServer(localProgress, serverProgress) {
  if (!serverProgress) return false;
  const localSnippets = localProgress?.pythonSnippets?.length || 0;
  const serverSnippets = serverProgress?.pythonSnippets?.length || 0;
  const localGraphics = localProgress?.graphicProjects?.length || 0;
  const serverGraphics = serverProgress?.graphicProjects?.length || 0;
  return serverSnippets > localSnippets || serverGraphics > localGraphics;
}

function getOrCreateLoginSessionId() {
  try {
    let id = sessionStorage.getItem(LOGIN_SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(LOGIN_SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function clearLoginSessionId() {
  try {
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function scheduleActivitySync(studentId, analytics) {
  if (activitySyncTimer) clearTimeout(activitySyncTimer);
  activitySyncTimer = setTimeout(() => {
    reportActivityPatch(studentId, {
      lastActivityAt: analytics.lastActivityAt,
      dailyLog: analytics.dailyLog,
      pagesVisited: analytics.pagesVisited,
      pythonRuns: analytics.pythonRuns,
      guiEvents: analytics.guiEvents,
      activitiesCompleted: analytics.activitiesCompleted,
      simRuns: analytics.simRuns,
    });
  }, 3000);
}

export function PlatformProvider({ children }) {
  const [state, setState] = useState(() => loadValidatedPlatformState());
  const [authReady] = useState(true);
  const [remoteAnalyticsByStudent, setRemoteAnalyticsByStudent] = useState({});
  const [analyticsSyncStatus, setAnalyticsSyncStatus] = useState({ loading: false, error: null, fetchedAt: null });
  const [serverStatsByStudent, setServerStatsByStudent] = useState({});
  const [progressSyncStatus, setProgressSyncStatus] = useState({
    loading: false,
    saving: false,
    error: null,
    fetchedAt: null,
  });
  const [publicationConfig, setPublicationConfig] = useState(null);

  const refreshPublicationConfig = useCallback(async () => {
    try {
      const res = await fetchPublicationConfigApi();
      if (res.ok) {
        setCachedPublicationConfig(res);
        setPublicationConfig(res);
        return res;
      }
    } catch (err) {
      console.error("[platform] publication config", err?.message || err);
    }
    return null;
  }, []);

  useEffect(() => {
    refreshPublicationConfig();
  }, [refreshPublicationConfig]);

  useEffect(() => {
    function onPageShow(event) {
      if (!event.persisted) return;
      const fresh = loadValidatedPlatformState();
      if (!fresh.sessionUserId) {
        hardRedirectToLogin();
        return;
      }
      setState(fresh);
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const persist = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      savePlatformState(next);
      return next;
    });
  }, []);

  const user = useMemo(
    () => (state.sessionUserId ? resolveSessionUser(state.sessionUserId) : null),
    [state.sessionUserId],
  );

  const sessionUserId = state.sessionUserId;
  const isStudentSession = Boolean(user?.role === "student");

  const refreshTeacherAnalytics = useCallback(async () => {
    setAnalyticsSyncStatus((s) => ({ ...s, loading: true, error: null }));
    const res = await fetchAllAnalytics();
    if (res.ok) {
      setRemoteAnalyticsByStudent(res.analyticsByStudent || {});
      setAnalyticsSyncStatus({
        loading: false,
        error: null,
        fetchedAt: res.fetchedAt || new Date().toISOString(),
      });
      try {
        const roster = await fetchTeacherRosterProgress();
        if (roster.ok && roster.byStudent) {
          const mapped = {};
          for (const [sid, computed] of Object.entries(roster.byStudent)) {
            mapped[sid] = mapComputedToStats(computed);
          }
          setServerStatsByStudent(mapped);
          setProgressSyncStatus((s) => ({
            ...s,
            fetchedAt: roster.fetchedAt || new Date().toISOString(),
            error: null,
          }));
        }
      } catch (err) {
        console.error("[platform] teacher roster progress", err?.message || err);
      }
      return { ok: true };
    }
    setAnalyticsSyncStatus({
      loading: false,
      error: res.error || "تعذّر جلب البيانات من الخادم",
      fetchedAt: null,
    });
    return { ok: false, error: res.error };
  }, []);

  const progressSyncTimerRef = useRef(null);

  const applyServerComputed = useCallback((studentId, computed) => {
    const stats = mapComputedToStats(computed);
    if (!stats) return;
    setServerStatsByStudent((prev) => ({ ...prev, [studentId]: stats }));
    setProgressSyncStatus((s) => ({
      ...s,
      fetchedAt: computed.calculatedAt || new Date().toISOString(),
      error: null,
      loading: false,
      saving: false,
    }));
  }, []);

  const refreshMyComputedProgress = useCallback(async (studentId, localProgress) => {
    if (!studentId) return;
    setProgressSyncStatus((s) => ({ ...s, loading: true, error: null }));
    try {
      const synced = await syncProgressApi(studentId, localProgress);
      if (synced.progress && shouldHydrateFromServer(localProgress, synced.progress)) {
        persist((prev) => {
          const current = getStudentProgress(prev, studentId);
          return {
            ...prev,
            progressByStudent: {
              ...prev.progressByStudent,
              [studentId]: {
                ...current,
                ...synced.progress,
                updatedAt: synced.progress.updatedAt || new Date().toISOString(),
              },
            },
          };
        });
      }
      if (synced.computed) {
        applyServerComputed(studentId, synced.computed);
        return synced.computed;
      }
      const me = await fetchComputedProgressMe();
      if (me.computed) applyServerComputed(studentId, me.computed);
      return me.computed;
    } catch (err) {
      setProgressSyncStatus((s) => ({
        ...s,
        loading: false,
        error: err?.message || "تعذّر مزامنة التقدم",
      }));
      return null;
    }
  }, [applyServerComputed, persist]);

  const scheduleProgressSync = useCallback(
    (studentId, progress) => {
      if (!studentId || !progress) return;
      if (progressSyncTimerRef.current) clearTimeout(progressSyncTimerRef.current);
      setProgressSyncStatus((s) => ({ ...s, saving: true, error: null }));
      progressSyncTimerRef.current = setTimeout(async () => {
        try {
          const res = await syncProgressApi(studentId, progress);
          if (res.computed) applyServerComputed(studentId, res.computed);
        } catch (err) {
          console.error("[platform] progress sync failed", err?.message || err);
          setProgressSyncStatus((s) => ({
            ...s,
            saving: false,
            error: err?.message || "تعذّر الحفظ",
          }));
        }
      }, 2000);
    },
    [applyServerComputed],
  );

  const loginTeacher = useCallback(
    async (username, password) => {
      const profileHint = findTeacherProfileByNationalId(username);
      if (!profileHint) return { ok: false, message: "بيانات الدخول غير صحيحة." };
      try {
        const data = await loginTeacherApi(username, password);
        const found = findTeacherById(data.user?.id) || profileHint;
        persist((prev) => ({ ...prev, ...createSessionPatch(found.id) }));
        await refreshTeacherAnalytics();
        return { ok: true, user: found };
      } catch (err) {
        console.error("[platform] server auth failed", err);
        return { ok: false, message: "بيانات الدخول غير صحيحة." };
      }
    },
    [persist, refreshTeacherAnalytics],
  );

  const loginStudentByNationalId = useCallback(
    async (nationalId) => {
      const row = findStudentByNationalId(nationalId);
      if (!row) {
        return { ok: false, message: "رقم الهوية غير مسجل في النظام." };
      }
      const student = rosterStudentToUser(row);
      try {
        await loginStudentApi(nationalId);
      } catch (err) {
        console.error("[platform] server auth failed", err);
        return { ok: false, message: "تعذّر إنشاء جلسة الخادم." };
      }
      const sessionId = getOrCreateLoginSessionId();
      let updatedAnalytics = null;
      let updatedProgress = null;

      persist((prev) => {
        let next = { ...prev, ...createSessionPatch(student.id) };
        next = ensureStudentRecords(next, student.id);
        const current = next.analyticsByStudent[student.id];
        updatedAnalytics = recordLogin(current, { sessionId });
        updatedProgress = getStudentProgress(next, student.id);
        next.analyticsByStudent = {
          ...next.analyticsByStudent,
          [student.id]: updatedAnalytics,
        };
        return next;
      });

      try {
        await reportLoginEvent(student.id, {
          at: updatedAnalytics.lastLoginAt,
          sessionId,
          success: true,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 200) : "",
        });
      } catch (err) {
        console.error("[platform] login sync failed", err?.message || err);
      }

      resetActivityTracking();
      refreshMyComputedProgress(student.id, updatedProgress).catch(() => {});
      return { ok: true, user: student };
    },
    [persist, refreshMyComputedProgress],
  );

  const loginDemoStudent = useCallback(
    async () => {
      let payload;
      try {
        payload = await loginDemoStudentApi();
      } catch (err) {
        console.error("[platform] demo auth failed", err);
        return { ok: false, message: "تعذّر بدء الجلسة التجريبية." };
      }

      const demoUser = resolveSessionUser(payload?.user?.id) || createDemoStudentProfile(payload?.user?.id);
      const sessionId = getOrCreateLoginSessionId();
      let updatedAnalytics = null;
      let updatedProgress = null;

      persist((prev) => {
        let next = { ...prev, ...createSessionPatch(demoUser.id) };
        next = ensureStudentRecords(next, demoUser.id);
        const current = next.analyticsByStudent[demoUser.id];
        updatedAnalytics = recordLogin(current, { sessionId });
        updatedProgress = getStudentProgress(next, demoUser.id);
        next.analyticsByStudent = {
          ...next.analyticsByStudent,
          [demoUser.id]: updatedAnalytics,
        };
        return next;
      });

      resetActivityTracking();
      refreshMyComputedProgress(demoUser.id, updatedProgress).catch(() => {});
      return { ok: true, user: demoUser };
    },
    [persist, refreshMyComputedProgress],
  );

  const logout = useCallback(
    ({ reason } = {}) => {
      logoutApi().catch((err) => console.error("[platform] server logout", err));
      persist((prev) => ({ ...prev, ...clearSessionPatch() }));
      clearLoginSessionId();
      clearActivityTracking();
      try {
        sessionStorage.clear();
      } catch {
        /* ignore */
      }
      if (reason === INACTIVITY_LOGOUT_REASON) {
        window.location.replace("/login?reason=inactivity");
        return;
      }
      hardRedirectToLogin();
    },
    [persist],
  );

  const logoutForInactivity = useCallback(() => {
    logout({ reason: INACTIVITY_LOGOUT_REASON });
  }, [logout]);

  const trackPageView = useCallback(
    (path) => {
      persist((prev) => {
        const uid = prev.sessionUserId;
        if (!uid) return prev;
        const resolved = resolveSessionUser(uid);
        if (!resolved || resolved.role !== "student") return prev;
        const current = getStudentAnalytics(prev, uid) ?? defaultAnalytics();
        const updated = recordPageView(current, path);
        scheduleActivitySync(uid, updated);
        return {
          ...prev,
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [uid]: updated,
          },
        };
      });
    },
    [persist],
  );

  const trackSimRun = useCallback(
    (simId) => {
      persist((prev) => {
        const uid = prev.sessionUserId;
        if (!uid) return prev;
        const resolved = resolveSessionUser(uid);
        if (!resolved || resolved.role !== "student") return prev;
        const current = getStudentAnalytics(prev, uid) ?? defaultAnalytics();
        return {
          ...prev,
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [uid]: recordSimRun(current, simId),
          },
        };
      });
    },
    [persist],
  );

  const trackPythonRun = useCallback(() => {
    persist((prev) => {
      const uid = prev.sessionUserId;
      if (!uid) return prev;
      const resolved = resolveSessionUser(uid);
      if (!resolved || resolved.role !== "student") return prev;
      const current = getStudentAnalytics(prev, uid) ?? defaultAnalytics();
      const updated = recordPythonRun(current);
      scheduleActivitySync(uid, updated);
      return {
        ...prev,
        analyticsByStudent: {
          ...prev.analyticsByStudent,
          [uid]: updated,
        },
      };
    });
  }, [persist]);

  const trackGuiEvent = useCallback((eventName) => {
    persist((prev) => {
      const uid = prev.sessionUserId;
      if (!uid) return prev;
      const resolved = resolveSessionUser(uid);
      if (!resolved || resolved.role !== "student") return prev;
      const current = getStudentAnalytics(prev, uid) ?? defaultAnalytics();
      const updated = recordGuiEvent(current, eventName);
      scheduleActivitySync(uid, updated);
      return {
        ...prev,
        analyticsByStudent: { ...prev.analyticsByStudent, [uid]: updated },
      };
    });
  }, [persist]);

  const myProgress = useMemo(() => {
    if (!sessionUserId || !isStudentSession) return null;
    return (
      state.progressByStudent[sessionUserId] ?? defaultProgressForStudent(sessionUserId)
    );
  }, [state.progressByStudent, sessionUserId, isStudentSession]);

  const myAnalytics = useMemo(() => {
    if (!sessionUserId || !isStudentSession) return null;
    return state.analyticsByStudent?.[sessionUserId] ?? defaultAnalytics();
  }, [state.analyticsByStudent, sessionUserId, isStudentSession]);

  const myStats = useMemo(() => {
    if (!myProgress || !sessionUserId) return null;
    const server = serverStatsByStudent[sessionUserId];
    if (server) return server;
    return computeProgressStats(myProgress);
  }, [myProgress, sessionUserId, serverStatsByStudent]);

  useEffect(() => {
    if (!authReady || !sessionUserId || !isStudentSession || !myProgress) return;
    scheduleProgressSync(sessionUserId, myProgress);
  }, [authReady, sessionUserId, isStudentSession, myProgress, scheduleProgressSync]);

  useEffect(() => {
    if (!authReady || !sessionUserId || !isStudentSession) return;
    refreshMyComputedProgress(sessionUserId, myProgress).catch(() => {});
  }, [authReady, sessionUserId, isStudentSession]);

  useEffect(() => {
    if (!sessionUserId || !isStudentSession) return;
    function onLessonProgressSaved() {
      refreshMyComputedProgress(sessionUserId, myProgress).catch(() => {});
    }
    window.addEventListener("platform:lesson-progress-saved", onLessonProgressSaved);
    return () => window.removeEventListener("platform:lesson-progress-saved", onLessonProgressSaved);
  }, [sessionUserId, isStudentSession, myProgress, refreshMyComputedProgress]);

  const updateMyProgress = useCallback(
    (patch) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: { ...current, ...patch, updatedAt: new Date().toISOString() },
          },
        };
      });
    },
    [persist, user],
  );

  const markDayComplete = useCallback(
    async (dayId) => {
      if (!user || user.role !== "student") return { ok: false };
      try {
        const res = await completeStudentDayApi(dayId);
        if (res.computed) applyServerComputed(user.id, res.computed);
        persist((prev) => {
          const current = getStudentProgress(prev, user.id);
          const set = new Set(current.completedDays || []);
          set.add(dayId);
          return {
            ...prev,
            progressByStudent: {
              ...prev.progressByStudent,
              [user.id]: {
                ...current,
                completedDays: [...set],
                dayCompletionTimes: {
                  ...(current.dayCompletionTimes || {}),
                  [dayId]: res.completedAt || new Date().toISOString(),
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
        return { ok: true, ...res };
      } catch (err) {
        return {
          ok: false,
          error: err?.message,
          incompleteItems: err?.incompleteItems || [],
        };
      }
    },
    [persist, user, applyServerComputed],
  );

  const saveWorksheetAnswers = useCallback(
    (worksheetId, answers, status = "in_progress") => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        let analytics = getStudentAnalytics(prev, user.id);
        if (status === "in_progress") analytics = recordActivityStart(analytics);
        if (status === "completed") analytics = recordActivityComplete(analytics, worksheetId);
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              worksheetAnswers: {
                ...current.worksheetAnswers,
                [worksheetId]: { answers, updatedAt: new Date().toISOString() },
              },
              worksheetStatus: {
                ...current.worksheetStatus,
                [worksheetId]: status,
              },
              updatedAt: new Date().toISOString(),
            },
          },
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [user.id]: analytics,
          },
        };
      });
    },
    [persist, user],
  );

  const saveQuizResult = useCallback(
    (quizId, result) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const analytics = recordActivityComplete(getStudentAnalytics(prev, user.id), quizId);
        const quizScores = {
          ...current.quizScores,
          [quizId]: { ...result, at: new Date().toISOString() },
        };
        const patch = { quizScores, updatedAt: new Date().toISOString() };
        if (quizId === "quiz-pre") patch.preTest = result;
        if (quizId === "quiz-post") patch.postTest = result;
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: { ...current, ...patch },
          },
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [user.id]: analytics,
          },
        };
      });
    },
    [persist, user],
  );

  const savePreAssessmentProgress = useCallback(
    async ({ answers, status, totalQuestions, defer, result }) => {
      if (!user || user.role !== "student") return;
      const now = new Date().toISOString();
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const existing = current.preAssessment || {};
        let nextStatus = status || existing.status || PRE_ASSESSMENT_STATUS.NOT_STARTED;
        if (defer) nextStatus = PRE_ASSESSMENT_STATUS.DEFERRED;
        const preAssessment = {
          ...existing,
          answers: answers ?? existing.answers ?? {},
          status: nextStatus,
          totalQuestions: totalQuestions ?? existing.totalQuestions ?? null,
          startedAt: existing.startedAt || (nextStatus !== PRE_ASSESSMENT_STATUS.NOT_STARTED ? now : null),
          updatedAt: now,
          deferredAt: defer ? now : existing.deferredAt ?? null,
          submittedAt: nextStatus === PRE_ASSESSMENT_STATUS.SUBMITTED ? now : existing.submittedAt ?? null,
        };
        const patch = { preAssessment, updatedAt: now };
        if (result && nextStatus === PRE_ASSESSMENT_STATUS.SUBMITTED) {
          patch.quizScores = {
            ...(current.quizScores || {}),
            "quiz-pre": { ...result, submitted: true, at: now },
          };
          patch.preTest = result;
        }
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: { ...current, ...patch },
          },
        };
      });
      return savePreAssessmentApi({ answers, status, totalQuestions, defer, result });
    },
    [persist, user],
  );

  const saveDrillResult = useCallback(
    (drillId, result) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              drillResults: {
                ...current.drillResults,
                [drillId]: { ...result, at: new Date().toISOString() },
              },
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [persist, user],
  );

  const saveMicrobitProgress = useCallback(
    (projectId, patch) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const existing = current.microbitProjects?.[projectId] || {
          status: "not_started",
          studentCode: "",
          quizScore: null,
        };
        let analytics = getStudentAnalytics(prev, user.id);
        if (patch.status === "completed") {
          analytics = recordActivityComplete(analytics, `microbit-${projectId}`);
        } else if (patch.status === "in_progress") {
          analytics = recordActivityStart(analytics);
        }
        const nextEntry = {
          ...existing,
          ...patch,
          updatedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              microbitProjects: {
                ...(current.microbitProjects || {}),
                [projectId]: nextEntry,
              },
              updatedAt: new Date().toISOString(),
            },
          },
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [user.id]: analytics,
          },
        };
      });
    },
    [persist, user],
  );

  const savePythonSnippet = useCallback(
    (title, code, meta = {}) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const analytics = recordPythonRun(getStudentAnalytics(prev, user.id));
        scheduleActivitySync(user.id, analytics);
        const now = new Date().toISOString();
        const snippet = {
          id: `py-${Date.now()}`,
          title: title || "كود محفوظ",
          code,
          lessonId: meta.lessonId || "",
          activityId: meta.activityId || "",
          snippetType: meta.snippetType || "lesson",
          at: now,
          updatedAt: now,
          teacherNote: "",
        };
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              pythonSnippets: [snippet, ...(current.pythonSnippets || [])],
              updatedAt: new Date().toISOString(),
            },
          },
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [user.id]: analytics,
          },
        };
      });
    },
    [persist, user],
  );

  const updatePythonSnippet = useCallback(
    (snippetId, patch = {}) => {
      if (!user || user.role !== "student" || !snippetId) return false;
      let updated = false;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const list = (current.pythonSnippets || []).map((snippet) => {
          if (snippet.id !== snippetId) return snippet;
          updated = true;
          return {
            ...snippet,
            ...patch,
            updatedAt: new Date().toISOString(),
          };
        });
        if (!updated) return prev;
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              pythonSnippets: list,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
      return updated;
    },
    [persist, user],
  );

  const deletePythonSnippet = useCallback(
    (snippetId) => {
      if (!user || user.role !== "student" || !snippetId) return false;
      let deleted = false;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const list = (current.pythonSnippets || []).filter((snippet) => {
          if (snippet.id !== snippetId) return true;
          deleted = true;
          return false;
        });
        if (!deleted) return prev;
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              pythonSnippets: list,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
      return deleted;
    },
    [persist, user],
  );

  const saveGraphicProject = useCallback(
    (title, code, existingId = null, meta = {}) => {
      if (!user || user.role !== "student") return null;
      let savedId = existingId;
      const templateId = meta.templateId || null;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const analytics = recordPythonRun(getStudentAnalytics(prev, user.id));
        scheduleActivitySync(user.id, analytics);
        const list = [...(current.graphicProjects || [])];
        const now = new Date().toISOString();
        if (existingId) {
          const idx = list.findIndex((p) => p.id === existingId);
          if (idx >= 0) {
            list[idx] = {
              ...list[idx],
              title: title || list[idx].title,
              code,
              updatedAt: now,
              ...(templateId ? { templateId } : {}),
            };
            savedId = existingId;
          } else {
            savedId = `gpy-${Date.now()}`;
            list.unshift({
              id: savedId,
              title: title || "مشروع رسومي",
              code,
              templateId,
              status: "draft",
              at: now,
              updatedAt: now,
              submittedAt: null,
              teacherNote: "",
              teacherScore: null,
            });
          }
        } else {
          savedId = `gpy-${Date.now()}`;
          list.unshift({
            id: savedId,
            title: title || "مشروع رسومي",
            code,
            templateId,
            status: "draft",
            at: now,
            updatedAt: now,
            submittedAt: null,
            teacherNote: "",
            teacherScore: null,
          });
        }
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              graphicProjects: list,
              updatedAt: now,
            },
          },
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [user.id]: analytics,
          },
        };
      });
      return savedId;
    },
    [persist, user],
  );

  const submitGraphicProject = useCallback(
    (projectId) => {
      if (!user || user.role !== "student") return false;
      let ok = false;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const list = (current.graphicProjects || []).map((p) => {
          if (p.id !== projectId) return p;
          ok = true;
          return {
            ...p,
            status: "submitted",
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });
        if (!ok) return prev;
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              graphicProjects: list,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
      return ok;
    },
    [persist, user],
  );

  const deleteGraphicProject = useCallback(
    (projectId) => {
      if (!user || user.role !== "student") return false;
      let removed = false;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const list = (current.graphicProjects || []).filter((project) => {
          if (project.id === projectId) {
            removed = true;
            return false;
          }
          return true;
        });
        if (!removed) return prev;
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: { ...current, graphicProjects: list, updatedAt: new Date().toISOString() },
          },
        };
      });
      return removed;
    },
    [persist, user],
  );

  const teacherUpdateGraphicProject = useCallback(
    (studentId, projectId, patch) => {
      persist((prev) => {
        const current = getStudentProgress(prev, studentId);
        const list = (current.graphicProjects || []).map((p) => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            ...patch,
            status: patch.status || (patch.teacherScore != null ? "reviewed" : p.status),
            updatedAt: new Date().toISOString(),
          };
        });
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [studentId]: {
              ...current,
              graphicProjects: list,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [persist],
  );

  const saveProject = useCallback(
    (projectPatch) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              project: { ...current.project, ...projectPatch, status: projectPatch.status || "draft" },
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [persist, user],
  );

  const teacherUpdateStudent = useCallback(
    (studentId, patch) => {
      persist((prev) => {
        const current = getStudentProgress(prev, studentId);
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [studentId]: { ...current, ...patch, updatedAt: new Date().toISOString() },
          },
        };
      });
    },
    [persist],
  );

  const teacherSetNote = useCallback(
    (studentId, note) => {
      persist((prev) => {
        const analytics = getStudentAnalytics(prev, studentId);
        return {
          ...prev,
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [studentId]: { ...analytics, teacherNotes: note },
          },
        };
      });
    },
    [persist],
  );

  const allStudentsProgress = useMemo(() => {
    return getAllRosterStudents().map((student) => {
      const progress = getStudentProgress(state, student.id);
      const localAnalytics = getStudentAnalytics(state, student.id);
      const remoteAnalytics = remoteAnalyticsByStudent[student.id];
      const analytics = mergeRemoteAnalytics(localAnalytics, remoteAnalytics);
      const serverStats = serverStatsByStudent[student.id];
      const stats = serverStats || computeProgressStats(progress);
      return {
        student,
        progress,
        analytics,
        stats,
      };
    });
  }, [state, remoteAnalyticsByStudent, serverStatsByStudent]);

  useEffect(() => {
    if (!authReady) return;
    const userNow = state.sessionUserId ? resolveSessionUser(state.sessionUserId) : null;
    if (userNow?.role !== "teacher") return;

    let cancelled = false;
    (async () => {
      try {
        const me = await fetchAuthMeApi();
        if (cancelled || me.user?.role !== "teacher") return;
        await refreshTeacherAnalytics();
      } catch {
        /* local session without server cookie — login flow will refresh */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state.sessionUserId, authReady, refreshTeacherAnalytics]);

  const value = useMemo(
    () => ({
      user,
      authReady,
      loginTeacher,
      loginStudentByNationalId,
      loginDemoStudent,
      logout,
      logoutForInactivity,
      myProgress,
      myAnalytics,
      myStats,
      updateMyProgress,
      markDayComplete,
      saveWorksheetAnswers,
      saveQuizResult,
      savePreAssessmentProgress,
      saveDrillResult,
      saveMicrobitProgress,
      savePythonSnippet,
      updatePythonSnippet,
      deletePythonSnippet,
      saveGraphicProject,
      submitGraphicProject,
      deleteGraphicProject,
      saveProject,
      teacherUpdateStudent,
      teacherUpdateGraphicProject,
      teacherSetNote,
      allStudentsProgress,
      trackPageView,
      trackSimRun,
      trackPythonRun,
      trackGuiEvent,
      sessionUserId,
      isStudentSession,
      refreshTeacherAnalytics,
      analyticsSyncStatus,
      progressSyncStatus,
      refreshMyComputedProgress,
      publicationConfig,
      refreshPublicationConfig,
      state,
    }),
    [
      user,
      authReady,
      loginTeacher,
      loginStudentByNationalId,
      loginDemoStudent,
      logout,
      logoutForInactivity,
      myProgress,
      myAnalytics,
      myStats,
      updateMyProgress,
      markDayComplete,
      saveWorksheetAnswers,
      saveQuizResult,
      savePreAssessmentProgress,
      saveDrillResult,
      saveMicrobitProgress,
      savePythonSnippet,
      updatePythonSnippet,
      deletePythonSnippet,
      saveGraphicProject,
      submitGraphicProject,
      deleteGraphicProject,
      saveProject,
      teacherUpdateStudent,
      teacherUpdateGraphicProject,
      teacherSetNote,
      allStudentsProgress,
      trackPageView,
      trackSimRun,
      trackPythonRun,
      trackGuiEvent,
      sessionUserId,
      isStudentSession,
      refreshTeacherAnalytics,
      analyticsSyncStatus,
      progressSyncStatus,
      refreshMyComputedProgress,
      publicationConfig,
      refreshPublicationConfig,
      state,
    ],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

// This established context module intentionally exports its provider and hook together.
// eslint-disable-next-line react-refresh/only-export-components
export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform outside PlatformProvider");
  return ctx;
}
