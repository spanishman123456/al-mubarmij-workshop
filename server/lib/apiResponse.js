/**
 * استجابات API موحّدة — success + message + code
 */

/** @param {import("express").Response} res @param {number} status @param {object} body */
export function sendJson(res, status, body) {
  return res.status(status).json(body);
}

/** @param {import("express").Response} res @param {object} payload */
export function sendSuccess(res, payload = {}) {
  return res.json({
    success: true,
    ok: true,
    ...payload,
  });
}

/**
 * @param {import("express").Response} res
 * @param {number} status
 * @param {{ code?: string, message?: string, messageAr?: string, helpAr?: string }} err
 */
export function sendError(res, status, err) {
  const message = err.messageAr || err.message || "حدث خطأ غير متوقع.";
  return res.status(status).json({
    success: false,
    ok: false,
    code: err.code || "ERROR",
    message,
    messageAr: message,
    helpAr: err.helpAr,
  });
}
