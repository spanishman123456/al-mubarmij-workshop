import { getPublishedDaysFromServerEnv } from "../../src/config/publicationPolicy.js";
import { resolvePreAssessmentStatus } from "../config/onboardingPolicy.js";
import { getOnboardingStatus } from "../repositories/onboardingRepository.js";
import {
  getStudentProgress,
  getLessonProgressAll,
  saveStudentProgress,
} from "../repositories/progressRepository.js";
import { loadStore } from "../analyticsStore.js";
import { STUDENTS_ROSTER } from "../../src/data/studentsRoster.js";
import {
  PROGRESS_VERSION,
  buildPublishedRequiredCatalog,
  evaluateCatalog,
  computeFullPathProgress,
} from "../../src/lib/progressCatalog.js";
import { logProgressCalculation } from "../repositories/progressCalculationLogRepository.js";
import { getStudentDayUnlockStatus, syncDayCompletionsFromProgress } from "./dayUnlockService.js";
import { getLatestSubmittedAttempt } from "../repositories/quizAttemptRepository.js";
import { buildAssessmentSummary, backfillAssessmentProgress } from "../../src/lib/assessmentSummary.js";

const ACTIVE_NOW_MS = 5 * 60 * 1000;
const ACTIVE_TODAY_MS = 24 * 60 * 60 * 1000;
const RECENTLY_ACTIVE_MS = 3 * 24 * 60 * 60 * 1000;

export function computeAttendanceStatus(analytics) {
  const last = analytics?.lastActivityAt || analytics?.lastLoginAt;
  const loginCount = analytics?.loginCount || 0;

  if (!loginCount && !last) {
    return { key: "not_started", label: "لم يبدأ", color: "bg-slate-100 text-slate-700" };
  }

  if (last) {
    const elapsed = Date.now() - new Date(last).getTime();
    if (elapsed <= ACTIVE_NOW_MS) {
      return { key: "active_now", label: "نشط الآن", color: "bg-emerald-100 text-emerald-800" };
    }
    if (elapsed <= ACTIVE_TODAY_MS) {
      return { key: "active_today", label: "نشط اليوم", color: "bg-cyan-100 text-cyan-800" };
    }
    if (elapsed <= RECENTLY_ACTIVE_MS) {
      return { key: "recently_active", label: "نشط مؤخرًا", color: "bg-violet-100 text-violet-800" };
    }
  }

  if (loginCount > 0) {
    return { key: "inactive", label: "لا يوجد نشاط حديث", color: "bg-slate-100 text-slate-600" };
  }

  return { key: "not_started", label: "لم يبدأ", color: "bg-slate-100 text-slate-700" };
}

function countMicrobitDone(progress = {}) {
  return Object.values(progress.microbitProjects || {}).filter((p) => p?.status === "completed").length;
}

function countWorksheetsDone(progress = {}) {
  return Object.values(progress.worksheetStatus || {}).filter((s) => s === "completed").length;
}

/**
 * @param {string} studentId
 * @param {{ reason?: string, publishedDays?: number, previousPercent?: number|null, persistSnapshot?: boolean }} [options]
 */
