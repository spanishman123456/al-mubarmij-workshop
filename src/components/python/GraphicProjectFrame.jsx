export function GraphicProjectFrame({ project, children, runStatus = null }) {
  if (!project) return children;

  const edu = project.edu || {};
  const usage = edu.usageSteps || project.usageSteps || [];

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-violet-500/35 bg-gradient-to-l from-violet-950/50 to-indigo-950/40 p-5 text-center">
        <div className="mb-2 text-3xl" aria-hidden>
          {project.icon || "🧩"}
        </div>
        <h2 className="text-xl font-bold text-violet-100" data-testid="skui-project-title">
          {project.titleAr}
        </h2>
        {edu.subtitle || project.description ? (
          <p className="mt-2 text-sm text-slate-300">{edu.subtitle || project.description}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-[11px]">
          {project.type ? (
            <span className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-cyan-200">
              {project.type}
            </span>
          ) : null}
          {project.difficulty ? (
            <span className="rounded-full border border-amber-500/30 bg-amber-950/40 px-2.5 py-1 text-amber-200">
              {project.difficulty}
            </span>
          ) : null}
        </div>
      </header>

      {usage.length ? (
        <section className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
          <h3 className="mb-2 text-sm font-bold text-cyan-200">طريقة الاستخدام</h3>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-300">
            {usage.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {runStatus ? (
        <div
          className={`rounded-xl border px-3 py-2 text-center text-sm font-bold ${
            runStatus.kind === "loading"
              ? "border-violet-500/40 bg-violet-950/40 text-violet-100"
              : runStatus.kind === "success"
                ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-100"
                : runStatus.kind === "code-error"
                  ? "border-amber-500/40 bg-amber-950/30 text-amber-100"
                  : "border-rose-500/40 bg-rose-950/30 text-rose-100"
          }`}
          data-testid="skui-run-status"
        >
          {runStatus.message}
        </div>
      ) : null}

      {children}
    </div>
  );
}
