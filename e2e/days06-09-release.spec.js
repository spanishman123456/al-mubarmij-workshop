/**
 * Release QA — days 6–9 published with sequential unlock (PUBLISHED_DAYS=9).
 */
import { test, expect } from "@playwright/test";
import {
  loginStudent,
  seedStudentCompletedDays,
  fetchDayUnlockMap,
  dayCard,
  STUDENT_NID,
} from "./helpers.js";

const ELIGIBLE = STUDENT_NID;
const LOCKED_HEADING = /اليوم مقفل|المحتوى غير متاح|ورقة العمل مقفلة/i;

function expectUnlocked(state) {
  expect(["available", "in_progress", "completed"]).toContain(state);
}

test.describe("release days 6–9 — sequential unlock map", () => {
  test("day 6 unlocked and day 7 locked after completing day 5", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5], ELIGIBLE);
    const map = await fetchDayUnlockMap(page);
    expectUnlocked(map["day-06"]);
    expect(map["day-07"]).toBe("locked");
    expect(map["day-08"]).toBe("locked");
    expect(map["day-09"]).toBe("locked");
  });

  test("day 7 unlocked after completing day 6", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5, 6], ELIGIBLE);
    const map = await fetchDayUnlockMap(page);
    expectUnlocked(map["day-07"]);
    expect(map["day-08"]).toBe("locked");
    expect(map["day-09"]).toBe("locked");
  });

  test("day 8 unlocked after completing day 7", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5, 6, 7], ELIGIBLE);
    const map = await fetchDayUnlockMap(page);
    expectUnlocked(map["day-08"]);
    expect(map["day-09"]).toBe("locked");
  });

  test("day 9 unlocked after completing day 8", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5, 6, 7, 8], ELIGIBLE);
    const map = await fetchDayUnlockMap(page);
    expectUnlocked(map["day-09"]);
  });
});

test.describe("release days 6–9 — /path UI states", () => {
  test("day 6 shows start CTA when day 5 complete", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5], ELIGIBLE);
    await page.goto("/path");
    const day6 = dayCard(page, "day-06");
    await expect(day6.getByText(/متاح الآن|قيد التقدم/i)).toBeVisible();
    await expect(day6.getByTestId("path-day-cta-day-06")).toBeVisible();
    const day7 = dayCard(page, "day-07");
    await expect(day7.getByText("مقفل")).toBeVisible();
    await expect(day7.getByText(/أكمل اليوم السابق/i)).toBeVisible();
  });

  test("day 10 shows draft schedule message", async ({ page }) => {
    await loginStudent(page, ELIGIBLE);
    await page.goto("/path");
    const day10 = dayCard(page, "day-10");
    await expect(day10.getByText("غير منشور")).toBeVisible();
    await expect(day10.getByText(/سيتم فتحه وفق الجدول/i)).toBeVisible();
  });
});

test.describe("release days 6–9 — direct URL guards", () => {
  test("day-07 hub blocked when only day 5 complete", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5], ELIGIBLE);
    await page.goto("/path/day/day-07");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("day-06 hub opens when day 5 complete", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5], ELIGIBLE);
    await page.goto("/path/day/day-06");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /1\.\s*شفرة قيصر|شفرة قيصر/i })).toBeVisible();
  });

  test("day-09 lesson blocked when day 8 not complete", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5, 6, 7], ELIGIBLE);
    await page.goto("/lessons/python-recursion");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("day-09 lesson opens when day 8 complete", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5, 6, 7, 8], ELIGIBLE);
    await page.goto("/lessons/python-recursion");
    await expect(page.getByRole("heading", { level: 1, name: /الاستدعاء الذاتي في بايثون/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toHaveCount(0);
  });
});

test.describe("release days 6–9 — worksheets and teacher answers", () => {
  test("ws-day-06 blocked when day 5 not complete enough", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4], ELIGIBLE);
    await page.goto("/worksheets/ws-day-06");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("ws-day-09 accessible when day 8 complete", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5, 6, 7, 8], ELIGIBLE);
    await page.goto("/worksheets/ws-day-09");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toHaveCount(0);
    await expect(page.getByText(/ورقة عمل|اليوم التاسع|factorial/i).first()).toBeVisible();
  });

  test("student cannot fetch teacher day-09 answers API", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5, 6, 7, 8, 9], ELIGIBLE);
    const res = await page.request.get("/api/teacher/day-09-answers");
    expect(res.status()).toBe(403);
  });

  test("student teacher answers page redirects or blocks", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5, 6, 7, 8, 9], ELIGIBLE);
    await page.goto("/teacher/day-09-answers");
    await expect(page).not.toHaveURL(/\/teacher\/day-09-answers$/);
  });
});
