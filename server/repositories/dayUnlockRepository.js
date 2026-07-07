import { queryAll, runSql } from "../db/query.js";

export function logDayUnlockOverride({ studentId, dayNumber, teacherId, reason }) {
  if (!studentId || !teacherId) {
    throw new Error(`invalid_unlock_log studentId=${studentId} teacherId=${teacherId}`);
  }
  const createdAt = new Date().toISOString();
  runSql(
    `INSERT INTO day_unlock_override_log (student_id, day_number, teacher_id, reason, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [studentId, dayNumber, teacherId, reason || null, createdAt],
  );
  return { studentId, dayNumber, teacherId, reason, createdAt };
}

export function listDayUnlockOverrides(studentId) {
  return queryAll(
    `SELECT student_id AS studentId, day_number AS dayNumber, teacher_id AS teacherId, reason, created_at AS createdAt
     FROM day_unlock_override_log WHERE student_id = ? ORDER BY created_at DESC`,
    [studentId],
  );
}
