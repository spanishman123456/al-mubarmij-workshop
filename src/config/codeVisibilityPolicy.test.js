import { describe, expect, it } from "vitest";
import {
  CODE_VISIBILITY_LEVELS,
  FULL_SOLUTION_LEVELS,
  DEFAULT_CODE_VISIBILITY_LEVEL,
  FALLBACK_CODE_VISIBILITY_LEVEL,
  isValidLevel,
  normalizeLevel,
  getLevelDef,
  defaultCodeVisibilityPolicy,
  resolveEffectiveLevel,
} from "./codeVisibilityPolicy.js";

describe("codeVisibilityPolicy — levels", () => {
  it("defines exactly 8 levels with ids 1..8", () => {
    expect(CODE_VISIBILITY_LEVELS).toHaveLength(8);
    expect(CODE_VISIBILITY_LEVELS.map((l) => l.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("only levels 7 and 8 reveal the full solution", () => {
    expect(FULL_SOLUTION_LEVELS).toEqual([7, 8]);
    expect(getLevelDef(7).fullSolution).toBe("after");
    expect(getLevelDef(8).fullSolution).toBe("immediate");
    for (const id of [1, 2, 3, 4, 5, 6]) {
      expect(getLevelDef(id).fullSolution).toBe("never");
    }
  });

  it("level 1 hides everything; level 2 shows task only; level 3 adds hints", () => {
    const l1 = getLevelDef(1);
    expect(l1.showsTask).toBe(false);
    expect(l1.showsHints).toBe(false);
    expect(l1.showsStarter).toBe(false);

    const l2 = getLevelDef(2);
    expect(l2.showsTask).toBe(true);
    expect(l2.showsHints).toBe(false);

    const l3 = getLevelDef(3);
    expect(l3.showsTask).toBe(true);
    expect(l3.showsHints).toBe(true);
    expect(l3.showsStarter).toBe(false);
  });

  it("default level is 4 and fallback level is 1", () => {
    expect(DEFAULT_CODE_VISIBILITY_LEVEL).toBe(4);
    expect(FALLBACK_CODE_VISIBILITY_LEVEL).toBe(1);
  });

  it("validates and normalizes levels", () => {
    expect(isValidLevel(5)).toBe(true);
    expect(isValidLevel(0)).toBe(false);
    expect(isValidLevel(9)).toBe(false);
    expect(isValidLevel("3")).toBe(true);
    expect(normalizeLevel(99)).toBe(DEFAULT_CODE_VISIBILITY_LEVEL);
    expect(normalizeLevel(6)).toBe(6);
  });
});

describe("codeVisibilityPolicy — resolveEffectiveLevel priority", () => {
  it("returns general level when no scope matches", () => {
    const policy = { ...defaultCodeVisibilityPolicy(), general: 3 };
    const { level, scope } = resolveEffectiveLevel({ projectId: "app-x", dayId: "day-02" }, policy);
    expect(level).toBe(3);
    expect(scope).toBe("general");
  });

  it("day overrides general", () => {
    const policy = { ...defaultCodeVisibilityPolicy(), general: 3, days: { "day-02": 5 } };
    const { level, scope } = resolveEffectiveLevel({ projectId: "app-x", dayId: "day-02" }, policy);
    expect(level).toBe(5);
    expect(scope).toBe("day");
  });

  it("project overrides day and general", () => {
    const policy = {
      ...defaultCodeVisibilityPolicy(),
      general: 3,
      days: { "day-02": 5 },
      projects: { "app-x": 8 },
    };
    const { level, scope } = resolveEffectiveLevel({ projectId: "app-x", dayId: "day-02" }, policy);
    expect(level).toBe(8);
    expect(scope).toBe("project");
  });

  it("student and group (phase 2) still take highest priority when present", () => {
    const policy = {
      ...defaultCodeVisibilityPolicy(),
      general: 3,
      projects: { "app-x": 8 },
      groups: { "grp-1": 2 },
      students: { "stu-1": 1 },
    };
    expect(resolveEffectiveLevel({ projectId: "app-x", groupId: "grp-1" }, policy).scope).toBe("group");
    expect(resolveEffectiveLevel({ projectId: "app-x", studentId: "stu-1", groupId: "grp-1" }, policy).scope).toBe(
      "student",
    );
  });

  it("falls back to default general when policy is empty", () => {
    const { level } = resolveEffectiveLevel({ projectId: "app-x" }, defaultCodeVisibilityPolicy());
    expect(level).toBe(DEFAULT_CODE_VISIBILITY_LEVEL);
  });
});
