import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPublishedDaysFromServerEnv } from "../../src/config/publicationPolicy.js";
import { parseUnlockPolicy } from "../../src/lib/dayUnlockPolicy.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, "../data/platform-settings.json");

const VALID_ASSIST = new Set(["full", "reduced", "off"]);

function defaultPublicationSettings() {
  return {
    publishedDays: getPublishedDaysFromServerEnv(),
    unlockPolicy: parseUnlockPolicy(process.env.STUDENT_UNLOCK_POLICY),
    daySchedules: {},
    updatedBy: null,
    updatedAt: null,
  };
}

function defaultSettings() {
  const env = String(process.env.VITE_PYTHON_CODE_ASSIST || process.env.PYTHON_CODE_ASSIST || "full").toLowerCase();
  return {
    pythonCodeAssist: VALID_ASSIST.has(env) ? env : "full",
    publication: defaultPublicationSettings(),
  };
}

function normalizePublication(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!raw.updatedAt) return null;
  return {
    publishedDays: Number(raw.publishedDays) || getPublishedDaysFromServerEnv(),
    unlockPolicy: parseUnlockPolicy(raw.unlockPolicy),
    daySchedules: raw.daySchedules && typeof raw.daySchedules === "object" ? raw.daySchedules : {},
    updatedBy: raw.updatedBy || null,
    updatedAt: raw.updatedAt,
  };
}

export function getPlatformSettings() {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) return defaultSettings();
    const raw = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
    const mode = String(raw.pythonCodeAssist || "full").toLowerCase();
    const publication = normalizePublication(raw.publication);
    return {
      pythonCodeAssist: VALID_ASSIST.has(mode) ? mode : "full",
      publication: publication || defaultPublicationSettings(),
    };
  } catch {
    return defaultSettings();
  }
}

function writeSettings(settings) {
  fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf8");
}

export function setPythonCodeAssist(mode) {
  const next = String(mode || "").toLowerCase();
  if (!VALID_ASSIST.has(next)) {
    throw new Error("invalid_mode");
  }
  const settings = { ...getPlatformSettings(), pythonCodeAssist: next };
  writeSettings(settings);
  return settings;
}

export function setPublicationSettings(publication) {
  const settings = {
    ...getPlatformSettings(),
    publication: {
      publishedDays: Number(publication.publishedDays) || getPublishedDaysFromServerEnv(),
      unlockPolicy: parseUnlockPolicy(publication.unlockPolicy),
      daySchedules: publication.daySchedules && typeof publication.daySchedules === "object" ? publication.daySchedules : {},
      updatedBy: publication.updatedBy || null,
      updatedAt: publication.updatedAt || new Date().toISOString(),
    },
  };
  writeSettings(settings);
  return settings.publication;
}

/** Test helper — reset settings file */
export function resetPlatformSettingsForTests() {
  if (fs.existsSync(SETTINGS_PATH)) fs.rmSync(SETTINGS_PATH, { force: true });
}
