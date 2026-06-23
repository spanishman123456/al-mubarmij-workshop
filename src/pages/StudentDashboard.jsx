import { Link } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";
import { curriculumDays } from "../data/curriculum15Days";

export default function StudentDashboard() {
  const { user, myStats, myProgress, logout } = usePlatform();
  if (!user || user.role !== "student") {
    return (
      <main className="px-4 pt-24 text-center font-ar text-slate-400">
        <Link to="/login" className="text-violet-300">سجّل الدخول كطالب</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-24 font-ar text-right" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">لوحة الطالب</h1>
          <p className="text-slate-400">{user.nameAr} — الصف {user.grade}</p>
        </div>
        <button type="button" onClick={logout} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-300">خروج</button>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <ProgressBar value={myStats?.overallPercent} label="التقدم العام في المنهج" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-slate-300">
          <p>الدروس المكتملة: {myStats?.completedDays} / {myStats?.totalDays}</p>
          <p>أوراق العمل المنجزة: {myStats?.worksheetsDone}</p>
          <p>التقويم القبلي: {myProgress?.preTest ? `${myProgress.preTest.percent}%` : "لم يُجرَ"}</p>
          <p>التقويم البعدي: {myProgress?.postTest ? `${myProgress.postTest.percent}%` : "لم يُجرَ"}</p>
          <p>المشروع: {myProgress?.project?.status ?? "لم يبدأ"}</p>
          <p>أكواد محفوظة: {myProgress?.pythonSnippets?.length ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/path" className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-5 hover:bg-violet-500/20">
          <h2 className="font-bold text-white">المسار الدراسي (15 يومًا)</h2>
          <p className="mt-1 text-sm text-slate-400">تابع الدروس والأنشطة</p>
        </Link>
        <Link to="/python" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 hover:bg-emerald-500/20">
          <h2 className="font-bold text-white">مختبر بايثون</h2>
          <p className="mt-1 text-sm text-slate-400">اكتب واحفظ أكوادك</p>
        </Link>
        <Link to="/worksheets" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 hover:bg-amber-500/20">
          <h2 className="font-bold text-white">أوراق العمل</h2>
        </Link>
        <Link to="/quizzes" className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-5 hover:bg-sky-500/20">
          <h2 className="font-bold text-white">الاختبارات</h2>
        </Link>
        <Link to="/simulations" className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-5 hover:bg-pink-500/20">
          <h2 className="font-bold text-white">المحاكاة التفاعلية</h2>
        </Link>
        <Link to="/projects" className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-5 hover:bg-cyan-500/20">
          <h2 className="font-bold text-white">المشروع النهائي</h2>
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">آخر الدروس</h2>
        <ul className="mt-3 space-y-2">
          {curriculumDays.slice(0, 5).map((d) => (
            <li key={d.id}>
              <Link to={`/path/day/${d.id}`} className="text-violet-300 hover:underline">
                {d.titleAr} {myProgress?.completedDays?.includes(d.id) ? "✓" : ""}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
