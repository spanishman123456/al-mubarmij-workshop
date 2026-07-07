import { STUDENTS_ROSTER } from "../../src/data/studentsRoster.js";
import { dayIdFromNumber } from "../../src/lib/dayUnlockPolicy.js";
import { getPublicationConfig, getPublicationStatusMap } from "./publicationConfigService.js";
import { getStudentDayUnlockStatus } from "../progress/dayUnlockService.js";

export function buildTeacherPublicationSummary() {
  const config = getPublicationConfig();
  const publicationStatus = getPublicationStatusMap(config);
  const days = [];

  for (let d = 1; d <= 15; d += 1) {
    const dayId = dayIdFromNumber(d);
    const key = d <= 9 ? `day0${d}` : `day${d}`;
    const publicationState = publicationStatus[key] || "draft";
    const stats = {
      available: 0,
      locked: 0,
      inProgress: 0,
      completed: 0,
      draft: 0,
    };

    for (const row of STUDENTS_ROSTER) {
      const studentId = `stu-${row.nationalId}`;
      const unlock = getStudentDayUnlockStatus(studentId);
      const state = unlock.dayUnlockMap?.[dayId] || "draft";
      if (state === "completed") stats.completed += 1;
      else if (state === "in_progress") stats.inProgress += 1;
      else if (state === "available") stats.available += 1;
      else if (state === "locked") stats.locked += 1;
      else stats.draft += 1;
    }

    days.push({
      day: d,
      dayId,
      publicationState,
      scheduledReleaseAt: config.daySchedules?.[String(d)]?.releaseAt || null,
      stats,
    });
  }

  return {
    publishedDays: config.publishedDays,
    effectivePublishedDays: days.filter((d) => d.publicationState === "published").length,
    unlockPolicy: config.unlockPolicy,
    source: config.source,
    updatedBy: config.updatedBy,
    updatedAt: config.updatedAt,
    days,
  };
}
