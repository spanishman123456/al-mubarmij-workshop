import { Link } from "react-router-dom";
import { WEEKS_15, curriculumDays, getDayById } from "../data/curriculum15Days";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";
import { PageShell, EduCard } from "../components/layout/PageShell";

const SIM_LABELS = {
  "number-converter": "محوّل الأنظمة",
  "binary-calculator": "حاسبة ثنائية",
  "truth-table": "جدول الحقيقة",
  "logic-gates": "البوابات المنطقية",
  "logic-circuit": "دوائر منطقية",
  karnaugh: "خريطة كارنوف",
  "caesar-cipher": "تشفير قيصر",
  "search-sort": "بحث وفرز",
};

export default function LearningPathPage() {
  const { user, myProgress } = usePlatform();
  const completed = new Set(myProgress?.completedDays ?? []);
  const wsStatus = myProgress?.worksheetStatus ?? {};

  const hero =
    user?.role === "student" && myProgress ? (
      <div className="max-w-lg rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <ProgressBar
          value={Math.round((completed.size / curriculumDays.length) * 100)}
          label="تقدمك في الرحلة التعليمية (15 يومًا)"
          variant="dark"
        />
        <p className="mt-2 text-sm text-violet-100">
          {completed.size} من {curriculumDays.length} يومًا مكتمل
        </p>
      </div>
    ) : null;

  return (
    <PageShell
      title="المسار الدراسي — 15 يومًا"
      subtitle="رحلة تعليمية متكاملة على ثلاثة أسابيع — مُحاذاة لمنهج وحدة برمجة الحاسب لبرنامج موهبة الأكاديمي (صفوف 6–8)."
      badge="منهج PDF الرسمي"
      hero={hero}
    >
      <div className="path-timeline space-y-14">
        {WEEKS_15.map((week) => (
          <section key={week.id}>
            <div className="path-week-banner">
              <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                الأسبوع {week.weekNumber}
              </p>
              <h2>{week.titleAr}</h2>
              <p>{week.summaryAr}</p>
            </div>

            <div className="mr-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {week.dayIds.map((dayId) => {
                const day = getDayById(dayId);
                if (!day) return null;
                const done = completed.has(dayId);
                const wsDone = day.worksheetId && wsStatus[day.worksheetId] === "completed";

                return (
                  <article
                    key={dayId}
                    className={`path-day-card ${done ? "path-day-card--done" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="path-day-num">{day.dayNumber}</span>
                      {done ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          مكتمل ✓
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          قيد التقدم
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-slate-900">{day.titleAr}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {day.summaryAr}
                    </p>

                    <div className="mt-3">
                      <p className="text-xs font-semibold text-violet-700">المفاهيم الرئيسية</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {day.conceptsAr.slice(0, 4).map((c) => (
                          <span
                            key={c}
                            className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-800"
                          >
                            {c}
                          </span>
                        ))}
                        {day.conceptsAr.length > 4 ? (
                          <span className="text-xs text-slate-500">+{day.conceptsAr.length - 4}</span>
                        ) : null}
                      </div>
                    </div>

                    <ul className="mt-3 space-y-1 text-xs text-slate-600">
                      {day.activitiesAr.slice(0, 2).map((a) => (
                        <li key={a} className="flex gap-1.5">
                          <span className="text-violet-500">•</span>
                          <span className="line-clamp-1">{a}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                      {day.worksheetId ? (
                        <Link
                          to={`/worksheets/${day.worksheetId}`}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            wsDone
                              ? "bg-amber-100 text-amber-800"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          ورقة عمل {wsDone ? "✓" : ""}
                        </Link>
                      ) : null}
                      {day.quizId ? (
                        <Link
                          to={`/quizzes/run/${day.quizId}`}
                          className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                        >
                          اختبار
                        </Link>
                      ) : null}
                      {day.simulationIds?.slice(0, 2).map((sid) => (
                        <Link
                          key={sid}
                          to={`/simulations#${sid}`}
                          className="rounded-lg bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700 hover:bg-pink-100"
                        >
                          {SIM_LABELS[sid] ?? sid}
                        </Link>
                      ))}
                    </div>

                    <Link
                      to={`/path/day/${dayId}`}
                      className="edu-btn edu-btn-primary mt-4 w-full text-center"
                    >
                      ابدأ الدرس
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <EduCard className="mt-10" title="مسار إضافي للمراجعة" accent="cyan">
        <p className="edu-text mt-2">
          يمكنك أيضًا استكشاف المسار الموسّع (9 وحدات) للمراجعة العميقة والمواضيع التكميلية.
        </p>
        <Link to="/curriculum" className="edu-btn edu-btn-outline mt-4 inline-flex">
          المسار الموسّع (9 وحدات) ←
        </Link>
      </EduCard>
    </PageShell>
  );
}
