import { runSql } from "../db/query.js";
import { persistDatabase } from "../db/index.js";

export function logProgressCalculation({
  studentId,
  reason,
  availableCount,
  completedCount,
  previousPercent,
  newPercent,
  progressVersion,
}) {
  const now = new Date().toISOString();
  runSql(
    `INSERT INTO progress_calculation_log
     (student_id, reason, available_count, completed_count, previous_percent, new_percent, calculated_at, progress_version)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      reason || "calculate",
      availableCount ?? null,
      completedCount ?? null,
      previousPercent ?? null,
      newPercent ?? null,
      now,
      progressVersion || "v2",
    ],
  );
  persistDatabase();
}
