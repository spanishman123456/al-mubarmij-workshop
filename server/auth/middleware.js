import { config } from "../config.js";
import { getSessionByToken, touchSession } from "./sessionService.js";
import { findTeacherById } from "../../src/data/demoUsers.js";
import { findRosterUserById } from "../../src/data/studentsRoster.js";

/** @param {import("express").Request} req */
export function readSessionToken(req) {
  return req.cookies?.[config.cookieName] || null;
}

/** @param {import("express").Request} req @param {import("express").Response} res @param {import("express").NextFunction} next */
export function attachSession(req, res, next) {
  const token = readSessionToken(req);
  if (!token) {
    req.session = null;
    req.user = null;
    return next();
  }
  const session = touchSession(token) || getSessionByToken(token);
  if (!session) {
    res.clearCookie(config.cookieName, cookieOptions());
    req.session = null;
    req.user = null;
    return next();
  }
  req.session = session;
  req.user =
    session.userRole === "teacher"
      ? findTeacherById(session.userId)
      : findRosterUserById(session.userId);
  next();
}

/** @param {import("express").Request} req @param {import("express").Response} res @param {import("express").NextFunction} next */
export function requireAuth(req, res, next) {
  if (!req.user || !req.session) {
    return res.status(401).json({
      ok: false,
      code: "UNAUTHORIZED",
      messageAr: "انتهت الجلسة أو غير صالحة. سجّل الدخول مجدداً.",
    });
  }
  next();
}

/** @param {string[]} roles */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        code: "FORBIDDEN",
        messageAr: "ليس لديك صلاحية للوصول إلى هذا المورد.",
      });
    }
    next();
  };
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: config.absoluteSessionMs,
  };
}

/** @param {import("express").Response} res @param {string} token */
export function setSessionCookie(res, token) {
  res.cookie(config.cookieName, token, cookieOptions());
}

/** @param {import("express").Response} res */
export function clearSessionCookie(res) {
  res.clearCookie(config.cookieName, cookieOptions());
}

/** @param {object} user */
export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    role: user.role,
    nameAr: user.nameAr,
    unitAr: user.unitAr ?? null,
    grade: user.grade ?? null,
  };
}
