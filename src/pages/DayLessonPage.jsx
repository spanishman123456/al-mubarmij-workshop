import { Link, useParams } from "react-router-dom";
import { getDayById } from "../data/curriculum15Days";
import { usePlatform } from "../context/PlatformContext";

const SIM_LINKS = {
  "number-converter": "/simulations#converter",
  "binary-calculator": "/simulations#binary-calc",
  "truth-table": "/simulations#truth",
  "logic-gates": "/simulations#gates",
  "logic-circuit": "/simulations#gates",
  karnaugh: "/simulations#truth",
  "caesar-cipher": "/simulations#caesar",
  "search-sort": "/simulations#search",
};

export default function DayLessonPage() {
  const { dayId } = useParams();
  const day = getDayById(dayId);
  const { user, markDayComplete, myProgress } = usePlatform();
  const done = myProgress?.completedDays?.includes(dayId);

  if (!day) {
    return (
      <main className="px-4 pt-24 font-ar text-center text-slate-400">
        <Link to="/path">العودة للمسار</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 font-ar text-right" dir="rtl">
      <Link to="/path" className="text-sm text-violet-300 hover:underline">← المسار الدراسي</Link>
      <p className="mt-4 text-sm text-slate-500">الأسبوع {day.weekNumber} — اليوم {day.dayNumber}</p>
      <h1 className="mt-2 text-3xl font-bold text-white">{day.titleAr}</h1>
      <p className="mt-4 text-slate-300">{day.summaryAr}</p>

      <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-bold text-violet-300">الأهداف التعليمية</h2>
        <ul className="mt-2 list-disc space-y-1 pr-5 text-slate-300">
          {day.objectivesAr.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-bold text-violet-300">المفاهيم الأساسية</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {day.conceptsAr.map((c) => (
            <span key={c} className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-200">{c}</span>
          ))}
        </div>
      </section>

      {day.sections.map((sec) => (
        <section key={sec.titleAr} className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-bold text-white">{sec.titleAr}</h2>
          <p className="mt-2 leading-relaxed text-slate-300">{sec.bodyAr}</p>
        </section>
      ))}

      <section className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="font-bold text-amber-200">أنشطة تفاعلية</h2>
        <ul className="mt-2 list-disc pr-5 text-slate-300">
          {day.activitiesAr.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      {day.simulationIds?.length ? (
        <section className="mt-6">
          <h2 className="font-bold text-pink-300">محاكاة مرتبطة</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {day.simulationIds.map((sid) => (
              <Link key={sid} to={SIM_LINKS[sid] || "/simulations"} className="rounded-lg bg-pink-600/30 px-3 py-2 text-sm text-pink-100 hover:bg-pink-600/50">
                {sid}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <h2 className="font-bold text-emerald-200">تطبيق عملي</h2>
        <p className="mt-2 text-slate-300">{day.practicalAr}</p>
        {day.exerciseIds?.length ? (
          <Link to={`/python?ex=${day.exerciseIds[0]}`} className="mt-3 inline-block text-emerald-300 hover:underline">
            افتح التمرين في مختبر بايثون →
          </Link>
        ) : null}
      </section>

      <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-bold text-white">ملخص نهاية اليوم</h2>
        <p className="mt-2 text-slate-300">{day.daySummaryAr}</p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        {day.worksheetId ? (
          <Link to={`/worksheets?day=${day.worksheetId}`} className="rounded-lg bg-amber-600 px-4 py-2 text-white">ورقة العمل</Link>
        ) : null}
        {day.quizId ? (
          <Link to={`/quizzes/run/${day.quizId}`} className="rounded-lg bg-sky-600 px-4 py-2 text-white">اختبار قصير</Link>
        ) : null}
        {user?.role === "student" ? (
          <button
            type="button"
            disabled={done}
            onClick={() => markDayComplete(dayId)}
            className="rounded-lg bg-violet-600 px-4 py-2 font-bold text-white disabled:opacity-50"
          >
            {done ? "تم إكمال اليوم ✓" : "أتممت هذا اليوم"}
          </button>
        ) : null}
      </div>
    </main>
  );
}
