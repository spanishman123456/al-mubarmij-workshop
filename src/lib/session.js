import { findTeacherById } from "../data/demoUsers";
import { findRosterUserById } from "../data/studentsRoster";
import { loadPlatformState, savePlatformState } from "./platformStore";

export const SESSION_MAX_MS = 8 * 60 * 60 * 1000; // 8 ساعات

export function resolveSessionUser(userId) {
  if (!userId) return null;
  return findTeacherById(userId) || findRosterUserById(userId) || null;
}

export function isSessionExpired(state) {
  if (!state?.sessionStartedAt) return false;
  const started = new Date(state.sessionStartedAt).getTime();
  if (Number.isNaN(started)) return true;
  return Date.now() - started > SESSION_MAX_MS;
}

/** تحميل الحالة مع التحقق من صلاحية الجلسة */
export function loadValidatedPlatformState() {
  const state = loadPlatformState();
  const user = resolveSessionUser(state.sessionUserId);

  if (!state.sessionUserId || !user || isSessionExpired(state)) {
    if (state.sessionUserId) {
      const cleared = { ...state, sessionUserId: null, sessionStartedAt: null };
      savePlatformState(cleared);
      return cleared;
    }
    return state;
  }

  return state;
}

export function createSessionPatch(userId) {
  return {
    sessionUserId: userId,
    sessionStartedAt: new Date().toISOString(),
  };
}

export function clearSessionPatch() {
  return {
    sessionUserId: null,
    sessionStartedAt: null,
  };
}

export function hardRedirectToLogin() {
  window.location.replace("/login");
}
