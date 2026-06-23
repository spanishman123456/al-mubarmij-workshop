/** حسابات تجريبية — تُخزَّن محليًا في المتصفح للتطوير والاختبار */

export const DEMO_TEACHER = {
  id: "teacher-1",
  role: "teacher",
  username: "teacher",
  password: "teacher123",
  nameAr: "أ. محمد — معلم الورشة",
};

export const DEMO_STUDENTS = [
  { id: "stu-1", role: "student", username: "sara", password: "sara123", nameAr: "سارة العتيبي", grade: "6" },
  { id: "stu-2", role: "student", username: "omar", password: "omar123", nameAr: "عمر الشمري", grade: "7" },
  { id: "stu-3", role: "student", username: "noura", password: "noura123", nameAr: "نورة القحطاني", grade: "8" },
  { id: "stu-4", role: "student", username: "fahad", password: "fahad123", nameAr: "فهد الدوسري", grade: "6" },
  { id: "stu-5", role: "student", username: "layla", password: "layla123", nameAr: "ليلى الحربي", grade: "7" },
];

export const ALL_DEMO_USERS = [DEMO_TEACHER, ...DEMO_STUDENTS];

export function findUser(username, password) {
  const u = String(username || "").trim().toLowerCase();
  const p = String(password || "");
  return ALL_DEMO_USERS.find(
    (user) => user.username.toLowerCase() === u && user.password === p,
  ) ?? null;
}

export function findUserById(id) {
  return ALL_DEMO_USERS.find((u) => u.id === id) ?? null;
}
