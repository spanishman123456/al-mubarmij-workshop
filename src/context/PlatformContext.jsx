import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { findUser, findUserById, DEMO_STUDENTS } from "../data/demoUsers";
import {
  loadPlatformState,
  savePlatformState,
  getStudentProgress,
  computeProgressStats,
  defaultProgressForStudent,
} from "../lib/platformStore";

const PlatformContext = createContext(null);

export function PlatformProvider({ children }) {
  const [state, setState] = useState(() => loadPlatformState());

  const persist = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      savePlatformState(next);
      return next;
    });
  }, []);

  const user = state.sessionUserId ? findUserById(state.sessionUserId) : null;

  const login = useCallback(
    (username, password) => {
      const found = findUser(username, password);
      if (!found) return { ok: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة." };
      persist((prev) => {
        const next = { ...prev, sessionUserId: found.id };
        if (found.role === "student" && !next.progressByStudent[found.id]) {
          next.progressByStudent = {
            ...next.progressByStudent,
            [found.id]: defaultProgressForStudent(found.id),
          };
        }
        return next;
      });
      return { ok: true, user: found };
    },
    [persist],
  );

  const logout = useCallback(() => {
    persist((prev) => ({ ...prev, sessionUserId: null }));
  }, [persist]);

  const myProgress = useMemo(() => {
    if (!user || user.role !== "student") return null;
    return getStudentProgress(state, user.id);
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

  const allStudentsProgress = useMemo(() => {
    return DEMO_STUDENTS.map((s) => ({
      student: s,
      progress: getStudentProgress(state, s.id),
      stats: computeProgressStats(getStudentProgress(state, s.id)),
    }));
  }, [state]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      myProgress,
      myStats,
      updateMyProgress,
      markDayComplete,
      saveWorksheetAnswers,
      saveQuizResult,
      savePythonSnippet,
      saveProject,
      teacherUpdateStudent,
      allStudentsProgress,
      state,
    }),
    [
      user,
      login,
      logout,
      myProgress,
      myStats,
      updateMyProgress,
      markDayComplete,
      saveWorksheetAnswers,
      saveQuizResult,
      savePythonSnippet,
      saveProject,
      teacherUpdateStudent,
      allStudentsProgress,
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
