import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, "../data/platform-settings.json");

const VALID_ASSIST = new Set(["full", "reduced", "off"]);

function defaultSettings() {
  const env = String(process.env.VITE_PYTHON_CODE_ASSIST || process.env.PYTHON_CODE_ASSIST || "full").toLowerCase();
  return { pythonCodeAssist: VALID_ASSIST.has(env) ? env : "full" };
}

export function getPlatformSettings() {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) return defaultSettings();
    const raw = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
    const mode = String(raw.pythonCodeAssist || "full").toLowerCase();
    return { pythonCodeAssist: VALID_ASSIST.has(mode) ? mode : "full" };
  } catch {
    return defaultSettings();
  }
}

export function setPythonCodeAssist(mode) {
  const next = String(mode || "").toLowerCase();
  if (!VALID_ASSIST.has(next)) {
    throw new Error("invalid_mode");
  }
  const settings = { ...getPlatformSettings(), pythonCodeAssist: next };
  fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf8");
  return settings;
}
