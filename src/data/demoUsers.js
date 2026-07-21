/** حساب المعلم — التحقق من كلمة المرور على الخادم فقط */

export const TEACHER_PROFILE = {
  id: "teacher-1",
  role: "teacher",
  nationalId: "2297033843",
  nameAr: "معلم وحدة برمجة الحاسب — موهبة",
};

/** Client-side: national ID format only — password verified by POST /api/auth/teacher */
export function isTeacherNationalId(username) {
  const nid = String(username || "").replace(/\D/g, "");
  return nid === TEACHER_PROFILE.nationalId;
}

export function findTeacherById(id) {
  return TEACHER_PROFILE.id === id ? TEACHER_PROFILE : null;
}

export function findTeacherProfileByNationalId(username) {
  return isTeacherNationalId(username) ? TEACHER_PROFILE : null;
}
