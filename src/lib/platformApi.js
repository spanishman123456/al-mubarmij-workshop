import { mutationHeaders } from "./csrfCookie.js";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function url(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers =
    method !== "GET" && method !== "HEAD"
      ? mutationHeaders(options.headers || {})
      : { ...(options.headers || {}) };
  const res = await fetch(url(path), {
    cache: "no-store",
    credentials: "include",
    headers,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function loginStudentApi(nationalId) {
  return request("/api/auth/student", {
    method: "POST",
    body: JSON.stringify({ nationalId }),
  });
}

export async function loginTeacherApi(nationalId, password) {
  return request("/api/auth/teacher", {
    method: "POST",
    body: JSON.stringify({ nationalId, password }),
  });
}

export async function logoutApi() {
  return request("/api/auth/logout", { method: "POST" });
}

export async function fetchAuthMeApi() {
  return request("/api/auth/me");
}

export async function fetchOnboardingStatus(studentId) {
  return request(`/api/onboarding/status/${encodeURIComponent(studentId)}`);
}

export async function saveBingoApi(_studentId, payload) {
  return request("/api/onboarding/bingo", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function savePreAssessmentApi(payload) {
  return request("/api/onboarding/pre-assessment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveAgreementApi(_studentId, payload) {
  return request("/api/onboarding/agreement", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchOnboardingAll() {
  return request("/api/onboarding/all");
}

export async function fetchComputedProgressMe() {
  return request("/api/progress/me");
}

export async function fetchComputedProgressDetailsMe() {
  return request("/api/progress/me/details");
}

export async function fetchTeacherRosterProgress() {
  return request("/api/progress/teacher/roster");
}

export async function fetchTeacherStudentProgress(studentId) {
  return request(`/api/teacher/students/${encodeURIComponent(studentId)}/progress`);
}

export async function recalculateProgressApi(reason = "teacher_recalculate") {
  return request("/api/progress/recalculate", {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function syncProgressApi(_studentId, progress) {
  return request("/api/progress/sync", {
    method: "POST",
    body: JSON.stringify({ progress }),
  });
}

export async function saveLessonProgressApi(_studentId, lessonId, sectionId, progress, completed) {
  return request("/api/lesson/progress", {
    method: "POST",
    body: JSON.stringify({ lessonId, sectionId, progress, completed }),
  });
}

export async function recordLessonAttemptApi(_studentId, payload) {
  return request("/api/lesson/attempt", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchStudentProgressApi(studentId) {
  return request(`/api/progress/${encodeURIComponent(studentId)}`);
}

export async function fetchHealthApi() {
  return request("/api/health");
}

export async function fetchLessonSummaryApi() {
  return request("/api/lesson/summary");
}

export async function fetchTeacherDay03AnswersApi() {
  return request("/api/teacher/day-03-answers");
}
