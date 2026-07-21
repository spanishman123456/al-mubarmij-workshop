import { describe, expect, it } from "vitest";
import { DayStudentState } from "./dayUnlockPolicy.js";
import { canStudentAccessDayResources, getPathDayCardAction } from "./pathDayCardUi.js";

describe("pathDayCardUi", () => {
  it("shows start button when status is available", () => {
    expect(getPathDayCardAction(DayStudentState.AVAILABLE)).toEqual({
      kind: "link",
      label: "ابدأ الدرس",
    });
  });

  it("shows review button when status is completed", () => {
    expect(getPathDayCardAction(DayStudentState.COMPLETED)).toEqual({
      kind: "link",
      label: "مراجعة اليوم",
    });
  });

  it("shows locked message when status is locked", () => {
    expect(getPathDayCardAction(DayStudentState.LOCKED)).toEqual({ kind: "locked" });
  });

  it("shows draft schedule when status is draft", () => {
    expect(getPathDayCardAction(DayStudentState.DRAFT)).toEqual({ kind: "draft" });
  });

  it("never pairs available badge state with a locked CTA", () => {
    const action = getPathDayCardAction(DayStudentState.AVAILABLE);
    expect(action.kind).toBe("link");
    expect(action.label).toBe("ابدأ الدرس");
  });

  it("allows worksheets when student can access the day", () => {
    expect(canStudentAccessDayResources(DayStudentState.AVAILABLE)).toBe(true);
    expect(canStudentAccessDayResources(DayStudentState.LOCKED)).toBe(false);
    expect(canStudentAccessDayResources(DayStudentState.DRAFT)).toBe(false);
  });
});
