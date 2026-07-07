import { describe, expect, it } from "vitest";
import { getPlatformSettings, setPythonCodeAssist, setPublicationSettings } from "../repositories/platformSettingsRepository.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SETTINGS_PATH = fileURLToPath(new URL("../data/platform-settings.json", import.meta.url));

describe("platformSettingsRepository", () => {
  it("defaults python assist to full", () => {
    if (fs.existsSync(SETTINGS_PATH)) fs.rmSync(SETTINGS_PATH, { force: true });
    expect(getPlatformSettings().pythonCodeAssist).toBe("full");
  });

  it("persists teacher assist mode", () => {
    setPythonCodeAssist("reduced");
    expect(getPlatformSettings().pythonCodeAssist).toBe("reduced");
    setPythonCodeAssist("full");
  });

  it("persists publication settings", () => {
    setPublicationSettings({
      publishedDays: 4,
      unlockPolicy: "sequential",
      daySchedules: {},
      updatedBy: "teacher-test",
      updatedAt: new Date().toISOString(),
    });
    expect(getPlatformSettings().publication.publishedDays).toBe(4);
  });
});
