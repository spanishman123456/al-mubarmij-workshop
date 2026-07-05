/** حساب المعلم — الطلاب يدخلون برقم الهوية من سجل Excel */

import bcrypt from "bcryptjs";

const TEACHER_BCRYPT_HASH =
  "$2b$10$NGhTMh4FzzNhtIu2UTyhb.EboMQ6Yx6SV4DUZlaueD1xXJeqN0mWG";

export const TEACHER_PROFILE = {
  id: "teacher-1",
  role: "teacher",
  nationalId: "2297033843",
  nameAr: "معلم وحدة برمجة الحاسب — موهبة",
};

export async function findTeacher(username, password) {
  const nid = String(username || "").replace(/\D/g, "");
  if (nid !== TEACHER_PROFILE.nationalId) return null;
  const ok = bcrypt.compareSync(String(password || ""), TEACHER_BCRYPT_HASH);
  if (!ok) return null;
  return TEACHER_PROFILE;
}

export function findTeacherById(id) {
  return TEACHER_PROFILE.id === id ? TEACHER_PROFILE : null;
}
