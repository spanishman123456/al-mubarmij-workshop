import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";

const LINKS = [
  { to: "/", label: "الرئيسية", end: true, active: "bg-violet-600" },
  { to: "/path", label: "المسار (15 يوم)", match: ["/path", "/curriculum"], active: "bg-violet-600" },
  { to: "/python", label: "بايثون", active: "bg-emerald-600" },
  { to: "/simulations", label: "محاكاة", match: ["/simulations"], active: "bg-pink-600" },
  { to: "/worksheets", label: "أوراق عمل", match: ["/worksheets"], active: "bg-amber-600" },
  { to: "/quizzes", label: "اختبارات", match: ["/quizzes"], active: "bg-sky-600" },
  { to: "/projects", label: "مشروعات", active: "bg-cyan-600" },
];

function isLinkActive(pathname, link) {
  if (link.end) return pathname === link.to;
  if (link.match) return link.match.some((m) => pathname.startsWith(m));
  return pathname.startsWith(link.to);
}

export function NavBar() {
  const { pathname } = useLocation();
  const { user, logout } = usePlatform();
  const [open, setOpen] = useState(false);

  const dashLink = user?.role === "teacher" ? "/teacher" : user?.role === "student" ? "/student" : "/login";
  const dashLabel = user ? (user.role === "teacher" ? "لوحة المعلم" : "حسابي") : "دخول";

  return (
    <header
      id="app-navbar"
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0a0e1a]/95 backdrop-blur-md print:hidden"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="font-ar text-lg font-bold text-white">
          المبرمج الصغير{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            · موهبة
          </span>
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav
          className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-1 border-b border-white/10 bg-[#0a0e1a] p-4 md:static md:flex md:flex-row md:flex-wrap md:items-center md:border-0 md:bg-transparent md:p-0`}
        >
          {LINKS.map((link) => {
            const active = isLinkActive(pathname, link);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={`rounded-full px-3 py-2 font-ar text-sm font-medium transition ${
                  active
                    ? `${link.active} text-white shadow-md`
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
          <NavLink
            to={dashLink}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `rounded-full px-3 py-2 font-ar text-sm font-medium transition ${
                isActive ? "bg-white/20 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {dashLabel}
          </NavLink>
          {user ? (
            <button
              type="button"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="rounded-full px-3 py-2 text-xs text-slate-500 hover:bg-white/10 hover:text-white md:py-1.5"
            >
              خروج
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
