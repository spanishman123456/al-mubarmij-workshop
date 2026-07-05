import bcrypt from "bcryptjs";

let testHashCache = null;
let testPasswordCache = null;

/**
 * Teacher password hash — never store plaintext in repo.
 * Production: set TEACHER_BCRYPT_HASH (generate via `npm run hash:teacher-password`).
 */
export function getTeacherBcryptHash() {
  const fromEnv = process.env.TEACHER_BCRYPT_HASH?.trim();
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV === "test") {
    return ensureTestTeacherCredentials().hash;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("TEACHER_BCRYPT_HASH is required when NODE_ENV=production");
  }

  return "";
}

/** Vitest-only auto credentials when env not set (not used in production). */
export function ensureTestTeacherCredentials() {
  if (testHashCache) return { hash: testHashCache, password: testPasswordCache };

  const password = process.env.TEST_TEACHER_PASSWORD?.trim() || "__vitest-teacher-local__";
  testHashCache = bcrypt.hashSync(password, 4);
  testPasswordCache = password;
  process.env.TEACHER_BCRYPT_HASH = testHashCache;
  return { hash: testHashCache, password: testPasswordCache };
}

export function getTestTeacherPassword() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("getTestTeacherPassword is for tests only");
  }
  return ensureTestTeacherCredentials().password;
}

export function hashPassword(plain) {
  return bcrypt.hashSync(String(plain || ""), 10);
}

export function verifyPassword(plain, hash) {
  if (!hash || !plain) return false;
  try {
    return bcrypt.compareSync(String(plain), hash);
  } catch {
    return false;
  }
}

/** Fail fast when production secrets are missing. */
export function assertProductionAuthConfig() {
  if (process.env.NODE_ENV !== "production") return;
  getTeacherBcryptHash();
  if (!process.env.ALLOWED_ORIGINS?.trim() && !process.env.APP_URL?.trim()) {
    console.warn(JSON.stringify({
      scope: "auth.config",
      level: "warn",
      message: "Set ALLOWED_ORIGINS or APP_URL for production CORS",
    }));
  }
}
