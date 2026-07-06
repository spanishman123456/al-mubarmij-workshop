import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";
import { curriculumDays } from "../data/curriculum15Days";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { MawhibaBrand } from "../components/branding/MawhibaBrand";
import { getAttendanceStatus, maskNationalId, defaultAnalytics } from "../lib/platformAnalytics";
import { defaultProgressForStudent } from "../lib/platformStore";
import { LtrValue, formatFraction, formatPercent } from "../components/LtrValue";
import { resolvePublishedDaysCount } from "../config/publication";

const QUICK_LINKS = [
  { to: "/path", title: "المسار الدراسي", desc: "15 يومًا من الدروس والأنشطة" },
  { to: "/python", title: "مختبر بايثون", desc: "تمارين نصية ومشاريع رسومية" },
  { to: "/worksheets", title: "أوراق العمل", desc: "تمارين نظرية وتطبيقية" },
  { to: "/quizzes", title: "الاختبارات", desc: "قبلي، قصير، وبعدي" },
  { to: "/simulations", title: "المحاكاة", desc: "معمل تفاعلي للمفاهيم" },
  { to: "/projects", title: "المشروع النهائي", desc: "مخرج الأسبوع الثالث" },
  { to: "/projects#microbit-game-lab", title: "مشاريع micro:bit", desc: "MakeCode Python — 9 مشاريع منهجية" },
];

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return (
      <LtrValue>{new Date(iso).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}</LtrValue>
    );
  } catch {
    return "—";
  }
}

function DashboardLoading() {
  return (
    <PageShell title="لوحة الطالب" badge="جاري التحميل">
      <EduCard className="py-12 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-300 border-t-violet-700" />
        <p className="mt-4 text-base font-semibold text-slate-700">جاري تحميل بيانات الطالب...</p>
      </EduCard>
    </PageShell>
  );
}

function DashboardError({ onLogout }) {
  return (
    <PageShell title="لوحة الطالب" badge="خطأ">
      <EduCard className="py-10 text-center" accent="amber">
        <p className="text-base font-semibold text-red-700">
          تعذر تحميل بيانات الطالب. الرجاء تسجيل الخروج والمحاولة مرة أخرى.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onLogout} className="edu-btn edu-btn-primary">
            تسجيل الخروج
          </button>
          <Link to="/login" className="edu-btn edu-btn-outline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </EduCard>
    </PageShell>
  );
}

