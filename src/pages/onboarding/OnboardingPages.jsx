import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";
import { fetchOnboardingStatus } from "../../lib/platformApi";
import {
  PRE_ASSESSMENT_HUB_HINT,
  PRE_ASSESSMENT_INTRO_AR,
  PRE_ASSESSMENT_STATUS,
  PRE_ASSESSMENT_STATUS_LABELS,
} from "../../content/onboarding/onboardingPolicy";

const GATE_PATHS = ["/path", "/curriculum", "/simulations", "/python", "/worksheets", "/quizzes", "/projects"];
const ONBOARDING_ALLOWED_PREFIXES = ["/onboarding", "/quizzes/run/quiz-pre", "/quizzes/take/quiz-pre"];

function preAssessmentBadge(status) {
  if (status === PRE_ASSESSMENT_STATUS.SUBMITTED) {
    return { text: PRE_ASSESSMENT_STATUS_LABELS.submitted, cls: "text-emerald-600" };
  }
  if (status === PRE_ASSESSMENT_STATUS.DEFERRED) {
    return { text: PRE_ASSESSMENT_STATUS_LABELS.deferred, cls: "text-sky-600" };
  }
  if (status === PRE_ASSESSMENT_STATUS.IN_PROGRESS) {
    return { text: PRE_ASSESSMENT_STATUS_LABELS.in_progress, cls: "text-violet-600" };
  }
  return { text: "يمكنك إكماله لاحقًا", cls: "text-slate-500" };
}

export function OnboardingGate({ children }) {
  const { user, isStudentSession } = usePlatform();
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDemoStudent = Boolean(user?.isDemo);
  const needsGate = isStudentSession && !isDemoStudent && GATE_PATHS.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (!needsGate || !user?.id) {
      setLoading(false);
      return;
    }
    fetchOnboardingStatus(user.id)
      .then((res) => setStatus(res))
      .catch(() => setStatus({ canAccessDayOne: false }))
      .finally(() => setLoading(false));
  }, [needsGate, user?.id, location.pathname]);

  if (!needsGate) return children;
  if (loading) return null;

  const canAccess =
    status?.canAccessDayOne ??
    status?.requiredComplete ??
    status?.complete;

  if (!canAccess && !ONBOARDING_ALLOWED_PREFIXES.some((p) => location.pathname.startsWith(p))) {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export function OnboardingHub() {
  const { user } = usePlatform();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchOnboardingStatus(user.id).then(setStatus).catch(() => setStatus(null));
  }, [user?.id]);

  const requiredItems = [
    { to: "/onboarding/bingo", label: "نشاط BINGO — كسر الجليد", done: status?.bingo?.status === "submitted" },
    { to: "/onboarding/honor-code", label: "مدونة الشرف", done: status?.agreements?.honor_code?.status === "signed" },
    {
      to: "/onboarding/acceptable-use",
      label: "سياسة الاستخدام المناسب",
      done: status?.agreements?.acceptable_use?.status === "signed",
    },
    {
      to: "/onboarding/honor-agreement",
      label: "اتفاقية مدونة الشرف",
      done: status?.agreements?.honor_agreement?.status === "signed",
    },
    {
      to: "/onboarding/tech-contract",
      label: "عقد استخدام التقنيات",
      done: status?.agreements?.tech_contract?.status === "signed",
    },
  ];

  const preStatus = status?.preAssessment?.status || PRE_ASSESSMENT_STATUS.NOT_STARTED;
  const preBadge = preAssessmentBadge(preStatus);
  const canStartDayOne = Boolean(status?.canAccessDayOne ?? status?.requiredComplete);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-900">القسم التمهيدي — برمجة الحاسب</h1>
      <p className="text-slate-600">
        أكمل الاتفاقيات والأنشطة التنظيمية الأساسية لبدء الدرس الأول. التقويم القبلي تقويم تشخيصي اختياري
        يمكن إكماله الآن أو لاحقًا.
      </p>

      {canStartDayOne ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <p className="font-semibold">يمكنك بدء الدرس الأول الآن.</p>
          <p className="mt-1 text-sm">{PRE_ASSESSMENT_INTRO_AR}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/path/day/day-01" className="edu-btn edu-btn-primary inline-flex">
              بدء الدرس الأول
            </Link>
            <Link to="/path" className="edu-btn edu-btn-outline inline-flex">
              المسار الدراسي
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          أكمل العناصر المطلوبة أدناه (BINGO والاتفاقيات) للانتقال إلى الدرس الأول.
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-800">متطلبات البدء</h2>
        <ul className="space-y-3">
          {requiredItems.map((it) => (
            <li key={it.to}>
              <Link
                to={it.to}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-violet-300"
              >
                <span className="font-semibold text-slate-800">{it.label}</span>
                <span className={`text-xs font-bold ${it.done ? "text-emerald-600" : "text-amber-600"}`}>
                  {it.done ? "مكتمل" : "مطلوب"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-bold text-slate-800">التقويم القبلي</h2>
        <p className="mb-3 text-sm text-slate-600">{PRE_ASSESSMENT_HUB_HINT}</p>
        <Link
          to="/quizzes/run/quiz-pre"
          className="flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-3 shadow-sm hover:border-violet-300"
        >
          <div>
            <span className="font-semibold text-slate-800">التقويم القبلي — تقويم تشخيصي</span>
            <p className="mt-1 text-xs text-slate-500">{PRE_ASSESSMENT_INTRO_AR}</p>
          </div>
          <span className={`text-xs font-bold ${preBadge.cls}`}>{preBadge.text}</span>
        </Link>
      </section>
    </div>
  );
}
