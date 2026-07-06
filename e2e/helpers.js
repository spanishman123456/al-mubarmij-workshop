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

/** Scroll to lesson progress footer and mark complete if needed. */
export async function assertLessonProgressSaved(page) {
  const completeBtn = page.getByRole("button", { name: /أكملت هذا الدرس/i });
  const completedMsg = page.getByText(/سُجّل إكمال/i);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  if ((await completeBtn.count()) > 0) {
    const saveDone = page.waitForResponse(
      (r) => r.url().includes("/api/lesson/progress") && r.request().method() === "POST" && r.ok(),
      { timeout: 20_000 },
    );
    await completeBtn.click();
    await saveDone;
    await expect(completedMsg).toBeVisible({ timeout: 15_000 });
  } else {
    await expect(completedMsg).toBeVisible({ timeout: 15_000 });
  }
  await page.reload();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(completedMsg).toBeVisible({ timeout: 15_000 });
}
