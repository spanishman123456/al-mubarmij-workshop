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
    const err = new Error(data.messageAr || data.error || res.statusText);
    err.status = res.status;
    err.incompleteItems = data.incompleteItems;
    err.code = data.error;
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

export async function completeStudentDayApi(dayId) {
  return request(`/api/student/day/${encodeURIComponent(dayId)}/complete`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function fetchPublicationConfigApi() {
  return request("/api/config/publication");
}

export async function updatePublicationConfigApi(payload) {
  return request("/api/config/publication", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function publishDayApi(dayNumber, releaseAt = null) {
  return request("/api/config/publication/publish-day", {
    method: "POST",
    body: JSON.stringify({ dayNumber, releaseAt }),
  });
}

export async function unpublishDayApi(dayNumber) {
  return request("/api/config/publication/unpublish-day", {
    method: "POST",
    body: JSON.stringify({ dayNumber }),
  });
}

export async function fetchTeacherPublicationSummaryApi() {
  return request("/api/teacher/publication/summary");
}

export async function fetchStudentUnlockLogApi(studentId) {
  return request(`/api/teacher/students/${encodeURIComponent(studentId)}/unlock-log`);
}

export async function teacherUnlockDayApi(studentId, dayNumber, reason = "") {
  return request(`/api/teacher/students/${encodeURIComponent(studentId)}/unlock-day`, {
    method: "POST",
    body: JSON.stringify({ dayNumber, reason }),
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

export async function fetchTeacherDay04AnswersApi() {
  return request("/api/teacher/day-04-answers");
}

export async function fetchTeacherDay05AnswersApi() {
  return request("/api/teacher/day-05-answers");
}

export async function fetchTeacherDay06AnswersApi() {
  return request("/api/teacher/day-06-answers");
}
