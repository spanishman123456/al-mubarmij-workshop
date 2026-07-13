import { SKUI_PROJECTS } from "../../data/skuiProjectsRegistry";

const DIFF_COLOR = {
  مبتدئ: "border-emerald-500/40 bg-emerald-950/30 text-emerald-200",
  متوسط: "border-amber-500/40 bg-amber-950/30 text-amber-200",
  متقدم: "border-rose-500/40 bg-rose-950/30 text-rose-200",
};

const ADVANCED_PROJECT_IDS = new Set([
  "algorithm-lab",
  "cipher-escape",
  "smart-city-ops",
  "app-algorithm-lab",
  "app-cipher-escape",
  "app-smart-city-ops",
]);

const KNOWN_BLOCKED_IDS = new Set(["app-timer", "app-colors"]);

function isAdvancedProject(project) {
  return (
    ADVANCED_PROJECT_IDS.has(project.id) ||
    project.category === "advanced" ||
    project.category === "advanced-final" ||
    project.track === "advanced-final" ||
    project.finalProject === true
  );
}

function isBlockedProject(project) {
  return project.status === "blocked" || project.blocked === true || KNOWN_BLOCKED_IDS.has(project.id);
}

export function SkuiProjectGallery({ selectedId, onSelect, role }) {
  const visibleProjects = SKUI_PROJECTS.filter(
    (project) => !(role === "student" && isBlockedProject(project)),
  );
  const advancedProjects = visibleProjects.filter(isAdvancedProject);
  const approvedAdvancedProjects = advancedProjects.filter(
    (project) => project.status === "approved" && Number(project.rubricScore) >= 85,
  );
  const qaAdvancedProjects = advancedProjects.filter(
    (project) => !approvedAdvancedProjects.includes(project),
  );
  const trainingProjects = visibleProjects.filter((project) => !isAdvancedProject(project));

  const renderProject = (project) => {
    const active = project.id === selectedId;
    const blocked = isBlockedProject(project);
    const disabled = blocked && role !== "teacher";

    return (
      <article
        key={project.id}
        aria-disabled={disabled || undefined}
        className={`flex flex-col rounded-2xl border p-4 transition ${
          disabled
            ? "cursor-not-allowed border-slate-700/60 bg-slate-950/60 opacity-60"
            : active
              ? "border-violet-400 bg-violet-950/50 shadow-[0_0_0_1px_rgba(167,139,250,.35)]"
              : "border-white/10 bg-white/[0.04] hover:border-violet-500/40 hover:bg-violet-950/20"
        }`}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="text-3xl" aria-hidden>
            {project.icon}
          </span>
          <div className="flex flex-wrap justify-end gap-1">
            {blocked ? (
              <span className="rounded-full border border-slate-500/50 bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                محجوب للاختبار
              </span>
            ) : null}
            {project.status === "qa" ? (
              <span className="rounded-full border border-amber-500/50 bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                نموذج قيد QA
              </span>
            ) : null}
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${DIFF_COLOR[project.difficulty] ?? DIFF_COLOR.متوسط}`}>
              {project.difficulty}
            </span>
          </div>
        </div>
        <h4 className="text-sm font-bold text-white">{project.titleAr}</h4>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-cyan-950/50 px-2 py-0.5 text-[10px] font-bold text-cyan-200">
            {project.type}
          </span>
          {(project.components ?? []).slice(0, 3).map((component) => (
            <span key={component} dir="ltr" className="rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              {component}
            </span>
          ))}
        </div>
        <button
          type="button"
          data-testid={`start-project-${project.id}`}
          onClick={() => onSelect?.(project.id)}
          disabled={disabled}
          className={`mt-4 w-full rounded-xl py-2.5 text-sm font-bold transition ${
            disabled
              ? "cursor-not-allowed bg-slate-800 text-slate-500"
              : active
                ? "bg-violet-500 text-white"
                : "bg-gradient-to-l from-violet-600 to-indigo-600 text-white hover:brightness-110"
          }`}
        >
          {disabled ? "غير متاح حاليًا" : active ? "المشروع الحالي" : "ابدأ المشروع"}
        </button>
      </article>
    );
  };

  return (
    <div className="space-y-6" data-testid="skui-project-gallery">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-violet-100">قائمة المشروعات الرسومية</h3>
          <p className="text-xs text-slate-400">اختر مشروعًا مستقلًا بعنوانه وكوده وتلميحاته ومعاينته.</p>
        </div>
        <span className="text-xs text-slate-500">{visibleProjects.length} مشروعًا</span>
      </div>
      <section aria-labelledby="advanced-projects-title" className="space-y-3">
        <div>
          <h4 id="advanced-projects-title" className="font-bold text-amber-200">المشروعات النهائية المتقدمة</h4>
          <p className="text-xs text-slate-400">تجارب متكاملة متعددة المشاهد لعرض مهارات المشروع النهائي.</p>
        </div>
        {approvedAdvancedProjects.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{approvedAdvancedProjects.map(renderProject)}</div>
        ) : (
          <p className="rounded-xl border border-dashed border-amber-500/20 bg-amber-950/10 p-3 text-xs text-slate-500">
            ستظهر المشروعات النهائية هنا عند اعتمادها للنشر.
          </p>
        )}
      </section>
      {qaAdvancedProjects.length ? (
        <section aria-labelledby="advanced-prototypes-title" className="space-y-3">
          <div>
            <h4 id="advanced-prototypes-title" className="font-bold text-cyan-200">نماذج متقدمة قيد التقييم</h4>
            <p className="text-xs text-slate-400">لا تُصنّف مشروعات نهائية قبل اجتياز 85/100 وبوابات الاستقرار والتصدير.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{qaAdvancedProjects.map(renderProject)}</div>
        </section>
      ) : null}
      <section aria-labelledby="training-projects-title" className="space-y-3">
        <div>
          <h4 id="training-projects-title" className="font-bold text-violet-100">تمارين ومشروعات تدريبية مصغرة</h4>
          <p className="text-xs text-slate-400">تطبيقات قصيرة للتدرّب على مكوّن أو فكرة برمجية محددة.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{trainingProjects.map(renderProject)}</div>
      </section>
    </div>
  );
}
