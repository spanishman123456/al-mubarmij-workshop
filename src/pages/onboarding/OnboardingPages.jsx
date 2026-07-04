import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";
import { fetchOnboardingStatus } from "../../lib/platformApi";

const GATE_PATHS = ["/path", "/curriculum", "/simulations", "/python", "/worksheets", "/quizzes", "/projects"];

export function OnboardingGate({ children }) {
  const { user, isStudentSession } = usePlatform();
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const needsGate = isStudentSession && GATE_PATHS.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (!needsGate || !user?.id) {
      setLoading(false);
      return;
    }
    fetchOnboardingStatus(user.id)
      .then((res) => setStatus(res))
      .catch(() => setStatus({ complete: false }))
      .finally(() => setLoading(false));
  }, [needsGate, user?.id, location.pathname]);

  if (!needsGate) return children;
  if (loading) return null;
  if (status && !status.complete && !location.pathname.startsWith("/onboarding")) {
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

  const items = [
    { to: "/onboarding/bingo", label: "نشاط BINGO — كسر الجليد", key: "bingo", done: status?.bingo?.status === "submitted" },
    { to: "/onboarding/honor-code", label: "مدونة الشرف", key: "honor_code", done: status?.agreements?.honor_code?.status === "signed" },
    { to: "/onboarding/acceptable-use", label: "سياسة الاستخدام المناسب", key: "acceptable_use", done: status?.agreements?.acceptable_use?.status === "signed" },
    { to: "/onboarding/honor-agreement", label: "اتفاقية مدونة الشرف", key: "honor_agreement", done: status?.agreements?.honor_agreement?.status === "signed" },
    { to: "/onboarding/tech-contract", label: "عقد استخدام التقنيات", key: "tech_contract", done: status?.agreements?.tech_contract?.status === "signed" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-900">القسم التمهيدي — برمجة الحاسب</h1>
      <p className="text-slate-600">
        أكمل جميع العناصر التالية قبل بدء مسار الـ15 يوماً. تُحفظ إجاباتك وتوقيعاتك على الخادم.
      </p>
      {status?.complete ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          اكتمل التمهيد. يمكنك <Link className="font-bold underline" to="/path">بدء المسار الدراسي</Link>.
        </div>
      ) : null}
      <ul className="space-y-3">
        {items.map((it) => (
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
    </div>
  );
}
