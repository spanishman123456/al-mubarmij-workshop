import { expect } from "@playwright/test";

export const STUDENT_NID = "1165814631";

/** Student login with retries (Windows E2E DB may briefly EPERM). */
export async function loginStudent(page, nid = STUDENT_NID) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.goto("/login");
    await page.getByTestId("student-national-id").fill(nid);
    await page.getByTestId("student-submit").click();
    try {
      await expect(page).toHaveURL(/\/student/, { timeout: 12_000 });
      return;
    } catch {
      await page.waitForTimeout(800);
    }
  }
  await expect(page).toHaveURL(/\/student/);
}

export async function loginDemoStudent(page) {
  await page.goto("/login");
  await page.getByTestId("demo-student-login").click();
  await expect(page).toHaveURL(/\/student/, { timeout: 12_000 });
}

async function csrfFromPageCookies(page) {
  const cookies = await page.context().cookies();
  return cookies.find((c) => c.name === "platform_csrf")?.value || "";
}

async function syncStudentProgress(page, progress) {
  const csrf = await csrfFromPageCookies(page);
  const sync = await page.request.post("/api/progress/sync", {
    headers: { "X-CSRF-Token": csrf },
    data: { progress },
  });
  expect(sync.ok()).toBeTruthy();
}

/** Mark day 1 complete via API after student login. */
export async function seedStudentDay1Complete(page, nid = STUDENT_NID) {
  await loginStudent(page, nid);
  await syncStudentProgress(page, {
    completedDays: ["day-01"],
    dayCompletionTimes: { "day-01": new Date().toISOString() },
  });
}

export async function isDay2LockedForStudent(page) {
  const res = await page.request.get("/api/student/day-unlock");
  const map = (await res.json()).dayUnlockMap;
  return map?.["day-02"] === "locked";
}

/** Login student without day 1 completion (for locked-day E2E). */
export async function seedStudentDay1Incomplete(page, nid) {
  await loginStudent(page, nid);
}

/** Scroll to lesson progress footer and mark complete if needed. */
export async function assertLessonProgressSaved(page) {
  const completeBtn = page.getByRole("button", { name: /أكملت هذا الدرس/i });
  const completedMsg = page.getByText(/سُجّل إكمال/i);
  const loadingFooter = page.getByText(/جاري تحميل تقدم الدرس/i);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait until progress footer leaves loading state and shows actionable UI.
  await expect(loadingFooter).toHaveCount(0, { timeout: 20_000 });
  await expect(completeBtn.or(completedMsg)).toBeVisible({ timeout: 20_000 });

  if (await completeBtn.isVisible()) {
    await expect(completeBtn).toBeEnabled({ timeout: 10_000 });
    const saveDone = page.waitForResponse(
      (r) => r.url().includes("/api/lesson/progress") && r.request().method() === "POST" && r.ok(),
      { timeout: 25_000 },
    );
    await completeBtn.click();
    await saveDone;
    await expect(completedMsg).toBeVisible({ timeout: 15_000 });
  } else {
    await expect(completedMsg).toBeVisible({ timeout: 15_000 });
  }

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(loadingFooter).toHaveCount(0, { timeout: 20_000 });
  await expect(completedMsg).toBeVisible({ timeout: 15_000 });
}
