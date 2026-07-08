/**
 * Day 10 QA — requires PUBLISHED_DAYS>=10 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY10_LESSONS = [
  {
    path: "/lessons/oop-foundations",
    heading: "البرمجة كائنية التوجه في بايثون",
    labTestId: "oop-foundations-lab",
    answer: "25",
  },
  {
    path: "/lessons/steganography-python",
    heading: "إخفاء المعلومات وفك التشفير بالبتات",
    labTestId: "steganography-lab",
    answer: "Teach",
  },
  {
    path: "/lessons/fractal-tree-recursion",
    heading: "رسم الشجرة ذات النمط الهندسي المتكرر",
    labTestId: "fractal-tree-lab",
    answer: "7",
  },
  {
    path: "/lessons/locker-pascal-problem",
    heading: "مشكلة الخزانة ومثلث باسكال ببايثون",
    labTestId: "locker-pascal-lab",
    answer: "1,4,9",
  },
];

test.describe("day 10 — lesson pages and labs", () => {
  for (const lesson of DAY10_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { level: 1, name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await page.getByTestId(lesson.labTestId).locator("input").first().fill(lesson.answer);
      await page.getByTestId(lesson.labTestId).getByRole("button", { name: /تحقق/ }).click();
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/صحيحة|✓|غير دقيقة|ممتاز|تلميح/i);
    });
  }
});

test.describe("day 10 — progress footer", () => {
  test("saves lesson completion on oop-foundations", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/oop-foundations");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 10 — day hub", () => {
  test("day-10 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-10");
    await expect(page.getByRole("link", { name: /1\.\s*البرمجة كائنية التوجه/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*إخفاء المعلومات/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*الشجرة الهندسية المتكررة/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*مشكلة الخزانة ومثلث باسكال/ })).toBeVisible();
  });
});
