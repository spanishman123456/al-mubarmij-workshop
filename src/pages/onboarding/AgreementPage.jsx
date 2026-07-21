import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";
import {
  HONOR_CODE_PRINCIPLES,
  ACCEPTABLE_USE_SECTIONS,
  AGREEMENT_META,
} from "../../content/onboarding/onboardingContent";
import { saveAgreementApi } from "../../lib/platformApi";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { formatLoginDateTime } from "../../lib/platformAnalytics";

const DOC_CONFIG = {
  "honor-code": {
    docType: "honor_code",
    title: "مدونة الشرف",
    intro:
      "مدونة الشرف مجموعة مبادئ توجيهية لخلق بيئة تعليمية آمنة وإيجابية. قراءتها والالتزام بها واجب على كل طالب في برنامج موهبة.",
    render: () => (
      <div className="space-y-4">
        {HONOR_CODE_PRINCIPLES.map((p) => (
          <div key={p.titleAr} className="rounded-lg bg-slate-50 p-4">
            <h3 className="font-bold text-violet-900">{p.titleAr}</h3>
            <p className="mt-1 text-sm text-slate-700">{p.bodyAr}</p>
          </div>
        ))}
      </div>
    ),
  },
  "acceptable-use": {
    docType: "acceptable_use",
    title: "سياسة الاستخدام المناسب لتقنيات الحاسب",
    intro: "تنطبق هذه السياسة على جميع الأجهزة والبرمجيات والشبكات في البرنامج.",
    render: () => (
      <div className="space-y-4">
        {ACCEPTABLE_USE_SECTIONS.map((sec) => (
          <div key={sec.titleAr}>
            <h3 className="font-bold text-slate-900">{sec.titleAr}</h3>
            <ul className="mt-2 list-disc space-y-1 pr-5 text-sm text-slate-700">
              {sec.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  "honor-agreement": {
    docType: "honor_agreement",
    title: "اتفاقية مدونة الشرف",
    intro:
      "لقد قرأت مدونة الشرف، وتعرفت بنودها جميعاً، وبتوقيعي أقر بالتزامي بها في الأوقات كلها.",
    render: () => (
      <div className="space-y-2 text-sm text-slate-700">
        <p><strong>اسم المقرر:</strong> {AGREEMENT_META.courseNameAr}</p>
        <p><strong>اسم المعلم:</strong> {AGREEMENT_META.teacherNameAr}</p>
        <p><strong>اسم المعلم المساعد:</strong> {AGREEMENT_META.assistantNameAr}</p>
      </div>
    ),
  },
  "tech-contract": {
    docType: "tech_contract",
    title: "عقد استخدام التقنيات",
    intro:
      "لقد قرأت سياسة الاستخدام المناسب لتقنيات الحاسب، وتعرفت بنودها جميعاً، وبتوقيعي أقر بالالتزام بها وأتحمل مسؤولية مخالفتها.",
    render: () => (
      <div className="space-y-2 text-sm text-slate-700">
        <p><strong>اسم المقرر:</strong> {AGREEMENT_META.courseNameAr}</p>
        <p><strong>اسم المعلم:</strong> {AGREEMENT_META.teacherNameAr}</p>
        <p><strong>اسم المعلم المساعد:</strong> {AGREEMENT_META.assistantNameAr}</p>
      </div>
    ),
  },
};

export default function AgreementPage() {
  const { slug } = useParams();
  const cfg = DOC_CONFIG[slug];
  const { user } = usePlatform();
  const [readOk, setReadOk] = useState(false);
  const [signature, setSignature] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!cfg) {
    return (
      <PageShell title="غير موجود">
        <Link to="/onboarding">العودة</Link>
      </PageShell>
    );
  }

  async function submit() {
    setError("");
    if (!readOk || !signature.trim()) {
      setError("يجب الإقرار بالقراءة وكتابة اسمك كتوقيع.");
      return;
    }
    try {
      await saveAgreementApi(user.id, {
        docType: cfg.docType,
        version: AGREEMENT_META.version,
        signatureText: signature.trim(),
        payload: { studentNameAr: user.nameAr, courseNameAr: AGREEMENT_META.courseNameAr },
      });
      setDone(true);
    } catch (e) {
      setError(e.message || "فشل الحفظ");
    }
  }

  return (
    <PageShell title={cfg.title} subtitle={cfg.intro}>
      <Link to="/onboarding" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← العودة للتمهيد
      </Link>
      <EduCard accent="violet">
        {cfg.render()}
        {!done ? (
          <div className="mt-6 space-y-4 border-t border-slate-200 pt-4">
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={readOk} onChange={(e) => setReadOk(e.target.checked)} />
              <span>أقر أنني قرأت وفهمت هذا المستند بالكامل.</span>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-bold">التوقيع (اكتب اسمك الكامل)</span>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button type="button" className="edu-btn edu-btn-primary" onClick={submit}>
              الموافقة والتوقيع
            </button>
          </div>
        ) : (
          <p className="mt-4 font-semibold text-emerald-700">
            تم التوقيع بنجاح — {formatLoginDateTime(new Date().toISOString())}
          </p>
        )}
      </EduCard>
    </PageShell>
  );
}
