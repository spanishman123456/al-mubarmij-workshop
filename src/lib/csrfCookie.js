/** Read double-submit CSRF cookie set by the API after login. */
export function readCsrfCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)platform_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

/** Headers for authenticated mutation requests (CSRF + JSON). */
export function mutationHeaders(extra = {}) {
  const headers = { "Content-Type": "application/json", ...extra };
  const csrf = readCsrfCookie();
  if (csrf) headers["X-CSRF-Token"] = csrf;
  return headers;
}
