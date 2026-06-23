import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { findTeacher, findTeacherById } from "../data/demoUsers";
import {
  findStudentByNationalId,
  rosterStudentToUser,
  getAllRosterStudents,
  findRosterUserById,
} from "../data/studentsRoster";
import {
  loadPlatformState,
  savePlatformState,
  getStudentProgress,
  getStudentAnalytics,
  computeProgressStats,
  defaultProgressForStudent,
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

const PlatformContext = createContext(null);

function resolveUser(userId) {
  if (!userId) return null;
  return findTeacherById(userId) || findRosterUserById(userId);
}

export function PlatformProvider({ children }) {
  const [state, setState] = useState(() => loadPlatformState());

  const persist = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      savePlatformState(next);
      return next;
    });
  }, []);

  const user = state.sessionUserId ? resolveUser(state.sessionUserId) : null;

  const loginTeacher = useCallback(
    (username, password) => {
      const found = findTeacher(username, password);
      if (!found) return { ok: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة." };
      persist((prev) => ({ ...prev, sessionUserId: found.id }));
      return { ok: true, user: found };
    },
    [persist],
  );

  const loginStudentByNationalId = useCallback(
    (nationalId) => {
      const row = findStudentByNationalId(nationalId);
      if (!row) {
        return { ok: false, message: "رقم الهوية غير مسجل في النظام." };
      }
      const student = rosterStudentToUser(row);
      persist((prev) => {
        const next = { ...prev, sessionUserId: student.id };
        if (!next.progressByStudent[student.id]) {
          next.progressByStudent = {
            ...next.progressByStudent,
            [student.id]: defaultProgressForStudent(student.id),
          };
        }
        if (!next.analyticsByStudent) next.analyticsByStudent = {};
        const current = next.analyticsByStudent[student.id] || defaultAnalytics();
        next.analyticsByStudent = {
          ...next.analyticsByStudent,
          [student.id]: recordLogin(current),
        };
        return next;
      });
      return { ok: true, user: student };
    },
    [persist],
  );

  const logout = useCallback(() => {
    persist((prev) => ({ ...prev, sessionUserId: null }));
  }, [persist]);

  const trackPageView = useCallback(
    (path) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentAnalytics(prev, user.id);
        return {
          ...prev,
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [user.id]: recordPageView(current, path),
          },
        };
      });
    },
    [persist, user],
  );

  const trackSimRun = useCallback(
    (simId) => {
      if (!user || user.role !== "student") return;
      persist((prev) => {
        const current = getStudentAnalytics(prev, user.id);
        return {
          ...prev,
          analyticsByStudent: {
            ...prev.analyticsByStudent,
            [user.id]: recordSimRun(current, simId),
          },
        };
      });
    },
    [persist, user],
  );

  const trackPythonRun = useCallback(() => {
    if (!user || user.role !== "student") return;
    persist((prev) => {
      const current = getStudentAnalytics(prev, user.id);
      return {
        ...prev,
        analyticsByStudent: {
          ...prev.analyticsByStudent,
          [user.id]: recordPythonRun(current),
        },
      };
    });
  }, [persist, user]);

  const myProgress = useMemo(() => {
    if (!user || user.role !== "student") return null;
    return getStudentProgress(state, user.id);
  }, [state, user]);

  const myAnalytics = useMemo(() => {
    if (!user || user.role !== "student") return null;
    return getStudentAnalytics(state, user.id);
  }, [state, user]);

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
      loginTeacher,
      loginStudentByNationalId,
      logout,
      myProgress,
      myAnalytics,
      myStats,
      updateMyProgress,
      markDayComplete,
      saveWorksheetAnswers,
      saveQuizResult,
      saveDrillResult,
      savePythonSnippet,
      saveProject,
      teacherUpdateStudent,
      teacherSetNote,
      allStudentsProgress,
      trackPageView,
      trackSimRun,
      trackPythonRun,
      state,
    }),
    [
      user,
      loginTeacher,
      loginStudentByNationalId,
      logout,
      myProgress,
      myAnalytics,
      myStats,
      updateMyProgress,
      markDayComplete,
      saveWorksheetAnswers,
      saveQuizResult,
      saveDrillResult,
      savePythonSnippet,
      saveProject,
      teacherUpdateStudent,
      teacherSetNote,
      allStudentsProgress,
      trackPageView,
      trackSimRun,
      trackPythonRun,
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
