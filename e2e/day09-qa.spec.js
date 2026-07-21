/**
 * Day 9 QA — requires PUBLISHED_DAYS>=9 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY09_LESSONS = [
  {
    path: "/lessons/python-recursion",
    heading: "الاستدعاء الذاتي في بايثون",
    labTestId: "python-recursion-lab",
    labAction: async (page) => {
      await page.getByTestId("recursion-answer-input").fill("120");
      await page.getByTestId("python-recursion-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/fractals-intro",
    heading: "الكسوريات والتشابه الذاتي",
    labTestId: "fractals-intro-lab",
    labAction: async (page) => {
      await page.getByTestId("fractals-intro-option-a").click();
      await page.getByTestId("fractals-intro-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/koch-snowflake",
    heading: "منحنى Koch وندفة الثلج",
    labTestId: "koch-snowflake-lab",
    labAction: async (page) => {
      await page.getByTestId("koch-answer-input").fill("12");
      await page.getByTestId("koch-snowflake-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/sierpinski-triangle",
    heading: "مثلث Sierpinski",
    labTestId: "sierpinski-triangle-lab",
    labAction: async (page) => {
      await page.getByTestId("sierpinski-answer-input").fill("9");
      await page.getByTestId("sierpinski-triangle-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
];

test.describe("day 09 — lesson pages and labs", () => {
  for (const lesson of DAY09_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { level: 1, name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await lesson.labAction(page);
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/تلميح|إجابة|راجع|✓|صحيحة|غير صحيح|ممتاز|أحسنت/i);
    });
  }
});

test.describe("day 09 — progress footer", () => {
  test("saves lesson completion on python-recursion", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/python-recursion");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 09 — day hub", () => {
  test("day-09 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-09");
    await expect(page.getByRole("link", { name: /1\.\s*الاستدعاء الذاتي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*الكسوريات/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*ندفة/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*Sierpinski|4\.\s*مثلث/ })).toBeVisible();
  });
});
