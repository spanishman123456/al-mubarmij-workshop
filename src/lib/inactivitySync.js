import {
  ACTIVITY_THROTTLE_MS,
  INACTIVITY_BROADCAST_CHANNEL,
  INACTIVITY_STORAGE_KEY,
} from "./inactivityConfig.js";

/** @returns {{ lastActivityAt: number, logoutSignal?: number }} */
function readStored() {
  try {
    const raw = localStorage.getItem(INACTIVITY_STORAGE_KEY);
    if (!raw) return { lastActivityAt: 0 };
    const parsed = JSON.parse(raw);
    return {
      lastActivityAt: Number(parsed.lastActivityAt) || 0,
      logoutSignal: Number(parsed.logoutSignal) || 0,
    };
  } catch {
    return { lastActivityAt: 0 };
  }
}

function writeStored(payload) {
  localStorage.setItem(INACTIVITY_STORAGE_KEY, JSON.stringify(payload));
}

let channel;
function getChannel() {
  if (typeof BroadcastChannel === "undefined") return null;
  if (!channel) channel = new BroadcastChannel(INACTIVITY_BROADCAST_CHANNEL);
  return channel;
}

/** @returns {number} */
export function getLastActivityAt() {
  return readStored().lastActivityAt;
}

/** @param {boolean} [force] */
export function bumpLastActivity(force = false) {
  const now = Date.now();
  const stored = readStored();
  if (!force && stored.lastActivityAt && now - stored.lastActivityAt < ACTIVITY_THROTTLE_MS) {
    return stored.lastActivityAt;
  }
  writeStored({ lastActivityAt: now, logoutSignal: 0 });
  getChannel()?.postMessage({ type: "activity", at: now });
  return now;
}

export function resetActivityTracking() {
  const now = Date.now();
  writeStored({ lastActivityAt: now, logoutSignal: 0 });
  getChannel()?.postMessage({ type: "activity", at: now });
  return now;
}

export function clearActivityTracking() {
  localStorage.removeItem(INACTIVITY_STORAGE_KEY);
  getChannel()?.postMessage({ type: "clear" });
}

export function signalCrossTabLogout() {
  const payload = { lastActivityAt: 0, logoutSignal: Date.now() };
  writeStored(payload);
  getChannel()?.postMessage({ type: "logout", at: payload.logoutSignal });
}

/**
 * @param {{ onActivity?: (at: number) => void, onLogout?: (at: number) => void, onClear?: () => void }} handlers
 * @returns {() => void}
 */
export function subscribeInactivitySync(handlers) {
  function onStorage(event) {
    if (event.key !== INACTIVITY_STORAGE_KEY) return;
    const stored = readStored();
    if (stored.logoutSignal) handlers.onLogout?.(stored.logoutSignal);
    else if (stored.lastActivityAt) handlers.onActivity?.(stored.lastActivityAt);
    else handlers.onClear?.();
  }

  const bc = getChannel();
  function onMessage(event) {
    const data = event.data || {};
    if (data.type === "activity") handlers.onActivity?.(data.at);
    if (data.type === "logout") handlers.onLogout?.(data.at ?? Date.now());
    if (data.type === "clear") handlers.onClear?.();
  }

  window.addEventListener("storage", onStorage);
  bc?.addEventListener("message", onMessage);
  return () => {
    window.removeEventListener("storage", onStorage);
    bc?.removeEventListener("message", onMessage);
  };
}
