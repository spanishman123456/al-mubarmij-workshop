import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { DEMO_STUDENT_LOGIN_CODE } from "../lib/demo/demoStudentProfile";

export default function DemoStudentEntryPage() {
  const { authReady, loginDemoStudent } = usePlatform();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startDemo() {
    setError("");
    setLoading(true);
    const res = await loginDemoStudent();
    setLoading(false);
    if (!res.ok) {
      setError(res.message || "تعذّر بدء التجربة.");
      return;
    }
    navigate("/student", { replace: true });
  }

  if (!authReady) return null;

  return (
    <div className="mx-auto max-w-2xl p-6" dir="rtl">
      <div className="rounded-2xl border border-violet-200 bg-white p-6 shadow">
        <h1 className="text-2xl font-extrabold text-violet-800">تجربة المنصة كطالب تجريبي</h1>
        <p className="mt-3 text-sm text-slate-700">
          أنت على وشك الدخول بحساب تجريبي آمن لتجربة الدروس المنشورة، الأنشطة التفاعلية، ومختبر بايثون بدون
          الحاجة إلى رقم هوية طالب حقيقي.
        </p>
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          <p>
            <span className="font-bold">رمز الدخول التجريبي:</span>{" "}
            <span dir="ltr" className="font-mono">
              {DEMO_STUDENT_LOGIN_CODE}
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500">هذا رمز داخلي تجريبي وليس رقم هوية وطنية حقيقي.</p>
        </div>
        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            data-testid="demo-start"
            onClick={startDemo}
            disabled={loading}
            className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800 disabled:opacity-60"
          >
            {loading ? "جاري تجهيز التجربة..." : "ابدأ التجربة"}
          </button>
          <Link to="/login?demo=student" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
            صفحة الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
