export function ProgressBar({ value = 0, label, className = "", variant = "light" }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const isDark = variant === "dark";
  return (
    <div className={`font-ar ${className}`}>
      {label ? (
        <div
          className={`mb-1 flex justify-between text-xs ${isDark ? "text-violet-100" : "text-slate-600"}`}
        >
          {label}
          <span className="font-bold">{v}%</span>
        </div>
      ) : null}
      <div className={`h-2.5 overflow-hidden rounded-full ${isDark ? "bg-white/20" : "bg-slate-200"}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
