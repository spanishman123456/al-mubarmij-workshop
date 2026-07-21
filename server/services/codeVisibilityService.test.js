import { describe, expect, it, beforeEach, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { resetPlatformSettingsForTests } from "../repositories/platformSettingsRepository.js";
import {
  getCodeVisibilityConfig,
  resolveLevelForResource,
  updateCodeVisibility,
  resetCodeVisibility,
  undoLastCodeVisibility,
  buildAllowedContent,
  previewAsStudent,
  diagnoseResource,
} from "./codeVisibilityService.js";
import { DEFAULT_CODE_VISIBILITY_LEVEL } from "../../src/config/codeVisibilityPolicy.js";
import { pythonExercises } from "../../src/data/pythonExercises.js";

const CONSOLE_RESOURCE = "intro-print";
const APP_RESOURCE = "app-guess-number";

/** يجد مورد console بلا حلٍّ نموذجي على الخادم (للاختبار السلبي). */
function findConsoleWithoutSolution() {
  for (const ex of pythonExercises) {
    const c = buildAllowedContent("console", ex.id, { role: "student" });
    if (!c.fullSolution && c.level >= 8) return ex.id;
  }
  return null;
}
const SETTINGS_PATH = fileURLToPath(
  new URL("../data/code-visibility-service.test-settings.json", import.meta.url),
);

beforeAll(() => {
  process.env.PLATFORM_SETTINGS_PATH = SETTINGS_PATH;
});

afterAll(() => {
  if (fs.existsSync(SETTINGS_PATH)) fs.rmSync(SETTINGS_PATH, { force: true });
  delete process.env.PLATFORM_SETTINGS_PATH;
});

describe("codeVisibilityService", () => {
  beforeEach(() => {
    resetPlatformSettingsForTests();
  });

  it("defaults to the safe level and source=default", () => {
    const config = getCodeVisibilityConfig();
    expect(config.general).toBe(DEFAULT_CODE_VISIBILITY_LEVEL);
    expect(config.source).toBe("default");
    const { level, scope } = resolveLevelForResource("console", CONSOLE_RESOURCE);
    expect(level).toBe(DEFAULT_CODE_VISIBILITY_LEVEL);
    expect(scope).toBe("general");
  });

  it("updates a scope and records an audit entry", () => {
    const updated = updateCodeVisibility(
      { scope: "general", level: 6, reason: "test" },
      "teacher-1",
    );
    expect(updated.general).toBe(6);
    expect(updated.source).toBe("database");
    expect(updated.updatedBy).toBe("teacher-1");
    expect(updated.audit.at(-1)).toMatchObject({
      scope: "general",
      after: 6,
      action: "update",
      reason: "test",
    });
  });

  it("project scope overrides general", () => {
    updateCodeVisibility({ scope: "general", level: 3 }, "t");
    updateCodeVisibility({ scope: "project", target: "app-guess-number", level: 8 }, "t");
    const { level, scope } = resolveLevelForResource("app", "app-guess-number");
    expect(level).toBe(8);
    expect(scope).toBe("project");
  });

  it("rejects invalid input", () => {
    expect(() => updateCodeVisibility({ scope: "bad", level: 3 }, "t")).toThrow("invalid_scope");
    expect(() => updateCodeVisibility({ scope: "project", level: 3 }, "t")).toThrow("missing_target");
    expect(() => updateCodeVisibility({ scope: "general", level: 99 }, "t")).toThrow("invalid_level");
  });

  it("reset returns a scope to default and logs it", () => {
    updateCodeVisibility({ scope: "project", target: "app-guess-number", level: 8 }, "t");
    const after = resetCodeVisibility({ scope: "project", target: "app-guess-number" }, "t");
    expect(after.projects["app-guess-number"]).toBeUndefined();
    expect(after.audit.at(-1).action).toBe("reset");
  });

  it("undo restores the previous value", () => {
    updateCodeVisibility({ scope: "general", level: 3 }, "t");
    updateCodeVisibility({ scope: "general", level: 8 }, "t");
    const reverted = undoLastCodeVisibility("t");
    expect(reverted.general).toBe(3);
    expect(reverted.audit.at(-1).action).toBe("undo");
  });

  it("undo throws when there is nothing to undo", () => {
    expect(() => undoLastCodeVisibility("t")).toThrow("nothing_to_undo");
  });
});

describe("codeVisibilityService — buildAllowedContent security", () => {
  beforeEach(() => {
    resetPlatformSettingsForTests();
  });

  it("hides everything at level 1", () => {
    updateCodeVisibility({ scope: "general", level: 1 }, "t");
    const c = buildAllowedContent("console", CONSOLE_RESOURCE, { role: "student" });
    expect(c.taskDescriptionAr).toBeNull();
    expect(c.hints).toEqual([]);
    expect(c.starterCode).toBeNull();
    expect(c.fullSolution).toBeNull();
    expect(c.fullSolutionAvailable).toBe(false);
  });

  it("default level 4 shows starter + hints but never the full solution", () => {
    const c = buildAllowedContent("console", CONSOLE_RESOURCE, { role: "student" });
    expect(c.level).toBe(DEFAULT_CODE_VISIBILITY_LEVEL);
    expect(c.starterCode).toBeTruthy();
    expect(c.hints.length).toBeGreaterThan(0);
    expect(c.fullSolution).toBeNull();
  });

  it("level 8 reveals the full solution to students immediately", () => {
    updateCodeVisibility({ scope: "general", level: 8 }, "t");
    const c = buildAllowedContent("console", CONSOLE_RESOURCE, { role: "student" });
    expect(c.fullSolutionAvailable).toBe(true);
    expect(c.fullSolution).toBeTruthy();
  });

  it("level 7 withholds the solution until the attempt condition is met", () => {
    updateCodeVisibility({ scope: "general", level: 7 }, "t");
    const before = buildAllowedContent("console", CONSOLE_RESOURCE, {
      role: "student",
      attemptsCompleted: 0,
    });
    expect(before.fullSolution).toBeNull();
    const after = buildAllowedContent("console", CONSOLE_RESOURCE, {
      role: "student",
      attemptsCompleted: 5,
    });
    expect(after.fullSolution).toBeTruthy();
  });

  it("never returns the solution to a teacher via the student gate (even at level 8)", () => {
    updateCodeVisibility({ scope: "general", level: 8 }, "t");
    const c = buildAllowedContent("console", CONSOLE_RESOURCE, { role: "teacher" });
    expect(c.fullSolutionAvailable).toBe(true);
    expect(c.fullSolution).toBeNull();
  });

  it("previewAsStudent behaves as a student regardless of caller", () => {
    updateCodeVisibility({ scope: "general", level: 8 }, "t");
    const c = previewAsStudent("console", CONSOLE_RESOURCE, {});
    expect(c.fullSolution).toBeTruthy();
  });
});

describe("codeVisibilityService — scope priority + student editor policy (app)", () => {
  beforeEach(() => {
    resetPlatformSettingsForTests();
  });

  it("general level 8 delivers the full solution for a graphical project", () => {
    updateCodeVisibility({ scope: "general", level: 8 }, "t");
    const c = buildAllowedContent("app", APP_RESOURCE, { role: "student" });
    expect(c.level).toBe(8);
    expect(c.resolvedScope).toBe("general");
    expect(c.fullSolution).toBeTruthy();
    expect(c.fullSolutionMissing).toBe(false);
  });

  it("a project-level 4 overrides general 8 and withholds the solution", () => {
    updateCodeVisibility({ scope: "general", level: 8 }, "t");
    updateCodeVisibility({ scope: "project", target: APP_RESOURCE, level: 4 }, "t");
    const c = buildAllowedContent("app", APP_RESOURCE, { role: "student" });
    expect(c.level).toBe(4);
    expect(c.resolvedScope).toBe("project");
    expect(c.fullSolution).toBeNull();
    expect(c.starterCode).toBeTruthy();
  });

  it("deleting the project override falls back to general 8 (solution returns)", () => {
    updateCodeVisibility({ scope: "general", level: 8 }, "t");
    updateCodeVisibility({ scope: "project", target: APP_RESOURCE, level: 4 }, "t");
    resetCodeVisibility({ scope: "project", target: APP_RESOURCE }, "t");
    const c = buildAllowedContent("app", APP_RESOURCE, { role: "student" });
    expect(c.level).toBe(8);
    expect(c.resolvedScope).toBe("general");
    expect(c.fullSolution).toBeTruthy();
  });

  it("diagnoseResource exposes the full scope breakdown + deciding scope", () => {
    updateCodeVisibility({ scope: "general", level: 8 }, "t");
    updateCodeVisibility({ scope: "project", target: APP_RESOURCE, level: 3 }, "t");
    const d = diagnoseResource("app", APP_RESOURCE);
    expect(d.generalLevel).toBe(8);
    expect(d.projectLevel).toBe(3);
    expect(d.resolvedLevel).toBe(3);
    expect(d.resolvedScope).toBe("project");
    expect(d.catalogMatch).toBe(true);
    expect(d.fullSolutionAvailable).toBe(true);
  });

  it("level 8 with no bound solution returns a structured 'missing' state (no wrong leak)", () => {
    updateCodeVisibility({ scope: "general", level: 8 }, "t");
    const resource = findConsoleWithoutSolution();
    if (!resource) return; // كل الموارد لها حل — لا شيء لاختباره سلبيًا
    const c = buildAllowedContent("console", resource, { role: "student" });
    expect(c.level).toBe(8);
    expect(c.fullSolution).toBeNull();
    expect(c.fullSolutionMissing).toBe(true);
    expect(c.notice).toBeTruthy();
  });
});
