import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { DEMO_STUDENTS } from "../data/demoUsers";
import { PageShell, EduCard } from "../components/layout/PageShell";

export default function LoginPage() {
  const { login, user } = usePlatform();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate(user.role === "teacher" ? "/teacher" : "/student", { replace: true });
    }
  }, [user, navigate]);

  if (user) return null;

  function submit(e) {
    e.preventDefault();
    const res = login(username, password);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    navigate(res.user.role === "teacher" ? "/teacher" : "/student");
  }

  return (
    <PageShell
      title="تسجيل الدخول"
      subtitle="منصة المبرمج الصغير — وحدة برمجة الحاسب لبرنامج موهبة الأكاديمي (صفوف 6–8)"
      badge="حسابات تجريبية متاحة"
    >
      <div className="mx-auto max-w-md">
        <EduCard>
          <form onSubmit={submit} className="space-y-5">
            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
            ) : null}
            <label className="block">
              <span className="edu-label">اسم المستخدم</span>
              <input
                className="edu-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label className="block">
              <span className="edu-label">كلمة المرور</span>
              <input
                type="password"
                className="edu-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit" className="edu-btn edu-btn-primary w-full py-3">
              دخول
            </button>
          </form>
        </EduCard>

        <EduCard className="mt-6" title="حسابات تجريبية" accent="violet">
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-bold text-slate-900">معلم:</span> teacher / teacher123
            </p>
            <p>
              <span className="font-bold text-slate-900">طالب:</span> {DEMO_STUDENTS[0].username} /{" "}
              {DEMO_STUDENTS[0].password}
            </p>
            <p className="edu-muted mt-2">
              بعد الدخول ستظهر لوحة تحكم تعرض تقدمك، اختباراتك، وأوراق عملك.
            </p>
          </div>
        </EduCard>

        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900">
          ← العودة للرئيسية
        </Link>
      </div>
    </PageShell>
  );
}
