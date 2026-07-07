import { useEffect, useState } from "react";
import { EduCard } from "../layout/PageShell";
import {
  fetchTeacherPublicationSummaryApi,
  publishDayApi,
  unpublishDayApi,
  updatePublicationConfigApi,
  teacherUnlockDayApi,
} from "../../lib/platformApi";

function dayLabel(n) {
  return `اليوم ${n}`;
}

export function DayPublicationPanel({ publicationConfig, onUpdated }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyDay, setBusyDay] = useState(null);
  const [error, setError] = useState("");
  const [policy, setPolicy] = useState(publicationConfig?.unlockPolicy || "sequential");

  async function loadSummary() {
    setLoading(true);
    setError("");
    try {
      const res = await fetchTeacherPublicationSummaryApi();
      setSummary(res.summary);
      setPolicy(res.summary?.unlockPolicy || "sequential");
    } catch (err) {
      setError(err.message || "تعذر تحميل إعدادات المسار");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, [publicationConfig?.updatedAt]);

  async function handlePublish(day) {
    setBusyDay(day);
    setError("");
    try {
      await publishDayApi(day);
      await onUpdated?.();
      await loadSummary();
    } catch (err) {
      setError(err.message || "تعذر نشر اليوم");
    } finally {
      setBusyDay(null);
    }
  }

  async function handleUnpublish(day) {
    if (!window.confirm(`إغلاق اليوم ${day} مؤقتًا للطلاب؟`)) return;
    setBusyDay(day);
    setError("");
    try {
      await unpublishDayApi(day);
      await onUpdated?.();
      await loadSummary();
    } catch (err) {
      setError(err.message || "تعذر إغلاق اليوم");
    } finally {
      setBusyDay(null);
    }
  }

  async function handlePolicyChange(nextPolicy) {
    setPolicy(nextPolicy);
    setError("");
    try {
      await updatePublicationConfigApi({ unlockPolicy: nextPolicy });
      await onUpdated?.();
      await loadSummary();
    } catch (err) {
      setError(err.message || "تعذر حفظ سياسة الفتح");
    }
  }

  const publishedDays = summary?.publishedDays ?? publicationConfig?.publishedDays ?? 1;
  const source = summary?.source ?? publicationConfig?.source ?? "env";

  return (
    <EduCard className="mb-6" accent="emerald" title="إدارة فتح الأيام — المسار التدريبي">
      <p className="text-sm text-slate-600">
        عدد الأيام المنشورة: <strong>{publishedDays}</strong> — المصدر:{" "}
        <strong>{source === "database" ? "قاعدة البيانات" : "إعدادات البيئة الابتدائية"}</strong>
        {summary?.updatedAt ? (
          <>
            {" "}
            — آخر تحديث: {new Date(summary.updatedAt).toLocaleString("ar-SA")}
          </>
        ) : null}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-slate-700">سياسة الفتح:</span>
        {[
          { key: "sequential", label: "تسلسلي (بعد إكمال اليوم السابق)" },
          { key: "open", label: "مفتوح ضمن الأيام المنشورة" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            disabled={loading}
            onClick={() => handlePolicyChange(opt.key)}
            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
              policy === opt.key ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">جاري تحميل حالة الأيام...</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-right text-xs text-slate-500">
                <th className="py-2 pl-2">اليوم</th>
                <th className="py-2 pl-2">النشر</th>
                <th className="py-2 pl-2">متاح</th>
                <th className="py-2 pl-2">مقفل</th>
                <th className="py-2 pl-2">مكتمل</th>
                <th className="py-2">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.days || []).slice(0, 15).map((row) => {
                const isPublished = row.publicationState === "published";
                return (
                  <tr key={row.day} className="border-b border-slate-100">
                    <td className="py-2 pl-2 font-medium">{dayLabel(row.day)}</td>
                    <td className="py-2 pl-2">{isPublished ? "منشور" : "غير منشور"}</td>
                    <td className="py-2 pl-2">{row.stats?.available ?? 0}</td>
                    <td className="py-2 pl-2">{row.stats?.locked ?? 0}</td>
                    <td className="py-2 pl-2">{row.stats?.completed ?? 0}</td>
                    <td className="py-2">
                      {isPublished ? (
                        row.day > 1 ? (
                          <button
                            type="button"
                            disabled={busyDay === row.day}
                            className="edu-btn edu-btn-outline text-xs"
                            onClick={() => handleUnpublish(row.day)}
                          >
                            إغلاق مؤقت
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )
                      ) : (
                        <button
                          type="button"
                          disabled={busyDay === row.day}
                          className="edu-btn edu-btn-primary text-xs"
                          onClick={() => handlePublish(row.day)}
                        >
                          نشر {dayLabel(row.day)}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">
        يفتح اليوم التالي للطالب تلقائيًا عند إكماله اليوم السابق (إذا كان منشورًا). لا حاجة لتعديل Render أو
        إعادة نشر الموقع.
      </p>
    </EduCard>
  );
}

export function StudentDayUnlockActions({ studentId, dayUnlock, onUnlocked }) {
  const [dayNumber, setDayNumber] = useState(2);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUnlock() {
    setBusy(true);
    setMessage("");
    try {
      await teacherUnlockDayApi(studentId, dayNumber, reason || "فتح يدوي من لوحة المعلم");
      setMessage("تم فتح اليوم للطالب.");
      await onUnlocked?.();
    } catch (err) {
      setMessage(err.message || "تعذر الفتح اليدوي");
    } finally {
      setBusy(false);
    }
  }

  const lockedDays = Object.entries(dayUnlock?.dayUnlockMap || {})
    .filter(([, state]) => state === "locked")
    .map(([dayId]) => Number(dayId.replace("day-", "")))
    .filter((n) => Number.isFinite(n));

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-700">فتح يدوي لطالب</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select
          className="rounded border border-slate-200 px-2 py-1 text-xs"
          value={dayNumber}
          onChange={(e) => setDayNumber(Number(e.target.value))}
        >
          {(lockedDays.length ? lockedDays : [2, 3, 4, 5]).map((d) => (
            <option key={d} value={d}>
              اليوم {d}
            </option>
          ))}
        </select>
        <input
          className="min-w-[160px] flex-1 rounded border border-slate-200 px-2 py-1 text-xs"
          placeholder="سبب الفتح (اختياري)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button type="button" disabled={busy} className="edu-btn edu-btn-outline text-xs" onClick={handleUnlock}>
          {busy ? "جاري..." : "فتح اليوم"}
        </button>
      </div>
      {message ? <p className="mt-2 text-xs text-slate-600">{message}</p> : null}
    </div>
  );
}
