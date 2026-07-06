import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getWorksheet15ById } from "../data/worksheets15Days";
import { WORKSHEET_MODEL_ANSWERS } from "../content/teacher/worksheetModelAnswers.js";
import { usePlatform } from "../context/PlatformContext";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { registerDraftSaver } from "../lib/draftFlush.js";
import { isTeacherRole, TEACHER_PREVIEW_BADGE_AR } from "../config/publication";
import {
  canStudentOpenWorksheet,
  getTeacherWorksheetBadge,
  studentWorksheetLockedMessage,
  WorksheetAccessState,
  getWorksheetAccessState,
} from "../lib/worksheetAccess";

export default function WorksheetDetailPage() {
  const { worksheetId } = useParams();
  const ws = getWorksheet15ById(worksheetId);
  const { user, myProgress, myStats, saveWorksheetAnswers } = usePlatform();
  const saved = myProgress?.worksheetAnswers?.[worksheetId]?.answers ?? {};
  const status = myProgress?.worksheetStatus?.[worksheetId] ?? "not_started";
  const isTeacher = isTeacherRole(user?.role);
  const dayUnlockMap = myStats?.dayUnlock?.dayUnlockMap;

  const [answers, setAnswers] = useState(saved);
  const [notice, setNotice] = useState("");

  const access =
    ws && user
      ? getWorksheetAccessState({
          role: user.role,
          dayId: ws.dayId,
          dayUnlockMap,
          myStats,
        })
      : WorksheetAccessState.OPEN;

  useEffect(() => {
    setAnswers(saved);
  }, [worksheetId, saved]);

  useEffect(() => {
    if (!user?.id || user.role !== "student") return undefined;
    if (!canStudentOpenWorksheet({ dayId: ws?.dayId, dayUnlockMap, myStats })) return undefined;
    return registerDraftSaver(() => {
      saveWorksheetAnswers(worksheetId, answers, "in_progress");
    });
  }, [user?.id, user?.role, worksheetId, answers, saveWorksheetAnswers, ws?.dayId, dayUnlockMap, myStats]);

  if (!ws) {
    return (
      <PageShell title="ورقة العمل">
        <EduCard>
          <p className="edu-text">لم تُعثر على ورقة العمل المطلوبة.</p>
          <Link to="/worksheets" className="edu-btn edu-btn-outline mt-4 inline-flex">
            العودة لأوراق العمل
          </Link>
        </EduCard>
      </PageShell>
    );
  }

  if (user?.role === "student" && access !== WorksheetAccessState.OPEN) {
    const locked = access === WorksheetAccessState.LOCKED;
    return (
      <PageShell title={locked ? "ورقة العمل مقفلة" : "المحتوى غير متاح بعد"} badge="أوراق العمل">
        <EduCard accent="amber">
          <p className="text-lg font-semibold text-slate-800">
            {studentWorksheetLockedMessage(ws.dayId, dayUnlockMap)}
          </p>
          <Link to="/worksheets" className="edu-btn edu-btn-outline mt-4 inline-flex">
            العودة لأوراق العمل
          </Link>
        </EduCard>
      </PageShell>
    );
  }

  const teacherBadge = isTeacher ? getTeacherWorksheetBadge(ws.dayId, myStats) : null;
  const model = WORKSHEET_MODEL_ANSWERS[worksheetId];

  function save(submit = false) {
    if (!user || user.role !== "student") {
      setNotice("سجّل الدخول كطالب لحفظ إجاباتك.");
      return;
    }
    saveWorksheetAnswers(worksheetId, answers, submit ? "completed" : "in_progress");
    setNotice(submit ? "تم إرسال الورقة للمعلم ✓" : "تم حفظ الإجابات");
  }

  return (
    <PageShell
      title={ws.titleAr}
      subtitle={ws.introAr}
      badge={`الأسبوع ${ws.weekNumber} — اليوم ${ws.dayNumber}`}
    >
      {isTeacher ? (
        <EduCard className="mb-6" accent="amber">
          <p className="font-semibold text-amber-900">معاينة المعلم — {teacherBadge?.label}</p>
          <p className="mt-2 text-sm text-amber-800">{TEACHER_PREVIEW_BADGE_AR}</p>
          {model?.teacherDayRoute ? (
            <Link to={model.teacherDayRoute} className="edu-btn edu-btn-outline mt-3 inline-flex text-sm">
              مفتاح إجابات اليوم في لوحة المعلم
            </Link>
          ) : null}
        </EduCard>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center gap-3 no-print">
        <Link to="/worksheets" className="text-sm font-semibold text-violet-700 hover:text-violet-900">
          ← كل أوراق العمل
        </Link>
        {!isTeacher ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              status === "completed"
                ? "bg-emerald-100 text-emerald-800"
                : status === "in_progress"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {status === "completed" ? "مكتملة" : status === "in_progress" ? "قيد العمل" : "لم تبدأ"}
          </span>
        ) : null}
        <button type="button" onClick={() => window.print()} className="edu-btn edu-btn-outline text-sm">
          طباعة
        </button>
      </div>

      <p className="mb-6 text-sm font-medium text-violet-800">الموضوع: {ws.topicAr}</p>

      <div className="space-y-6">
        {ws.tasks.map((task) => {
          const modelTask = model?.tasks?.find((t) => t.n === task.n);
          return (
            <EduCard key={task.n} accent="violet">
              <h2 className="font-bold text-violet-800">السؤال {task.n}.</h2>
              {task.pdfRef ? (
                <span className="mt-1 inline-block text-xs font-medium text-slate-500">مرجع PDF: {task.pdfRef}</span>
              ) : null}
              <p className="mt-2 leading-relaxed text-slate-800">{task.textAr}</p>

              {isTeacher && modelTask ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm print:hidden">
                  <p className="font-bold text-emerald-900">الإجابة النموذجية (للمعلم)</p>
                  <p className="mt-2 whitespace-pre-wrap text-emerald-800">{modelTask.modelAr}</p>
                  {modelTask.stepsAr?.length ? (
                    <ol className="mt-2 list-decimal pr-5 text-emerald-700">
                      {modelTask.stepsAr.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              ) : (
                <label className="mt-4 block print:hidden">
                  <span className="edu-label">مساحة الإجابة</span>
                  <textarea
                    className="edu-input min-h-[100px]"
                    value={answers[task.n] ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [task.n]: e.target.value }))}
                    placeholder="اكتب إجابتك هنا..."
                  />
                </label>
              )}

              <div className="mt-4 hidden border-b border-dashed border-slate-300 pb-12 print:block" />
            </EduCard>
          );
        })}
      </div>

      {!isTeacher ? (
        <>
          <div className="mt-8 flex flex-wrap gap-3 no-print">
            <button type="button" onClick={() => save(false)} className="edu-btn edu-btn-outline">
              حفظ المسودة
            </button>
            <button type="button" onClick={() => save(true)} className="edu-btn edu-btn-primary">
              إرسال للمعلم
            </button>
          </div>
          {notice ? (
            <p className="mt-4 rounded-lg bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800">{notice}</p>
          ) : null}
        </>
      ) : null}
    </PageShell>
  );
}
