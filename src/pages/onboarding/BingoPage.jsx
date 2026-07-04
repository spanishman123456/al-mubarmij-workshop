import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";
import { BINGO_CELLS } from "../../content/onboarding/onboardingContent";
import { fetchOnboardingStatus, saveBingoApi } from "../../lib/platformApi";
import { PageShell, EduCard } from "../../components/layout/PageShell";

export default function BingoPage() {
  const { user } = usePlatform();
  const [cells, setCells] = useState({});
  const [status, setStatus] = useState("not_started");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fillable = BINGO_CELLS.filter((c) => !c.free);
  const filledCount = fillable.filter((c) => String(cells[c.id] || "").trim()).length;
  const percent = Math.round((filledCount / fillable.length) * 100);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetchOnboardingStatus(user.id);
      setCells(res.bingo?.cells || {});
      setStatus(res.bingo?.status || "not_started");
    } catch {
      /* local only fallback */
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function persist(nextCells, nextStatus, submitted = false) {
    if (!user?.id) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await saveBingoApi(user.id, {
        cells: nextCells,
        status: nextStatus,
        startedAt: status === "not_started" ? now : undefined,
        completedAt: nextStatus === "completed" ? now : undefined,
        submittedAt: submitted ? now : undefined,
      });
      setStatus(nextStatus);
      setMessage(submitted ? "تم إرسال النشاط بنجاح." : "تم الحفظ.");
    } catch {
      setMessage("تعذّر الحفظ على الخادم — تحقق من الاتصال.");
    } finally {
      setSaving(false);
    }
  }

  function updateCell(id, value) {
    const next = { ...cells, [id]: value };
    setCells(next);
    const nextStatus = filledCount + (value.trim() ? 1 : 0) >= fillable.length ? "completed" : "in_progress";
    persist(next, nextStatus);
  }

  const rowComplete = useMemo(() => {
    const wins = [];
    for (let r = 0; r < 5; r++) {
      const rowIds = BINGO_CELLS.slice(r * 5, r * 5 + 5).filter((c) => !c.free).map((c) => c.id);
      if (rowIds.every((id) => String(cells[id] || "").trim())) wins.push(`صف ${r + 1}`);
    }
    for (let col = 0; col < 5; col++) {
      const colIds = [0, 1, 2, 3, 4].map((r) => BINGO_CELLS[r * 5 + col]).filter((c) => !c.free).map((c) => c.id);
      if (colIds.every((id) => String(cells[id] || "").trim())) wins.push(`عمود ${col + 1}`);
    }
    return wins;
  }, [cells]);

  return (
    <PageShell title="نشاط BINGO — كسر الجليد" subtitle="ابحث عن زميل في الصف تنطبق عليه كل صفة">
      <Link to="/onboarding" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← العودة للتمهيد
      </Link>
      <EduCard accent="violet">
        <p className="mb-2 text-sm text-slate-600">نسبة الإنجاز: {percent}% ({filledCount}/{fillable.length})</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {BINGO_CELLS.map((cell) => (
            <div
              key={cell.id}
              className={`rounded-lg border p-2 ${cell.free ? "border-dashed bg-violet-50" : "border-slate-200 bg-white"}`}
            >
              <p className="mb-2 min-h-[3rem] text-xs font-medium text-slate-800">{cell.labelAr}</p>
              {cell.free ? (
                <span className="text-xs text-violet-600">★ مجاني</span>
              ) : (
                <input
                  className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                  placeholder="اسم زميل"
                  value={cells[cell.id] || ""}
                  onChange={(e) => updateCell(cell.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        {rowComplete.length ? (
          <p className="mt-3 text-sm font-semibold text-emerald-700">أكملت: {rowComplete.join("، ")}</p>
        ) : null}
        {message ? <p className="mt-2 text-sm text-slate-600">{message}</p> : null}
        <button
          type="button"
          disabled={saving || filledCount < fillable.length}
          className="edu-btn edu-btn-primary mt-4 disabled:opacity-50"
          onClick={() => persist(cells, "submitted", true)}
        >
          {saving ? "جاري الإرسال..." : "إرسال النشاط"}
        </button>
        <p className="mt-2 text-xs text-slate-500">الحالة: {status === "submitted" ? "تم التسليم" : status === "completed" ? "مكتمل" : status === "in_progress" ? "قيد التنفيذ" : "لم يبدأ"}</p>
      </EduCard>
    </PageShell>
  );
}
