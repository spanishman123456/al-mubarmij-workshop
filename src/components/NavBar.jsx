import { Link, NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0a0e1a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-ar text-lg font-bold text-white">
          المبرمج الصغير{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            · ورشة برمجة الحاسب
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 font-ar transition ${isActive ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/10"}`
            }
            end
          >
            الرئيسية
          </NavLink>
          <NavLink
            to="/curriculum"
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 font-ar transition ${isActive ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/10"}`
            }
          >
            المسار الدراسي
          </NavLink>
          <NavLink
            to="/python"
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 font-ar transition ${isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-white/10"}`
            }
          >
            مختبر بايثون
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
