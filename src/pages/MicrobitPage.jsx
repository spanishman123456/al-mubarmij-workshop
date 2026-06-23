import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { MawhibaBrand } from "../components/branding/MawhibaBrand";
import { MICROBIT_PROJECTS } from "../data/microbitProjects";

export default function MicrobitPage() {
  return (
    <PageShell
      title="مشاريع micro:bit الإثرائية"
      subtitle="أفكار مشاريع قابلة للتنفيذ بـ Python/MicroPython — للطلاب المتقدمين في وحدة برمجة الحاسب"
      badge="وحدة إثرائية — موهبة"
    >
      <EduCard className="mb-8 flex flex-wrap items-center justify-center gap-6" accent="violet">
        <MawhibaBrand variant="vertical" />
      </EduCard>

      <EduCard accent="amber" title="ما هي micro:bit؟">
        <p className="edu-text mt-2">
          لوحة تعليمية صغيرة تحتوي أزرارًا، حساسات، وشبكة LED — مثالية لربط البرمجة بالعالم الحقيقي
          بعد إتقان أساسيات بايثون في المنصة.
        </p>
      </EduCard>

      <div className="mt-8 space-y-6">
        {MICROBIT_PROJECTS.map((p) => (
          <EduCard key={p.id} accent="cyan">
            <h2 className="edu-card-title text-lg">{p.title}</h2>
            <p className="edu-card-subtitle mt-1">{p.idea}</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold text-slate-500">الأدوات</p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
                  {p.tools.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">خطوات التنفيذ</p>
                <ol className="mt-1 list-inside list-decimal text-sm text-slate-700">
                  {p.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>

            <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <summary className="cursor-pointer text-sm font-bold text-slate-800">الكود المقترح</summary>
              <pre className="code-editor mt-3 text-xs">{p.code}</pre>
            </details>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <div className="rounded-lg bg-emerald-50 p-3">
                <p className="font-bold text-emerald-900">الاختبار</p>
                <p className="mt-1 text-emerald-800">{p.test}</p>
              </div>
              <div className="rounded-lg bg-violet-50 p-3">
                <p className="font-bold text-violet-900">تطوير لمستوى أعلى</p>
                <p className="mt-1 text-violet-800">{p.extend}</p>
              </div>
            </div>
          </EduCard>
        ))}
      </div>

      <Link to="/projects" className="mt-8 inline-block font-semibold text-violet-700 hover:underline">
        ← العودة لصفحة المشروعات
      </Link>
    </PageShell>
  );
}
