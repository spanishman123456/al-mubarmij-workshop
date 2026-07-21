import { useState } from "react";
import { runPythonWithSkulpt } from "../../lib/skulptRun.js";

export function QuizCodeEditorQuestion({ question, value, onChange, disabled }) {
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function runCode() {
    if (disabled) return;
    setRunning(true);
    setError("");
    setOutput("");
    try {
      const result = await runPythonWithSkulpt(value || "");
      setOutput(typeof result === "string" ? result : "(لا مخرجات)");
    } catch (e) {
      setError(e.message || "خطأ في التشغيل");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-3" dir="rtl" data-testid="quiz-code-editor">
      {question.instructionAr ? (
        <p className="rounded-lg bg-violet-950/40 px-3 py-2 text-sm text-violet-100">{question.instructionAr}</p>
      ) : null}
      {question.codeSnippetAr ? (
        <div>
          <p className="mb-1 text-xs text-slate-400">الكود المعطى:</p>
          <pre
            className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-3 text-left text-sm text-emerald-200"
            dir="ltr"
          >
            {question.codeSnippetAr}
          </pre>
        </div>
      ) : null}
      <textarea
        className="edu-input min-h-[180px] w-full resize-y bg-black/40 font-mono text-sm text-emerald-100"
        placeholder="# اكتب برنامجك هنا..."
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        dir="ltr"
        spellCheck={false}
        data-testid="quiz-code-input"
      />
      {!disabled ? (
        <button
          type="button"
          onClick={runCode}
          disabled={running}
          className="edu-btn edu-btn-outline text-sm"
        >
          {running ? "جاري التشغيل…" : "▶ تشغيل الكود"}
        </button>
      ) : null}
      {output ? (
        <pre className="rounded-lg bg-black/50 p-3 text-left text-sm text-slate-200" dir="ltr">
          {output}
        </pre>
      ) : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <p className="text-xs text-violet-300/80">يُراجع المعلم الكود بعد الإرسال النهائي.</p>
    </div>
  );
}