export function calculateStudentProgress(studentId, options = {}) {
  const publishedDays = options.publishedDays ?? getPublishedDaysFromServerEnv();
  const catalog = buildPublishedRequiredCatalog(publishedDays);

  const progressRow = getStudentProgress(studentId);
  let progress = progressRow?.progress || {};
  const preAttempt = getLatestSubmittedAttempt(studentId, "quiz-pre");
  const postAttempt = getLatestSubmittedAttempt(studentId, "quiz-post");

  if (options.persistSnapshot) {
    const backfilled = backfillAssessmentProgress(progress, { preAttempt, postAttempt });
    if (backfilled !== progress) {
      progress = backfilled;
      saveStudentProgress(studentId, progress);
    }
  }

  const lessonRows = getLessonProgressAll(studentId);
  const onboarding = getOnboardingStatus(studentId);
  const analytics = loadStore().analyticsByStudent?.[studentId] || {};
  const preAssessment = resolvePreAssessmentStatus(progress, preAttempt);
  const assessmentSummary = buildAssessmentSummary(progress, { preAttempt, postAttempt, publishedDays });

  const evaluated = evaluateCatalog(catalog, {
    onboarding,
    progress,
    lessonRows,
  });

  const pathProgress = computeFullPathProgress(progress, publishedDays);
  const dayUnlock = getStudentDayUnlockStatus(studentId);
  const microbitDone = countMicrobitDone(progress);
  const worksheetsDone = countWorksheetsDone(progress);
  const pythonRuns = analytics.pythonRuns || 0;
  const pythonSnippetsCount = (progress.pythonSnippets || []).length;
  const lastPythonRunAt = analytics.lastPythonRunAt || null;
  let pythonActivityNoteAr = null;
  if (pythonRuns === 0 && pythonSnippetsCount === 0) {
    pythonActivityNoteAr = "لا توجد تشغيلات كود محفوظة في الخادم — شغّل كودًا في مختبر بايثون ليُحتسب.";
  } else if (lastPythonRunAt) {
    pythonActivityNoteAr = `آخر تشغيل كود: ${new Date(lastPythonRunAt).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}`;
  } else if (pythonSnippetsCount > 0) {
    pythonActivityNoteAr = `لديك ${pythonSnippetsCount} كود محفوظ — شغّل الكود في المختبر ليُحتسب كتشغيل.`;
  }

  const lastLessonEvent = [...lessonRows].sort(
    (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
  )[0];

  const result = {
    studentId,
    publishedDays,
    requiredItems: evaluated.requiredItems,
    completedRequiredItems: evaluated.completedRequiredItems,
    availableProgressPercent: evaluated.availableProgressPercent,
    overallPercent: evaluated.availableProgressPercent,
    completedLessons: evaluated.completedLessons,
    totalPublishedLessons: evaluated.totalPublishedLessons,
    completedActivities: evaluated.completedActivities,
    totalPublishedActivities: evaluated.totalPublishedActivities,
    completedWorksheets: evaluated.completedWorksheets,
    totalPublishedWorksheets: evaluated.totalPublishedWorksheets,
    completedQuizzes: evaluated.completedQuizzes,
    totalPublishedQuizzes: evaluated.totalPublishedQuizzes,
    worksheetsDone,
    microbitDone,
    microbitTotal: 9,
    totalDays: 15,
    completedDays: (progress.completedDays || []).filter((id) => {
      const m = /^day-(\d+)$/.exec(id);
      return m ? Number(m[1]) <= publishedDays : false;
    }).length,
    preAssessmentStatus: preAssessment.status,
    preAssessmentLabelAr: preAssessment.statusLabelAr,
    preAssessmentDiagnosticPercent: preAssessment.diagnosticPercent,
    assessmentSummary,
    preTest: progress.preTest ?? (preAttempt?.result ? preAttempt.result : null),
    postTest: progress.postTest ?? (postAttempt?.result ? postAttempt.result : null),
    projectStatus: progress.project?.status ?? "not_started",
    lastActivityAt: analytics.lastActivityAt || progress.updatedAt || null,
    lastLessonId: lastLessonEvent?.lessonId || null,
    lastLessonUpdatedAt: lastLessonEvent?.updatedAt || null,
    loginCount: analytics.loginCount || 0,
    pythonRuns,
    pythonSnippetsCount,
    lastPythonRunAt,
    pythonActivityNoteAr,
    attendanceStatus: computeAttendanceStatus(analytics),
    pathProgress,
    dayUnlock,
    progressVersion: PROGRESS_VERSION,
    calculatedAt: new Date().toISOString(),
    updatedAt: progressRow?.updatedAt || null,
  };

  if (options.persistSnapshot) {
    const nextProgress = {
      ...progress,
      _computedProgress: {
        ...result,
        breakdown: evaluated.breakdown.map(({ id, labelAr, category, status, complete }) => ({
          id,
          labelAr,
          category,
          status,
          complete,
        })),
      },
    };
    saveStudentProgress(studentId, nextProgress);
  }

  if (options.reason) {
    logProgressCalculation({
      studentId,
      reason: options.reason,
      availableCount: evaluated.requiredItems,
      completedCount: evaluated.completedRequiredItems,
      previousPercent: options.previousPercent ?? null,
      newPercent: evaluated.availableProgressPercent,
      progressVersion: PROGRESS_VERSION,
    });
  }

  return {
    ...result,
    breakdown: evaluated.breakdown,
    details: evaluated.breakdown.map((item) => ({
      id: item.id,
      labelAr: item.labelAr,
      category: item.category,
      status: item.complete ? "completed" : "not_started",
      icon: item.complete ? "✓" : item.status === "in_progress" ? "◐" : "○",
    })),
  };
}

export function calculateStudentProgressDetails(studentId, options = {}) {
  return calculateStudentProgress(studentId, options);
}

export function recalculateAllStudentsProgress({ reason = "batch_recalculate", persistSnapshot = true } = {}) {
  const publishedDays = getPublishedDaysFromServerEnv();
  const report = {
    publishedDays,
    progressVersion: PROGRESS_VERSION,
    startedAt: new Date().toISOString(),
    students: [],
    changed: 0,
    conflicts: [],
  };

  for (const row of STUDENTS_ROSTER) {
    const studentId = `stu-${row.nationalId}`;
    syncDayCompletionsFromProgress(studentId);
    const beforeRow = getStudentProgress(studentId);
    const beforePercent = beforeRow?.progress?._computedProgress?.availableProgressPercent ?? null;

    const after = calculateStudentProgress(studentId, {
      reason,
      publishedDays,
      previousPercent: beforePercent,
      persistSnapshot,
    });

    const changed = beforePercent != null && beforePercent !== after.availableProgressPercent;
    if (changed) report.changed += 1;

    const localOnly =
      beforePercent === 0 &&
      after.availableProgressPercent > 0 &&
      !(beforeRow?.progress?.completedDays?.length || beforeRow?.progress?.worksheetStatus);

    if (localOnly) {
      report.conflicts.push({ studentId, note: "server_records_recovered_progress" });
    }

    report.students.push({
      studentId,
      beforePercent,
      afterPercent: after.availableProgressPercent,
      completedRequiredItems: after.completedRequiredItems,
      requiredItems: after.requiredItems,
      changed,
      day2Unlocked: after.dayUnlock?.dayUnlockMap?.["day-02"] !== "locked",
      day1Completed: after.dayUnlock?.dayCompletions?.["day-01"]?.completed ?? false,
    });
  }

  report.day2UnlockedCount = report.students.filter((s) => s.day2Unlocked).length;
  report.day2LockedCount = report.students.filter((s) => !s.day2Unlocked).length;

  report.finishedAt = new Date().toISOString();
  return report;
}
