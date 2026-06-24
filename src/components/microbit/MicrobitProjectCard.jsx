import { useState } from "react";
import { Link } from "react-router-dom";
import { MICROBIT_CATEGORIES } from "../../data/microbitProjects";
import {
  exportMicrobitHex,
  MICROBIT_FLASH_STEPS,
  openInMakeCode,
} from "../../lib/makecodeHexExport.js";

const STATUS_LABELS = {
  not_started: { text: "لم يبدأ", cls: "bg-slate-100 text-slate-700" },
  in_progress: { text: "قيد التنفيذ", cls: "bg-amber-100 text-amber-900" },
  completed: { text: "مكتمل", cls: "bg-emerald-100 text-emerald-900" },
};

export function MicrobitProjectCard({ project, progress, onSave }) {
  const [showCode, setShowCode] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [studentCode, setStudentCode] = useState(progress?.studentCode || "");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [exportMsg, setExportMsg] = useState(null);
  const [exportBusy, setExportBusy] = useState(false);
  const [codeAttempts, setCodeAttempts] = useState(0);

  const status = progress?.status || "not_started";
  const statusMeta = STATUS_LABELS[status] || STATUS_LABELS.not_started;
  const categoryLabel =
    MICROBIT_CATEGORIES.find((c) => c.id === project.category)?.label || project.category;

  const starterSnippet = `# اكتب الكود خطوة بخطوة — ابدأ بـ:\nfrom microbit import *\n\n# ${project.title}`;

  function startProject() {
    onSave(project.id, { status: "in_progress", studentCode: starterSnippet });
    setStudentCode(starterSnippet);
  }

  function saveCode() {
    onSave(project.id, { studentCode, status: status === "not_started" ? "in_progress" : status });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function checkQuiz() {
    const questions = project.quiz || [];
    let correct = 0;
    questions.forEach((q, i) => {
      if (Number(quizAnswers[i]) === q.answer) correct += 1;
    });
    const percent = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const passed = percent >= 60;
    setQuizResult({ correct, total: questions.length, percent, passed });
    if (passed) {
      onSave(project.id, {
        status: "completed",
        studentCode,
        quizScore: percent,
        quizAnswers: { ...quizAnswers },
      });
    } else {
      onSave(project.id, { quizScore: percent, quizAnswers: { ...quizAnswers } });
    }
  }

  async function handleExportHex() {
    setExportBusy(true);
    setExportMsg(null);
    const code = studentCode.trim() || project.code;
    try {
      const result = await exportMicrobitHex({ ...project, code });
      setExportMsg({ ok: result.ok, text: result.messageAr, showMakeCode: !result.ok });
    } catch (e) {
      console.error("[micro:bit export]", e);
      setExportMsg({
        ok: false,
        text: "حدث خطأ أثناء تنزيل ملف HEX. تحقق من الاتصال وحاول مجدداً، أو افتح MakeCode.",
        showMakeCode: true,
      });
    } finally {
      setExportBusy(false);
    }
  }

  async function handleOpenMakeCode() {
    setExportBusy(true);
    const code = studentCode.trim() || project.code;
    try {
      const result = await openInMakeCode({ ...project, code });
      setExportMsg({ ok: result.ok, text: result.messageAr, showMakeCode: false });
    } finally {
      setExportBusy(false);
    }
  }

  function handleShowSolution() {
    if (showCode) {
      setShowCode(false);
      return;
    }
    setCodeAttempts((n) => n + 1);
    if (codeAttempts < 2) {
      const ok = window.confirm(
        "حاول كتابة الكود بنفسك أولاً! هل تريد عرض الحل الكامل؟",
      );
      if (!ok) return;
    }
    setShowCode(true);
    setStudentCode(project.code);
  }

  return (
    <article className="edu-card microbit-card" id={`microbit-${project.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-900">
            {categoryLabel}
          </span>
          <h2 className="edu-card-title mt-2 text-lg">{project.title}</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusMeta.cls}`}>
          {statusMeta.text}
        </span>
      </div>

      <div className="microbit-topic-box mt-3 text-sm">
        <p>
          <span className="microbit-label">الموضوع: </span>
          {project.curriculumTopic}
        </p>
        <p className="mt-1">
          <span className="microbit-label">الهدف: </span>
          {project.objective}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {project.relatedDays.map((d) => (
          <Link
            key={d.dayId}
            to={`/path/day/${d.dayId}`}
            className="microbit-day-link rounded-full px-3 py-1 text-xs font-semibold transition"
          >
            📅 {d.label}
          </Link>
        ))}
        {project.relatedLinks?.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="microbit-related-link rounded-full px-3 py-1 text-xs font-semibold transition"
          >
            ↗ {l.label}
          </Link>
        ))}
      </div>

      <p className="edu-card-subtitle mt-4">{project.idea}</p>

      <div className="microbit-flash-steps mt-4">
        <p className="microbit-section-title text-sm">خطوات التحميل على اللوحة</p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
          {MICROBIT_FLASH_STEPS.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="microbit-section-label text-xs">الأدوات</p>
          <ul className="microbit-body-text mt-1 list-inside list-disc text-sm">
            {project.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="microbit-section-label text-xs">خطوات البرمجة</p>
          <ol className="microbit-body-text mt-1 list-inside list-decimal text-sm">
            {project.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={startProject} className="edu-btn edu-btn-primary text-sm">
          ابدأ المشروع
        </button>
        <button
          type="button"
          onClick={handleExportHex}
          disabled={exportBusy}
          className="edu-btn edu-btn-primary text-sm bg-emerald-700 hover:bg-emerald-600"
          aria-busy={exportBusy}
        >
          {exportBusy ? "جارٍ إنشاء ملف HEX…" : "تصدير المشروع بصيغة HEX"}
        </button>
        <button
          type="button"
          onClick={handleOpenMakeCode}
          disabled={exportBusy}
          className="edu-btn edu-btn-outline text-sm"
        >
          فتح في MakeCode
        </button>
        <button type="button" onClick={handleShowSolution} className="edu-btn edu-btn-outline text-sm">
          {showCode ? "إخفاء الحل" : "عرض الحل (بعد المحاولة)"}
        </button>
        <button
          type="button"
          onClick={() => setShowQuiz((v) => !v)}
          className="edu-btn edu-btn-outline text-sm"
        >
          اختبر فهمك
        </button>
      </div>

      {exportMsg ? (
        <div
          className={`mt-3 rounded-lg p-3 text-sm ${exportMsg.ok ? "microbit-export-ok" : "microbit-export-err"}`}
          role="status"
        >
          <p>{exportMsg.text}</p>
          {exportMsg.showMakeCode ? (
            <button
              type="button"
              onClick={handleOpenMakeCode}
              disabled={exportBusy}
              className="edu-btn edu-btn-outline mt-2 text-xs"
            >
              فتح في MakeCode لإكمال التجميع
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4">
        <p className="microbit-section-label mb-2 text-xs">كودك — اكتب بنفسك</p>
        <textarea
          className="code-editor min-h-[160px] w-full text-xs"
          value={studentCode || starterSnippet}
          onChange={(e) => setStudentCode(e.target.value)}
          dir="ltr"
          spellCheck={false}
          placeholder="from microbit import *"
        />
        <button type="button" onClick={saveCode} className="edu-btn edu-btn-primary mt-2 text-sm">
          {saved ? "تم الحفظ ✓" : "حفظ الكود"}
        </button>
      </div>

      {showCode ? (
        <div className="mt-4 space-y-4">
          <div className="microbit-solution-warn rounded-lg p-3 text-xs">
            ⚠️ هذا الحل للمراجعة والتعلّم. حاول كتابة نسختك بنفسك قبل النسخ.
          </div>
          <div className="microbit-solution-code rounded-lg p-3">
            <p className="microbit-section-label text-xs">الحل المرجعي (MicroPython)</p>
            <pre className="code-editor mt-2 max-h-64 overflow-auto text-xs">{project.code}</pre>
          </div>
          <div className="microbit-info-violet rounded-lg p-3 text-sm">
            <p className="microbit-section-title">شرح مبسط</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {project.codeExplanation.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {showQuiz ? (
        <div className="microbit-quiz-box mt-4 rounded-lg p-4">
          <p className="microbit-section-title font-bold">اختبر فهمك — {project.title}</p>
          <div className="mt-3 space-y-4">
            {(project.quiz || []).map((q, qi) => (
              <div key={qi} className="text-sm">
                <p className="font-semibold">
                  {qi + 1}. {q.q}
                </p>
                <div className="mt-2 space-y-1">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name={`quiz-${project.id}-${qi}`}
                        checked={Number(quizAnswers[qi]) === oi}
                        onChange={() => setQuizAnswers((a) => ({ ...a, [qi]: oi }))}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={checkQuiz} className="edu-btn edu-btn-primary mt-4 text-sm">
            تحقق من الإجابات
          </button>
          {quizResult ? (
            <p
              className={`mt-3 text-sm font-bold ${quizResult.passed ? "text-emerald-800" : "text-red-800"}`}
            >
              {quizResult.passed
                ? `ممتاز! ${quizResult.correct}/${quizResult.total} — اكتمل المشروع.`
                : `${quizResult.correct}/${quizResult.total} — راجع الدرس (يلزم 60%).`}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="microbit-info-emerald rounded-lg p-3">
          <p className="microbit-section-title font-bold">اختبار micro:bit</p>
          <p className="mt-1">{project.test}</p>
        </div>
        <div className="microbit-info-violet rounded-lg p-3">
          <p className="microbit-section-title font-bold">تطوير لمستوى أعلى</p>
          <p className="mt-1">{project.extend}</p>
        </div>
      </div>

      <div className="microbit-reflection mt-3 rounded-lg p-3">
        <p className="microbit-section-label text-xs">أسئلة تفكير</p>
        <ul className="microbit-body-text mt-2 list-inside list-disc text-sm">
          {project.reflectionQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
