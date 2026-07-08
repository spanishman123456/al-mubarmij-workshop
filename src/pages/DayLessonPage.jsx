import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { getDayById } from "../data/curriculum15Days";
import { usePlatform } from "../context/PlatformContext";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { getDayLessonRoutes } from "../content/lessons/dayLessonRoutes";
import {
  canStudentAccessDayContent,
  getStudentDayState,
  DAY_SCHEDULE_MESSAGE_AR,
  DAY_LOCKED_MESSAGE_AR,
  DayStudentState,
  TEACHER_PREVIEW_BADGE_AR,
  isTeacherRole,
  isCurriculumDayPublished,
  resolvePublishedDaysForRole,
} from "../config/publication";

const SIM_LINKS = {
  "number-converter": "/simulations#number-converter",
  "binary-calculator": "/simulations#binary-calc",
  "truth-table": "/simulations#truth",
  "logic-gates": "/simulations#gates",
  "logic-circuit": "/simulations#circuit",
  karnaugh: "/simulations#karnaugh",
  "caesar-cipher": "/simulations#caesar",
  "search-sort": "/simulations#search",
};

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

export default function DayLessonPage() {
  const { dayId } = useParams();
  const day = getDayById(dayId);
  const { user, markDayComplete, myProgress, myStats } = usePlatform();
  const [completeError, setCompleteError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const dayUnlock = myStats?.dayUnlock?.dayCompletions?.[dayId];
  const dayUnlockMap = myStats?.dayUnlock?.dayUnlockMap;
  const studentState = getStudentDayState(dayId, dayUnlockMap);
  const isTeacher = isTeacherRole(user?.role);
  const studentPublished = isCurriculumDayPublished(dayId, resolvePublishedDaysForRole("student", myStats));
  const done = dayUnlock?.completed || myProgress?.completedDays?.includes(dayId);
  const incomplete = dayUnlock?.incompleteItems || [];
  const dayLessons = getDayLessonRoutes(day.id);

  if (!day) {
    return (
      <PageShell title="الدرس">
        <EduCard>
          <Link to="/path" className="edu-btn edu-btn-outline inline-flex">
            العودة للمسار
          </Link>
        </EduCard>
      </PageShell>
    );
  }

  if (user?.role === "student" && !canStudentAccessDayContent(dayId, dayUnlockMap, myStats)) {
    const locked = studentState === DayStudentState.LOCKED;
    return (
      <PageShell
        title={locked ? "اليوم مقفل" : "المحتوى غير متاح بعد"}
        badge={locked ? "المسار التعليمي" : "الجدول التدريبي"}
      >
        <EduCard accent="amber">
          <p className="text-lg font-semibold text-slate-800">
            {locked ? DAY_LOCKED_MESSAGE_AR : DAY_SCHEDULE_MESSAGE_AR}
          </p>
          <Link to="/path" className="edu-btn edu-btn-outline mt-4 inline-flex">
            العودة للمسار
          </Link>
        </EduCard>
      </PageShell>
    );
  }

  async function handleCompleteDay() {
    setCompleteError(null);
    setCompleting(true);
    const res = await markDayComplete(dayId);
    setCompleting(false);
    if (!res?.ok) {
      setCompleteError(res?.incompleteItems?.length ? res.incompleteItems : [{ labelAr: res?.error || "تعذّر الإكمال" }]);
    }
  }

  return (
    <PageShell
      title={day.titleAr}
      subtitle={day.summaryAr}
      badge={`الأسبوع ${day.weekNumber} — اليوم ${day.dayNumber}`}
    >
      <Link to="/path" className="mb-6 inline-flex text-sm font-semibold text-violet-700 hover:text-violet-900">
        ← المسار الدراسي
      </Link>

      {isTeacher && !studentPublished ? (
        <EduCard className="mb-6" accent="amber">
          <p className="font-semibold text-amber-900">{TEACHER_PREVIEW_BADGE_AR}</p>
          <p className="mt-2 text-sm text-amber-800">
            أنت تعرض هذا اليوم كمعلم. الطلاب لا يرونه حتى يُنشر وفق سياسة النشر وفتح الأيام.
          </p>
        </EduCard>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <EduCard title="الأهداف التعليمية" accent="violet">
            <ul className="mt-3 list-disc space-y-2 pr-5 text-slate-700">
              {day.objectivesAr.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </EduCard>

          <EduCard title="المفاهيم الأساسية" accent="cyan">
            <div className="mt-3 flex flex-wrap gap-2">
              {day.conceptsAr.map((c) => (
                <span key={c} className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800">
                  {c}
                </span>
              ))}
            </div>
          </EduCard>

          {day.sections.map((sec) => (
            <EduCard key={sec.titleAr} title={sec.titleAr}>
              <p className="mt-2 leading-relaxed text-slate-700">{sec.bodyAr}</p>
            </EduCard>
          ))}

          <div data-testid="day-lessons-section">
            <EduCard title="دروس اليوم" accent="violet">
              <p className="text-sm text-slate-600">
                صفحة اليوم تعرض المسار العام. ابدأ من الدروس التفصيلية التالية للحصول على الشرح الكامل، الأمثلة، والتدريبات.
              </p>
              {dayLessons.length ? (
                <div className="mt-3 space-y-2">
                  {dayLessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div className="text-sm text-slate-800">
                        <span className="font-semibold">{idx + 1}. {lesson.titleAr}</span>
                        {lesson.pdfRef ? <span className="mr-2 text-xs text-slate-500">(pdfPageIndex {lesson.pdfRef})</span> : null}
                      </div>
                      <Link
                        to={lesson.to}
                        data-testid={`day-lesson-link-${lesson.id}`}
                        className="edu-btn edu-btn-primary inline-flex text-xs"
                      >
                        ابدأ الدرس
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  لا توجد دروس تفصيلية مرتبطة بهذا اليوم بعد.
                </p>
              )}
            </EduCard>
          </div>

          <EduCard title="تطبيق عملي" accent="emerald">
            <p className="mt-2 text-slate-700">{day.practicalAr}</p>
            {day.exerciseIds?.length ? (
              <Link to={`/python?ex=${day.exerciseIds[0]}`} className="edu-btn edu-btn-primary mt-4 inline-flex text-sm">
                افتح التمرين في مختبر بايثون
              </Link>
            ) : null}
          </EduCard>
        </div>

        <div className="space-y-6">
          <EduCard title="أنشطة تفاعلية" accent="amber">
            <ul className="mt-3 list-disc space-y-2 pr-5 text-sm text-slate-700">
              {day.activitiesAr.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </EduCard>

          {day.simulationIds?.length ? (
            <EduCard title="محاكاة مرتبطة" accent="violet">
              <div className="mt-3 flex flex-col gap-2">
                {day.simulationIds.map((sid) => (
                  <Link
                    key={sid}
                    to={SIM_LINKS[sid] || "/simulations"}
                    className="rounded-lg bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-800 hover:bg-pink-100"
                  >
                    {SIM_LABELS[sid] ?? sid} →
                  </Link>
                ))}
              </div>
            </EduCard>
          ) : null}

          <EduCard title="موارد الدرس">
            <div className="mt-3 flex flex-col gap-2">
              {day.worksheetId ? (
                <Link to={`/worksheets/${day.worksheetId}`} className="edu-btn edu-btn-outline text-sm">
                  ورقة العمل
                </Link>
              ) : null}
              {day.quizId ? (
                <Link to={`/quizzes/run/${day.quizId}`} className="edu-btn edu-btn-outline text-sm">
                  اختبار قصير
                </Link>
              ) : null}
              {user?.role === "student" ? (
                <div className="space-y-3">
                  {!done && incomplete.length > 0 ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                      <p className="font-bold text-amber-900">بقي عليك لإكمال هذا اليوم:</p>
                      <ul className="mt-2 space-y-1 pr-4">
                        {incomplete.map((item) => (
                          <li key={item.id} className="text-amber-900">
                            ○ {item.labelAr}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {completeError?.length ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                      {completeError.map((item) => (
                        <p key={item.id || item.labelAr}>○ {item.labelAr}</p>
                      ))}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    disabled={done || completing}
                    onClick={handleCompleteDay}
                    className="edu-btn edu-btn-primary w-full text-sm disabled:opacity-50"
                    data-testid="complete-day-btn"
                  >
                    {done ? "تم إكمال اليوم ✓" : completing ? "جاري الحفظ…" : "إكمال اليوم وفتح اليوم التالي"}
                  </button>
                </div>
              ) : null}
            </div>
          </EduCard>

          <EduCard title="ملخص نهاية اليوم" accent="emerald">
            <p className="mt-2 text-slate-700">{day.daySummaryAr}</p>
          </EduCard>
        </div>
      </div>
    </PageShell>
  );
}
