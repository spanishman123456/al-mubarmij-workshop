import bcrypt from "bcryptjs";

/** bcrypt hash for demo teacher password (babamama) — cost 10; never store plaintext */
export const TEACHER_BCRYPT_HASH =
  "$2b$10$NGhTMh4FzzNhtIu2UTyhb.EboMQ6Yx6SV4DUZlaueD1xXJeqN0mWG";

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
