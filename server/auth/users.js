import { createHash } from "node:crypto";
import { STUDENTS_ROSTER } from "../../src/data/studentsRoster.js";

const TEACHER_PASSWORD_HASH =
  "493d9fe4443a3b77c93f8bdc778ed995d310251af2e6a328c23475b05ce9335e";

export const TEACHER_PROFILE = {
  id: "teacher-1",
  role: "teacher",
  nationalId: "2297033843",
  nameAr: "معلم وحدة برمجة الحاسب — موهبة",
};

function sha256Hex(text) {
  return createHash("sha256").update(String(text || ""), "utf8").digest("hex");
}

export function studentIdFromNationalId(nationalId) {
  const nid = String(nationalId || "").replace(/\D/g, "");
  return nid ? `stu-${nid}` : null;
}

export function findStudentByNationalId(nationalId) {
  const nid = String(nationalId || "").replace(/\D/g, "");
  if (!nid) return null;
  const row = STUDENTS_ROSTER.find((s) => s.nationalId === nid);
  if (!row) return null;
  return {
    id: studentIdFromNationalId(nid),
    role: "student",
    nationalId: row.nationalId,
    nameAr: row.nameAr,
  };
}

export function verifyTeacher(nationalId, password) {
  const nid = String(nationalId || "").replace(/\D/g, "");
  if (nid !== TEACHER_PROFILE.nationalId) return null;
  if (sha256Hex(password) !== TEACHER_PASSWORD_HASH) return null;
  return { ...TEACHER_PROFILE };
}

export function isKnownStudentId(studentId) {
  if (!studentId?.startsWith("stu-")) return false;
  const nid = studentId.slice(4);
  return STUDENTS_ROSTER.some((s) => s.nationalId === nid);
}

export function teacherCanAccessStudent(_teacherId, studentId) {
  return isKnownStudentId(studentId);
}
