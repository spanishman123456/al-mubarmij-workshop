import { loadPlatformState, savePlatformState } from "./platformStore";

/** إزالة حقول الجلسة القديمة من localStorage — الجلسة تُدار من الخادم فقط */
export function stripLegacySessionFields(state) {
  if (!state) return state;
  const next = { ...state };
  delete next.sessionUserId;
  delete next.sessionStartedAt;
  return next;
}

/** تحميل حالة التقدّم المحلية (بدون اعتماد على جلسة المتصفح) */
export function loadValidatedPlatformState() {
  const state = loadPlatformState();
  const cleaned = stripLegacySessionFields(state);
  if (cleaned !== state) {
    savePlatformState(cleaned);
  }
  return cleaned;
}

export function hardRedirectToLogin() {
  window.location.replace("/login");
}
