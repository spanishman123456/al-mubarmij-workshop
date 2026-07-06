import { describe, expect, it } from "vitest";
import { DayStudentState } from "../lib/dayUnlockPolicy.js";
import {
  canStudentAccessDayContent,
  isStudentDayRouteAllowed,
} from "./publication.js";

describe("publication day access", () => {
  const statsPublished2 = { publishedDays: 2, dayUnlock: { publishedDays: 2 } };

  it("allows day-02 route when unlock map says available despite client-only draft", () => {
    const map = { "day-02": DayStudentState.AVAILABLE };
    expect(canStudentAccessDayContent("day-02", map, statsPublished2)).toBe(true);
    expect(isStudentDayRouteAllowed("/path/day/day-02", map, "student", statsPublished2)).toBe(true);
  });

  it("blocks day-02 when unlock map says locked", () => {
    const map = { "day-02": DayStudentState.LOCKED };
    expect(canStudentAccessDayContent("day-02", map, statsPublished2)).toBe(false);
    expect(isStudentDayRouteAllowed("/path/day/day-02", map, "student", statsPublished2)).toBe(false);
  });

  it("blocks day-03 as draft when only two days published", () => {
    const map = { "day-03": DayStudentState.DRAFT };
    expect(canStudentAccessDayContent("day-03", map, statsPublished2)).toBe(false);
  });
});