export default function StudentDashboard() {
  const {
    user,
    authReady,
    myStats,
    myProgress,
    myAnalytics,
    logout,
    progressSyncStatus: syncStatusRaw,
  } = usePlatform();
  const publishedDays = resolvePublishedDaysCount(myStats);
  const progressSyncStatus = syncStatusRaw ?? {
    loading: false,
    saving: false,
    error: null,
    fetchedAt: null,
  };

  if (!authReady) {
    return <DashboardLoading />;
  }

  if (!user || user.role !== "student") {
    return <Navigate to="/login" replace />;
  }

  const progress = myProgress ?? defaultProgressForStudent(user.id);
  const analytics = myAnalytics ?? defaultAnalytics();

  const pre = progress.preTest?.percent;
  const post = progress.postTest?.percent;
  const growth = pre != null && post != null ? post - pre : null;
  const attendanceRaw = myStats?.attendanceStatus || getAttendanceStatus(analytics, myStats);
  const attendance =
    attendanceRaw?.label && attendanceRaw?.color
      ? attendanceRaw
      : getAttendanceStatus(analytics, myStats);
  const wsPending = Object.entries(progress.worksheetStatus || {}).filter(
    ([, s]) => s !== "completed",
  ).length;
  const teacherNote = analytics.teacherNotes ?? "";
  const recentDays = curriculumDays
    .filter((d) => !(progress.completedDays || []).includes(d.id))
    .slice(0, 3);

  const completedLessons = myStats?.completedLessons ?? 0;
  const totalLessons = myStats?.totalPublishedLessons ?? 9;
  const requiredDone = myStats?.completedRequiredItems ?? 0;
  const requiredTotal = myStats?.requiredItems ?? 0;
  const pythonRuns = myStats?.pythonRuns ?? analytics.pythonRuns ?? 0;
  const pythonSaved = myStats?.pythonSnippetsCount ?? progress.pythonSnippets?.length ?? 0;
  const progressDetails = myStats?.details ?? [];
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const completedItems = progressDetails.filter((d) => d.status === "completed");
  const pendingItems = progressDetails.filter((d) => d.status !== "completed");

  return (
    <PageShell
      title={`مرحبًا، ${user.nameAr}`}
      subtitle="منصة برمجة الحاسب — برنامج موهبة الإثرائي"
      badge="لوحة الطالب"
      hero={
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
        >
          خروج
        </button>
      }
    >
      <EduCard className="mb-6 flex flex-wrap items-center justify-center gap-6" accent="violet">
        <MawhibaBrand variant="vertical" />
        <img src="/images/mawhiba/mawhiba-banner.png" alt="موهبة" className="h-16 object-contain" />
      </EduCard>

      <EduCard className="mb-4" accent="cyan">
        <div className="flex flex-wrap gap-4 text-sm text-slate-700">
          <p>
            <span className="font-bold text-slate-900">الهوية: </span>
            <LtrValue>{maskNationalId(user.nationalId)}</LtrValue>
          </p>
          <p>
            <span className="font-bold text-slate-900">الصف: </span>
            {user.grade ?? "6-8"}
          </p>
          <p>
            <span className="font-bold text-slate-900">الوحدة: </span>
            {user.unitAr ?? "برمجة الحاسب"}
          </p>
        </div>
      </EduCard>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${attendance.color}`}>{attendance.label}</span>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
          آخر نشاط: {formatDate(analytics.lastActivityAt)}
        </span>
        {progressSyncStatus.fetchedAt ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            آخر تحديث: {formatDate(progressSyncStatus.fetchedAt)}
          </span>
        ) : null}
        {progressSyncStatus.saving ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">جاري الحفظ...</span>
        ) : null}
      </div>

      <EduCard accent="violet">
        <ProgressBar value={myStats?.overallPercent ?? 0} label="التقدم في المحتوى المتاح" />
        {requiredTotal > 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            أكملت{" "}
            <LtrValue>{formatFraction(requiredDone, requiredTotal)}</LtrValue> عناصر إلزامية —{" "}
            <LtrValue>{formatPercent(myStats?.overallPercent ?? 0)}</LtrValue>
          </p>
        ) : null}
        {myStats?.pathProgress?.pathLabelAr ? (
          <p className="mt-1 text-xs text-slate-500">{myStats.pathProgress.pathLabelAr}</p>
        ) : null}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            label="الدروس المكتملة (منشورة)"
            value={
              totalLessons > 0 && completedLessons === 0 && progressDetails.length > 0 ? (
                <span className="text-sm">لم تُسجَّل دروس مكتملة بعد</span>
              ) : (
                <LtrValue>{formatFraction(completedLessons, totalLessons)}</LtrValue>
              )
            }
          />
          <Stat label="أوراق العمل المنجزة" value={<LtrValue>{myStats?.worksheetsDone ?? 0}</LtrValue>} />
          <Stat label="أوراق معلّقة" value={<LtrValue>{wsPending}</LtrValue>} />
          <Stat label="تشغيلات بايثون" value={<LtrValue>{pythonRuns}</LtrValue>} />
          <Stat label="أكواد بايثون محفوظة" value={<LtrValue>{pythonSaved}</LtrValue>} />
          <Stat label="مشاريع رسومية" value={<LtrValue>{progress.graphicProjects?.length ?? 0}</LtrValue>} />
          <Stat
            label="التقويم القبلي (تشخيصي)"
            value={
              myStats?.preAssessmentLabelAr ||
              (pre != null ? <LtrValue>{formatPercent(pre)}</LtrValue> : "لم يُجرَ")
            }
          />
          <Stat
            label="التقويم البعدي"
            value={post != null ? <LtrValue>{formatPercent(post)}</LtrValue> : "لم يُجرَ"}
          />
          <Stat
            label="نمو الأداء"
            value={
              growth != null ? (
                <LtrValue>{growth >= 0 ? `+${growth}%` : `${growth}%`}</LtrValue>
              ) : (
                "—"
              )
            }
          />
          <Stat label="المشروع النهائي" value={progress.project?.status ?? "لم يبدأ"} />
          <Stat
            label="مشاريع micro:bit"
            value={<LtrValue>{formatFraction(myStats?.microbitDone ?? 0, 9)}</LtrValue>}
          />
          <Stat label="عدد الدخول" value={<LtrValue>{analytics.loginCount ?? 0}</LtrValue>} />
        </div>
        {myStats?.pythonActivityNoteAr ? (
          <p className="mt-3 text-xs text-slate-500">{myStats.pythonActivityNoteAr}</p>
        ) : null}
        {progressDetails.length > 0 ? (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              type="button"
              className="text-sm font-semibold text-violet-700 hover:underline"
              onClick={() => setShowProgressDetails((v) => !v)}
            >
              {showProgressDetails ? "إخفاء تفاصيل التقدم" : "عرض تفاصيل التقدم"}
            </button>
            {showProgressDetails ? (
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-bold text-emerald-800">العناصر المكتملة:</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {completedItems.length ? (
                      completedItems.map((item) => (
                        <li key={item.id}>
                          {item.icon} {item.labelAr}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">لا يوجد بعد</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">العناصر غير المكتملة:</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {pendingItems.length ? (
                      pendingItems.map((item) => (
                        <li key={item.id}>
                          {item.icon} {item.labelAr}
                          {item.status === "in_progress" ? " (قيد التنفيذ)" : ""}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">أكملت كل العناصر المنشورة</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </EduCard>

      {teacherNote ? (
        <EduCard className="mt-6" title="ملاحظة من المعلم" accent="amber">
          <p className="edu-text">{teacherNote}</p>
        </EduCard>
      ) : null}

      <EduCard className="mt-6" title="مهام اليوم" accent="cyan">
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {recentDays.length ? (
            recentDays.map((d) => (
              <li key={d.id}>
                <Link to={`/path/day/${d.id}`} className="font-semibold text-violet-700 hover:underline">
                  أكمل {d.titleAr}
                </Link>
              </li>
            ))
          ) : (
            <li className="font-semibold text-emerald-700">أحسنت! أكملت جميع الدروس الأساسية.</li>
          )}
          <li>
            <Link to="/simulations" className="text-violet-700 hover:underline">
              جرّب محاكاة جديدة في المعمل التفاعلي
            </Link>
          </li>
        </ul>
      </EduCard>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((item) => (
          <Link key={item.to} to={item.to} className="edu-card block hover:scale-[1.02]">
            <h2 className="edu-card-title">{item.title}</h2>
            <p className="edu-card-subtitle">{item.desc}</p>
          </Link>
        ))}
      </div>

      <EduCard className="mt-8" title="آخر الدروس المتاحة" accent="cyan">
        <ul className="mt-3 space-y-2">
          {curriculumDays.slice(0, publishedDays).map((d) => {
            const done = (progress.completedDays || []).includes(d.id);
            return (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <Link to={`/path/day/${d.id}`} className="font-medium text-violet-700 hover:underline">
                  {d.titleAr}
                </Link>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    done ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {done ? "مكتمل" : "متاح"}
                </span>
              </li>
            );
          })}
        </ul>
      </EduCard>
    </PageShell>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
