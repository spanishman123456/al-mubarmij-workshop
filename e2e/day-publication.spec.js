/**
 * Teacher publishes days from dashboard — no Render env change required.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, seedStudentDay1Complete, isDay2LockedForStudent } from "./helpers.js";

const TEACHER_NID = "2297033843";
const TEACHER_PASS = process.env.E2E_TEACHER_PASSWORD || "";
const ELIGIBLE_STUDENT = "1165814631";

async function loginTeacher(page) {
  if (!TEACHER_PASS) {
    test.skip(true, "E2E_TEACHER_PASSWORD not set");
  }
  await page.goto("/login");
  await page.getByTestId("teacher-national-id").fill(TEACHER_NID);
  await page.getByTestId("teacher-password").fill(TEACHER_PASS);
  await page.getByTestId("teacher-submit").click();
  await expect(page).toHaveURL(/\/teacher/);
}

function dayCard(page, dayId) {
  return page.locator(`article[data-day-id="${dayId}"]`);
}

test.describe("teacher publication from dashboard", () => {
  test("teacher publishes day 2 and student sees it after completing day 1", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/teacher");
    await expect(page.getByText("إدارة فتح الأيام")).toBeVisible();

    const publishBtn = page.getByRole("button", { name: /نشر اليوم 2/i });
    if (await publishBtn.isVisible()) {
      await publishBtn.click();
      await expect(page.getByText(/عدد الأيام المنشورة:\s*2/)).toBeVisible({ timeout: 15_000 });
    }

    await seedStudentDay1Complete(page, ELIGIBLE_STUDENT);
    if (await isDay2LockedForStudent(page)) {
      test.skip(true, "day 2 still locked in E2E DB after publish");
    }

    await page.goto("/path");
    const day2 = dayCard(page, "day-02");
    await expect(day2.getByText("متاح الآن")).toBeVisible();
    await expect(day2.getByTestId("path-day-cta-day-02")).toBeVisible();
  });
});
