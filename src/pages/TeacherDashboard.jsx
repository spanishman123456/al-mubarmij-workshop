import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { fetchOnboardingAll, fetchTeacherStudentProgress } from "../lib/platformApi";
import { ProgressBar } from "../components/ProgressBar";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { PrePostComparisonChart } from "../components/charts/PrePostComparisonChart";
import { TeacherGraphicProjects } from "../components/teacher/TeacherGraphicProjects";
import { MawhibaBrand } from "../components/branding/MawhibaBrand";
import { LtrValue, formatFraction, formatPercent } from "../components/LtrValue";
import {
  maskNationalId,
  getAccountStatus,
  getAttendanceStatus,
  getPresenceStatus,
  formatLoginDateTime,
  filterByLastLogin,
  todayKey,
} from "../lib/platformAnalytics";
import { buildAssessmentSummary, formatAssessmentCardLine } from "../lib/assessmentSummary.js";
import { DayPublicationPanel, StudentDayUnlockActions } from "../components/teacher/DayPublicationPanel";

function formatDate(iso) {
  return formatLoginDateTime(iso) === "لم يسجل الدخول" ? "—" : formatLoginDateTime(iso);
}

export default function TeacherDashboard() {
  const {
    user,
    allStudentsProgress,
    logout,
    teacherSetNote,
    teacherUpdateGraphicProject,
    refreshTeacherAnalytics,
    analyticsSyncStatus,
    publicationConfig,
    refreshPublicationConfig,
  } = usePlatform();

  const [loginFilter, setLoginFilter] = useState("all");
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [onboardingSummary, setOnboardingSummary] = useState(null);
  const [progressDetails, setProgressDetails] = useState(null);
  const [progressDetailsLoading, setProgressDetailsLoading] = useState(false);

  useEffect(() => {
    fetchOnboardingAll()
      .then(setOnboardingSummary)
      .catch(() => setOnboardingSummary(null));
  }, [analyticsSyncStatus.fetchedAt]);

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

  const filteredStudents = filterByLastLogin(allStudentsProgress, loginFilter);

  const avg =
    allStudentsProgress.reduce((s, x) => s + x.stats.overallPercent, 0) /
    Math.max(allStudentsProgress.length, 1);
  const neverLogged = allStudentsProgress.filter((x) => !x.analytics?.loginCount);
  const today = todayKey();
  const presentToday = allStudentsProgress.filter((x) => x.analytics?.dailyLog?.[today]?.entered);
  const needsFollowup = allStudentsProgress.filter(
    (x) =>
      (x.stats?.overallPercent ?? 0) < 15 &&
      getAttendanceStatus(x.analytics, x.stats).key === "inactive",
  );
  const onlineNow = allStudentsProgress.filter((x) => getPresenceStatus(x.analytics).key === "online");
  const publishedDays = publicationConfig?.publishedDays ?? 1;

  async function handleRefresh() {
    setRefreshing(true);
    await refreshTeacherAnalytics();
    setRefreshing(false);
  }

  async function showProgressDetails(studentId) {
    setProgressDetailsLoading(true);
    try {
      const res = await fetchTeacherStudentProgress(studentId);
      setProgressDetails(res.computed);
    } catch {
      setProgressDetails(null);
    } finally {
      setProgressDetailsLoading(false);
    }
  }

  return (
    <PageShell
      title="لوحة المعلم"
      subtitle={`${user.nameAr} — متابعة تقدم ونشاط طلاب برمجة الحاسب`}
      badge="برنامج موهبة الإثرائي"
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
      <EduCard className="mb-6 flex flex-wrap items-center justify-between gap-4" accent="violet">
        <MawhibaBrand variant="horizontal" />
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/teacher/day-01-answers" className="edu-btn edu-btn-outline text-sm">
            إجابات المعلم — اليوم 1
          </Link>
          <Link to="/teacher/day-02-answers" className="edu-btn edu-btn-outline text-sm">
            إجابات المعلم — اليوم 2
          </Link>
          <Link to="/teacher/day-03-answers" className="edu-btn edu-btn-outline text-sm">
            إجابات المعلم — اليوم 3
          </Link>
          <Link to="/teacher/day-04-answers" className="edu-btn edu-btn-outline text-sm">
            إجابات المعلم — اليوم 4
          </Link>
          <Link to="/teacher/day-05-answers" className="edu-btn edu-btn-outline text-sm">
            إجابات المعلم — اليوم 5
          </Link>
          <Link to="/teacher/day-06-answers" className="edu-btn edu-btn-outline text-sm">
            إجابات المعلم — اليوم 6
          </Link>
          <Link to="/teacher/day-07-answers" className="edu-btn edu-btn-outline text-sm">
            إجابات المعلم — اليوم 7
          </Link>
          <Link to="/teacher/quiz-review" className="edu-btn edu-btn-outline text-sm">
            مراجعة الاختبارات
          </Link>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || analyticsSyncStatus.loading}
            className="edu-btn edu-btn-primary text-sm disabled:opacity-60"
          >
            {refreshing || analyticsSyncStatus.loading ? "جاري التحديث..." : "تحديث الإحصائيات"}
          </button>
          {analyticsSyncStatus.fetchedAt ? (
            <span className="text-xs text-slate-500">
              آخر مزامنة: {formatLoginDateTime(analyticsSyncStatus.fetchedAt)}
            </span>
          ) : null}
        </div>
      </EduCard>

      {analyticsSyncStatus.error ? (
        <EduCard className="mb-4 border-amber-200 bg-amber-50" accent="amber">
          <p className="text-sm text-amber-900">
            تعذّر جلب بيانات النشاط من الخادم: {analyticsSyncStatus.error}. تُعرض البيانات المحلية
            المتاحة فقط.
          </p>
        </EduCard>
      ) : null}

      {onboardingSummary ? (
        <EduCard className="mb-4" accent="cyan" title="التمهيد — BINGO والموافقات والتقويم القبلي">
          <p className="text-sm text-slate-600">
            طلاب سجّلوا في التمهيد: {onboardingSummary.studentIds?.length ?? 0} — يُحدَّث من قاعدة
            البيانات المركزية.
          </p>
          {onboardingSummary.preAssessment && Object.keys(onboardingSummary.preAssessment).length > 0 ? (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-right text-xs text-slate-500">
                    <th className="py-2 pl-2">الطالب</th>
                    <th className="py-2 pl-2">التقويم القبلي</th>
                    <th className="py-2">تشخيصي</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(onboardingSummary.preAssessment)
                    .slice(0, 12)
                    .map(([sid, pa]) => (
                      <tr key={sid} className="border-b border-slate-100">
                        <td className="py-2 pl-2 font-mono text-xs">{sid.replace("stu-", "")}</td>
                        <td className="py-2 pl-2">{pa.teacherLabelAr || pa.statusLabelAr}</td>
                        <td className="py-2">
                          {pa.diagnosticPercent != null ? `${pa.diagnosticPercent}%` : "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </EduCard>
      ) : null}

      <DayPublicationPanel publicationConfig={publicationConfig} onUpdated={refreshPublicationConfig} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <SummaryCard value={allStudentsProgress.length} label="إجمالي الطلاب" color="violet" />
        <SummaryCard value={`${Math.round(avg)}%`} label="متوسط التقدم" color="emerald" />
        <SummaryCard value={presentToday.length} label="حاضرون اليوم" color="cyan" />
        <SummaryCard value={onlineNow.length} label="متصلون الآن" color="emerald" />
        <SummaryCard value={neverLogged.length} label="لم يسجلوا بعد" color="amber" />
        <SummaryCard value={needsFollowup.length} label="يحتاجون متابعة" color="amber" />
      </div>

      <EduCard className="mt-6 flex flex-wrap items-center gap-3" accent="violet">
        <span className="text-sm font-bold text-slate-700">تصفية حسب آخر دخول:</span>
        {[
          { key: "all", label: "الكل" },
          { key: "today", label: "اليوم" },
          { key: "week", label: "آخر 7 أيام" },
          { key: "month", label: "آخر 30 يومًا" },
          { key: "never", label: "لم يسجّل" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setLoginFilter(opt.key)}
            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
              loginFilter === opt.key
                ? "bg-violet-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="text-xs text-slate-500">({filteredStudents.length} طالب)</span>
      </EduCard>

      <PrePostComparisonChart className="mt-8" students={allStudentsProgress} />

      <TeacherGraphicProjects
        students={allStudentsProgress}
        onUpdate={teacherUpdateGraphicProject}
      />

      <section className="mt-10 space-y-5">
        <h2 className="text-xl font-bold text-slate-900">
          متابعة الطلاب — {filteredStudents.length} طالب
        </h2>

        {filteredStudents.length === 0 ? (
          <EduCard className="text-center text-slate-600">
            لا يوجد طلاب يطابقون معايير التصفية المحددة.
          </EduCard>
        ) : null}

        {filteredStudents.map(({ student, progress, analytics, stats }) => {
          const account = getAccountStatus(analytics);
          const attendance = getAttendanceStatus(analytics, stats);
          const presence = getPresenceStatus(analytics);
          const wsCount = Object.values(progress.worksheetStatus || {}).filter((s) => s === "completed").length;
          const quizCount = Object.keys(progress.quizScores || {}).length;
          const simRuns = Object.values(analytics?.simRuns || {}).reduce((a, b) => a + b, 0);
          const pagesCount = Object.values(analytics?.pagesVisited || {}).reduce((a, b) => a + b, 0);
          const loginHistory = analytics?.loginHistory || [];
          const showHistory = expandedHistory === student.id;

          return (
            <EduCard key={student.id} accent="violet">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{student.nameAr}</h3>
                  <p className="text-sm text-slate-600">هوية: {maskNationalId(student.nationalId)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${presence.color}`}>
                    {presence.label}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {account.label}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${attendance.color}`}>
                    {attendance.label}
                  </span>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-800">
                    <LtrValue>{formatPercent(stats.overallPercent)}</LtrValue>
                  </span>
                </div>
              </div>

              <ProgressBar className="mt-4" value={stats.overallPercent} label="التقدم في المحتوى المتاح" />
              {stats.dayUnlock ? (
                <p className="mt-2 text-xs text-slate-600">
                  اليوم 1: {stats.dayUnlock.dayCompletions?.["day-01"]?.completed ? "مكتمل ✓" : "غير مكتمل"} — اليوم
                  2: {stats.dayUnlock.dayUnlockMap?.["day-02"] === "locked" ? "مقفل" : "مفتوح"}
                </p>
              ) : null}

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Info label="آخر تسجيل دخول" value={formatLoginDateTime(analytics?.lastLoginAt)} />
                <Info label="عدد مرات الدخول" value={<LtrValue>{analytics?.loginCount ?? 0}</LtrValue>} />
                <Info label="آخر نشاط" value={formatDate(analytics?.lastActivityAt)} />
                <Info label="الصفحات المزارة" value={<LtrValue>{pagesCount}</LtrValue>} />
                <Info
                  label="الدروس (منشورة)"
                  value={
                    <LtrValue>
                      {formatFraction(stats.completedLessons ?? stats.completedDays ?? 0, stats.totalPublishedLessons ?? stats.totalDays ?? 15)}
                    </LtrValue>
                  }
                />
                <Info label="أوراق العمل" value={<LtrValue>{stats.worksheetsDone ?? wsCount}</LtrValue>} />
                <Info label="الاختبارات" value={<LtrValue>{stats.quizCount ?? quizCount}</LtrValue>} />
                <Info label="المحاكاة" value={<LtrValue>{simRuns}</LtrValue>} />
                <Info label="تشغيل بايثون" value={<LtrValue>{analytics?.pythonRuns ?? 0}</LtrValue>} />
                <Info label="المشروع" value={progress.project?.status ?? "لم يبدأ"} />
                <Info
                  label="قبلي → بعدي (تشخيصي)"
                  value={
                    <LtrValue>
                      {stats.assessmentSummary
                        ? formatAssessmentCardLine(stats.assessmentSummary)
                        : formatAssessmentCardLine(
                            buildAssessmentSummary(progress, { publishedDays: stats.publishedDays ?? publishedDays }),
                          )}
                    </LtrValue>
                  }
                />
                <Info label="الأنشطة المكتملة" value={<LtrValue>{analytics?.activitiesCompleted ?? 0}</LtrValue>} />
              </div>

              {analytics?.teacherNotes ? (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                  ملاحظة المعلم: {analytics.teacherNotes}
                </p>
              ) : null}

              {stats.dayUnlock ? (
                <StudentDayUnlockActions
                  studentId={student.id}
                  dayUnlock={stats.dayUnlock}
                  onUnlocked={refreshTeacherAnalytics}
                />
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="edu-btn edu-btn-primary text-xs"
                  onClick={() => showProgressDetails(student.id)}
                >
                  عرض تفاصيل التقدم
                </button>
                <button
                  type="button"
                  className="edu-btn edu-btn-outline text-xs"
                  onClick={() => setExpandedHistory(showHistory ? null : student.id)}
                >
                  {showHistory ? "إخفاء سجل الدخول" : "عرض سجل الدخول"}
                  {loginHistory.length ? ` (${loginHistory.length})` : ""}
                </button>
                <button
                  type="button"
                  className="edu-btn edu-btn-outline text-xs"
                  onClick={() =>
                    teacherSetNote(student.id, "يُنصح بمتابعة إكمال أوراق العمل والمحاكاة اليومية.")
                  }
                >
                  إضافة ملاحظة للطالب
                </button>
              </div>

              {showHistory ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  {loginHistory.length === 0 ? (
                    <p className="text-sm text-slate-500">لا توجد جلسات دخول مسجّلة لهذا الطالب.</p>
                  ) : (
                    <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
                      {[...loginHistory].reverse().map((entry, idx) => (
                        <li
                          key={`${entry.at}-${idx}`}
                          className="flex flex-wrap justify-between gap-2 rounded-md bg-white px-3 py-2"
                        >
                          <span className="font-medium text-slate-800">
                            {formatLoginDateTime(entry.at)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {entry.success === false ? "فشل" : "نجاح"}
                            {entry.userAgent ? ` — ${entry.userAgent.slice(0, 40)}…` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </EduCard>
          );
        })}
      </section>

      {progressDetails || progressDetailsLoading ? (
        <EduCard className="fixed inset-x-4 bottom-4 z-50 mx-auto max-h-[70vh] max-w-lg overflow-y-auto shadow-2xl md:inset-x-auto md:right-8 md:top-24" accent="violet" title="تفاصيل التقدم">
          {progressDetailsLoading ? (
            <p className="text-sm text-slate-600">جاري التحميل...</p>
          ) : (
            <>
              <p className="text-sm text-slate-700">
                النسبة: <LtrValue>{formatPercent(progressDetails.availableProgressPercent)}</LtrValue> —{" "}
                <LtrValue>
                  {formatFraction(progressDetails.completedRequiredItems, progressDetails.requiredItems)}
                </LtrValue>
              </p>
              <p className="mt-1 text-xs text-slate-500">{progressDetails.pathProgress?.pathLabelAr}</p>
              {progressDetails.assessmentSummary ? (
                <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50 p-3 text-sm">
                  <p className="font-bold text-violet-900">التقويم القبلي</p>
                  <p className="mt-1">
                    الحالة: {progressDetails.assessmentSummary.preAssessment.statusLabelAr}
                    {progressDetails.assessmentSummary.preAssessment.scorePercent != null
                      ? ` — ${progressDetails.assessmentSummary.preAssessment.scorePercent}%`
                      : ""}
                  </p>
                  {progressDetails.assessmentSummary.preAssessment.answeredCount != null ? (
                    <p className="text-xs text-slate-600">
                      الأسئلة المجابة: {progressDetails.assessmentSummary.preAssessment.answeredCount}
                      {progressDetails.assessmentSummary.preAssessment.totalQuestions
                        ? ` / ${progressDetails.assessmentSummary.preAssessment.totalQuestions}`
                        : ""}
                    </p>
                  ) : null}
                  {progressDetails.assessmentSummary.preAssessment.submittedAt ? (
                    <p className="text-xs text-slate-600">
                      وقت الإرسال: {formatLoginDateTime(progressDetails.assessmentSummary.preAssessment.submittedAt)}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-violet-800">
                    ملاحظة: النتيجة تشخيصية ولا تؤثر على فتح الدروس.
                  </p>
                  <p className="mt-3 font-bold text-violet-900">التقويم البعدي</p>
                  <p className="mt-1">{progressDetails.assessmentSummary.postAssessment.statusLabelAr}</p>
                  {progressDetails.assessmentSummary.postAssessment.scorePercent != null ? (
                    <p>{progressDetails.assessmentSummary.postAssessment.scorePercent}%</p>
                  ) : null}
                </div>
              ) : null}
              <ul className="mt-4 space-y-1 text-sm">
                {(progressDetails.details || []).map((item) => (
                  <li key={item.id} className="flex gap-2">
                    <span>{item.icon}</span>
                    <span>{item.labelAr}</span>
                    <span className="text-slate-500">— {item.status === "completed" ? "مكتمل" : "لم يبدأ"}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="edu-btn edu-btn-outline mt-4 text-sm"
                onClick={() => setProgressDetails(null)}
              >
                إغلاق
              </button>
            </>
          )}
        </EduCard>
      ) : null}
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
