/**
 * Student pilot smoke — MUST run with PUBLISHED_DAYS=1 (see npm run test:e2e:pilot).
 */
import { test, expect } from "@playwright/test";
import { loginStudent } from "./helpers.js";
const LOCKED_HEADING = /المحتوى غير متاح بعد/;

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

  test("all day 06 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/caesar-cipher",
      "/lessons/memory-hierarchy",
      "/lessons/cpu-scheduling",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-06 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-06");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("all day 07 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/python-scope",
      "/lessons/dice-random",
      "/lessons/tic-tac-toe",
      "/lessons/game-planning",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-07 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-07");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("all day 08 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/fibonacci-sequence",
      "/lessons/algorithm-complexity",
      "/lessons/tower-of-hanoi",
      "/lessons/python-files-io",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-08 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-08");
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
