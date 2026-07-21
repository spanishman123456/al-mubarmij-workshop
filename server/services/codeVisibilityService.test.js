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
} from "./codeVisibilityService.js";
import { DEFAULT_CODE_VISIBILITY_LEVEL } from "../../src/config/codeVisibilityPolicy.js";

const CONSOLE_RESOURCE = "intro-print";
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
