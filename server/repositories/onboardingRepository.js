import { queryOne, queryAll, runSql } from "../db/query.js";
import { persistDatabase } from "../db/index.js";
import { getStudentProgress, saveStudentProgress } from "./progressRepository.js";
import {
  BINGO_EXPECTED_FILLABLE,
  computeBingoProgress,
  createInitialBingoStudentState,
  normalizeBingoStudentState,
} from "../../src/content/onboarding/validateBingoContent.js";
import { BINGO_CELLS } from "../../src/content/onboarding/onboardingContent.js";
import {
  buildOnboardingAccessStatus,
  DOC_TYPES,
  getPreAssessmentTeacherLabel,
  mergePreAssessmentIntoProgress,
  resolvePreAssessmentStatus,
} from "../config/onboardingPolicy.js";
import { buildAssessmentSummary } from "../../src/lib/assessmentSummary.js";
import { getLatestSubmittedAttempt } from "./quizAttemptRepository.js";
import { getPublishedDaysCount } from "../config/publication.js";

export function getOnboardingStatus(studentId) {
  const bingoRow = queryOne(
    `SELECT status, started_at, completed_at, submitted_at, cells_json FROM bingo_progress WHERE student_id = ?`,
    [studentId],
  );

  const bingo = bingoRow
    ? normalizeBingoStudentState({
        status: bingoRow.status,
        startedAt: bingoRow.started_at,
        completedAt: bingoRow.completed_at,
        submittedAt: bingoRow.submitted_at,
        cells: JSON.parse(bingoRow.cells_json || "{}"),
      })
    : createInitialBingoStudentState();

  const agreements = {};
  for (const docType of DOC_TYPES) {
    const row = queryOne(
      `SELECT status, signed_at, signature_text, version FROM onboarding_records
       WHERE student_id = ? AND doc_type = ? ORDER BY updated_at DESC LIMIT 1`,
      [studentId, docType],
    );
    agreements[docType] = row
      ? { status: row.status, signedAt: row.signed_at, signatureText: row.signature_text, version: row.version }
      : { status: "not_started" };
  }

  const progressRow = getStudentProgress(studentId);
  const progress = progressRow?.progress || {};
  const access = buildOnboardingAccessStatus({ bingo, agreements, progress });

  return {
    bingo,
    agreements,
    preAssessment: access.preAssessment,
    requiredComplete: access.requiredComplete,
    canAccessDayOne: access.canAccessDayOne,
    complete: access.complete,
    requiredDocs: DOC_TYPES,
  };
}

export function savePreAssessmentProgress(studentId, payload) {
  const progressRow = getStudentProgress(studentId);
  const progress = progressRow?.progress || {};
  const merged = mergePreAssessmentIntoProgress(progress, payload);
  saveStudentProgress(studentId, merged);
  return getOnboardingStatus(studentId);
}

export function saveBingoProgress(studentId, { cells, status, startedAt, completedAt, submittedAt }) {
  const now = new Date().toISOString();
  const existing = queryOne(`SELECT started_at FROM bingo_progress WHERE student_id = ?`, [studentId]);
  runSql(
    `INSERT INTO bingo_progress (student_id, cells_json, started_at, completed_at, submitted_at, status, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(student_id) DO UPDATE SET
       cells_json = excluded.cells_json,
       started_at = COALESCE(bingo_progress.started_at, excluded.started_at),
       completed_at = excluded.completed_at,
       submitted_at = excluded.submitted_at,
       status = excluded.status,
       updated_at = excluded.updated_at`,
    [
      studentId,
      JSON.stringify(cells || {}),
      existing?.started_at || startedAt || now,
      completedAt || null,
      submittedAt || null,
      status || "in_progress",
      now,
    ],
  );
  persistDatabase();
  return getOnboardingStatus(studentId);
}

export function saveAgreement(studentId, { docType, version, signatureText, payload, ipAddress, userAgent }) {
  const now = new Date().toISOString();
  runSql(
    `INSERT INTO onboarding_records
     (student_id, doc_type, version, status, payload_json, signature_text, signed_at, ip_address, user_agent, created_at, updated_at)
     VALUES (?, ?, ?, 'signed', ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(student_id, doc_type, version) DO UPDATE SET
       status = 'signed',
       payload_json = excluded.payload_json,
       signature_text = excluded.signature_text,
       signed_at = excluded.signed_at,
       ip_address = excluded.ip_address,
       user_agent = excluded.user_agent,
       updated_at = excluded.updated_at`,
    [
      studentId,
      docType,
      version || "1.0",
      JSON.stringify(payload || {}),
      signatureText,
      now,
      ipAddress || null,
      userAgent || null,
      now,
      now,
    ],
  );
  persistDatabase();
  return getOnboardingStatus(studentId);
}

export function getAllOnboardingSummary() {
  const bingoRows = queryAll(`SELECT student_id, status, started_at, submitted_at, cells_json FROM bingo_progress`);
  const bingoMap = {};
  const students = new Set();

  for (const row of bingoRows) {
    students.add(row.student_id);
    const cells = JSON.parse(row.cells_json || "{}");
    const { filledCount, percent, totalFillable } = computeBingoProgress(BINGO_CELLS, cells);
    bingoMap[row.student_id] = {
      status: row.status,
      startedAt: row.started_at,
      submittedAt: row.submitted_at,
      filledCells: filledCount,
      totalCells: totalFillable || BINGO_EXPECTED_FILLABLE,
      percent,
    };
  }

  const agreeRows = queryAll(`SELECT student_id, doc_type, status, signed_at FROM onboarding_records`);
  const agreeMap = {};
  for (const row of agreeRows) {
    students.add(row.student_id);
    if (!agreeMap[row.student_id]) agreeMap[row.student_id] = {};
    agreeMap[row.student_id][row.doc_type] = { status: row.status, signedAt: row.signed_at };
  }

  const progressRows = queryAll(`SELECT student_id, progress_json FROM student_progress`);
  const preAssessmentMap = {};
  const publishedDays = getPublishedDaysCount();
  for (const row of progressRows) {
    students.add(row.student_id);
    const progress = JSON.parse(row.progress_json || "{}");
    const preAttempt = getLatestSubmittedAttempt(row.student_id, "quiz-pre");
    const summary = buildAssessmentSummary(progress, { preAttempt, publishedDays });
    const pa = summary.preAssessment;
    preAssessmentMap[row.student_id] = {
      ...pa,
      teacherLabelAr: getPreAssessmentTeacherLabel(pa.status),
      diagnosticPercent: pa.scorePercent,
      statusLabelAr: pa.statusLabelAr,
    };
  }

  return { studentIds: [...students], bingo: bingoMap, agreements: agreeMap, preAssessment: preAssessmentMap };
}
