import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../components/layout/PageShell";
import { MawhibaBrand } from "../components/branding/MawhibaBrand";
import { MicrobitProjectCard } from "../components/microbit/MicrobitProjectCard";
import { MICROBIT_CATEGORIES, getProjectsByCategory } from "../data/microbitProjects";
import { usePlatform } from "../context/PlatformContext";

export default function MicrobitPage() {
  const { user, myProgress, saveMicrobitProgress } = usePlatform();
  const [category, setCategory] = useState("all");

  const projects = useMemo(() => getProjectsByCategory(category), [category]);
  const microbitData = myProgress?.microbitProjects || {};

  const completedCount = Object.values(microbitData).filter((p) => p?.status === "completed").length;
  const totalCount = 9;

  function handleSave(projectId, patch) {
    saveMicrobitProgress(projectId, patch);
  }

  return (
    <PageShell
      title="مشاريع micro:bit المرتبطة بالمنهج"
      subtitle="تطبيق عملي لمفاهيم برمجة الحاسب — أنظمة العد، بايثون، الخوارزميات، التشفير، المنطق، والمتتاليات"
      badge="وحدة إثرائية — مرتبطة بملف PDF"
    >
      <EduCard className="mb-6 flex flex-wrap items-center justify-between gap-4" accent="violet">
        <MawhibaBrand variant="horizontal" />
        {user?.role === "student" ? (
          <div className="text-center sm:text-right">
            <p className="text-sm font-bold text-slate-800">تقدمك في مشاريع micro:bit</p>
            <p className="text-2xl font-extrabold text-violet-700">
              {completedCount} / {totalCount} مكتمل
            </p>
          </div>
        ) : null}
      </EduCard>

      <EduCard accent="amber" title="لماذا micro:bit في منهج برمجة الحاسب؟">
        <p className="edu-text mt-2">
          كل مشروع أدناه مربوط بموضوع علمي من مقرر «برمجة الحاسب»: ليس مجرد أفكار عامة، بل امتداد لما
          درسته في المسار الدراسي، المحاكاة، وأوراق العمل. ابدأ بالدرس المرتبط، ثم نفّذ المشروع على
          micro:bit، ثم اختبر فهمك داخل المنصة.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/path" className="edu-btn edu-btn-outline text-sm">
            المسار الدراسي
          </Link>
          <Link to="/simulations" className="edu-btn edu-btn-outline text-sm">
            معمل المحاكاة
          </Link>
          <Link to="/projects" className="edu-btn edu-btn-outline text-sm">
            المشروع النهائي
          </Link>
        </div>
      </EduCard>

      <nav className="sim-nav no-print mt-8" aria-label="تصنيف المشاريع">
        {MICROBIT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`sim-nav-btn ${category === cat.id ? "sim-nav-btn--active" : ""}`}
            onClick={() => setCategory(cat.id)}
          >
            <span className="ml-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 space-y-8">
        {projects.length ? (
          projects.map((p) => (
            <MicrobitProjectCard
              key={p.id}
              project={p}
              progress={microbitData[p.id]}
              onSave={handleSave}
            />
          ))
        ) : (
          <EduCard className="text-center text-slate-600">لا توجد مشاريع في هذا التصنيف.</EduCard>
        )}
      </div>

      <Link to="/student" className="mt-8 inline-block font-semibold text-violet-700 hover:underline">
        ← العودة للوحة الطالب
      </Link>
    </PageShell>
  );
}
