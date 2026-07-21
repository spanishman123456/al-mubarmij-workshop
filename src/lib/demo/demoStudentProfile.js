export const DEMO_STUDENT_LOGIN_CODE = "9999999999";
export const DEMO_STUDENT_USER_ID_PREFIX = "demo-stu-";
export const DEMO_STUDENT_NAME_AR = "طالب تجريبي";

function normalizeSeed(seed) {
  return String(seed || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 24);
}

export function buildDemoStudentId(seed = "shared") {
  const normalized = normalizeSeed(seed) || "shared";
  return `${DEMO_STUDENT_USER_ID_PREFIX}${normalized}`;
}

export function isDemoStudentId(userId) {
  return typeof userId === "string" && userId.startsWith(DEMO_STUDENT_USER_ID_PREFIX);
}

export function createDemoStudentProfile(seedOrId = "shared") {
  const id = isDemoStudentId(seedOrId) ? seedOrId : buildDemoStudentId(seedOrId);
  return {
    id,
    role: "student",
    nationalId: DEMO_STUDENT_LOGIN_CODE,
    nameAr: DEMO_STUDENT_NAME_AR,
    unitAr: "برمجة الحاسب",
    languageAr: "عربي",
    grade: "تجريبي",
    isDemo: true,
    studentType: "demo",
    demoAccessCode: DEMO_STUDENT_LOGIN_CODE,
  };
}

export function findDemoStudentById(userId) {
  if (!isDemoStudentId(userId)) return null;
  return createDemoStudentProfile(userId);
}
