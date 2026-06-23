/** حساب المعلم فقط — الطلاب يدخلون برقم الهوية من سجل Excel */

export const DEMO_TEACHER = {
  id: "teacher-1",
  role: "teacher",
  username: "teacher",
  password: "teacher123",
  nameAr: "معلم وحدة برمجة الحاسب — موهبة",
};

export function findTeacher(username, password) {
  const u = String(username || "").trim().toLowerCase();
  const p = String(password || "");
  if (DEMO_TEACHER.username.toLowerCase() === u && DEMO_TEACHER.password === p) {
    return DEMO_TEACHER;
  }
  return null;
}

export function findTeacherById(id) {
  return DEMO_TEACHER.id === id ? DEMO_TEACHER : null;
}
