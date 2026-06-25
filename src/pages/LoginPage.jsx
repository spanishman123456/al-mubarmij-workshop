import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { toFriendlyAuthMessage } from "../lib/authApi.js";
import { MawhibaBrand, SiteTitle } from "../components/branding/MawhibaBrand";

export default function LoginPage() {
  const { loginStudentByNationalId, loginTeacher, authReady } = usePlatform();
  const navigate = useNavigate();
  const [tab, setTab] = useState("student");
  const [nationalId, setNationalId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [helpText, setHelpText] = useState("");
  const [loading, setLoading] = useState(false);
  const submitLock = useRef(false);

  if (!authReady) return null;

  async function submitStudent(e) {
    e.preventDefault();
    if (submitLock.current) return;
    submitLock.current = true;
    setError("");
    setHelpText("");
    setLoading(true);
    try {
      const res = await loginStudentByNationalId(nationalId);
      if (!res?.ok) {
        setError(res?.message || "تعذر تسجيل الدخول. حاول مجدداً.");
        if (res?.helpAr) setHelpText(res.helpAr);
        return;
      }
      navigate("/student", { replace: true });
    } catch (err) {
      setError(toFriendlyAuthMessage(err));
    } finally {
      setLoading(false);
      submitLock.current = false;
    }
  }

  async function submitTeacher(e) {
    e.preventDefault();
    if (submitLock.current) return;
    submitLock.current = true;
    setError("");
    setHelpText("");
    setLoading(true);
    try {
      const res = await loginTeacher(username, password);
      if (!res?.ok) {
        setError(res?.message || "تعذر تسجيل الدخول. حاول مجدداً.");
        return;
      }
      navigate("/teacher", { replace: true });
    } catch (err) {
      setError(toFriendlyAuthMessage(err, "بيانات الدخول غير صحيحة."));
    } finally {
      setLoading(false);
      submitLock.current = false;
    }
  }

  return (
    <div className="login-page min-h-screen" dir="rtl">
      <header className="login-hero">
        <div className="login-hero-inner">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <MawhibaBrand variant="banner" className="justify-start" />
            <div className="flex gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">AR</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <SiteTitle subtitle="منصة تعليمية تفاعلية — برنامج موهبة الإثرائي" light />
            <p className="mx-auto mt-3 max-w-xl text-sm text-violet-100/90">
              سجّل الدخول برقم الهوية لمتابعة دروسك، محاكياتك، وأوراق عملك في وحدة برمجة الحاسب
            </p>
          </div>
        </div>
      </header>

      <div className="login-body">
        <div className="login-card">
          <div className="mb-6 flex justify-center">
            <MawhibaBrand variant="vertical" />
          </div>

          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setTab("student");
                setError("");
                setHelpText("");
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${
                tab === "student" ? "bg-violet-700 text-white shadow" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              دخول الطالب
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("teacher");
                setError("");
                setHelpText("");
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${
                tab === "teacher" ? "bg-violet-700 text-white shadow" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              دخول المعلم
            </button>
          </div>

          {error ? (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm">
              <p className="font-semibold text-red-700">{error}</p>
              {helpText ? <p className="mt-2 text-red-600">{helpText}</p> : null}
            </div>
          ) : null}

          {tab === "student" ? (
            <form onSubmit={submitStudent} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">رقم الهوية الوطنية</span>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg tracking-widest text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="أدخل رقم الهوية"
                  autoComplete="off"
                  required
                  disabled={loading}
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-violet-700 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-violet-800 disabled:opacity-60"
              >
                {loading ? "جاري التحقق..." : "دخول"}
              </button>
              <p className="text-center text-xs text-slate-500">
                يُسمح بالدخول فقط للطلاب المسجلين في النظام الرسمي. جلسة واحدة نشطة لكل حساب.
              </p>
            </form>
          ) : (
            <form onSubmit={submitTeacher} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">رقم الهوية</span>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg tracking-widest text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="أدخل رقم الهوية"
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">كلمة المرور</span>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-violet-700 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-violet-800 disabled:opacity-60"
              >
                {loading ? "جاري الدخول..." : "دخول المعلم"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-emerald-600">● النظام محمي — يتطلب تسجيل دخول صالح</p>
        </div>
      </div>
    </div>
  );
}
