const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function url(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function request(path, options = {}) {
  const res = await fetch(url(path), {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export async function fetchOnboardingStatus(studentId) {
  return request(`/api/onboarding/status/${encodeURIComponent(studentId)}`);
}

export async function saveBingoApi(studentId, payload) {
  return request("/api/onboarding/bingo", {
    method: "POST",
    body: JSON.stringify({ studentId, ...payload }),
  });
}

export async function saveAgreementApi(studentId, payload) {
  return request("/api/onboarding/agreement", {
    method: "POST",
    body: JSON.stringify({ studentId, ...payload }),
  });
}

export async function fetchOnboardingAll() {
  return request("/api/onboarding/all");
}

export async function syncProgressApi(studentId, progress) {
  return request("/api/progress/sync", {
    method: "POST",
    body: JSON.stringify({ studentId, progress }),
  });
}

export async function saveLessonProgressApi(studentId, lessonId, sectionId, progress, completed) {
  return request("/api/lesson/progress", {
    method: "POST",
    body: JSON.stringify({ studentId, lessonId, sectionId, progress, completed }),
  });
}

export async function recordLessonAttemptApi(studentId, payload) {
  return request("/api/lesson/attempt", {
    method: "POST",
    body: JSON.stringify({ studentId, ...payload }),
  });
}

export async function fetchLessonSummaryApi() {
  return request("/api/lesson/summary");
}
