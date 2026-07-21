import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPublishedDaysFromServerEnv } from "../../src/config/publicationPolicy.js";
import { parseUnlockPolicy } from "../../src/lib/dayUnlockPolicy.js";
import {
  defaultCodeVisibilityPolicy,
  normalizeLevel,
  isValidLevel,
} from "../../src/config/codeVisibilityPolicy.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SETTINGS_PATH = path.join(__dirname, "../data/platform-settings.json");

/** Resolved per-call so tests can isolate settings via PLATFORM_SETTINGS_PATH. */
function settingsPath() {
  return process.env.PLATFORM_SETTINGS_PATH || DEFAULT_SETTINGS_PATH;
}

const VALID_ASSIST = new Set(["full", "reduced", "off"]);
const MAX_AUDIT_ENTRIES = 200;

function defaultPublicationSettings() {
  return {
    publishedDays: getPublishedDaysFromServerEnv(),
    unlockPolicy: parseUnlockPolicy(process.env.STUDENT_UNLOCK_POLICY),
    daySchedules: {},
    updatedBy: null,
    updatedAt: null,
  };
}

function defaultCodeVisibilitySettings() {
  return {
    ...defaultCodeVisibilityPolicy(),
    audit: [],
    updatedBy: null,
    updatedAt: null,
  };
}

function defaultSettings() {
  const env = String(process.env.VITE_PYTHON_CODE_ASSIST || process.env.PYTHON_CODE_ASSIST || "full").toLowerCase();
  return {
    pythonCodeAssist: VALID_ASSIST.has(env) ? env : "full",
    publication: defaultPublicationSettings(),
    codeVisibility: defaultCodeVisibilitySettings(),
  };
}

function normalizeLevelMap(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [key, value] of Object.entries(raw)) {
    if (!key) continue;
    if (!isValidLevel(value)) continue;
    out[key] = normalizeLevel(value);
  }
  return out;
}

function normalizeAudit(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e) => e && typeof e === "object" && e.at)
    .slice(-MAX_AUDIT_ENTRIES)
    .map((e) => ({
      at: String(e.at),
      teacherId: e.teacherId || null,
      scope: e.scope || null,
      target: e.target || null,
      before: isValidLevel(e.before) ? normalizeLevel(e.before) : null,
      after: isValidLevel(e.after) ? normalizeLevel(e.after) : null,
      action: e.action || "update",
      reason: e.reason || null,
    }));
}

function normalizeCodeVisibility(raw) {
  const base = defaultCodeVisibilitySettings();
  if (!raw || typeof raw !== "object") return base;
  return {
    general: isValidLevel(raw.general) ? normalizeLevel(raw.general) : base.general,
    projects: normalizeLevelMap(raw.projects),
    days: normalizeLevelMap(raw.days),
    students: normalizeLevelMap(raw.students),
    groups: normalizeLevelMap(raw.groups),
    schedules: raw.schedules && typeof raw.schedules === "object" ? raw.schedules : {},
    audit: normalizeAudit(raw.audit),
    updatedBy: raw.updatedBy || null,
    updatedAt: raw.updatedAt || null,
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
    const p = settingsPath();
    if (!fs.existsSync(p)) return defaultSettings();
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    const mode = String(raw.pythonCodeAssist || "full").toLowerCase();
    const publication = normalizePublication(raw.publication);
    return {
      pythonCodeAssist: VALID_ASSIST.has(mode) ? mode : "full",
      publication: publication || defaultPublicationSettings(),
      codeVisibility: normalizeCodeVisibility(raw.codeVisibility),
    };
  } catch {
    return defaultSettings();
  }
}

function writeSettings(settings) {
  const p = settingsPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(settings, null, 2), "utf8");
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

export function getCodeVisibilitySettings() {
  return normalizeCodeVisibility(getPlatformSettings().codeVisibility);
}

export function setCodeVisibilitySettings(codeVisibility) {
  const settings = {
    ...getPlatformSettings(),
    codeVisibility: normalizeCodeVisibility(codeVisibility),
  };
  writeSettings(settings);
  return settings.codeVisibility;
}

/** Test helper — reset settings file */
export function resetPlatformSettingsForTests() {
  const p = settingsPath();
  if (fs.existsSync(p)) fs.rmSync(p, { force: true });
}
