/**
 * Day 7 QA — requires PUBLISHED_DAYS>=7 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY07_LESSONS = [
  {
    path: "/lessons/python-scope",
    heading: "نطاق المتغيرات (Scope) والمعاملات في بايثون",
    labTestId: "python-scope-lab",
    labAction: async (page) => {
      await page.getByTestId("scope-answer-input").fill("3");
      await page.getByTestId("python-scope-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/dice-random",
    heading: "رمي النرد ووحدة random في بايثون",
    labTestId: "dice-random-lab",
    labAction: async (page) => {
      await page.getByTestId("dice-random-lab").getByRole("button", { name: /ارمِ النردين/ }).click();
      const sumLine = await page.getByTestId("dice-random-lab").locator('span[dir="ltr"]').textContent();
      const match = /= (\d+)/.exec(sumLine || "");
      await page.getByTestId("dice-sum-guess").fill(match?.[1] ?? "7");
      await page.getByTestId("dice-random-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/tic-tac-toe",
    heading: "لعبة تك-تاك-تو — منطق اللوحة 3×3",
    labTestId: "tic-tac-toe-lab",
    labAction: async (page) => {
      await page.getByTestId("ttt-cell-0").click();
      await page.getByTestId("ttt-cell-3").click();
      await page.getByTestId("ttt-cell-6").click();
      await page.getByTestId("winner-guess-X").click();
      await page.getByTestId("tic-tac-toe-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/game-planning",
    heading: "التخطيط التعاوني للألعاب — شبه الكود قبل البرمجة",
    labTestId: "game-planning-lab",
    labAction: async (page) => {
      const order = {
        "plan-rules": "1",
        "draw-board": "2",
        "write-functions": "3",
        test: "4",
        demo: "5",
      };
      for (const [stepId, rank] of Object.entries(order)) {
        await page.getByTestId(`rank-${stepId}`).selectOption(rank);
      }
      await page.getByTestId("game-planning-lab").getByRole("button", { name: /تحقق من الترتيب/ }).click();
    },
  },
];

test.describe("day 07 — lesson pages and labs", () => {
  for (const lesson of DAY07_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { level: 1, name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await lesson.labAction(page);
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/تلميح|إجابة|راجع|✓|صحيحة|غير صحيح|ممتاز|ترتيب/i);
    });
  }
});

test.describe("day 07 — progress footer", () => {
  test("saves lesson completion on python-scope", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/python-scope");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 07 — day hub", () => {
  test("day-07 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-07");
    await expect(page.getByRole("link", { name: /1\.\s*نطاق/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*رمي النرد/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*تيك-تاك-تو/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*التخطيط/ })).toBeVisible();
  });
});
