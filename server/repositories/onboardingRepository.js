import { queryOne, queryAll, runSql } from "../db/query.js";
import { persistDatabase } from "../db/index.js";

const DOC_TYPES = ["honor_code", "acceptable_use", "honor_agreement", "tech_contract"];

export function getOnboardingStatus(studentId) {
  const bingoRow = queryOne(
    `SELECT status, started_at, completed_at, submitted_at, cells_json FROM bingo_progress WHERE student_id = ?`,
    [studentId],
  );

  const bingo = bingoRow
    ? {
        status: bingoRow.status,
        startedAt: bingoRow.started_at,
        completedAt: bingoRow.completed_at,
        submittedAt: bingoRow.submitted_at,
        cells: JSON.parse(bingoRow.cells_json || "{}"),
      }
    : { status: "not_started", cells: {} };

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

  const complete =
    bingo.status === "submitted" && DOC_TYPES.every((t) => agreements[t].status === "signed");

  return { bingo, agreements, complete, requiredDocs: DOC_TYPES };
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
    const filled = Object.values(cells).filter((v) => String(v || "").trim()).length;
    bingoMap[row.student_id] = {
      status: row.status,
      startedAt: row.started_at,
      submittedAt: row.submitted_at,
      filledCells: filled,
      totalCells: 24,
      percent: Math.round((filled / 24) * 100),
    };
  }

  const agreeRows = queryAll(`SELECT student_id, doc_type, status, signed_at FROM onboarding_records`);
  const agreeMap = {};
  for (const row of agreeRows) {
    students.add(row.student_id);
    if (!agreeMap[row.student_id]) agreeMap[row.student_id] = {};
    agreeMap[row.student_id][row.doc_type] = { status: row.status, signedAt: row.signed_at };
  }

  return { studentIds: [...students], bingo: bingoMap, agreements: agreeMap };
}
