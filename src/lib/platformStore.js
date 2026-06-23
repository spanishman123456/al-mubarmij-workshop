import { getAllDayIds } from "../data/curriculum15Days";

const STORAGE_KEY = "mubarmij-platform-v1";

function defaultProgressForStudent(studentId) {
  const days = getAllDayIds();
  return {
    studentId,
    completedDays: [],
    completedActivities: [],
    worksheetStatus: {}, // dayId -> not_started | in_progress | completed | needs_review
    worksheetAnswers: {}, // wsId -> { answers, updatedAt }
    quizScores: {}, // quizId -> { score, total, percent, at }
    preTest: null,
    postTest: null,
    pythonSnippets: [], // { id, title, code, at, teacherNote }
    project: {
      status: "not_started", // not_started | draft | submitted | reviewed
      title: "",
      description: "",
      code: "",
      teacherScore: null,
      teacherNote: "",
      rubric: {},
    },
    updatedAt: new Date().toISOString(),
  };
}

function seedProgress() {
  const map = {};
  ["stu-1", "stu-2", "stu-3", "stu-4", "stu-5"].forEach((id, i) => {
    const p = defaultProgressForStudent(id);
    const doneCount = 3 + i * 2;
    p.completedDays = getAllDayIds().slice(0, Math.min(doneCount, 15));
    p.worksheetStatus["ws-day-01"] = "completed";
    p.worksheetStatus["ws-day-02"] = i > 0 ? "completed" : "in_progress";
    p.preTest = { score: 8 + i, total: 15, percent: Math.round(((8 + i) / 15) * 100), at: "2025-09-01" };
    if (i >= 2) {
      p.postTest = { score: 11 + i, total: 15, percent: Math.round(((11 + i) / 15) * 100), at: "2025-09-20" };
    }
    if (i === 4) {
      p.project = {
        status: "submitted",
        title: "لعبة تخمين الرقم",
        description: "لعبة تعليمية بلغة بايثون",
        code: 'print("مرحبًا بالموهبة!")',
        teacherScore: null,
        teacherNote: "",
        rubric: {},
      };
    }
    map[id] = p;
  });
  return map;
}

export function loadPlatformState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {
    sessionUserId: null,
    progressByStudent: seedProgress(),
  };
}

export function savePlatformState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getStudentProgress(state, studentId) {
  if (!state.progressByStudent[studentId]) {
    state.progressByStudent[studentId] = defaultProgressForStudent(studentId);
  }
  return state.progressByStudent[studentId];
}

export function computeProgressStats(progress) {
  const totalDays = getAllDayIds().length;
  const completedDays = progress.completedDays?.length ?? 0;
  const worksheets = Object.values(progress.worksheetStatus || {});
  const worksheetsDone = worksheets.filter((s) => s === "completed").length;
  const percent = Math.round(
    ((completedDays / totalDays) * 0.5 +
      (worksheetsDone / Math.max(worksheets.length, 1)) * 0.25 +
      (progress.project?.status === "submitted" || progress.project?.status === "reviewed" ? 0.25 : 0)) *
      100,
  );
  return {
    totalDays,
    completedDays,
    dayPercent: Math.round((completedDays / totalDays) * 100),
    worksheetsDone,
    overallPercent: Math.min(100, percent),
    preTest: progress.preTest,
    postTest: progress.postTest,
    projectStatus: progress.project?.status ?? "not_started",
  };
}

export { defaultProgressForStudent };
