import {
  getDayPublicationMap,
  getPublishedDaysFromServerEnv,
  parsePublishedDays,
} from "../../src/config/publicationPolicy.js";
import { parseUnlockPolicy } from "../../src/lib/dayUnlockPolicy.js";
import {
  getPlatformSettings,
  setPublicationSettings,
} from "../repositories/platformSettingsRepository.js";

function defaultPublicationFromEnv() {
  return {
    publishedDays: getPublishedDaysFromServerEnv(),
    unlockPolicy: parseUnlockPolicy(process.env.STUDENT_UNLOCK_POLICY),
    daySchedules: {},
    updatedBy: null,
    updatedAt: null,
    source: "env",
  };
}

function normalizeDaySchedules(raw) {
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  for (const [key, value] of Object.entries(raw)) {
    const day = Number(key);
    if (!Number.isFinite(day) || day < 1 || day > 15) continue;
    if (!value || typeof value !== "object") continue;
    out[String(day)] = {
      publicationStatus: value.publicationStatus === "draft" ? "draft" : "published",
      releaseAt: value.releaseAt || null,
    };
  }
  return out;
}

export function getPublicationConfig() {
  const settings = getPlatformSettings();
  if (settings.publication?.updatedAt) {
    return {
      publishedDays: parsePublishedDays(settings.publication.publishedDays),
      unlockPolicy: parseUnlockPolicy(settings.publication.unlockPolicy),
      daySchedules: normalizeDaySchedules(settings.publication.daySchedules),
      updatedBy: settings.publication.updatedBy || null,
      updatedAt: settings.publication.updatedAt || null,
      source: "database",
    };
  }
  return defaultPublicationFromEnv();
}

export function isDayReleased(dayNumber, config = getPublicationConfig(), now = new Date()) {
  const schedule = config.daySchedules?.[String(dayNumber)];
  if (schedule?.publicationStatus === "draft") return false;
  if (!schedule?.releaseAt) return true;
  const releaseAt = new Date(schedule.releaseAt);
  return Number.isFinite(releaseAt.getTime()) && releaseAt.getTime() <= now.getTime();
}

/** Effective published day count after schedules (future releaseAt reduces visible days). */
export function getEffectivePublishedDays(config = getPublicationConfig(), now = new Date()) {
  let effective = 0;
  for (let d = 1; d <= config.publishedDays; d += 1) {
    if (isDayReleased(d, config, now)) effective = d;
  }
  return effective;
}

export function getPublishedDaysCount() {
  return getEffectivePublishedDays();
}

export function getUnlockPolicy() {
  return getPublicationConfig().unlockPolicy;
}

export function getPublicationStatusMap(config = getPublicationConfig(), now = new Date()) {
  const map = getDayPublicationMap(config.publishedDays);
  for (let d = 1; d <= 15; d += 1) {
    const key = d <= 9 ? `day0${d}` : `day${d}`;
    const schedule = config.daySchedules?.[String(d)];
    if (d > config.publishedDays || schedule?.publicationStatus === "draft") {
      map[key] = "draft";
      continue;
    }
    if (!isDayReleased(d, config, now)) {
      map[key] = "draft";
    }
  }
  return map;
}

export function updatePublicationConfig(patch, teacherId) {
  const current = getPublicationConfig();
  const publishedDays = patch.publishedDays != null ? parsePublishedDays(patch.publishedDays) : current.publishedDays;
  const unlockPolicy = patch.unlockPolicy != null ? parseUnlockPolicy(patch.unlockPolicy) : current.unlockPolicy;
  const daySchedules =
    patch.daySchedules != null ? normalizeDaySchedules(patch.daySchedules) : current.daySchedules;

  const next = {
    publishedDays,
    unlockPolicy,
    daySchedules,
    updatedBy: teacherId || current.updatedBy || "teacher",
    updatedAt: new Date().toISOString(),
  };
  setPublicationSettings(next);
  return getPublicationConfig();
}

export function publishDay(dayNumber, teacherId, options = {}) {
  const config = getPublicationConfig();
  const day = parsePublishedDays(dayNumber);
  const publishedDays = Math.max(config.publishedDays, day);
  const daySchedules = { ...config.daySchedules };
  daySchedules[String(day)] = {
    publicationStatus: "published",
    releaseAt: options.releaseAt || null,
  };
  return updatePublicationConfig({ publishedDays, daySchedules, unlockPolicy: config.unlockPolicy }, teacherId);
}

export function unpublishDay(dayNumber, teacherId) {
  const config = getPublicationConfig();
  const day = parsePublishedDays(dayNumber);
  const daySchedules = { ...config.daySchedules };
  daySchedules[String(day)] = { publicationStatus: "draft", releaseAt: null };
  const publishedDays = Math.min(config.publishedDays, day - 1);
  return updatePublicationConfig(
    { publishedDays: Math.max(1, publishedDays), daySchedules, unlockPolicy: config.unlockPolicy },
    teacherId,
  );
}
