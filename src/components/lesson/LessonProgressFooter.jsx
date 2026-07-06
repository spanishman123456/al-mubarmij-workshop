import { useEffect } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { EduCard } from "../layout/PageShell";

/**
 * تسجيل بدء الدرس وإكماله على الخادم (lesson_progress).
 */
export function LessonProgressFooter({ lessonId, userId, titleAr }) {
  const { progress, restored, completed, saving, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "main",
  });

  useEffect(() => {
    if (!userId || !lessonId || !restored || completed) return;
    if (progress?.startedAt) return;
    persist({ startedAt: new Date().toISOString(), status: "in_progress" });
  }, [userId, lessonId, restored, completed, progress?.startedAt, persist]);

  if (!userId) {
    return (
      <EduCard className="mt-6" accent="amber">
        <p className="text-sm text-amber-900">سجّل الدخول كطالب لحفظ تقدمك في هذا الدرس.</p>
      </EduCard>
    );
  }

  if (!restored) {
    return (
      <EduCard className="mt-6" accent="violet">
        <p className="text-sm text-slate-600">جاري تحميل تقدم الدرس…</p>
      </EduCard>
    );
  }

  async function handleComplete() {
    await markComplete({
      startedAt: progress?.startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: "completed",
    });
  }

  return (
    <EduCard className="mt-6" accent={completed ? "emerald" : "violet"} title="تقدم الدرس">
      <p className="text-sm text-slate-700">
        {completed
          ? `✓ سُجّل إكمال «${titleAr || lessonId}» في حسابك.`
          : `بعد قراءة الدرس وتنفيذ التمارين، اضغط الزر لحفظ إكمال «${titleAr || lessonId}» في الخادم.`}
      </p>
      {!completed ? (
        <button
          type="button"
          className="edu-btn edu-btn-primary mt-3 text-sm"
          onClick={handleComplete}
          disabled={saving}
        >
          {saving ? "جاري الحفظ…" : "أكملت هذا الدرس — احفظ التقدم"}
        </button>
      ) : null}
      {progress?.startedAt && !completed ? (
        <p className="mt-2 text-xs text-slate-500">بدأت هذا الدرس — التقدم يُحفظ على الخادم.</p>
      ) : null}
    </EduCard>
  );
}
