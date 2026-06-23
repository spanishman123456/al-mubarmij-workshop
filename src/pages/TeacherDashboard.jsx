import { Link } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { PrePostComparisonChart } from "../components/charts/PrePostComparisonChart";

export default function TeacherDashboard() {
  const { user, allStudentsProgress, logout, teacherUpdateStudent } = usePlatform();

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
  const behind = allStudentsProgress.filter((x) => x.stats.overallPercent < 40);
  const ahead = allStudentsProgress.filter((x) => x.stats.overallPercent >= 70);

  return (
    <PageShell
      title="لوحة المعلم"
      subtitle={`${user.nameAr} — متابعة تقدم الطلاب ونتائج الاختبارات والمشاريع`}
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard value={allStudentsProgress.length} label="عدد الطلاب" color="violet" />
        <SummaryCard value={`${Math.round(avg)}%`} label="متوسط التقدم" color="emerald" />
        <SummaryCard value={behind.length} label="يحتاجون دعمًا" color="amber" />
        <SummaryCard value={ahead.length} label="متقدمون" color="cyan" />
      </div>

      <PrePostComparisonChart className="mt-8" students={allStudentsProgress} />

      <section className="mt-10 space-y-5">
        <h2 className="text-xl font-bold text-slate-900">تقدم الطلاب</h2>
        {allStudentsProgress.map(({ student, progress, stats }) => {
          const pre = progress.preTest?.percent;
          const post = progress.postTest?.percent;
          const wsCount = Object.values(progress.worksheetStatus || {}).filter(
            (s) => s === "completed",
          ).length;

          return (
            <EduCard key={student.id} accent="violet">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{student.nameAr}</h3>
                  <p className="text-sm text-slate-600">الصف {student.grade}</p>
                </div>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-800">
                  {stats.overallPercent}%
                </span>
              </div>

              <ProgressBar className="mt-4" value={stats.overallPercent} label="إكمال المحتوى" />

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Info label="الدروس" value={`${stats.completedDays}/${stats.totalDays}`} />
                <Info label="أوراق العمل" value={wsCount} />
                <Info label="قبلي → بعدي" value={`${pre ?? "—"}% → ${post ?? "—"}%`} />
                <Info label="المشروع" value={progress.project?.status ?? "لم يبدأ"} />
              </div>

              {progress.pythonSnippets?.[0] ? (
                <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                    آخر كود بايثون
                  </summary>
                  <pre
                    className="mt-2 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-emerald-300"
                    dir="ltr"
                  >
                    {progress.pythonSnippets[0].code}
                  </pre>
                </details>
              ) : null}

              {progress.project?.title ? (
                <div className="mt-3 rounded-lg bg-cyan-50 p-3">
                  <p className="text-sm font-bold text-cyan-900">مشروع: {progress.project.title}</p>
                  {progress.project.teacherNote ? (
                    <p className="mt-1 text-sm text-cyan-800">ملاحظة: {progress.project.teacherNote}</p>
                  ) : null}
                </div>
              ) : null}

              <button
                type="button"
                className="edu-btn edu-btn-outline mt-4 text-xs"
                onClick={() =>
                  teacherUpdateStudent(student.id, {
                    project: {
                      ...progress.project,
                      teacherNote: "عمل جيد — أضف توثيقًا للكود وشرحًا للفكرة.",
                      status: "reviewed",
                    },
                  })
                }
              >
                إضافة ملاحظة تجريبية
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
