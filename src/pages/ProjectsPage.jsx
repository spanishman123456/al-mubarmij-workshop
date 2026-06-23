import { useState } from "react";
import { Link } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";
import { PageShell, EduCard } from "../components/layout/PageShell";

const PROJECT_IDEAS = [
  { title: "لعبة تخمين رقم ببايثون", desc: "خوارزمية بحث مع تلميحات تدريجية" },
  { title: "أداة تحويل بين أنظمة العد", desc: "عشري، ثنائي، وست عشري مع شرح الخطوات" },
  { title: "برنامج تشفير وفك تشفير رسالة", desc: "شيفرة قيصر أو ترميز مخصص" },
  { title: "لعبة تعليمية بسيطة", desc: "أسئلة تفاعلية لطلاب أصغر سنًا" },
  { title: "برنامج بحث وفرز", desc: "تصور خطوات الخوارزمية" },
  { title: "حاسبة لمسائل رياضية", desc: "عمليات وجذور وقوى" },
  { title: "مشروع اختياري بـ micro:bit", desc: "ربط البرمجة بالعالم الفيزيائي" },
];

const RUBRIC = [
  { key: "idea", label: "وضوح الفكرة والأصالة", max: 5, desc: "هل المشروع مبتكر وواضح الهدف؟" },
  { key: "code", label: "جودة الكود والتنظيم", max: 5, desc: "تسمية المتغيرات، التعليقات، والهيكلة" },
  { key: "practice", label: "التطبيق العملي", max: 5, desc: "هل يحل مشكلة حقيقية أو تعليمية؟" },
  { key: "demo", label: "العرض والتوثيق", max: 5, desc: "شرح الفكرة وطريقة التشغيل" },
  { key: "solution", label: "حل المشكلة", max: 5, desc: "اكتمال الحل وخلوه من أخطاء جوهرية" },
];

export default function ProjectsPage() {
  const { user, myProgress, saveProject } = usePlatform();
  const p = myProgress?.project ?? {};
  const [title, setTitle] = useState(p.title || "");
  const [description, setDescription] = useState(p.description || "");
  const [idea, setIdea] = useState(p.idea || "");
  const [code, setCode] = useState(p.code || '# اكتب كود مشروعك هنا\nprint("مرحبًا موهبة")');
  const [link, setLink] = useState(p.link || "");
  const [team, setTeam] = useState(p.team || "");
  const [saved, setSaved] = useState(false);

  function submit() {
    if (!user || user.role !== "student") return;
    saveProject({ title, description, idea, code, link, team, status: "submitted" });
    setSaved(true);
  }

  return (
    <PageShell
      title="المشروع النهائي"
      subtitle="ختام الأسبوع الثالث — مخرج البرنامج الذي يعكس ما تعلمته في علوم الحاسب والبرمجة. المعلم يقيّم وفق معيار التقييم أدناه."
      badge="الأسبوع 3 — اليوم 15"
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <EduCard title="أفكار مقترحة" accent="violet">
            <ul className="mt-4 space-y-3">
              {PROJECT_IDEAS.map((item) => (
                <li key={item.title} className="rounded-lg border border-violet-100 bg-violet-50/50 p-3">
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{item.desc}</p>
                </li>
              ))}
            </ul>
          </EduCard>

          <EduCard title="معيار التقييم (Rubric)" accent="cyan">
            <div className="mt-4 space-y-3">
              {RUBRIC.map((r) => (
                <div key={r.key} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-sm font-bold text-cyan-800">
                    {r.max}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{r.label}</p>
                    <p className="text-sm text-slate-600">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="edu-muted mt-4">المجموع الكلي: 25 نقطة</p>
          </EduCard>
        </div>

        <div className="lg:col-span-3">
          {user?.role === "student" ? (
            <EduCard title="نموذج تقديم المشروع" accent="emerald">
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <label className="block">
                  <span className="edu-label">اسم المشروع</span>
                  <input className="edu-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <label className="block">
                  <span className="edu-label">وصف المشروع</span>
                  <textarea className="edu-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <label className="block">
                  <span className="edu-label">الفكرة والهدف</span>
                  <textarea className="edu-input" rows={2} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="ما المشكلة التي يحلها مشروعك؟" />
                </label>
                <label className="block">
                  <span className="edu-label">أعضاء الفريق (إن وجد)</span>
                  <input className="edu-input" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="أسماء أعضاء الفريق" />
                </label>
                <label className="block">
                  <span className="edu-label">رابط أو ملف (اختياري)</span>
                  <input className="edu-input" dir="ltr" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
                </label>
                <label className="block">
                  <span className="edu-label">كود بايثون</span>
                  <textarea
                    className="edu-input font-mono text-sm"
                    rows={12}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    dir="ltr"
                    style={{ textAlign: "left" }}
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className="edu-btn edu-btn-primary">
                    إرسال للمعلم
                  </button>
                  <span className="text-sm text-slate-600">
                    الحالة:{" "}
                    <strong className="text-slate-900">{p.status || "لم يبدأ"}</strong>
                  </span>
                </div>
                {saved ? (
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                    تم إرسال المشروع بنجاح!
                  </p>
                ) : null}
                {p.teacherNote ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-bold text-amber-900">ملاحظة المعلم:</p>
                    <p className="mt-1 text-sm text-amber-800">{p.teacherNote}</p>
                  </div>
                ) : null}
              </form>
            </EduCard>
          ) : (
            <EduCard title="تقديم المشروع" accent="amber">
              <p className="edu-text mt-2">
                سجّل الدخول كطالب لتقديم مشروعك النهائي ومتابعة ملاحظات المعلم.
              </p>
              <Link to="/login" className="edu-btn edu-btn-primary mt-4 inline-flex">
                تسجيل الدخول
              </Link>
            </EduCard>
          )}
        </div>
      </div>
    </PageShell>
  );
}
