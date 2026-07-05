import { queryOne, queryAll, runSql } from "../db/query.js";
import { persistDatabase } from "../db/index.js";

function parseJson(raw, fallback) {
  try {
    return JSON.parse(raw || "");
  } catch {
    return fallback;
  }
}

export function getActiveAttempt(studentId, quizId) {
  const row = queryOne(
    `SELECT * FROM quiz_attempts
     WHERE student_id = ? AND quiz_id = ? AND status IN ('in_progress', 'deferred')
     ORDER BY id DESC LIMIT 1`,
    [studentId, quizId],
  );
  if (!row) return null;
  return rowToAttempt(row);
}

export function getAttemptById(attemptId) {
  const row = queryOne(`SELECT * FROM quiz_attempts WHERE id = ?`, [attemptId]);
  return row ? rowToAttempt(row) : null;
}

export function getLatestSubmittedAttempt(studentId, quizId) {
  const row = queryOne(
    `SELECT * FROM quiz_attempts
     WHERE student_id = ? AND quiz_id = ? AND status = 'submitted'
     ORDER BY submitted_at DESC LIMIT 1`,
    [studentId, quizId],
  );
  return row ? rowToAttempt(row) : null;
}

function nextAttemptNumber(studentId, quizId) {
  const row = queryOne(`SELECT MAX(attempt_number) AS n FROM quiz_attempts WHERE student_id = ? AND quiz_id = ?`, [
    studentId,
    quizId,
  ]);
  return (row?.n || 0) + 1;
}

export function createAttempt(studentId, quizId, { answers = {}, meta = {}, status = "in_progress" } = {}) {
  const now = new Date().toISOString();
  const attemptNumber = nextAttemptNumber(studentId, quizId);
  runSql(
    `INSERT INTO quiz_attempts
     (student_id, quiz_id, attempt_number, status, answers_json, meta_json, started_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [studentId, quizId, attemptNumber, status, JSON.stringify(answers), JSON.stringify(meta), now, now],
  );
  const row = queryOne(
    `SELECT * FROM quiz_attempts WHERE student_id = ? AND quiz_id = ? ORDER BY id DESC LIMIT 1`,
    [studentId, quizId],
  );
  persistDatabase();
  return rowToAttempt(row);
}

export function saveAttemptProgress(attemptId, { answers, meta, status }) {
  const now = new Date().toISOString();
  const current = getAttemptById(attemptId);
  if (!current) return null;
  if (current.status === "submitted") {
    throw new Error("attempt_locked");
  }
  const nextAnswers = answers ?? current.answers;
  const nextMeta = meta ?? current.meta;
  const nextStatus = status ?? current.status;
  runSql(`UPDATE quiz_attempts SET answers_json = ?, meta_json = ?, status = ?, updated_at = ? WHERE id = ?`, [
    JSON.stringify(nextAnswers),
    JSON.stringify(nextMeta),
    nextStatus,
    now,
    attemptId,
  ]);
  persistDatabase();
  return getAttemptById(attemptId);
}

export function submitAttempt(attemptId, result) {
  const now = new Date().toISOString();
  const current = getAttemptById(attemptId);
  if (!current) return null;
  if (current.status === "submitted") return current;
  runSql(`UPDATE quiz_attempts SET status = 'submitted', result_json = ?, submitted_at = ?, updated_at = ? WHERE id = ?`, [
    JSON.stringify(result),
    now,
    now,
    attemptId,
  ]);
  persistDatabase();
  return getAttemptById(attemptId);
}

export function migratePreAssessmentToAttempt(studentId, preAssessment) {
  if (!preAssessment?.answers || !Object.keys(preAssessment.answers).length) return null;
  const existing = getActiveAttempt(studentId, "quiz-pre");
  if (existing) return existing;

  const statusMap = {
    submitted: "submitted",
    deferred: "deferred",
    in_progress: "in_progress",
    not_started: "in_progress",
  };
  const status = statusMap[preAssessment.status] || "in_progress";
  const attempt = createAttempt(studentId, "quiz-pre", {
    answers: preAssessment.answers,
    meta: { migratedFrom: "preAssessment", totalQuestions: preAssessment.totalQuestions },
    status: status === "submitted" ? "in_progress" : status,
  });

  if (status === "submitted" && preAssessment.result) {
    submitAttempt(attempt.id, preAssessment.result);
    return getAttemptById(attempt.id);
  }
  return attempt;
}

export function listAttemptsForTeacher(quizId = null) {
  const rows = quizId
    ? queryAll(
        `SELECT id, student_id, quiz_id, attempt_number, status, updated_at, submitted_at
         FROM quiz_attempts WHERE quiz_id = ? ORDER BY updated_at DESC`,
        [quizId],
      )
    : queryAll(
        `SELECT id, student_id, quiz_id, attempt_number, status, updated_at, submitted_at
         FROM quiz_attempts ORDER BY updated_at DESC`,
      );
  return rows;
}

function rowToAttempt(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    quizId: row.quiz_id,
    attemptNumber: row.attempt_number,
    status: row.status,
    answers: parseJson(row.answers_json, {}),
    meta: parseJson(row.meta_json, {}),
    result: row.result_json ? parseJson(row.result_json, null) : null,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    submittedAt: row.submitted_at,
  };
}
