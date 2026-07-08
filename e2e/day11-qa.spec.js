/**
 * Day 11 QA — requires PUBLISHED_DAYS>=11 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY11_LESSONS = [
  {
    path: "/lessons/ai-foundations",
    heading: "مقدمة الذكاء الاصطناعي وتطبيقاته",
    labTestId: "ai-foundations-lab",
    answer: "التعلم من البيانات لاكتشاف الأنماط",
  },
  {
    path: "/lessons/machine-learning-basics",
    heading: "أساسيات التعلم الآلي وقياس الأداء",
    labTestId: "machine-learning-lab",
    answer: "70",
  },
  {
    path: "/lessons/ai-ethics-safety",
    heading: "أخلاقيات الذكاء الاصطناعي والخصوصية",
    labTestId: "ai-ethics-lab",
    answer: "نعم",
  },
  {
    path: "/lessons/ai-research-presentation",
    heading: "إعداد بحث وعرض تقديمي في الذكاء الاصطناعي",
    labTestId: "ai-presentation-lab",
    answer: "نعم",
  },
];

test.describe("day 11 — lesson pages and labs", () => {
  for (const lesson of DAY11_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { level: 1, name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await page.getByTestId(lesson.labTestId).locator("input").first().fill(lesson.answer);
      await page.getByTestId(lesson.labTestId).getByRole("button", { name: /تحقق/ }).click();
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/صحيحة|✓|أحسنت|تلميح|تحتاج ضبط/i);
    });
  }
});

test.describe("day 11 — progress footer", () => {
  test("saves lesson completion on ai-foundations", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/ai-foundations");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 11 — day hub", () => {
  test("day-11 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-11");
    await expect(page.getByRole("link", { name: /1\.\s*مقدمة الذكاء الاصطناعي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*أساسيات التعلم الآلي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*أخلاقيات الذكاء الاصطناعي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*البحث والعرض في الذكاء الاصطناعي/ })).toBeVisible();
  });
});
