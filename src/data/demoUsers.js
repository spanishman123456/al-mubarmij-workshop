/** حساب المعلم — الطلاب يدخلون برقم الهوية من سجل Excel */

const TEACHER_PASSWORD_HASH =
  "493d9fe4443a3b77c93f8bdc778ed995d310251af2e6a328c23475b05ce9335e";

export const TEACHER_PROFILE = {
  id: "teacher-1",
  role: "teacher",
  nationalId: "2297033843",
  nameAr: "معلم وحدة برمجة الحاسب — موهبة",
};

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function findTeacher(username, password) {
  const nid = String(username || "").replace(/\D/g, "");
  if (nid !== TEACHER_PROFILE.nationalId) return null;
  const hash = await sha256Hex(String(password || ""));
  if (hash !== TEACHER_PASSWORD_HASH) return null;
  return TEACHER_PROFILE;
}

export function findTeacherById(id) {
  return TEACHER_PROFILE.id === id ? TEACHER_PROFILE : null;
}
