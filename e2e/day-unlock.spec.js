/**
 * Sequential day unlock E2E — requires PUBLISHED_DAYS=2.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, seedStudentDay1Complete, seedStudentDay1Incomplete, isDay2LockedForStudent } from "./helpers.js";

const ELIGIBLE_STUDENT = "1165814631";

function dayCard(page, dayId) {
  return page.locator(`article[data-day-id="${dayId}"]`);
}

test.describe("sequential day unlock", () => {
  test("day 2 locked on /path when day 1 not complete", async ({ page }) => {
    await seedStudentDay1Incomplete(page, ELIGIBLE_STUDENT);
    if (!(await isDay2LockedForStudent(page))) {
      test.skip(true, "student already unlocked day 2 in E2E DB");
    }
    await page.goto("/path");
    const day2 = dayCard(page, "day-02");
    await expect(day2.getByText("مقفل")).toBeVisible();
    await expect(day2.getByText(/أكمل اليوم السابق/i)).toBeVisible();
    await expect(day2.getByTestId("path-day-cta-day-02")).toHaveCount(0);
  });

  test("direct day-02 URL blocked when locked", async ({ page }) => {
    await seedStudentDay1Incomplete(page, ELIGIBLE_STUDENT);
    if (!(await isDay2LockedForStudent(page))) {
      test.skip(true, "student already unlocked day 2 in E2E DB");
    }
    await page.goto("/path/day/day-02");
    await expect(page.getByRole("heading", { name: /اليوم مقفل|المحتوى غير متاح/i })).toBeVisible();
  });

  test("day 3 shows draft schedule message", async ({ page }) => {
    await loginStudent(page, ELIGIBLE_STUDENT);
    await page.goto("/path");
    const day3 = dayCard(page, "day-03");
    await expect(day3.getByText("غير منشور")).toBeVisible();
    await expect(day3.getByText(/سيتم فتحه وفق الجدول/i)).toBeVisible();
  });

  test("eligible student sees start button on day 2 even if VITE_PUBLISHED_DAYS=1", async ({ page }) => {
    await seedStudentDay1Complete(page, ELIGIBLE_STUDENT);
    await page.goto("/path");
    const day2 = dayCard(page, "day-02");
    await expect(day2.getByText("متاح الآن")).toBeVisible();
    const day2Cta = day2.getByTestId("path-day-cta-day-02");
    await expect(day2Cta).toBeVisible();
    await expect(day2Cta).toHaveText("ابدأ الدرس");
    await expect(day2.getByText(/سيتم فتحه وفق الجدول/i)).toHaveCount(0);
  });

  test("eligible student opens day-02 hub from start button", async ({ page }) => {
    await seedStudentDay1Complete(page, ELIGIBLE_STUDENT);
    await page.goto("/path");
    await dayCard(page, "day-02").getByTestId("path-day-cta-day-02").click();
    await expect(page).toHaveURL(/\/path\/day\/day-02/);
    await expect(page.getByRole("heading", { name: /اليوم الثاني — التحويلات/i })).toBeVisible();
    await expect(page.getByText("المحتوى غير متاح بعد")).toHaveCount(0);
    await expect(page.getByText(/سيتم فتح الدرس التالي وفق الجدول/i)).toHaveCount(0);
  });
});
