/**
 * Day 14 QA — requires PUBLISHED_DAYS>=14 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY14_LESSONS = [
  {
    path: "/lessons/project-architecture",
    heading: "هيكل المشروع وتقسيم المكونات",
    labTestId: "project-build-lab",
    answer: "75",
  },
  {
    path: "/lessons/project-implementation-sprint",
    heading: "تنفيذ المشروع على مراحل",
    labTestId: "project-build-lab",
    answer: "نعم",
  },
  {
    path: "/lessons/project-testing-debugging",
    heading: "اختبار المشروع وتصحيح الأخطاء",
    labTestId: "project-testing-lab",
    answer: "75",
  },
  {
    path: "/lessons/project-presentation-rehearsal",
    heading: "تجهيز العرض التقديمي وبروفة المشروع",
    labTestId: "project-demo-lab",
    answer: "المشكلة",
  },
];

test.describe("day 14 — lesson pages and labs", () => {
  for (const lesson of DAY14_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { level: 1, name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await page.getByTestId(lesson.labTestId).locator("input").first().fill(lesson.answer);
      await page.getByTestId(lesson.labTestId).getByRole("button", { name: /تحقق/ }).click();
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/صحيحة|✓|ممتاز|تلميح|تحتاج ضبط/i);
    });
  }
});

test.describe("day 14 — progress footer", () => {
  test("saves lesson completion on project-architecture", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/project-architecture");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 14 — day hub", () => {
  test("day-14 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-14");
    await expect(page.getByRole("link", { name: /1\.\s*هيكل المشروع/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*تنفيذ المشروع على مراحل/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*اختبار وتصحيح المشروع/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*تجهيز العرض التقديمي/ })).toBeVisible();
  });
});
