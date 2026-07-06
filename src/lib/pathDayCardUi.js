import { DayStudentState } from "./dayUnlockPolicy.js";

/** CTA for a day card on /path — single source of truth from unlock state. */
export function getPathDayCardAction(studentState) {
  switch (studentState) {
    case DayStudentState.COMPLETED:
      return { kind: "link", label: "مراجعة اليوم" };
    case DayStudentState.AVAILABLE:
    case DayStudentState.IN_PROGRESS:
      return { kind: "link", label: "ابدأ الدرس" };
    case DayStudentState.LOCKED:
      return { kind: "locked" };
    case DayStudentState.DRAFT:
      return { kind: "draft" };
    default:
      return { kind: "draft" };
  }
}

export function canStudentAccessDayResources(studentState) {
  return (
    studentState === DayStudentState.AVAILABLE ||
    studentState === DayStudentState.IN_PROGRESS ||
    studentState === DayStudentState.COMPLETED
  );
}
