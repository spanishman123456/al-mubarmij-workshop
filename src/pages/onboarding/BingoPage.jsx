import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";
import { BINGO_CELLS } from "../../content/onboarding/onboardingContent";
import {
  assertValidBingoContent,
  BINGO_INSTRUCTIONS_AR,
  BINGO_TITLE_AR,
  computeBingoProgress,
  createInitialBingoStudentState,
  listCompletedBingoLines,
  normalizeBingoStudentState,
} from "../../content/onboarding/validateBingoContent";
import { fetchOnboardingStatus, saveBingoApi } from "../../lib/platformApi";
import { PageShell, EduCard } from "../../components/layout/PageShell";

assertValidBingoContent(BINGO_CELLS);

function logBingoClient(event, detail = {}) {
  console.info(
    JSON.stringify({
      scope: "bingo.page",
      event,
      path: "/onboarding/bingo",
      at: new Date().toISOString(),
      ...detail,
    }),
  );
}

export default function BingoPage() {
  const { user } = usePlatform();
  const [bingoState, setBingoState] = useState(createInitialBingoStudentState);
  const [loadState, setLoadState] = useState("loading");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const { fillable, filledCount, percent, totalFillable } = useMemo(
    () => computeBingoProgress(BINGO_CELLS, bingoState.cells),
    [bingoState.cells],
  );

  const rowComplete = useMemo(
    () => listCompletedBingoLines(BINGO_CELLS, bingoState.cells),
    [bingoState.cells],
  );

  const load = useCallback(async () => {
    if (!user?.id) {
      setLoadState("ready");
      return;
    }
    setLoadState("loading");
    try {
      const res = await fetchOnboardingStatus(user.id);
      setBingoState(normalizeBingoStudentState(res.bingo));
      setLoadState("ready");
    } catch (err) {
      logBingoClient("load_failed", { status: err?.status, errorType: err?.message });
      setBingoState(createInitialBingoStudentState());
      setLoadState(err?.status === 401 ? "session" : "error");
      setMessage(
        err?.status === 401
          ? "انتهت الجلسة، يرجى تسجيل الدخول مجددًا."
          : "تعذر الاتصال بالخادم، حاول مرة أخرى.",
      );
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
        startedAt: bingoState.status === "not_started" ? now : undefined,
        completedAt: nextStatus === "completed" ? now : undefined,
        submittedAt: submitted ? now : undefined,
      });
      setBingoState((prev) => ({
        ...prev,
        cells: nextCells,
        status: nextStatus,
        startedAt: prev.startedAt || (prev.status === "not_started" ? now : prev.startedAt),
        completedAt: nextStatus === "completed" ? now : prev.completedAt,
        submittedAt: submitted ? now : prev.submittedAt,
      }));
      setMessage(submitted ? "تم إرسال النشاط بنجاح." : "تم حفظ تقدمك.");
      logBingoClient("save_ok", { status: nextStatus, submitted });
    } catch (err) {
      logBingoClient("save_failed", { status: err?.status, errorType: err?.message });
      setMessage("تعذر حفظ آخر تعديل — تحقق من الاتصال.");
    } finally {
      setSaving(false);
    }
  }

  function updateCell(id, value) {
    const nextCells = { ...bingoState.cells, [id]: value };
    setBingoState((prev) => ({ ...prev, cells: nextCells }));
    const { filledCount: nextFilled } = computeBingoProgress(BINGO_CELLS, nextCells);
    const nextStatus =
      nextFilled >= totalFillable ? "completed" : bingoState.status === "not_started" ? "in_progress" : "in_progress";
    persist(nextCells, nextStatus);
  }

  if (loadState === "loading") {
    return (
      <PageShell title={BINGO_TITLE_AR} subtitle={BINGO_INSTRUCTIONS_AR}>
        <EduCard className="py-10 text-center">
          <p className="text-base font-semibold text-slate-700">جاري تحميل النشاط...</p>
        </EduCard>
      </PageShell>
    );
  }

  if (loadState === "session") {
    return (
      <PageShell title={BINGO_TITLE_AR}>
        <EduCard accent="amber">
          <p className="text-base font-semibold text-slate-800">{message}</p>
          <Link to="/login" className="edu-btn edu-btn-primary mt-4 inline-flex">
            تسجيل الدخول
          </Link>
        </EduCard>
      </PageShell>
    );
  }

  const status = bingoState.status;

  return (
    <PageShell title={BINGO_TITLE_AR} subtitle={BINGO_INSTRUCTIONS_AR}>
      <Link to="/onboarding" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← العودة للتمهيد
      </Link>
      {loadState === "error" ? (
        <EduCard accent="amber" className="mb-4">
          <p className="text-sm text-amber-900">{message}</p>
          <button type="button" className="edu-btn edu-btn-outline mt-3 text-sm" onClick={load}>
            إعادة المحاولة
          </button>
        </EduCard>
      ) : null}
      <EduCard accent="violet">
        <p className="mb-2 text-sm text-slate-600">
          نسبة الإنجاز: {percent}% ({filledCount}/{totalFillable})
        </p>
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
                  value={bingoState.cells[cell.id] || ""}
                  onChange={(e) => updateCell(cell.id, e.target.value)}
                  aria-label={cell.labelAr}
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
          disabled={saving || filledCount < totalFillable}
          className="edu-btn edu-btn-primary mt-4 disabled:opacity-50"
          onClick={() => persist(bingoState.cells, "submitted", true)}
        >
          {saving ? "جاري الإرسال..." : "إرسال النشاط"}
        </button>
        <p className="mt-2 text-xs text-slate-500">
          الحالة:{" "}
          {status === "submitted"
            ? "تم التسليم"
            : status === "completed"
              ? "مكتمل"
              : status === "in_progress"
                ? "قيد التنفيذ"
                : "لم يبدأ"}
        </p>
      </EduCard>
    </PageShell>
  );
}
