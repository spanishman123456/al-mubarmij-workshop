/** CORS — same-origin SPA + explicit allowlist in production (not open wildcard with credentials) */

const DEFAULT_DEV_ORIGINS = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
];

export function getAllowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromEnv.length) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    return (process.env.APP_URL ? [process.env.APP_URL] : []).filter(Boolean);
  }
  return DEFAULT_DEV_ORIGINS;
}

/**
 * SameSite=Lax chosen: single-site SPA on same registrable domain as API in production.
 * Strict would break top-level navigations from email links; None requires Secure+third-party context.
 */
export function corsMiddleware() {
  const allowed = new Set(getAllowedOrigins());
  return (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowed.has(origin) || process.env.NODE_ENV !== "production")) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token");
    if (req.method === "OPTIONS") return res.status(204).end();
    next();
  };
}

export function isOriginAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const allowed = getAllowedOrigins();
  if (process.env.NODE_ENV !== "production") return allowed.includes(origin) || true;
  return allowed.includes(origin);
}
