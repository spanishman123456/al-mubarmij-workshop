import { useState } from "react";
import { Link } from "react-router-dom";
import { MICROBIT_CATEGORIES } from "../../data/microbitProjects";

const STATUS_LABELS = {
  not_started: { text: "لم يبدأ", cls: "bg-slate-100 text-slate-600" },
  in_progress: { text: "قيد التنفيذ", cls: "bg-amber-100 text-amber-800" },
  completed: { text: "مكتمل", cls: "bg-emerald-100 text-emerald-800" },
};

export function MicrobitProjectCard({ project, progress, onSave }) {
  const [showCode, setShowCode] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [studentCode, setStudentCode] = useState(progress?.studentCode || project.code);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const status = progress?.status || "not_started";
  const statusMeta = STATUS_LABELS[status] || STATUS_LABELS.not_started;
  const categoryLabel =
    MICROBIT_CATEGORIES.find((c) => c.id === project.category)?.label || project.category;

  function startProject() {
    onSave(project.id, { status: "in_progress", studentCode });
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

  return (
    <article className="edu-card" id={`microbit-${project.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-800">
            {categoryLabel}
          </span>
          <h2 className="edu-card-title mt-2 text-lg">{project.title}</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusMeta.cls}`}>
          {statusMeta.text}
        </span>
      </div>

      <div className="mt-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900">
        <p>
          <span className="font-bold">الموضوع من المنهج: </span>
          {project.curriculumTopic}
        </p>
        <p className="mt-1">
          <span className="font-bold">الهدف: </span>
          {project.objective}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {project.relatedDays.map((d) => (
          <Link
            key={d.dayId}
            to={`/path/day/${d.dayId}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-100"
          >
            📅 {d.label}
          </Link>
        ))}
        {project.relatedLinks?.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 hover:bg-cyan-100"
          >
            ↗ {l.label}
          </Link>
        ))}
      </div>

      <p className="edu-card-subtitle mt-4">{project.idea}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold text-slate-500">الأدوات</p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
            {project.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500">خطوات التنفيذ</p>
          <ol className="mt-1 list-inside list-decimal text-sm text-slate-700">
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
          onClick={() => setShowCode((v) => !v)}
          className="edu-btn edu-btn-outline text-sm"
        >
          {showCode ? "إخفاء الكود" : "عرض الكود"}
        </button>
        <button
          type="button"
          onClick={() => setShowQuiz((v) => !v)}
          className="edu-btn edu-btn-outline text-sm"
        >
          اختبر فهمك
        </button>
      </div>

      {showCode ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-600">الكود المقترح (MicroPython)</p>
            <pre className="code-editor mt-2 max-h-64 overflow-auto text-xs">{project.code}</pre>
          </div>
          <div className="rounded-lg bg-violet-50 p-3 text-sm text-violet-900">
            <p className="font-bold">شرح مبسط للكود</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {project.codeExplanation.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold text-slate-600">كودك (عدّله واحفظه)</p>
            <textarea
              className="code-editor min-h-[160px] w-full text-xs"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              dir="ltr"
              spellCheck={false}
            />
            <button type="button" onClick={saveCode} className="edu-btn edu-btn-primary mt-2 text-sm">
              {saved ? "تم الحفظ ✓" : "حفظ الكود"}
            </button>
          </div>
        </div>
      ) : null}

      {showQuiz ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-bold text-amber-900">اختبر فهمك — {project.title}</p>
          <div className="mt-3 space-y-4">
            {(project.quiz || []).map((q, qi) => (
              <div key={qi} className="text-sm">
                <p className="font-semibold text-slate-800">
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
              className={`mt-3 text-sm font-bold ${quizResult.passed ? "text-emerald-700" : "text-red-700"}`}
            >
              {quizResult.passed
                ? `ممتاز! ${quizResult.correct}/${quizResult.total} — اكتمل المشروع ويُحسب في تقدمك.`
                : `${quizResult.correct}/${quizResult.total} — راجع الدرس وحاول مجددًا (يلزم 60% للإكمال).`}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
        <div className="rounded-lg bg-emerald-50 p-3">
          <p className="font-bold text-emerald-900">اختبار micro:bit</p>
          <p className="mt-1 text-emerald-800">{project.test}</p>
        </div>
        <div className="rounded-lg bg-violet-50 p-3">
          <p className="font-bold text-violet-900">تطوير لمستوى أعلى</p>
          <p className="mt-1 text-violet-800">{project.extend}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-slate-50 p-3">
        <p className="text-xs font-bold text-slate-600">أسئلة تفكير بعد التنفيذ</p>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
          {project.reflectionQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
