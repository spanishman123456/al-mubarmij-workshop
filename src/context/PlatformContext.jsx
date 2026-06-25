import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  findStudentByNationalId,
  getAllRosterStudents,
} from "../data/studentsRoster";
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
  recordActivityStart,
  recordActivityComplete,
  defaultAnalytics,
} from "../lib/platformAnalytics";
import {
  loadValidatedPlatformState,
  hardRedirectToLogin,
  stripLegacySessionFields,
} from "../lib/session";
import {
  fetchAuthMe,
  heartbeatSession,
  loginStudentApi,
  loginTeacherApi,
  logoutApi,
} from "../lib/authApi";

const PlatformContext = createContext(null);

export function PlatformProvider({ children }) {
  const [state, setState] = useState(() => loadValidatedPlatformState());
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const bootstrapped = useRef(false);

  const persist = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      savePlatformState(stripLegacySessionFields(next));
      return next;
    });
  }, []);

  const applyServerUser = useCallback(
    (serverUser, session = null, { recordLoginEvent = false } = {}) => {
      setUser(serverUser);
      setSessionInfo(session);
      if (serverUser?.role === "student") {
        persist((prev) => {
          let next = ensureStudentRecords(prev, serverUser.id);
          if (recordLoginEvent) {
            const current = next.analyticsByStudent[serverUser.id];
            next.analyticsByStudent = {
              ...next.analyticsByStudent,
              [serverUser.id]: recordLogin(current),
            };
          }
          return next;
        });
      }
    },
    [persist],
  );

  const refreshAuth = useCallback(async () => {
    try {
      const data = await fetchAuthMe();
      if (data.user) {
        applyServerUser(data.user, data.session);
      } else {
        setUser(null);
        setSessionInfo(null);
      }
      return data.user;
    } catch {
      setUser(null);
      setSessionInfo(null);
      return null;
    }
  }, [applyServerUser]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    refreshAuth().finally(() => setAuthReady(true));

    function onPageShow(event) {
      if (!event.persisted) return;
      refreshAuth().then((u) => {
        if (!u) hardRedirectToLogin();
      });
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [refreshAuth]);

  const sessionUserId = user?.id ?? null;
  const isStudentSession = Boolean(user?.role === "student");

  const loginTeacher = useCallback(
    async (username, password) => {
      try {
        const data = await loginTeacherApi(username, password);
        applyServerUser(data.user, data.session);
        return { ok: true, user: data.user };
      } catch (err) {
        return { ok: false, message: err.message || "بيانات الدخول غير صحيحة." };
      }
    },
    [applyServerUser],
  );

  const loginStudentByNationalId = useCallback(
    async (nationalId) => {
      const row = findStudentByNationalId(nationalId);
      if (!row) {
        return { ok: false, message: "رقم الهوية غير مسجل في النظام." };
      }
      try {
        const data = await loginStudentApi(nationalId);
        applyServerUser(data.user, data.session, { recordLoginEvent: true });
        return { ok: true, user: data.user };
      } catch (err) {
        return {
          ok: false,
          message: err.message,
          code: err.code,
          helpAr: err.helpAr,
        };
      }
    },
    [applyServerUser],
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      /* still clear client state */
    }
    setUser(null);
    setSessionInfo(null);
    persist((prev) => stripLegacySessionFields(prev));
    try {
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
    hardRedirectToLogin();
  }, [persist]);

  const pingSession = useCallback(async () => {
    if (!user) return true;
    try {
      const data = await heartbeatSession();
      setSessionInfo((prev) => ({ ...prev, ...data.session }));
      return true;
    } catch {
      setUser(null);
      setSessionInfo(null);
      hardRedirectToLogin();
      return false;
    }
  }, [user]);

  const trackPageView = useCallback(
    (path) => {
      persist((prev) => {
        const uid = user?.id;
        if (!uid || user?.role !== "student") return prev;
        const current = getStudentAnalytics(prev, uid) ?? defaultAnalytics();
        return {
          ...prev,
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [uid]: recordPageView(current, path),
          },
        };
      });
    },
    [persist, user],
  );

  const trackSimRun = useCallback(
    (simId) => {
      persist((prev) => {
        const uid = user?.id;
        if (!uid || user?.role !== "student") return prev;
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
    [persist, user],
  );

  const trackPythonRun = useCallback(() => {
    persist((prev) => {
      const uid = user?.id;
      if (!uid || user?.role !== "student") return prev;
      const current = getStudentAnalytics(prev, uid) ?? defaultAnalytics();
      return {
        ...prev,
        analyticsByStudent: {
          ...prev.analyticsByStudent,
          [uid]: recordPythonRun(current),
        },
      };
    });
  }, [persist, user]);

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
    if (!myProgress) return null;
    return computeProgressStats(myProgress);
  }, [myProgress]);

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
    (dayId) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const analytics = getStudentAnalytics(prev, user.id);
        const set = new Set(current.completedDays || []);
        set.add(dayId);
        return {
          ...prev,
          progressByStudent: {
            ...prev.progressByStudent,
            [user.id]: {
              ...current,
              completedDays: [...set],
              updatedAt: new Date().toISOString(),
            },
          },
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [user.id]: recordActivityComplete(analytics, `day-${dayId}`),
          },
        };
      });
    },
    [persist, user],
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
    (title, code) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const analytics = recordPythonRun(getStudentAnalytics(prev, user.id));
        const snippet = {
          id: `py-${Date.now()}`,
          title: title || "كود محفوظ",
          code,
          at: new Date().toISOString(),
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

  const saveGraphicProject = useCallback(
    (title, code, existingId = null) => {
      if (!user || user.role !== "student") return null;
      let savedId = existingId;
      persist((prev) => {
        const current = getStudentProgress(prev, user.id);
        const analytics = recordPythonRun(getStudentAnalytics(prev, user.id));
        const list = [...(current.graphicProjects || [])];
        const now = new Date().toISOString();
        if (existingId) {
          const idx = list.findIndex((p) => p.id === existingId);
          if (idx >= 0) {
            list[idx] = { ...list[idx], title: title || list[idx].title, code, updatedAt: now };
            savedId = existingId;
          } else {
            savedId = `gpy-${Date.now()}`;
            list.unshift({
              id: savedId,
              title: title || "مشروع رسومي",
              code,
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
      const analytics = getStudentAnalytics(state, student.id);
      return {
        student,
        progress,
        analytics,
        stats: computeProgressStats(progress),
      };
    });
  }, [state]);

  const value = useMemo(
    () => ({
      user,
      authReady,
      sessionInfo,
      loginTeacher,
      loginStudentByNationalId,
      logout,
      pingSession,
      refreshAuth,
      myProgress,
      myAnalytics,
      myStats,
      updateMyProgress,
      markDayComplete,
      saveWorksheetAnswers,
      saveQuizResult,
      saveDrillResult,
      saveMicrobitProgress,
      savePythonSnippet,
      saveGraphicProject,
      submitGraphicProject,
      saveProject,
      teacherUpdateStudent,
      teacherUpdateGraphicProject,
      teacherSetNote,
      allStudentsProgress,
      trackPageView,
      trackSimRun,
      trackPythonRun,
      sessionUserId,
      isStudentSession,
      state,
    }),
    [
      user,
      authReady,
      sessionInfo,
      loginTeacher,
      loginStudentByNationalId,
      logout,
      pingSession,
      refreshAuth,
      myProgress,
      myAnalytics,
      myStats,
      updateMyProgress,
      markDayComplete,
      saveWorksheetAnswers,
      saveQuizResult,
      saveDrillResult,
      saveMicrobitProgress,
      savePythonSnippet,
      saveGraphicProject,
      submitGraphicProject,
      saveProject,
      teacherUpdateStudent,
      teacherUpdateGraphicProject,
      teacherSetNote,
      allStudentsProgress,
      trackPageView,
      trackSimRun,
      trackPythonRun,
      sessionUserId,
      isStudentSession,
      state,
    ],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform outside PlatformProvider");
  return ctx;
}
