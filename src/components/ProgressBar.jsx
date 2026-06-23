export function ProgressBar({ value = 0, label, className = "" }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={`font-ar ${className}`}>
      {label ? <div className="mb-1 flex justify-between text-xs text-slate-400">{label}<span>{v}%</span></div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
