import { useCallback, useEffect, useState } from "react";
import { fetchSecurityLog, fetchStudentSessions, revokeStudentSessionApi } from "../../lib/authApi.js";

function formatTs(ms) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "—";
  }
}

const EVENT_LABELS = {
  login_success: "دخول ناجح",
  login_rejected_active_session: "رفض دخول — جلسة نشطة",
  logout: "تسجيل خروج",
  session_revoked: "إنهاء جلسة",
  expired: "انتهاء الجلسة",
};

export function StudentSessionsPanel() {
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sessRes, logRes] = await Promise.all([fetchStudentSessions(), fetchSecurityLog(30)]);
      setSessions(sessRes.sessions || []);
      setEvents(logRes.events || []);
    } catch {
      setMsg("تعذّر تحميل بيانات الجلسات.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function revokeSession(studentId) {
    setBusyId(studentId);
    setMsg("");
    try {
      const res = await revokeStudentSessionApi(studentId);
      setMsg(res.messageAr);
      await load();
    } catch (e) {
      setMsg(e.message || "تعذّر إنهاء الجلسة.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">الجلسات النشطة للطلاب</h2>
        <p className="mt-1 text-sm text-slate-600">
          جلسة واحدة لكل طالب. يمكنك إنهاء الجلسة إذا نسي الطالب تسجيل الخروج أو فقد جهازه.
        </p>

        {msg ? (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{msg}</p>
        ) : null}

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">جاري التحميل…</p>
        ) : sessions.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">لا توجد جلسات طلاب نشطة حالياً.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 font-bold">الطالب</th>
                  <th className="py-2 font-bold">بدء الجلسة</th>
                  <th className="py-2 font-bold">آخر نشاط</th>
                  <th className="py-2 font-bold">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.sessionId} className="border-b border-slate-100">
                    <td className="py-3 font-semibold text-slate-800">{s.studentName}</td>
                    <td className="py-3 text-slate-700">{formatTs(s.createdAt)}</td>
                    <td className="py-3 text-slate-700">{formatTs(s.lastActivityAt)}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        disabled={busyId === s.studentId}
                        onClick={() => revokeSession(s.studentId)}
                        className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50"
                      >
                        {busyId === s.studentId ? "جارٍ…" : "إنهاء الجلسة"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">سجل أمني — الدخول والخروج</h3>
        {events.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">لا توجد أحداث مسجّلة بعد.</p>
        ) : (
          <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
            {events.map((ev) => (
              <li key={ev.id} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                <span className="font-semibold">{EVENT_LABELS[ev.eventType] || ev.eventType}</span>
                {" — "}
                {formatTs(ev.createdAt)}
                {ev.userId ? ` · ${ev.userId.replace("stu-", "طالب ***")}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
