import { Link } from "react-router-dom";
import { WEEKS_15, curriculumDays, getDayById } from "../data/curriculum15Days";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";

export default function LearningPathPage() {
  const { user, myProgress } = usePlatform();
  const completed = new Set(myProgress?.completedDays ?? []);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-24 font-ar text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-white">المسار الدراسي — 15 يومًا</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        منهج وحدة برمجة الحاسب لبرنامج موهبة الأكاديمي (صفوف 6–8) على ثلاثة أسابيع — مُحاذى لملف PDF الرسمي.
      </p>
      {user?.role === "student" && myProgress ? (
        <div className="mt-6 max-w-md">
          <ProgressBar
            value={Math.round((completed.size / curriculumDays.length) * 100)}
            label="تقدمك في الأيام الدراسية"
          />
        </div>
      ) : null}

      <div className="mt-10 space-y-12">
        {WEEKS_15.map((week) => (
          <section key={week.id}>
            <h2 className="text-xl font-bold text-violet-300">{week.titleAr}</h2>
            <p className="mt-1 text-sm text-slate-500">{week.summaryAr}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {week.dayIds.map((dayId) => {
                const day = getDayById(dayId);
                if (!day) return null;
                const done = completed.has(dayId);
                return (
                  <Link
                    key={dayId}
                    to={`/path/day/${dayId}`}
                    className={`rounded-xl border p-4 transition hover:scale-[1.02] ${
                      done
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-white/10 bg-white/5 hover:border-violet-500/40"
                    }`}
                  >
                    <p className="text-xs text-slate-500">اليوم {day.dayNumber}</p>
                    <h3 className="mt-1 font-bold text-white">{day.titleAr}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">{day.summaryAr}</p>
                    {done ? <span className="mt-2 inline-block text-xs text-emerald-400">مكتمل ✓</span> : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-slate-500">
        يمكنك أيضًا استكشاف{" "}
        <Link to="/curriculum" className="text-violet-300 hover:underline">المسار الموسّع (9 وحدات)</Link>
        {" "}للمراجعة الإضافية.
      </p>
    </main>
  );
}
