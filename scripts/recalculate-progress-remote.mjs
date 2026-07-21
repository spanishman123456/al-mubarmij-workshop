#!/usr/bin/env node
/**
 * إعادة احتساب التقدم على خادم منشور (Render) عبر API المعلم.
 * Usage:
 *   E2E_TEACHER_PASSWORD='...' node scripts/recalculate-progress-remote.mjs
 *   BASE_URL=https://al-mubarmij-workshop.onrender.com (optional)
 */
import { loginTeacher, authFetch } from "../server/testHelpers.js";

const BASE_URL = (process.env.BASE_URL || "https://al-mubarmij-workshop.onrender.com").replace(/\/$/, "");
const TEACHER_NID = process.env.TEACHER_NATIONAL_ID || "2297033843";
const PASSWORD = process.env.E2E_TEACHER_PASSWORD || process.env.TEST_TEACHER_PASSWORD;

async function main() {
  if (!PASSWORD) {
    console.error("Set E2E_TEACHER_PASSWORD or TEST_TEACHER_PASSWORD");
    process.exit(1);
  }

  console.info(`Logging in teacher at ${BASE_URL}...`);
  const auth = await loginTeacher(BASE_URL, TEACHER_NID, PASSWORD);
  if (!auth.res.ok) {
    console.error("Teacher login failed:", auth.body);
    process.exit(1);
  }

  const res = await authFetch(BASE_URL, "/api/progress/recalculate", {
    cookie: auth.cookie,
    csrf: auth.csrf,
    method: "POST",
    body: JSON.stringify({ reason: "remote_recalculate", persistSnapshot: true }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Recalculate failed:", res.status, body);
    process.exit(1);
  }

  console.info(JSON.stringify(body.report || body, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
