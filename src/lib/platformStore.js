import { getAllDayIds } from "../data/curriculum15Days";
import { STUDENTS_ROSTER } from "../data/studentsRoster";
import { defaultAnalytics } from "./platformAnalytics";

const STORAGE_KEY = "mubarmij-platform-v2";

function defaultProgressForStudent(studentId) {
  return {
    studentId,
    completedDays: [],
    completedActivities: [],
    worksheetStatus: {},
    worksheetAnswers: {},
    quizScores: {},
    drillResults: {},
    microbitProjects: {},
    preTest: null,
    postTest: null,
    pythonSnippets: [],
    project: {
      status: "not_started",
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
  STUDENTS_ROSTER.forEach((row) => {
    map[`stu-${row.nationalId}`] = defaultProgressForStudent(`stu-${row.nationalId}`);
  });
  return map;
}

function seedAnalytics() {
  const map = {};
  STUDENTS_ROSTER.forEach((row) => {
    map[`stu-${row.nationalId}`] = defaultAnalytics();
  });
  return map;
}

function migrateFromV1() {
  try {
    const raw = localStorage.getItem("mubarmij-platform-v1");
    if (!raw) return null;
    const old = JSON.parse(raw);
    const progressByStudent = { ...seedProgress(), ...(old.progressByStudent || {}) };
    const analyticsByStudent = seedAnalytics();
    Object.keys(old.progressByStudent || {}).forEach((id) => {
      if (!analyticsByStudent[id]) analyticsByStudent[id] = defaultAnalytics();
    });
    return {
      sessionUserId: old.sessionUserId,
      progressByStudent,
      analyticsByStudent,
    };
  } catch {
    return null;
  }
}

export function loadPlatformState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.analyticsByStudent) {
        parsed.analyticsByStudent = seedAnalytics();
      }
      return parsed;
    }
  } catch {
    /* ignore */
  }
  const migrated = migrateFromV1();
  if (migrated) return migrated;
  return {
    sessionUserId: null,
    progressByStudent: seedProgress(),
    analyticsByStudent: seedAnalytics(),
  };
}

export function savePlatformState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getStudentProgress(state, studentId) {
  return state.progressByStudent?.[studentId] ?? defaultProgressForStudent(studentId);
}

export function getStudentAnalytics(state, studentId) {
  return state.analyticsByStudent?.[studentId] ?? defaultAnalytics();
}

export function ensureStudentRecords(state, studentId) {
  const progressByStudent = { ...state.progressByStudent };
  const analyticsByStudent = { ...(state.analyticsByStudent || {}) };
  let changed = false;

  if (!progressByStudent[studentId]) {
    progressByStudent[studentId] = defaultProgressForStudent(studentId);
    changed = true;
  }
  if (!analyticsByStudent[studentId]) {
    analyticsByStudent[studentId] = defaultAnalytics();
    changed = true;
  }

  if (!changed) return state;
  return { ...state, progressByStudent, analyticsByStudent };
}

export function computeProgressStats(progress) {
  const totalDays = getAllDayIds().length;
  const completedDays = progress.completedDays?.length ?? 0;
  const worksheets = Object.values(progress.worksheetStatus || {});
  const worksheetsDone = worksheets.filter((s) => s === "completed").length;
  const quizCount = Object.keys(progress.quizScores || {}).length;
  const drillsDone = Object.values(progress.drillResults || {}).filter((d) => d?.completed).length;
  const microbitDone = Object.values(progress.microbitProjects || {}).filter(
    (p) => p?.status === "completed",
  ).length;
  const percent = Math.round(
    ((completedDays / totalDays) * 0.35 +
      (worksheetsDone / Math.max(worksheets.length, 1)) * 0.2 +
      (quizCount / 5) * 0.15 +
      (drillsDone / 10) * 0.1 +
      (microbitDone / 9) * 0.1 +
      (progress.project?.status === "submitted" || progress.project?.status === "reviewed" ? 0.1 : 0)) *
      100,
  );
  return {
    totalDays,
    completedDays,
    dayPercent: Math.round((completedDays / totalDays) * 100),
    worksheetsDone,
    quizCount,
    drillsDone,
    microbitDone,
    overallPercent: Math.min(100, percent),
    preTest: progress.preTest,
    postTest: progress.postTest,
    projectStatus: progress.project?.status ?? "not_started",
  };
}

export { defaultProgressForStudent };
