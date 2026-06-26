import {
  INACTIVITY_LOGOUT_MESSAGE_AR,
  INACTIVITY_WARNING_MESSAGE_AR,
} from "../../lib/inactivityConfig.js";

export function InactivityWarningModal({ onContinue, onLogoutNow }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      dir="rtl"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="inactivity-warning-title"
      aria-describedby="inactivity-warning-desc"
    >
      <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl">
        <h2 id="inactivity-warning-title" className="text-lg font-bold text-slate-900">
          تنبيه انتهاء الجلسة
        </h2>
        <p id="inactivity-warning-desc" className="mt-3 text-sm leading-relaxed text-slate-700">
          {INACTIVITY_WARNING_MESSAGE_AR}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-800"
          >
            متابعة الجلسة
          </button>
          <button
            type="button"
            onClick={onLogoutNow}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            تسجيل الخروج الآن
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-500">{INACTIVITY_LOGOUT_MESSAGE_AR}</p>
      </div>
    </div>
  );
}
