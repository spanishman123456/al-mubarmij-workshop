/**
 * Student pilot smoke — MUST run with PUBLISHED_DAYS=1 (see npm run test:e2e:pilot).
 */
import { test, expect } from "@playwright/test";

const STUDENT_NID = "1165814631";
const LOCKED_HEADING = /المحتوى غير متاح بعد/;

async function loginStudent(page) {
  await page.goto("/login");
  await page.getByTestId("student-national-id").fill(STUDENT_NID);
  await page.getByTestId("student-submit").click();
  await expect(page).toHaveURL(/\/student/);
}

test.describe("pilot PUBLISHED_DAYS=1", () => {
  test("student dashboard loads", async ({ page }) => {
    await loginStudent(page);
    await expect(page.getByText(/لوحة الطالب|مرحبًا/i).first()).toBeVisible();
  });

  test("day 04 direct lesson URL is blocked", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/karnaugh-maps");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("all day 04 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/karnaugh-maps",
      "/lessons/logic-equivalence",
      "/lessons/python-tuples",
      "/lessons/nested-loops-lab",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("all day 05 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/linear-search",
      "/lessons/binary-search",
      "/lessons/sorting-algorithms",
      "/lessons/sieve-primes",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-04 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-04");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("day-05 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-05");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("day 01 lesson still accessible", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/binary-cards");
    await expect(page.getByRole("heading", { name: /بطاقات الأرقام الثنائية/i })).toBeVisible();
  });

  test("python lab still accessible", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/python");
    await expect(page.getByRole("button", { name: "تشغيل الكود" })).toBeVisible();
  });
});

test.describe("pilot — no answer reveal on lesson practice", () => {
  test("guided practice does not show correct answer text", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/number-systems");
    const input = page.locator('input[type="text"]').first();
    if (await input.isVisible()) {
      await input.fill("wrong-answer-xyz");
      const checkBtn = page.getByRole("button", { name: /تحقق/ }).first();
      if (await checkBtn.isVisible()) {
        await checkBtn.click();
        await expect(page.getByText(/الإجابة الصحيحة:/)).not.toBeVisible();
      }
    }
  });
});
