import crypto from "node:crypto";
import { config } from "../config.js";
import { getDb } from "../db.js";
import { generateSessionToken, hashSessionToken } from "./tokens.js";

/** @typedef {{ id: string, userId: string, userRole: string, createdAt: number, lastActivityAt: number, expiresAt: number }} SessionRow */

export const SESSION_CONFLICT = "SESSION_ACTIVE_ELSEWHERE";

/**
 * @param {string} eventType
 * @param {{ userId?: string, userRole?: string, sessionId?: string, actorId?: string, meta?: object }} details
 */
export function logSecurityEvent(eventType, details = {}) {
  const database = getDb();
  database
    .prepare(
      `INSERT INTO security_audit (event_type, user_id, user_role, session_id, actor_id, created_at, meta_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      eventType,
      details.userId ?? null,
      details.userRole ?? null,
      details.sessionId ?? null,
      details.actorId ?? null,
      Date.now(),
      details.meta ? JSON.stringify(details.meta) : null,
    );
}

/** @param {SessionRow} row */
function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    userRole: row.user_role,
    createdAt: row.created_at,
    lastActivityAt: row.last_activity_at,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
    revokeReason: row.revoke_reason,
  };
}

/** @param {ReturnType<typeof mapRow>} session */
function isSessionActive(session, now = Date.now()) {
  if (!session || session.revokedAt) return false;
  if (now > session.expiresAt) return false;
  if (now - session.lastActivityAt > config.idleSessionMs) return false;
  return true;
}

/** @param {string} userId @param {'student'|'teacher'} userRole */
export function getActiveSessionForUser(userId, userRole) {
  const database = getDb();
  const row = database
    .prepare(
      `SELECT * FROM sessions
       WHERE user_id = ? AND user_role = ? AND revoked_at IS NULL
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get(userId, userRole);
  const session = mapRow(row);
  if (!session || !isSessionActive(session)) {
    if (session && !session.revokedAt) {
      revokeSessionById(session.id, session.userRole === "student" ? "expired" : "expired");
    }
    return null;
  }
  return session;
}

/** @param {string} token */
export function getSessionByToken(token) {
  if (!token) return null;
  const database = getDb();
  const row = database
    .prepare(`SELECT * FROM sessions WHERE token_hash = ? LIMIT 1`)
    .get(hashSessionToken(token));
  const session = mapRow(row);
  if (!session || !isSessionActive(session)) {
    if (session && !session.revokedAt) {
      revokeSessionById(session.id, "expired");
    }
    return null;
  }
  return session;
}

/**
 * @param {{ userId: string, userRole: 'student'|'teacher', rejectIfActive?: boolean }}
 * @returns {{ ok: true, token: string, session: object } | { ok: false, code: string, messageAr: string }}
 */
export function createSession({ userId, userRole, rejectIfActive = userRole === "student" }) {
  const database = getDb();
  const now = Date.now();

  if (rejectIfActive) {
    const existing = getActiveSessionForUser(userId, userRole);
    if (existing) {
      logSecurityEvent("login_rejected_active_session", {
        userId,
        userRole,
        sessionId: existing.id,
      });
      return {
        ok: false,
        code: SESSION_CONFLICT,
        messageAr:
          "هذا الحساب مستخدم حاليًا على جهاز آخر. يجب تسجيل الخروج من الجلسة الحالية قبل تسجيل الدخول من جهاز جديد.",
      };
    }
  }

  const token = generateSessionToken();
  const sessionId = crypto.randomUUID();
  const expiresAt = now + config.absoluteSessionMs;

  try {
    database
      .prepare(
        `INSERT INTO sessions (id, user_id, user_role, token_hash, created_at, last_activity_at, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(sessionId, userId, userRole, hashSessionToken(token), now, now, expiresAt);
  } catch (err) {
    if (String(err.message).includes("UNIQUE constraint failed") && userRole === "student") {
      logSecurityEvent("login_rejected_active_session", { userId, userRole, meta: { constraint: true } });
      return {
        ok: false,
        code: SESSION_CONFLICT,
        messageAr:
          "هذا الحساب مستخدم حاليًا على جهاز آخر. يجب تسجيل الخروج من الجلسة الحالية قبل تسجيل الدخول من جهاز جديد.",
      };
    }
    throw err;
  }

  logSecurityEvent("login_success", { userId, userRole, sessionId });

  return {
    ok: true,
    token,
    session: {
      id: sessionId,
      userId,
      userRole,
      createdAt: now,
      lastActivityAt: now,
      expiresAt,
    },
  };
}

/** @param {string} sessionId @param {string} [reason] */
export function revokeSessionById(sessionId, reason = "logout") {
  const database = getDb();
  const row = database.prepare(`SELECT * FROM sessions WHERE id = ?`).get(sessionId);
  if (!row || row.revoked_at) return false;
  database
    .prepare(`UPDATE sessions SET revoked_at = ?, revoke_reason = ? WHERE id = ?`)
    .run(Date.now(), reason, sessionId);
  logSecurityEvent(reason === "logout" ? "logout" : "session_revoked", {
    userId: row.user_id,
    userRole: row.user_role,
    sessionId,
    meta: { reason },
  });
  return true;
}

/** @param {string} token @param {string} [reason] */
export function revokeSessionByToken(token, reason = "logout") {
  if (!token) return false;
  const database = getDb();
  const row = database
    .prepare(`SELECT id FROM sessions WHERE token_hash = ? AND revoked_at IS NULL`)
    .get(hashSessionToken(token));
  if (!row) return false;
  return revokeSessionById(row.id, reason);
}

/** @param {string} userId @param {'student'|'teacher'} userRole @param {string} [reason] @param {string} [actorId] */
export function revokeAllSessionsForUser(userId, userRole, reason = "admin_revoke", actorId = null) {
  const database = getDb();
  const now = Date.now();
  const rows = database
    .prepare(
      `SELECT id FROM sessions WHERE user_id = ? AND user_role = ? AND revoked_at IS NULL`,
    )
    .all(userId, userRole);
  if (!rows.length) return 0;
  database
    .prepare(
      `UPDATE sessions SET revoked_at = ?, revoke_reason = ? WHERE user_id = ? AND user_role = ? AND revoked_at IS NULL`,
    )
    .run(now, reason, userId, userRole);
  for (const row of rows) {
    logSecurityEvent("session_revoked", {
      userId,
      userRole,
      sessionId: row.id,
      actorId: actorId ?? undefined,
      meta: { reason },
    });
  }
  return rows.length;
}

/** @param {string} token */
export function touchSession(token) {
  const session = getSessionByToken(token);
  if (!session) return null;
  const now = Date.now();
  if (now - session.lastActivityAt < config.activityWriteThrottleMs) {
    return session;
  }
  const database = getDb();
  database
    .prepare(`UPDATE sessions SET last_activity_at = ? WHERE id = ?`)
    .run(now, session.id);
  return { ...session, lastActivityAt: now };
}

/** @returns {Array<object>} */
export function listActiveStudentSessions() {
  const database = getDb();
  const now = Date.now();
  const rows = database
    .prepare(
      `SELECT * FROM sessions WHERE user_role = 'student' AND revoked_at IS NULL ORDER BY last_activity_at DESC`,
    )
    .all();
  return rows
    .map(mapRow)
    .filter((s) => isSessionActive(s, now));
}

/** @param {number} [limit] */
export function getSecurityAuditLog(limit = 50) {
  const database = getDb();
  return database
    .prepare(
      `SELECT id, event_type, user_id, user_role, session_id, actor_id, created_at, meta_json
       FROM security_audit ORDER BY created_at DESC LIMIT ?`,
    )
    .all(limit)
    .map((row) => ({
      id: row.id,
      eventType: row.event_type,
      userId: row.user_id,
      userRole: row.user_role,
      sessionId: row.session_id,
      actorId: row.actor_id,
      createdAt: row.created_at,
      meta: row.meta_json ? JSON.parse(row.meta_json) : null,
    }));
}

/** تنظيف الجلسات المنتهية */
export function purgeExpiredSessions() {
  const database = getDb();
  const now = Date.now();
  const idleCutoff = now - config.idleSessionMs;
  const result = database
    .prepare(
      `UPDATE sessions
       SET revoked_at = ?, revoke_reason = 'expired'
       WHERE revoked_at IS NULL AND (expires_at < ? OR last_activity_at < ?)`,
    )
    .run(now, now, idleCutoff);
  return result.changes;
}
