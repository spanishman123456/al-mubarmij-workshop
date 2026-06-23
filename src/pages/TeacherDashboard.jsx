import { Link } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";

export default function TeacherDashboard() {
  const { user, allStudentsProgress, logout, teacherUpdateStudent } = usePlatform();

  if (!user || user.role !== "teacher") {
    return (
      <main className="px-4 pt-24 text-center font-ar text-slate-400">
        <Link to="/login" className="text-violet-300">سجّل الدخول كمعلم</Link>
      </main>
    );
  }

  const avg =
    allStudentsProgress.reduce((s, x) => s + x.stats.overallPercent, 0) /
    Math.max(allStudentsProgress.length, 1);

  const behind = allStudentsProgress.filter((x) => x.stats.overallPercent < 40);
  const ahead = allStudentsProgress.filter((x) => x.stats.overallPercent >= 70);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-24 font-ar text-right" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">لوحة المعلم</h1>
          <p className="text-slate-400">{user.nameAr}</p>
        </div>
        <button type="button" onClick={logout} className="rounded-lg border border-white/20 px-4 py-2 text-sm">خروج</button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-bold text-white">{allStudentsProgress.length}</p>
          <p className="text-sm text-slate-400">عدد الطلاب</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-bold text-emerald-300">{Math.round(avg)}%</p>
          <p className="text-sm text-slate-400">متوسط التقدم</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-bold text-amber-300">{behind.length}</p>
          <p className="text-sm text-slate-400">متأخرون</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-bold text-violet-300">{ahead.length}</p>
          <p className="text-sm text-slate-400">متقدمون</p>
        </div>
      </div>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-bold text-white">تقدم الطلاب</h2>
        {allStudentsProgress.map(({ student, progress, stats }) => (
          <article key={student.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="text-lg font-bold text-white">{student.nameAr}</h3>
              <span className="text-sm text-slate-400">الصف {student.grade}</span>
            </div>
            <ProgressBar className="mt-3" value={stats.overallPercent} label="إكمال المحتوى" />
            <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
              <span>دروس: {stats.completedDays}/{stats.totalDays}</span>
              <span>قبلي: {progress.preTest?.percent ?? "—"}% → بعدي: {progress.postTest?.percent ?? "—"}%</span>
              <span>مشروع: {progress.project?.status}</span>
            </div>
            {progress.pythonSnippets?.[0] ? (
              <details className="mt-3 text-sm text-slate-400">
                <summary>آخر كود بايثون</summary>
                <pre className="mt-2 overflow-x-auto rounded bg-black/40 p-2 text-xs">{progress.pythonSnippets[0].code}</pre>
              </details>
            ) : null}
            {progress.project?.title ? (
              <p className="mt-2 text-sm text-cyan-300">مشروع: {progress.project.title}</p>
            ) : null}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="rounded-lg bg-violet-600 px-3 py-1 text-xs text-white"
                onClick={() =>
                  teacherUpdateStudent(student.id, {
                    project: {
                      ...progress.project,
                      teacherNote: "عمل جيد — أضف توثيقًا للكود.",
                      status: "reviewed",
                    },
                  })
                }
              >
                إضافة ملاحظة تجريبية
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
