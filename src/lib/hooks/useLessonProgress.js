import { useCallback, useEffect, useRef, useState } from "react";
import { fetchStudentProgressApi, saveLessonProgressApi } from "../platformApi";

/**
 * حفظ واستعادة تقدم الدرس من الخادم (SQLite) — لا يعتمد على localStorage للبيانات الأساسية.
 */
export function useLessonProgress({ studentId, lessonId, sectionId = "main", autoRestore = true }) {
  const [progress, setProgress] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [restored, setRestored] = useState(false);
  const [saving, setSaving] = useState(false);
  const startedAtRef = useRef(null);

  useEffect(() => {
    if (!autoRestore || !studentId || !lessonId) {
      setRestored(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchStudentProgressApi(studentId);
        const row = (data.lessons || []).find(
          (l) => l.lessonId === lessonId && (l.sectionId || "") === (sectionId || ""),
        );
        if (!cancelled && row) {
          setProgress(row.progress || {});
          setCompleted(Boolean(row.completed));
          startedAtRef.current = row.progress?.startedAt || null;
        }
      } catch {
        /* offline — start fresh */
      } finally {
        if (!cancelled) setRestored(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [studentId, lessonId, sectionId, autoRestore]);

  const persist = useCallback(
    async (patch, { markCompleted = false } = {}) => {
      if (!studentId || !lessonId) return;
      const startedAt = startedAtRef.current || new Date().toISOString();
      if (!startedAtRef.current) startedAtRef.current = startedAt;
      const next = {
        ...(progress || {}),
        ...patch,
        startedAt,
        updatedAt: new Date().toISOString(),
      };
      if (markCompleted) next.completedAt = new Date().toISOString();
      setProgress(next);
      if (markCompleted) setCompleted(true);
      setSaving(true);
      try {
        await saveLessonProgressApi(studentId, lessonId, sectionId, next, markCompleted || completed);
      } finally {
        setSaving(false);
      }
    },
    [studentId, lessonId, sectionId, progress, completed],
  );

  return {
    progress,
    completed,
    restored,
    saving,
    setProgress,
    persist,
    markComplete: (patch = {}) => persist(patch, { markCompleted: true }),
  };
}
