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

  test("all day 09 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/python-recursion",
      "/lessons/fractals-intro",
      "/lessons/koch-snowflake",
      "/lessons/sierpinski-triangle",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-09 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-09");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("all day 10 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/oop-foundations",
      "/lessons/steganography-python",
      "/lessons/fractal-tree-recursion",
      "/lessons/locker-pascal-problem",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-10 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-10");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("all day 11 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/ai-foundations",
      "/lessons/machine-learning-basics",
      "/lessons/ai-ethics-safety",
      "/lessons/ai-research-presentation",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-11 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-11");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("all day 12 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/regex-automata",
      "/lessons/dfa-nfa-design",
      "/lessons/p-vs-np-intro",
      "/lessons/graph-theory-basics",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-12 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-12");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("all day 13 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/comprehensive-review",
      "/lessons/post-assessment-readiness",
      "/lessons/project-ideation",
      "/lessons/project-planning",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-13 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-13");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("all day 14 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/project-architecture",
      "/lessons/project-implementation-sprint",
      "/lessons/project-testing-debugging",
      "/lessons/project-presentation-rehearsal",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-14 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-14");
    await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
  });

  test("all day 15 lesson routes blocked", async ({ page }) => {
    await loginStudent(page);
    const routes = [
      "/lessons/final-project-presentation",
      "/lessons/peer-feedback-and-refinement",
      "/lessons/final-evaluation",
      "/lessons/program-closure-next-steps",
    ];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: LOCKED_HEADING })).toBeVisible();
    }
  });

  test("day-15 hub blocked for student", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-15");
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
