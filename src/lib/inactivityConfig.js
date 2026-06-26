/** إعدادات انتهاء جلسة الطالب بسبب عدم النشاط — مصدر واحد للقيم */

/** مدة عدم النشاط قبل تسجيل الخروج (ساعتان) */
export const INACTIVITY_TIMEOUT_MS = 2 * 60 * 60 * 1000;

/** التنبيه قبل انتهاء الجلسة (5 دقائق) */
export const INACTIVITY_WARNING_MS = 5 * 60 * 1000;

/** أقصى تكرار لتحديث وقت آخر نشاط في التخزين */
export const ACTIVITY_THROTTLE_MS = 30 * 1000;

/** فترة فحص المؤقتات (30 ثانية) */
export const INACTIVITY_CHECK_INTERVAL_MS = 30 * 1000;

export const INACTIVITY_STORAGE_KEY = "mubarmij-student-activity-v1";
export const INACTIVITY_BROADCAST_CHANNEL = "mubarmij-student-inactivity";

export const INACTIVITY_LOGOUT_REASON = "inactivity";

export const INACTIVITY_LOGOUT_MESSAGE_AR =
  "تم تسجيل خروجك تلقائيًا لحماية حسابك بسبب عدم النشاط لمدة ساعتين.";

export const INACTIVITY_WARNING_MESSAGE_AR =
  "ستنتهي جلستك بعد 5 دقائق بسبب عدم النشاط. اضغط «متابعة الجلسة» للاستمرار.";
