import { mutationHeaders } from "./csrfCookie.js";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function url(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function requestJson(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers =
    method !== "GET" && method !== "HEAD"
      ? mutationHeaders({ "Content-Type": "application/json", ...(options.headers || {}) })
      : { ...(options.headers || {}) };
  const res = await fetch(url(path), {
    cache: "no-store",
    credentials: "include",
    headers,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export async function fetchPlatformSettingsPublic() {
  return requestJson("/api/platform/settings/public");
}

export async function savePythonAssistMode(mode) {
  return requestJson("/api/platform/settings/python-assist", {
    method: "PUT",
    body: JSON.stringify({ mode }),
  });
}
