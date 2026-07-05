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

export async function fetchQuizPublicApi(quizId) {
  return request(`/api/quiz/${quizId}/public`);
}

export async function fetchQuizAttemptApi(quizId) {
  return request(`/api/quiz/${quizId}/attempt`);
}

export async function saveQuizAttemptApi(quizId, attemptId, payload) {
  return request(`/api/quiz/${quizId}/attempt/${attemptId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function submitQuizAttemptApi(quizId, attemptId) {
  return request(`/api/quiz/${quizId}/attempt/${attemptId}/submit`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function fetchQuizReviewApi(attemptId) {
  return request(`/api/quiz/review/${attemptId}`);
}

export async function fetchLatestReviewIdApi(quizId) {
  return request(`/api/quiz/${quizId}/latest-review`);
}
