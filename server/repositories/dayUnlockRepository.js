import { getDatabase } from "../db/index.js";

export function logDayUnlockOverride({ studentId, dayNumber, teacherId, reason }) {
  const db = getDatabase();
  const createdAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO day_unlock_override_log (student_id, day_number, teacher_id, reason, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(studentId, dayNumber, teacherId, reason || null, createdAt);
  return { studentId, dayNumber, teacherId, reason, createdAt };
}

export function listDayUnlockOverrides(studentId) {
  const db = getDatabase();
  return db
    .prepare(
      `SELECT student_id AS studentId, day_number AS dayNumber, teacher_id AS teacherId, reason, created_at AS createdAt
       FROM day_unlock_override_log WHERE student_id = ? ORDER BY created_at DESC`,
    )
    .all(studentId);
}
