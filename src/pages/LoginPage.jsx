import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { DEMO_STUDENTS } from "../data/demoUsers";

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
    <main className="mx-auto max-w-lg px-4 pb-16 pt-24 font-ar text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-white">تسجيل الدخول</h1>
      <p className="mt-2 text-slate-400">منصة موهبة — وحدة برمجة الحاسب (صفوف 6–8)</p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <label className="block text-sm">
          اسم المستخدم
          <input className="mt-1 w-full rounded-lg border border-white/10 bg-[#0a0e1a] px-3 py-2 text-white" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="block text-sm">
          كلمة المرور
          <input type="password" className="mt-1 w-full rounded-lg border border-white/10 bg-[#0a0e1a] px-3 py-2 text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 py-3 font-bold text-white">
          دخول
        </button>
      </form>
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
        <p className="font-bold text-slate-200">حسابات تجريبية:</p>
        <p>معلم: teacher / teacher123</p>
        <p>طالب: {DEMO_STUDENTS[0].username} / {DEMO_STUDENTS[0].password}</p>
      </div>
      <Link to="/" className="mt-6 inline-block text-violet-300 hover:underline">← العودة للرئيسية</Link>
    </main>
  );
}
