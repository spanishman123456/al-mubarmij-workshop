import { SKUI_PROJECTS } from "../../data/skuiProjectsRegistry";

const DIFF_COLOR = {
  مبتدئ: "border-emerald-500/40 bg-emerald-950/30 text-emerald-200",
  متوسط: "border-amber-500/40 bg-amber-950/30 text-amber-200",
  متقدم: "border-rose-500/40 bg-rose-950/30 text-rose-200",
};

export function SkuiProjectGallery({ selectedId, onSelect }) {
  return (
    <div className="space-y-3" data-testid="skui-project-gallery">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-violet-100">قائمة المشروعات الرسومية</h3>
          <p className="text-xs text-slate-400">اختر مشروعًا مستقلًا بعنوانه وكوده وتلميحاته ومعاينته.</p>
        </div>
        <span className="text-xs text-slate-500">{SKUI_PROJECTS.length} مشروعًا</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SKUI_PROJECTS.map((project) => {
          const active = project.id === selectedId;
          return (
            <article
              key={project.id}
              className={`flex flex-col rounded-2xl border p-4 transition ${
                active
                  ? "border-violet-400 bg-violet-950/50 shadow-[0_0_0_1px_rgba(167,139,250,.35)]"
                  : "border-white/10 bg-white/[0.04] hover:border-violet-500/40 hover:bg-violet-950/20"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="text-3xl" aria-hidden>
                  {project.icon}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${DIFF_COLOR[project.difficulty]}`}>
                  {project.difficulty}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{project.titleAr}</h4>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-cyan-950/50 px-2 py-0.5 text-[10px] font-bold text-cyan-200">
                  {project.type}
                </span>
                {project.components.slice(0, 3).map((c) => (
                  <span key={c} dir="ltr" className="rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                    {c}
                  </span>
                ))}
              </div>
              <button
                type="button"
                data-testid={`start-project-${project.id}`}
                onClick={() => onSelect(project.id)}
                className={`mt-4 w-full rounded-xl py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-violet-500 text-white"
                    : "bg-gradient-to-l from-violet-600 to-indigo-600 text-white hover:brightness-110"
                }`}
              >
                {active ? "المشروع الحالي" : "ابدأ المشروع"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
