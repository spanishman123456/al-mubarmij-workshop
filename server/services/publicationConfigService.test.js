import { describe, expect, it, beforeEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getPublicationConfig,
  getEffectivePublishedDays,
  publishDay,
  updatePublicationConfig,
} from "./publicationConfigService.js";
import { resetPlatformSettingsForTests } from "../repositories/platformSettingsRepository.js";

const SETTINGS_PATH = fileURLToPath(new URL("../data/platform-settings.json", import.meta.url));

describe("publicationConfigService", () => {
  beforeEach(() => {
    resetPlatformSettingsForTests();
    process.env.PUBLISHED_DAYS = "2";
    process.env.STUDENT_UNLOCK_POLICY = "sequential";
  });

  it("falls back to env when no DB settings", () => {
    const config = getPublicationConfig();
    expect(config.publishedDays).toBe(2);
    expect(config.unlockPolicy).toBe("sequential");
    expect(config.source).toBe("env");
  });

  it("persists teacher publication settings in platform-settings.json", () => {
    updatePublicationConfig({ publishedDays: 3, unlockPolicy: "open" }, "teacher-1");
    const config = getPublicationConfig();
    expect(config.publishedDays).toBe(3);
    expect(config.unlockPolicy).toBe("open");
    expect(config.source).toBe("database");
    expect(config.updatedBy).toBe("teacher-1");
    expect(fs.existsSync(SETTINGS_PATH)).toBe(true);
  });

  it("publishDay increases publishedDays count", () => {
    publishDay(3, "teacher-1");
    expect(getPublicationConfig().publishedDays).toBe(3);
    expect(getEffectivePublishedDays()).toBe(3);
  });
});
