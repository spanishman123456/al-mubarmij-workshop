import { Link } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";
import { curriculumDays } from "../data/curriculum15Days";
import { PageShell, EduCard } from "../components/layout/PageShell";

const QUICK_LINKS = [
  { to: "/path", title: "المسار الدراسي", desc: "15 يومًا من الدروس والأنشطة", color: "violet" },
  { to: "/python", title: "مختبر بايثون", desc: "اكتب واحفظ أكوادك", color: "emerald" },
  { to: "/worksheets", title: "أوراق العمل", desc: "تمارين نظرية وتطبيقية", color: "amber" },
  { to: "/quizzes", title: "الاختبارات", desc: "قبلي، قصير، وبعدي", color: "cyan" },
  { to: "/simulations", title: "المحاكاة", desc: "معمل تفاعلي للمفاهيم", color: "violet" },
  { to: "/projects", title: "المشروع النهائي", desc: "مخرج الأسبوع الثالث", color: "emerald" },
];

export default function StudentDashboard() {
  const { user, myStats, myProgress, logout } = usePlatform();

  if (!user || user.role !== "student") {
    return (
      <PageShell title="لوحة الطالب">
        <EduCard className="text-center">
          <p className="edu-text">يجب تسجيل الدخول كطالب للوصول إلى لوحة التحكم.</p>
          <Link to="/login" className="edu-btn edu-btn-primary mt-4 inline-flex">
            تسجيل الدخول
          </Link>
        </EduCard>
      </PageShell>
    );
  }

  const pre = myProgress?.preTest?.percent;
  const post = myProgress?.postTest?.percent;
  const growth = pre != null && post != null ? post - pre : null;

  return (
    <PageShell
      title={`مرحبًا، ${user.nameAr}`}
      subtitle={`الصف ${user.grade} — تابع تقدمك في منهج برمجة الحاسب`}
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
      <EduCard accent="violet">
        <ProgressBar value={myStats?.overallPercent ?? 0} label="التقدم العام في المنهج" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="الدروس المكتملة" value={`${myStats?.completedDays ?? 0} / ${myStats?.totalDays ?? 15}`} />
          <Stat label="أوراق العمل" value={myStats?.worksheetsDone ?? 0} />
          <Stat label="أكواد محفوظة" value={myProgress?.pythonSnippets?.length ?? 0} />
          <Stat label="التقويم القبلي" value={pre != null ? `${pre}%` : "لم يُجرَ"} />
          <Stat label="التقويم البعدي" value={post != null ? `${post}%` : "لم يُجرَ"} />
          <Stat
            label="نمو الأداء"
            value={growth != null ? (growth >= 0 ? `+${growth}%` : `${growth}%`) : "—"}
          />
          <Stat label="المشروع" value={myProgress?.project?.status ?? "لم يبدأ"} />
        </div>
      </EduCard>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="edu-card block hover:scale-[1.02]"
          >
            <h2 className="edu-card-title">{item.title}</h2>
            <p className="edu-card-subtitle">{item.desc}</p>
          </Link>
        ))}
      </div>

      <EduCard className="mt-8" title="آخر الدروس" accent="cyan">
        <ul className="mt-4 divide-y divide-slate-100">
          {curriculumDays.slice(0, 8).map((d) => {
            const done = myProgress?.completedDays?.includes(d.id);
            return (
              <li key={d.id} className="flex items-center justify-between py-3">
                <Link to={`/path/day/${d.id}`} className="font-semibold text-violet-700 hover:text-violet-900">
                  اليوم {d.dayNumber}: {d.titleAr}
                </Link>
                <span className={`text-sm font-medium ${done ? "text-emerald-600" : "text-slate-400"}`}>
                  {done ? "مكتمل ✓" : "—"}
                </span>
              </li>
            );
          })}
        </ul>
        <Link to="/path" className="edu-btn edu-btn-outline mt-4 inline-flex">
          عرض المسار الكامل
        </Link>
      </EduCard>
    </PageShell>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
