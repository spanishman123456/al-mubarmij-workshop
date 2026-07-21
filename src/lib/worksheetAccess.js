import {
  canStudentAccessDayContent,
  isCurriculumDayPublished,
  isTeacherRole,
  resolvePublishedDaysCount,
} from "../config/publication.js";
import { DayStudentState } from "./dayUnlockPolicy.js";

export const WorksheetAccessState = {
  OPEN: "open",
  LOCKED: "locked",
  DRAFT: "draft",
};

/** Whether a worksheet appears in the student's list (open or locked within published days). */
export function getWorksheetAccessState({ role, dayId, dayUnlockMap, myStats }) {
  if (isTeacherRole(role)) return WorksheetAccessState.OPEN;

  const publishedDays = resolvePublishedDaysCount(myStats);
  if (!isCurriculumDayPublished(dayId, publishedDays)) {
    return WorksheetAccessState.DRAFT;
  }

  if (canStudentAccessDayContent(dayId, dayUnlockMap, myStats)) {
    return WorksheetAccessState.OPEN;
  }

  const unlockState = dayUnlockMap?.[dayId];
  if (unlockState === DayStudentState.LOCKED) {
    return WorksheetAccessState.LOCKED;
  }

  return WorksheetAccessState.DRAFT;
}

export function canStudentOpenWorksheet({ dayId, dayUnlockMap, myStats }) {
  return (
    getWorksheetAccessState({ role: "student", dayId, dayUnlockMap, myStats }) === WorksheetAccessState.OPEN
  );
}

/** Teacher-facing publish badge for a worksheet card. */
export function getTeacherWorksheetBadge(dayId, myStats) {
  const publishedDays = resolvePublishedDaysCount(myStats);
  const dayNum = Number(String(dayId).replace("day-", ""));
  if (!dayNum) return { label: "معاينة معلم", cls: "bg-slate-100 text-slate-700" };

  if (dayNum > publishedDays) {
    return { label: "معاينة معلم فقط", cls: "bg-amber-100 text-amber-900" };
  }
  if (dayNum === 2 && publishedDays >= 2) {
    return { label: "منشورة للطلاب المؤهلين", cls: "bg-sky-100 text-sky-900" };
  }
  return { label: "منشورة للطلاب", cls: "bg-emerald-100 text-emerald-900" };
}

export function studentWorksheetLockedMessage(dayId, dayUnlockMap) {
  if (dayUnlockMap?.[dayId] === DayStudentState.LOCKED) {
    return "أكمل اليوم السابق لفتح هذه الورقة";
  }
  return "سيتم فتحها وفق الجدول التدريبي المعتمد";
}
