import { describe, expect, it } from "vitest";
import { DayStudentState } from "./dayUnlockPolicy.js";
import {
  WorksheetAccessState,
  canStudentOpenWorksheet,
  getTeacherWorksheetBadge,
  getWorksheetAccessState,
} from "./worksheetAccess.js";

const statsPublished2 = { publishedDays: 2, dayUnlock: { publishedDays: 2 } };

describe("worksheet access", () => {
  it("eligible student sees day-02 worksheet as open", () => {
    const map = { "day-02": DayStudentState.AVAILABLE };
    expect(
      getWorksheetAccessState({
        role: "student",
        dayId: "day-02",
        dayUnlockMap: map,
        myStats: statsPublished2,
      }),
    ).toBe(WorksheetAccessState.OPEN);
    expect(canStudentOpenWorksheet({ dayId: "day-02", dayUnlockMap: map, myStats: statsPublished2 })).toBe(true);
  });

  it("student without day-02 unlock sees locked state", () => {
    const map = { "day-02": DayStudentState.LOCKED };
    expect(
      getWorksheetAccessState({
        role: "student",
        dayId: "day-02",
        dayUnlockMap: map,
        myStats: statsPublished2,
      }),
    ).toBe(WorksheetAccessState.LOCKED);
    expect(canStudentOpenWorksheet({ dayId: "day-02", dayUnlockMap: map, myStats: statsPublished2 })).toBe(false);
  });

  it("student does not see draft day-03 when only two days published", () => {
    expect(
      getWorksheetAccessState({
        role: "student",
        dayId: "day-03",
        dayUnlockMap: { "day-03": DayStudentState.DRAFT },
        myStats: statsPublished2,
      }),
    ).toBe(WorksheetAccessState.DRAFT);
  });

  it("teacher always has open access", () => {
    expect(
      getWorksheetAccessState({
        role: "teacher",
        dayId: "day-05",
        dayUnlockMap: {},
        myStats: null,
      }),
    ).toBe(WorksheetAccessState.OPEN);
  });

  it("teacher badge reflects publish state", () => {
    expect(getTeacherWorksheetBadge("day-01", statsPublished2).label).toContain("منشورة");
    expect(getTeacherWorksheetBadge("day-02", statsPublished2).label).toContain("المؤهلين");
    expect(getTeacherWorksheetBadge("day-05", statsPublished2).label).toContain("معاينة");
  });

  it("publishedDays=1 hides day-02 from student list", () => {
    const stats1 = { publishedDays: 1 };
    expect(
      getWorksheetAccessState({
        role: "student",
        dayId: "day-02",
        dayUnlockMap: {},
        myStats: stats1,
      }),
    ).toBe(WorksheetAccessState.DRAFT);
  });
});
