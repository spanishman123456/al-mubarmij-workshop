import { parsePublishedDays } from "../config/publicationPolicy.js";

let cachedPublication = null;

export function getCachedPublicationConfig() {
  return cachedPublication;
}

export function setCachedPublicationConfig(config) {
  cachedPublication = config;
}

export function resolvePublishedDaysFromCache(fallback) {
  const fromCache = cachedPublication?.publishedDays;
  if (Number.isFinite(fromCache) && fromCache >= 1) {
    return parsePublishedDays(fromCache);
  }
  return fallback;
}

export function resolveUnlockPolicyFromCache(fallback = "sequential") {
  return cachedPublication?.unlockPolicy || fallback;
}
