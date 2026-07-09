/**
 * Day 13 QA — requires PUBLISHED_DAYS>=13 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY13_LESSONS = [
  {
    path: "/lessons/comprehensive-review",
    heading: "مراجعة شاملة لمحاور المقرر",
    labTestId: "review-lab",
    answer: "70",
  },
  {
    path: "/lessons/post-assessment-readiness",
    heading: "التقويم البعدي وقراءة نتائج التعلم",
    labTestId: "post-assessment-lab",
    answer: "30",
  },
  {
    path: "/lessons/project-ideation",
    heading: "صياغة فكرة المشروع النهائي",
    labTestId: "project-prep-lab",
    answer: "تعريف المشكلة",
  },
  {
    path: "/lessons/project-planning",
    heading: "تخطيط التنفيذ وخارطة المشروع",
    labTestId: "project-prep-lab",
    answer: "نعم",
  },
];

test.describe("day 13 — lesson pages and labs", () => {
  for (const lesson of DAY13_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { level: 1, name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await page.getByTestId(lesson.labTestId).locator("input").first().fill(lesson.answer);
      await page.getByTestId(lesson.labTestId).getByRole("button", { name: /تحقق/ }).click();
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/صحيحة|✓|أحسنت|تلميح|تحتاج تحسين/i);
    });
  }
});

test.describe("day 13 — progress footer", () => {
  test("saves lesson completion on comprehensive-review", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/comprehensive-review");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 13 — day hub", () => {
  test("day-13 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-13");
    await expect(page.getByRole("link", { name: /1\.\s*مراجعة شاملة/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*التقويم البعدي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*صياغة فكرة المشروع/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*تخطيط المشروع/ })).toBeVisible();
  });
});
