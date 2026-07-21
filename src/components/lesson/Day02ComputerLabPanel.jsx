import { useEffect, useState } from "react";
import { IfStatementLab } from "./IfStatementLab";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";

const TASKS = [
  { id: "t1", titleAr: "حجران — if/elif/else", check: (out) => out.includes("2") || out.includes("1") || out.includes("tie") },
  { id: "t2", titleAr: "درجة >= 50", check: (out) => /Pass|ناجح|Fail|راسب/i.test(out) },
  { id: "t3", titleAr: "for sum 1..10", check: (out) => out.includes("55") },
  { id: "t4", titleAr: "while countdown", check: (out) => /5|4|3|2|1/.test(out) },
];

export function Day02ComputerLabPanel({ lessonId, userId, initialCode }) {
  const { progress, restored, persist, markComplete, completed } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "computer-lab",
  });

  const [activeTask, setActiveTask] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [taskStatus, setTaskStatus] = useState({});
  const [lastOutput, setLastOutput] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (typeof progress.activeTask === "number") setActiveTask(progress.activeTask);
    if (typeof progress.hintsUsed === "number") setHintsUsed(progress.hintsUsed);
    if (progress.taskStatus) setTaskStatus(progress.taskStatus);
    if (progress.lastOutput) setLastOutput(progress.lastOutput);
  }, [restored, progress]);

  async function onRunResult(output, ok) {
    setLastOutput(output);
    const task = TASKS[activeTask];
    const passed = ok && task?.check(output);
    const nextStatus = { ...taskStatus, [task.id]: passed ? "done" : "attempted" };
    setTaskStatus(nextStatus);
    if (userId) {
      await recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `lab-${task.id}`,
        answer: output.slice(0, 500),
        correct: passed,
        hintsUsed,
      });
    }
    const allDone = TASKS.every((t) => nextStatus[t.id] === "done");
    const patch = {
      activeTask,
      hintsUsed,
      taskStatus: nextStatus,
      lastOutput: output.slice(0, 500),
      lastStep: task.id,
      answers: { ...(progress?.answers || {}), [task.id]: output.slice(0, 200) },
    };
    if (allDone) await markComplete(patch);
    else await persist(patch);
    if (passed && activeTask < TASKS.length - 1) setActiveTask((i) => i + 1);
  }

  function useHint() {
    const n = hintsUsed + 1;
    setHintsUsed(n);
    persist({ hintsUsed: n, lastStep: "hint" });
  }

  return (
    <div dir="rtl">
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
        <p className="font-bold">المهمة {activeTask + 1}/{TASKS.length}: {TASKS[activeTask].titleAr}</p>
        <p className="text-xs text-slate-600">
          بدء: {progress?.startedAt?.slice(0, 19) || "—"} · تلميحات: {hintsUsed} ·
          {completed ? " ✓ مكتمل" : " قيد التنفيذ"}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {TASKS.map((t, i) => (
            <li
              key={t.id}
              className={`rounded px-2 py-0.5 text-xs ${
                taskStatus[t.id] === "done" ? "bg-emerald-200" : i === activeTask ? "bg-violet-200" : "bg-white"
              }`}
            >
              {t.titleAr}
            </li>
          ))}
        </ul>
        <button type="button" className="mt-2 text-xs font-bold text-amber-800 underline" onClick={useHint}>
          استخدم تلميحاً
        </button>
      </div>
      <IfStatementLab
        lessonId={lessonId}
        userId={userId}
        initialCode={initialCode}
        onRunComplete={onRunResult}
      />
      {lastOutput ? (
        <pre className="mt-2 max-h-24 overflow-auto rounded bg-slate-900 p-2 text-xs text-emerald-300" dir="ltr">
          {lastOutput}
        </pre>
      ) : null}
      {!restored ? <p className="text-xs text-slate-500">جاري استعادة تقدم المختبر…</p> : null}
    </div>
  );
}
