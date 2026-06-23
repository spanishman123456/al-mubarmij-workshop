import { Link } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { PrePostComparisonChart } from "../components/charts/PrePostComparisonChart";
import { MawhibaBrand } from "../components/branding/MawhibaBrand";
import { maskNationalId, getAccountStatus, getAttendanceStatus } from "../lib/platformAnalytics";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "—";
  }
}

export default function TeacherDashboard() {
  const { user, allStudentsProgress, logout, teacherSetNote } = usePlatform();

  if (!user || user.role !== "teacher") {
    return (
      <PageShell title="لوحة المعلم">
        <EduCard className="text-center">
          <p className="edu-text">يجب تسجيل الدخول كمعلم للوصول إلى لوحة التحكم.</p>
          <Link to="/login" className="edu-btn edu-btn-primary mt-4 inline-flex">
            تسجيل الدخول
          </Link>
        </EduCard>
      </PageShell>
    );
  }

  const avg =
    allStudentsProgress.reduce((s, x) => s + x.stats.overallPercent, 0) /
    Math.max(allStudentsProgress.length, 1);
  const neverLogged = allStudentsProgress.filter((x) => !x.analytics?.loginCount);
  const presentToday = allStudentsProgress.filter((x) => {
    const today = new Date().toISOString().slice(0, 10);
    return x.analytics?.dailyLog?.[today]?.entered;
  });
  const needsFollowup = allStudentsProgress.filter(
    (x) => getAttendanceStatus(x.analytics, x.stats).key === "needs_followup",
  );

  return (
    <PageShell
      title="لوحة المعلم"
      subtitle={`${user.nameAr} — متابعة تقدم ونشاط طلاب برمجة الحاسب`}
      badge="برنامج موهبة"
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
      <EduCard className="mb-6 flex flex-wrap items-center justify-between gap-4" accent="violet">
        <MawhibaBrand variant="horizontal" />
        <img
          src="/images/mawhiba/mawhiba-banner.png"
          alt="موهبة"
          className="hidden h-14 object-contain sm:block"
        />
      </EduCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard value={allStudentsProgress.length} label="إجمالي الطلاب" color="violet" />
        <SummaryCard value={`${Math.round(avg)}%`} label="متوسط التقدم" color="emerald" />
        <SummaryCard value={presentToday.length} label="حاضرون اليوم" color="cyan" />
        <SummaryCard value={neverLogged.length} label="لم يسجلوا بعد" color="amber" />
        <SummaryCard value={needsFollowup.length} label="يحتاجون متابعة" color="amber" />
      </div>

      <PrePostComparisonChart className="mt-8" students={allStudentsProgress} />

      <section className="mt-10 space-y-5">
        <h2 className="text-xl font-bold text-slate-900">متابعة الطلاب — {allStudentsProgress.length} طالب</h2>
        {allStudentsProgress.map(({ student, progress, analytics, stats }) => {
          const account = getAccountStatus(analytics);
          const attendance = getAttendanceStatus(analytics, stats);
          const wsCount = Object.values(progress.worksheetStatus || {}).filter((s) => s === "completed").length;
          const quizCount = Object.keys(progress.quizScores || {}).length;
          const simRuns = Object.values(analytics?.simRuns || {}).reduce((a, b) => a + b, 0);
          const pagesCount = Object.values(analytics?.pagesVisited || {}).reduce((a, b) => a + b, 0);

          return (
            <EduCard key={student.id} accent="violet">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{student.nameAr}</h3>
                  <p className="text-sm text-slate-600">هوية: {maskNationalId(student.nationalId)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {account.label}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${attendance.color}`}>
                    {attendance.label}
                  </span>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-800">
                    {stats.overallPercent}%
                  </span>
                </div>
              </div>

              <ProgressBar className="mt-4" value={stats.overallPercent} label="نسبة التقدم العامة" />

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Info label="آخر دخول" value={formatDate(analytics?.lastLoginAt)} />
                <Info label="عدد الدخول" value={analytics?.loginCount ?? 0} />
                <Info label="آخر نشاط" value={formatDate(analytics?.lastActivityAt)} />
                <Info label="الصفحات المزارة" value={pagesCount} />
                <Info label="الدروس" value={`${stats.completedDays}/${stats.totalDays}`} />
                <Info label="أوراق العمل" value={wsCount} />
                <Info label="الاختبارات" value={quizCount} />
                <Info label="المحاكاة" value={simRuns} />
                <Info label="تشغيل بايثون" value={analytics?.pythonRuns ?? 0} />
                <Info label="المشروع" value={progress.project?.status ?? "لم يبدأ"} />
                <Info
                  label="قبلي → بعدي"
                  value={`${progress.preTest?.percent ?? "—"}% → ${progress.postTest?.percent ?? "—"}%`}
                />
                <Info label="الأنشطة المكتملة" value={analytics?.activitiesCompleted ?? 0} />
              </div>

              {analytics?.teacherNotes ? (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                  ملاحظة المعلم: {analytics.teacherNotes}
                </p>
              ) : null}

              <button
                type="button"
                className="edu-btn edu-btn-outline mt-4 text-xs"
                onClick={() =>
                  teacherSetNote(student.id, "يُنصح بمتابعة إكمال أوراق العمل والمحاكاة اليومية.")
                }
              >
                إضافة ملاحظة للطالب
              </button>
            </EduCard>
          );
        })}
      </section>
    </PageShell>
  );
}

function SummaryCard({ value, label, color }) {
  const bg = {
    violet: "bg-violet-50 border-violet-200 text-violet-900",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    cyan: "bg-cyan-50 border-cyan-200 text-cyan-900",
  }[color];
  return (
    <div className={`rounded-xl border p-5 ${bg}`}>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm font-medium opacity-80">{label}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}
