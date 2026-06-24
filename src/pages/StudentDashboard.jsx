import { Link, Navigate } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";
import { curriculumDays } from "../data/curriculum15Days";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { MawhibaBrand } from "../components/branding/MawhibaBrand";
import { getAttendanceStatus, maskNationalId } from "../lib/platformAnalytics";

const QUICK_LINKS = [
  { to: "/path", title: "المسار الدراسي", desc: "15 يومًا من الدروس والأنشطة" },
  { to: "/python", title: "مختبر بايثون", desc: "اكتب واحفظ أكوادك" },
  { to: "/worksheets", title: "أوراق العمل", desc: "تمارين نظرية وتطبيقية" },
  { to: "/quizzes", title: "الاختبارات", desc: "قبلي، قصير، وبعدي" },
  { to: "/simulations", title: "المحاكاة", desc: "معمل تفاعلي للمفاهيم" },
  { to: "/projects", title: "المشروع النهائي", desc: "مخرج الأسبوع الثالث" },
  { to: "/microbit", title: "مشاريع micro:bit", desc: "تطبيق المنهج على micro:bit" },
];

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" });
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
  const { user, authReady, myStats, myProgress, myAnalytics, logout } = usePlatform();

  if (!authReady) {
    return <DashboardLoading />;
  }

  if (!user || user.role !== "student") {
    return <Navigate to="/login" replace />;
  }

  const pre = myProgress.preTest?.percent;
  const post = myProgress.postTest?.percent;
  const growth = pre != null && post != null ? post - pre : null;
  const attendance = getAttendanceStatus(myAnalytics, myStats);
  const wsPending = Object.entries(myProgress.worksheetStatus || {}).filter(
    ([, s]) => s !== "completed",
  ).length;
  const teacherNote = myAnalytics.teacherNotes;
  const recentDays = curriculumDays
    .filter((d) => !(myProgress.completedDays || []).includes(d.id))
    .slice(0, 3);

  return (
    <PageShell
      title={`مرحبًا، ${user.nameAr}`}
      subtitle="منصة برمجة الحاسب — برنامج موهبة الأكاديمي"
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
            {maskNationalId(user.nationalId)}
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
          آخر نشاط: {formatDate(myAnalytics.lastActivityAt)}
        </span>
      </div>

      <EduCard accent="violet">
        <ProgressBar value={myStats?.overallPercent ?? 0} label="التقدم العام في المنهج" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="الدروس المكتملة" value={`${myStats?.completedDays ?? 0} / ${myStats?.totalDays ?? 15}`} />
          <Stat label="أوراق العمل المنجزة" value={myStats?.worksheetsDone ?? 0} />
          <Stat label="أوراق معلّقة" value={wsPending} />
          <Stat label="أكواد بايثون" value={myProgress.pythonSnippets?.length ?? 0} />
          <Stat label="التقويم القبلي" value={pre != null ? `${pre}%` : "لم يُجرَ"} />
          <Stat label="التقويم البعدي" value={post != null ? `${post}%` : "لم يُجرَ"} />
          <Stat label="نمو الأداء" value={growth != null ? (growth >= 0 ? `+${growth}%` : `${growth}%`) : "—"} />
          <Stat label="المشروع النهائي" value={myProgress.project?.status ?? "لم يبدأ"} />
          <Stat label="مشاريع micro:bit" value={`${myStats?.microbitDone ?? 0} / 9`} />
          <Stat label="عدد الدخول" value={myAnalytics.loginCount ?? 0} />
        </div>
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
          {curriculumDays.slice(0, 5).map((d) => {
            const done = (myProgress.completedDays || []).includes(d.id);
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
