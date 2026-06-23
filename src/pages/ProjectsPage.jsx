import { useState } from "react";
import { usePlatform } from "../context/PlatformContext";

const PROJECT_IDEAS = [
  "لعبة تخمين رقم بلغة بايثون",
  "أداة تحويل بين أنظمة العد",
  "برنامج تشفير وفك تشفير رسالة",
  "لعبة تعليمية للصف الأصغر",
  "حاسبة مسائل رياضية بسيطة",
];

const RUBRIC = [
  { key: "idea", label: "وضوح الفكرة والأصالة", max: 5 },
  { key: "code", label: "جودة الكود والتنظيم", max: 5 },
  { key: "demo", label: "العرض والتوثيق", max: 5 },
];

export default function ProjectsPage() {
  const { user, myProgress, saveProject } = usePlatform();
  const p = myProgress?.project ?? {};
  const [title, setTitle] = useState(p.title || "");
  const [description, setDescription] = useState(p.description || "");
  const [code, setCode] = useState(p.code || '# اكتب كود مشروعك هنا\nprint("مرحبًا موهبة")');

  function submit() {
    if (!user || user.role !== "student") return;
    saveProject({ title, description, code, status: "submitted" });
    alert("تم إرسال المشروع للمعلم للمراجعة.");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 font-ar text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-white">المشروعات النهائية</h1>
      <p className="mt-2 text-slate-400">
        ختام الأسبوع الثالث — مشروع برمجي يعكس ما تعلمته. المعلم يقيّم وفق المعيار أدناه.
      </p>

      <section className="mt-8 rounded-xl border border-violet-500/30 bg-violet-500/10 p-5">
        <h2 className="font-bold text-violet-200">أفكار مقترحة</h2>
        <ul className="mt-2 list-disc pr-5 text-slate-300">
          {PROJECT_IDEAS.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-bold text-white">معيار التقييم (Rubric)</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-400">
          {RUBRIC.map((r) => (
            <li key={r.key}>{r.label} — من {r.max}</li>
          ))}
        </ul>
      </section>

      {user?.role === "student" ? (
        <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <label className="block text-sm">
            عنوان المشروع
            <input className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="block text-sm">
            وصف الفكرة
            <textarea className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="block text-sm">
            كود بايثون
            <textarea className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-emerald-200" rows={10} value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" />
          </label>
          <p className="text-xs text-slate-500">الحالة: {p.status || "لم يبدأ"}</p>
          {p.teacherNote ? <p className="text-sm text-amber-300">ملاحظة المعلم: {p.teacherNote}</p> : null}
          <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-6 py-3 font-bold text-white">
            إرسال للمعلم
          </button>
        </form>
      ) : (
        <p className="mt-8 text-slate-400">سجّل الدخول كطالب لتقديم مشروعك.</p>
      )}
    </main>
  );
}
