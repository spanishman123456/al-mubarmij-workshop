import { useCallback, useEffect, useRef, useState } from "react";
import { EduCard } from "../layout/PageShell";
import { PyAppPreview } from "../python/PyAppPreview";
import { PythonAppSession } from "../../lib/skulptAppRun";
import { ensureSkulptLoaded } from "../../lib/skulptRun";
import { formatSkulptError } from "../../lib/pythonErrorHelp";
import { ProjectExportPanel } from "../python/ProjectExportPanel";

function TeacherProjectRunner({ code }) {
  const sessionRef = useRef(null);
  const [ui, setUi] = useState(null);
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [consoleOut, setConsoleOut] = useState("");

  const stopSession = useCallback(() => {
    sessionRef.current?.destroy();
    sessionRef.current = null;
  }, []);

  useEffect(() => {
    ensureSkulptLoaded().catch(() => {});
    return () => stopSession();
  }, [stopSession]);

  async function runProject() {
    stopSession();
    setBusy(true);
    setFeedback(null);
    setConsoleOut("");
    try {
      const session = new PythonAppSession();
      session.onSnapshot = (nextUi) => setUi(nextUi);
      session.onError = (nextFeedback) => setFeedback(nextFeedback);
      sessionRef.current = session;
      const result = await session.load(code);
      setUi(result.ui);
      setValues(result.ui.values || {});
      if (result.console) setConsoleOut(result.console);
    } catch (e) {
      setFeedback(e?.feedback ?? formatSkulptError(e, { appMode: true }));
      setUi(null);
    } finally {
      setBusy(false);
    }
  }

  async function onButton(btnId) {
    if (!sessionRef.current) return;
    setBusy(true);
    setFeedback(null);
    try {
      const result = await sessionRef.current.click(btnId, values);
      setUi(result.ui);
      setValues(result.ui.values || {});
      if (result.console) setConsoleOut((prev) => prev + result.console);
    } catch (e) {
      setFeedback(e?.feedback ?? formatSkulptError(e, { appMode: true }));
    } finally {
      setBusy(false);
    }
  }

  async function onEvent(id, eventName, value) {
    if (!sessionRef.current || eventName === "on_click") return;
    try {
      const result = await sessionRef.current.event(id, eventName, value);
      setUi(result.ui);
      if (result.console) setConsoleOut((prev) => prev + result.console);
    } catch (e) {
      setFeedback(e?.feedback ?? formatSkulptError(e, { appMode: true }));
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <button
        type="button"
        onClick={runProject}
        disabled={busy}
        className="edu-btn edu-btn-primary text-sm disabled:opacity-60"
      >
        {busy ? "جاري التشغيل…" : "تشغيل المشروع"}
      </button>
      {feedback ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{feedback.headlineAr}</p>
      ) : null}
      <PyAppPreview
        ui={ui}
        values={values}
        onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))}
        onButton={onButton}
        onEvent={onEvent}
        loading={busy}
      />
      {consoleOut ? (
        <pre dir="ltr" className="max-h-32 overflow-auto rounded-lg bg-slate-900 p-3 text-left font-mono text-xs text-emerald-200">
          {consoleOut}
        </pre>
      ) : null}
    </div>
  );
}

export function TeacherGraphicProjects({ students, onUpdate }) {
  const rows = students.flatMap(({ student, progress }) =>
    (progress.graphicProjects || [])
      .filter((p) => p.status === "submitted" || p.status === "reviewed")
      .map((project) => ({ student, project })),
  );

  if (!rows.length) {
    return (
      <EduCard className="mt-10" title="مشاريع بايثون الرسومية" accent="emerald">
        <p className="edu-text text-sm">لا توجد مشاريع مرسلة من الطلاب بعد.</p>
      </EduCard>
    );
  }

  return (
    <section className="mt-10 space-y-5">
      <h2 className="text-xl font-bold text-slate-900">مشاريع بايثون الرسومية ({rows.length})</h2>
      {rows.map(({ student, project }) => (
        <EduCard key={`${student.id}-${project.id}`} accent="emerald">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
              <p className="text-sm text-slate-600">
                {student.nameAr} —{" "}
                {project.status === "reviewed" ? (
                  <span className="font-bold text-emerald-700">تم التقييم</span>
                ) : (
                  <span className="font-bold text-amber-700">بانتظار التقييم</span>
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                أُرسل: {project.submittedAt ? new Date(project.submittedAt).toLocaleString("ar-SA") : "—"}
              </p>
            </div>
            {project.teacherScore != null ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                الدرجة: {project.teacherScore}/100
              </span>
            ) : null}
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-bold text-violet-700">عرض الكود</summary>
            <pre
              dir="ltr"
              className="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-left font-mono text-xs text-slate-800"
            >
              {project.code}
            </pre>
          </details>

          <TeacherProjectRunner code={project.code} />

          <div className="mt-4">
            <p className="mb-2 text-sm font-bold text-slate-700">تحميل المشروع</p>
            <ProjectExportPanel
              title={project.title}
              code={project.code}
              mode="app"
              templateId={project.templateId || null}
              authorName={student.nameAr}
              ownerId={student.id}
              projectId={project.id}
              variant="light"
              compact
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-slate-700">ملاحظة المعلم</span>
              <textarea
                className="w-full rounded-lg border border-slate-200 p-2 text-sm"
                rows={2}
                defaultValue={project.teacherNote || ""}
                id={`note-${student.id}-${project.id}`}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-slate-700">الدرجة (0–100)</span>
              <input
                type="number"
                min={0}
                max={100}
                className="w-full rounded-lg border border-slate-200 p-2 text-sm"
                defaultValue={project.teacherScore ?? ""}
                id={`score-${student.id}-${project.id}`}
              />
            </label>
          </div>
          <button
            type="button"
            className="edu-btn edu-btn-outline mt-3 text-sm"
            onClick={() => {
              const note = document.getElementById(`note-${student.id}-${project.id}`)?.value ?? "";
              const scoreRaw = document.getElementById(`score-${student.id}-${project.id}`)?.value;
              const teacherScore = scoreRaw === "" ? null : Math.min(100, Math.max(0, Number(scoreRaw)));
              onUpdate(student.id, project.id, { teacherNote: note, teacherScore, status: "reviewed" });
            }}
          >
            حفظ التقييم
          </button>
          {project.teacherNote ? (
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">ملاحظة محفوظة: {project.teacherNote}</p>
          ) : null}
        </EduCard>
      ))}
    </section>
  );
}
