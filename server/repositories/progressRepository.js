import { queryOne, queryAll, runSql } from "../db/query.js";
import { persistDatabase } from "../db/index.js";

export function getStudentProgress(studentId) {
  const row = queryOne(`SELECT progress_json, updated_at FROM student_progress WHERE student_id = ?`, [studentId]);
  if (!row) return null;
  return { progress: JSON.parse(row.progress_json || "{}"), updatedAt: row.updated_at };
}

export function saveStudentProgress(studentId, progress) {
  const now = new Date().toISOString();
  runSql(
    `INSERT INTO student_progress (student_id, progress_json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(student_id) DO UPDATE SET progress_json = excluded.progress_json, updated_at = excluded.updated_at`,
    [studentId, JSON.stringify(progress || {}), now],
  );
  persistDatabase();
  return { updatedAt: now };
}

export function saveLessonProgress(studentId, lessonId, sectionId, progressJson, completed = false) {
  const now = new Date().toISOString();
  runSql(
    `INSERT INTO lesson_progress (student_id, lesson_id, section_id, progress_json, completed, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(student_id, lesson_id, section_id) DO UPDATE SET
       progress_json = excluded.progress_json,
       completed = excluded.completed,
       updated_at = excluded.updated_at`,
    [studentId, lessonId, sectionId || "", JSON.stringify(progressJson || {}), completed ? 1 : 0, now],
  );
  persistDatabase();
}

export function recordLessonAttempt(studentId, { lessonId, exerciseId, answer, correct, hintsUsed, errorType, durationMs }) {
  const now = new Date().toISOString();
  runSql(
    `INSERT INTO lesson_attempts (student_id, lesson_id, exercise_id, answer, correct, hints_used, error_type, duration_ms, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      lessonId,
      exerciseId,
      answer ?? null,
      correct ? 1 : 0,
      hintsUsed || 0,
      errorType || null,
      durationMs || null,
      now,
    ],
  );
  persistDatabase();
}

export function getLessonProgressAll(studentId) {
  const rows = queryAll(
    `SELECT lesson_id, section_id, progress_json, completed, updated_at FROM lesson_progress WHERE student_id = ?`,
    [studentId],
  );
  return rows.map((v) => ({
    lessonId: v.lesson_id,
    sectionId: v.section_id,
    progress: JSON.parse(v.progress_json || "{}"),
    completed: Boolean(v.completed),
    updatedAt: v.updated_at,
  }));
}

export function getTeacherLessonSummary() {
  const rows = queryAll(
    `SELECT student_id, lesson_id, MAX(completed) as done, MAX(updated_at) as last_at
     FROM lesson_progress GROUP BY student_id, lesson_id`,
  );
  const map = {};
  for (const v of rows) {
    if (!map[v.student_id]) map[v.student_id] = {};
    map[v.student_id][v.lesson_id] = { completed: Boolean(v.done), updatedAt: v.last_at };
  }
  return map;
}
