import { Link } from "react-router-dom";
import { WEEKS_15, curriculumDays, getDayById } from "../data/curriculum15Days";
import { usePlatform } from "../context/PlatformContext";
import { ProgressBar } from "../components/ProgressBar";
import { PageShell, EduCard } from "../components/layout/PageShell";
import {
  resolvePublishedDaysCount,
  isCurriculumDayPublished,
  DayStudentState,
  DAY_SCHEDULE_MESSAGE_AR,
  DAY_LOCKED_MESSAGE_AR,
} from "../config/publication";
import { canStudentAccessDayResources, getPathDayCardAction } from "../lib/pathDayCardUi";

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

const STATE_BADGE = {
  [DayStudentState.COMPLETED]: { label: "مكتمل ✓", className: "bg-emerald-100 text-emerald-700" },
  [DayStudentState.AVAILABLE]: { label: "متاح الآن", className: "bg-sky-100 text-sky-800" },
  [DayStudentState.IN_PROGRESS]: { label: "قيد التقدم", className: "bg-violet-100 text-violet-800" },
  [DayStudentState.LOCKED]: { label: "مقفل", className: "bg-slate-200 text-slate-700" },
  [DayStudentState.DRAFT]: { label: "غير منشور", className: "bg-amber-100 text-amber-800" },
};

export default function LearningPathPage() {
  const { user, myProgress, myStats } = usePlatform();
  const completed = new Set(myProgress?.completedDays ?? []);
  const wsStatus = myProgress?.worksheetStatus ?? {};
  const publishedDays = resolvePublishedDaysCount(myStats);
  const visibleDays = curriculumDays.filter((d) => isCurriculumDayPublished(d.id, publishedDays));
  const dayUnlockMap = myStats?.dayUnlock?.dayUnlockMap || {};

  const hero =
    user?.role === "student" && myProgress ? (
      <div className="max-w-lg rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <ProgressBar
          value={Math.round((completed.size / Math.max(visibleDays.length, 1)) * 100)}
          label={`تقدمك في الرحلة التعليمية (${publishedDays === 15 ? "15" : publishedDays} يومًا)`}
          variant="dark"
        />
        <p className="mt-2 text-sm text-violet-100">
          {completed.size} من {visibleDays.length} يومًا مكتمل
        </p>
      </div>
    ) : null;

  return (
    <PageShell
      title="المسار الدراسي — 15 يومًا"
      subtitle="رحلة تعليمية متكاملة على ثلاثة أسابيع — مُحاذاة لمنهج وحدة برمجة الحاسب لبرنامج موهبة الإثرائي (صفوف 6–8)."
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
                const published = isCurriculumDayPublished(dayId, publishedDays);
                const studentState =
                  user?.role === "student" ? dayUnlockMap[dayId] || DayStudentState.DRAFT : null;
                const badge = studentState ? STATE_BADGE[studentState] : null;
                const done = studentState === DayStudentState.COMPLETED || completed.has(dayId);
                const wsDone = day.worksheetId && wsStatus[day.worksheetId] === "completed";
                const canAccessResources =
                  user?.role !== "student" ? published : canStudentAccessDayResources(studentState);
                const cardAction = user?.role === "student" ? getPathDayCardAction(studentState) : null;

                return (
                  <article
                    key={dayId}
                    data-day-id={dayId}
                    className={`path-day-card ${done ? "path-day-card--done" : ""} ${!published ? "opacity-90" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="path-day-num">{day.dayNumber}</span>
                      {badge ? (
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badge.className}`}>
                          {badge.label}
                        </span>
                      ) : done ? (
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
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                      {canAccessResources && day.worksheetId ? (
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
                      {canAccessResources && day.quizId ? (
                        <Link
                          to={`/quizzes/run/${day.quizId}`}
                          className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                        >
                          اختبار
                        </Link>
                      ) : null}
                    </div>

                    {user?.role !== "student" && published ? (
                      <Link
                        to={`/path/day/${dayId}`}
                        className="edu-btn edu-btn-primary mt-4 w-full text-center"
                      >
                        {done ? "مراجعة اليوم" : "ابدأ الدرس"}
                      </Link>
                    ) : cardAction?.kind === "link" ? (
                      <Link
                        to={`/path/day/${dayId}`}
                        className="edu-btn edu-btn-primary mt-4 w-full text-center"
                        data-testid={`path-day-cta-${dayId}`}
                      >
                        {cardAction.label}
                      </Link>
                    ) : cardAction?.kind === "locked" ? (
                      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm font-semibold text-slate-700">
                        {DAY_LOCKED_MESSAGE_AR}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-center text-sm font-semibold text-amber-900">
                        {DAY_SCHEDULE_MESSAGE_AR}
                      </div>
                    )}
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
