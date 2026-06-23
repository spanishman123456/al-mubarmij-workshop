import { Link, NavLink, useLocation } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";

export function NavBar() {
  const { pathname } = useLocation();
  const { user, logout } = usePlatform();
  const pathActive = pathname.startsWith("/path") || pathname.startsWith("/curriculum");
  const worksheetsActive = pathname.startsWith("/worksheets");
  const quizzesActive = pathname.startsWith("/quizzes");
  const simsActive = pathname.startsWith("/simulations");

  const dashLink = user?.role === "teacher" ? "/teacher" : user?.role === "student" ? "/student" : "/login";
  const dashLabel = user ? (user.role === "teacher" ? "لوحة المعلم" : "حسابي") : "دخول";

  return (
    <header
      id="app-navbar"
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0a0e1a]/90 backdrop-blur-md print:hidden"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="font-ar text-lg font-bold text-white">
          المبرمج الصغير{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            · موهبة
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1.5 text-sm">
          <NavLink to="/" className={({ isActive }) => `rounded-full px-3 py-1.5 font-ar ${isActive ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/10"}`} end>
            الرئيسية
          </NavLink>
          <NavLink to="/path" className={() => `rounded-full px-3 py-1.5 font-ar ${pathActive ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>
            المسار (15 يوم)
          </NavLink>
          <NavLink to="/python" className={({ isActive }) => `rounded-full px-3 py-1.5 font-ar ${isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>
            بايثون
          </NavLink>
          <NavLink to="/simulations" className={() => `rounded-full px-3 py-1.5 font-ar ${simsActive ? "bg-pink-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>
            محاكاة
          </NavLink>
          <NavLink to="/worksheets" className={() => `rounded-full px-3 py-1.5 font-ar ${worksheetsActive ? "bg-amber-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>
            أوراق عمل
          </NavLink>
          <NavLink to="/quizzes" className={() => `rounded-full px-3 py-1.5 font-ar ${quizzesActive ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>
            اختبارات
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `rounded-full px-3 py-1.5 font-ar ${isActive ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>
            مشروعات
          </NavLink>
          <NavLink to={dashLink} className={({ isActive }) => `rounded-full px-3 py-1.5 font-ar ${isActive ? "bg-white/20 text-white" : "text-slate-300 hover:bg-white/10"}`}>
            {dashLabel}
          </NavLink>
          {user ? (
            <button type="button" onClick={logout} className="rounded-full px-2 py-1.5 text-xs text-slate-500 hover:text-white">
              خروج
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
