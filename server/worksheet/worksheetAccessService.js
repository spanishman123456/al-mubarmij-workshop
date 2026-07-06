import { worksheets15Days } from "../../src/data/worksheets15Days.js";
import { getWorksheetAccessState, WorksheetAccessState } from "../../src/lib/worksheetAccess.js";
import { buildUnlockContext } from "../progress/dayUnlockService.js";
import { getPublishedDaysCount } from "../config/publication.js";
import { getStudentDayUnlockStatus } from "../progress/dayUnlockService.js";

export function getWorksheetById(worksheetId) {
  return worksheets15Days.find((w) => w.id === worksheetId) ?? null;
}

export function listWorksheetsForStudent(studentId) {
  const unlock = getStudentDayUnlockStatus(studentId);
  const myStats = { publishedDays: unlock.publishedDays, dayUnlock: unlock };
  return worksheets15Days
    .map((ws) => {
      const access = getWorksheetAccessState({
        role: "student",
        dayId: ws.dayId,
        dayUnlockMap: unlock.dayUnlockMap,
        myStats,
      });
      return {
        id: ws.id,
        dayId: ws.dayId,
        dayNumber: ws.dayNumber,
        weekNumber: ws.weekNumber,
        titleAr: ws.titleAr,
        topicAr: ws.topicAr,
        taskCount: ws.tasks.length,
        access,
        canOpen: access === WorksheetAccessState.OPEN,
      };
    })
    .filter((w) => w.access === WorksheetAccessState.OPEN || w.access === WorksheetAccessState.LOCKED);
}

export function listWorksheetsForTeacher() {
  const publishedDays = getPublishedDaysCount();
  const myStats = { publishedDays };
  return worksheets15Days.map((ws) => ({
    id: ws.id,
    dayId: ws.dayId,
    dayNumber: ws.dayNumber,
    weekNumber: ws.weekNumber,
    titleAr: ws.titleAr,
    topicAr: ws.topicAr,
    taskCount: ws.tasks.length,
    access: WorksheetAccessState.OPEN,
    canOpen: true,
    publishedDays,
    dayIdNum: ws.dayNumber,
    isPublishedToStudents: ws.dayNumber <= publishedDays,
  }));
}

export function assertStudentCanAccessWorksheet(studentId, worksheetId) {
  const ws = getWorksheetById(worksheetId);
  if (!ws) {
    const err = new Error("not_found");
    err.status = 404;
    throw err;
  }
  const unlock = getStudentDayUnlockStatus(studentId);
  const myStats = { publishedDays: unlock.publishedDays, dayUnlock: unlock };
  const access = getWorksheetAccessState({
    role: "student",
    dayId: ws.dayId,
    dayUnlockMap: unlock.dayUnlockMap,
    myStats,
  });
  if (access !== WorksheetAccessState.OPEN) {
    const err = new Error(access === WorksheetAccessState.LOCKED ? "day_locked" : "content_not_published");
    err.status = 403;
    throw err;
  }
  return ws;
}

export function filterWorksheetProgressForStudent(studentId, progress) {
  const unlock = getStudentDayUnlockStatus(studentId);
  const myStats = { publishedDays: unlock.publishedDays, dayUnlock: unlock };
  const worksheetStatus = { ...(progress.worksheetStatus || {}) };
  const worksheetAnswers = { ...(progress.worksheetAnswers || {}) };

  for (const ws of worksheets15Days) {
    const access = getWorksheetAccessState({
      role: "student",
      dayId: ws.dayId,
      dayUnlockMap: unlock.dayUnlockMap,
      myStats,
    });
    if (access !== WorksheetAccessState.OPEN) {
      delete worksheetStatus[ws.id];
      delete worksheetAnswers[ws.id];
    }
  }

  return { ...progress, worksheetStatus, worksheetAnswers };
}
