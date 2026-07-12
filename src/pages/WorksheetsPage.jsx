import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { curriculumUnits } from "../data/curriculum";
import { worksheets, worksheetsIntroAr } from "../data/worksheets";
import { worksheets15Days } from "../data/worksheets15Days";
import { WEEKS_15 } from "../data/curriculum15Days";
import { usePlatform } from "../context/PlatformContext";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { ArabicText } from "../components/BilingualTextBlocks";
import { isTeacherRole, TEACHER_PREVIEW_BADGE_AR } from "../config/publication";
import {
  getTeacherWorksheetBadge,
  getWorksheetAccessState,
  studentWorksheetLockedMessage,
  WorksheetAccessState,
} from "../lib/worksheetAccess";

function unitTitle(unitId) {
  return curriculumUnits.find((u) => u.id === unitId)?.titleAr ?? unitId;
}

export default function WorksheetsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { myProgress, user, myStats } = usePlatform();
  const wsStatus = myProgress?.worksheetStatus ?? {};
  const isTeacher = isTeacherRole(user?.role);
  const dayUnlockMap = myStats?.dayUnlock?.dayUnlockMap;

  const view = searchParams.get("view") === "units" ? "units" : "path";
  const weekFilter = Number(searchParams.get("week")) || 0;
  const unitParam = searchParams.get("unit");
  const unitFilter =
    unitParam && curriculumUnits.some((u) => u.id === unitParam) ? unitParam : "all";

  const pathList = useMemo(() => {
    let list = worksheets15Days.map((ws) => {
      const access = getWorksheetAccessState({
        role: user?.role,
        dayId: ws.dayId,
        dayUnlockMap,
        myStats,
      });
      return { ws, access };
    });

    if (!isTeacher) {
      list = list.filter(
        ({ access }) => access === WorksheetAccessState.OPEN || access === WorksheetAccessState.LOCKED,
      );
    }

    if (weekFilter > 0) {
      list = list.filter(({ ws }) => ws.weekNumber === weekFilter);
    }
    return list;
  }, [weekFilter, user?.role, dayUnlockMap, myStats, isTeacher]);

  const unitList = useMemo(() => {
    if (unitFilter === "all") return worksheets;
    return worksheets.filter((w) => w.unitId === unitFilter);
  }, [unitFilter]);

  return (
    <PageShell
      title="أوراق العمل"
      subtitle={`${worksheetsIntroAr} مرتبطة بمسار 15 يومًا ووحدات المنهج الرسمي.`}
      badge={isTeacher ? `${worksheets15Days.length} ورقة — معاينة المعلم` : `${pathList.length} ورقة متاحة`}
    >
      {isTeacher ? (
        <EduCard className="mb-6" accent="amber">
          <p className="text-sm font-semibold text-amber-900">{TEACHER_PREVIEW_BADGE_AR}</p>
          <p className="mt-1 text-sm text-amber-800">
            ترى كل أوراق العمل في المنهج — الأيام غير المنشورة للطلاب تظهر كمعاينة معلم فقط.
          </p>
        </EduCard>
      ) : null}

      <div className="no-print mb-8 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${view === "path" ? "bg-violet-600 text-white" : "text-slate-600"}`}
          >
            مسار 15 يومًا
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ view: "units" })}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${view === "units" ? "bg-violet-600 text-white" : "text-slate-600"}`}
          >
            حسب الوحدة
          </button>
        </div>

        {view === "path" ? (
          <select
            value={weekFilter}
            onChange={(e) => {
              const w = e.target.value;
              setSearchParams(w === "0" ? {} : { week: w });
            }}
            className="edu-select w-auto"
          >
            <option value={0}>كل الأسابيع</option>
            {WEEKS_15.map((w) => (
              <option key={w.id} value={w.weekNumber}>
                الأسبوع {w.weekNumber}
              </option>
            ))}
          </select>
        ) : (
          <select
            value={unitFilter}
            onChange={(e) => {
              const v = e.target.value;
              setSearchParams(v === "all" ? { view: "units" } : { view: "units", unit: v });
            }}
            className="edu-select w-auto"
          >
            <option value="all">كل الوحدات</option>
            {curriculumUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.titleAr}
              </option>
            ))}
          </select>
        )}

        <button type="button" onClick={() => window.print()} className="edu-btn edu-btn-outline text-sm">
          طباعة الصفحة
        </button>
      </div>

      {view === "path" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="worksheets-path-grid">
          {pathList.map(({ ws, access }) => {
            const st = wsStatus[ws.id] ?? "not_started";
            const locked = access === WorksheetAccessState.LOCKED;
            const teacherBadge = isTeacher ? getTeacherWorksheetBadge(ws.dayId, myStats) : null;
            return (
              <WorksheetCard
                key={ws.id}
                badge={`اليوم ${ws.dayNumber}`}
                title={ws.titleAr}
                topic={ws.topicAr}
                count={ws.tasks.length}
                status={st}
                to={locked ? undefined : `/worksheets/${ws.id}`}
                locked={locked}
                lockedMessage={studentWorksheetLockedMessage(ws.dayId, dayUnlockMap)}
                publishBadge={teacherBadge}
                testId={`worksheet-card-${ws.id}`}
              />
            );
          })}
        </div>
      ) : (
        <ul className="space-y-8 print:space-y-6">
          {unitList.map((ws) => (
            <li key={ws.id} className="print-area edu-card">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <p className="text-xs font-medium text-violet-600">{unitTitle(ws.unitId)}</p>
                  <h2 className="text-xl font-bold text-slate-900">{ws.titleAr}</h2>
                </div>
                <button type="button" onClick={() => window.print()} className="no-print edu-btn edu-btn-ghost text-sm">
                  طباعة
                </button>
              </div>
              <ArabicText text={ws.introAr} className="text-slate-700" />
              <ol className="mt-6 space-y-6">
                {ws.tasks.map((task) => (
                  <li key={task.n}>
                    <p className="font-bold text-violet-800">السؤال {task.n}.</p>
                    <ArabicText text={task.textAr} className="mt-2 text-slate-800" />
                    <div className="mt-4 border-b border-dashed border-slate-300 pb-10" />
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}

function WorksheetCard({
  badge,
  title,
  topic,
  count,
  status,
  to,
  locked,
  lockedMessage,
  publishBadge,
  testId,
}) {
  const statusLabel = {
    completed: { text: "مكتملة ✓", cls: "bg-emerald-100 text-emerald-800" },
    in_progress: { text: "قيد العمل", cls: "bg-amber-100 text-amber-800" },
    not_started: { text: "لم تبدأ", cls: "bg-slate-100 text-slate-600" },
  }[status] ?? { text: status, cls: "bg-slate-100 text-slate-600" };

  return (
    <div data-testid={testId} className="h-full">
      <EduCard accent="amber" className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-800">{badge}</span>
        <div className="flex flex-col items-end gap-1">
          {publishBadge ? (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${publishBadge.cls}`}>
              {publishBadge.label}
            </span>
          ) : null}
          {locked ? (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">مقفل</span>
          ) : (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusLabel.cls}`}>
              {statusLabel.text}
            </span>
          )}
        </div>
      </div>
      <h3 className="mt-3 font-bold text-slate-900 line-clamp-2">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{topic}</p>
      <p className="mt-2 text-xs text-slate-500">{count} أسئلة</p>
      {locked ? (
        <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-700">
          {lockedMessage}
        </p>
      ) : null}
      <div className="mt-auto flex gap-2 pt-4">
        {to ? (
          <Link to={to} className="edu-btn edu-btn-primary flex-1 text-center text-sm">
            فتح
          </Link>
        ) : (
          <span className="edu-btn edu-btn-outline flex-1 cursor-not-allowed text-center text-sm opacity-60">مقفل</span>
        )}
      </div>
      </EduCard>
    </div>
  );
}
