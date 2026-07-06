/**
 * Sequential day unlock E2E — requires PUBLISHED_DAYS=2.
 */
import { test, expect } from "@playwright/test";
import { loginStudent } from "./helpers.js";

test.describe("sequential day unlock", () => {
  test("day 2 locked on /path when day 1 not complete", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path");
    await expect(page.getByText("مقفل").first()).toBeVisible();
    await expect(page.getByText(/أكمل اليوم السابق/i).first()).toBeVisible();
  });

  test("direct day-02 URL blocked when locked", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-02");
    await expect(page.getByRole("heading", { name: /اليوم مقفل|المحتوى غير متاح/i })).toBeVisible();
  });

  test("day 3 shows draft schedule message", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path");
    await expect(page.getByText(/سيتم فتحه وفق الجدول|غير منشور/i).first()).toBeVisible();
  });
});
