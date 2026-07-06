/** سياسة التلميحات — لا كشف للإجابة الصحيحة في التدريبات التعليمية */

export const DEFAULT_ALLOW_REVEAL_ANSWER = false;

export const AFTER_MAX_HINTS_AR =
  "راجع الشرح في الدرس أو اطلب مساعدة المعلم — استمر بالمحاولة دون الاعتماد على الحل الجاهز.";

export const WRONG_TRY_AGAIN_AR = "الإجابة غير صحيحة بعد — راجع خطواتك وحاول مرة أخرى.";

export const TEACHER_HELP_AR = "يمكنك طلب مساعدة المعلم إذا احتجت توجيهًا إضافيًا.";

/**
 * @param {number} attemptIndex - محاولة فاشلة (1-based بعد التلميحات)
 * @param {string[]} hints
 * @param {string} [wrongMessage]
 */
export function feedbackAfterFailedAttempt(attemptIndex, hints = [], wrongMessage = WRONG_TRY_AGAIN_AR) {
  if (attemptIndex <= hints.length && hints[attemptIndex - 1]) {
    return `تلميح ${attemptIndex}: ${hints[attemptIndex - 1]}`;
  }
  if (attemptIndex === hints.length + 1) {
    return wrongMessage;
  }
  return AFTER_MAX_HINTS_AR;
}
