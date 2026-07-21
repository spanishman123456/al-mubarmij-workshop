import { STUDENTS_ROSTER } from "../../src/data/studentsRoster.js";
import { createDemoStudentProfile, findDemoStudentById } from "../../src/lib/demo/demoStudentProfile.js";
import { verifyPassword, getTeacherBcryptHash } from "./password.js";

export const GENERIC_AUTH_ERROR = "Invalid credentials";

export const TEACHER_PROFILE = {
  id: "teacher-1",
  role: "teacher",
  nationalId: "2297033843",
  nameAr: "معلم وحدة برمجة الحاسب — موهبة",
};

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

export function findStudentById(studentId) {
  if (!studentId?.startsWith("stu-")) return null;
  const nid = studentId.slice(4);
  return findStudentByNationalId(nid);
}

export function createDemoStudentSessionProfile(seed) {
  return createDemoStudentProfile(seed);
}

export { findDemoStudentById };

export function verifyTeacher(nationalId, password) {
  const nid = String(nationalId || "").replace(/\D/g, "");
  if (nid !== TEACHER_PROFILE.nationalId) return null;
  if (!verifyPassword(password, getTeacherBcryptHash())) return null;
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
