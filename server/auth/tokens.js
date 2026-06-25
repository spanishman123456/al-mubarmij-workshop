import crypto from "node:crypto";

/** @returns {string} رمز جلسة عشوائي (يُرسل للمتصفح مرة واحدة فقط) */
export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

/** @param {string} token */
export function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
