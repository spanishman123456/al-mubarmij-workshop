import { useState } from "react";

function Section({ title, children, defaultOpen = true, accent = "cyan" }) {
  const [open, setOpen] = useState(defaultOpen);
  const border = {
    cyan: "border-cyan-500/30 bg-cyan-950/20",
    violet: "border-violet-500/30 bg-violet-950/20",
    emerald: "border-emerald-500/30 bg-emerald-950/20",
    amber: "border-amber-500/30 bg-amber-950/20",
  }[accent];
  const heading = {
    cyan: "text-cyan-200",
    violet: "text-violet-200",
    emerald: "text-emerald-200",
    amber: "text-amber-200",
  }[accent];

  return (
    <section className={`rounded-xl border p-4 ${border}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between text-right text-sm font-bold ${heading}`}
      >
        <span>{title}</span>
        <span className="text-xs opacity-70">{open ? "▼" : "◀"}</span>
      </button>
      {open ? <div className="mt-3 text-sm leading-relaxed text-slate-200">{children}</div> : null}
    </section>
  );
}

function BulletList({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="list-inside list-disc space-y-1.5 text-slate-300">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function GraphicProjectFrame({ project, children }) {
  if (!project) return children;

  const edu = project.edu || {};

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-violet-500/35 bg-gradient-to-l from-violet-950/50 to-indigo-950/40 p-5 text-center">
        <h2 className="text-xl font-bold text-violet-100">{project.titleAr}</h2>
        {edu.subtitle ? <p className="mt-2 text-base text-violet-200/90">{edu.subtitle}</p> : null}
        {edu.description ? <p className="mt-2 text-sm text-slate-300">{edu.description}</p> : null}
      </header>

      {edu.usageSteps?.length ? (
        <Section title="طريقة الاستخدام" accent="cyan" defaultOpen>
          <BulletList items={edu.usageSteps} />
        </Section>
      ) : null}

      {children}

      {edu.learningObjectives?.length ? (
        <Section title="ماذا ستتعلم من هذا المشروع؟" accent="emerald" defaultOpen={false}>
          <BulletList items={edu.learningObjectives} />
        </Section>
      ) : null}

      {edu.curriculumLink ? (
        <Section title="ارتباط المشروع بمنهج برمجة الحاسب" accent="violet" defaultOpen={false}>
          <p className="text-slate-300">{edu.curriculumLink}</p>
        </Section>
      ) : null}

      {edu.codeHowItWorks?.length ? (
        <Section title="كيف يعمل الكود؟" accent="amber" defaultOpen={false}>
          <BulletList items={edu.codeHowItWorks} />
        </Section>
      ) : null}

      {edu.reflectionQuestions?.length ? (
        <Section title="أسئلة تفكير بعد التجربة" accent="cyan" defaultOpen={false}>
          <BulletList items={edu.reflectionQuestions} />
        </Section>
      ) : null}
    </div>
  );
}
