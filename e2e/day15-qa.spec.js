/**
 * Day 15 QA — requires PUBLISHED_DAYS>=15 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY15_LESSONS = [
  {
    path: "/lessons/final-project-presentation",
    heading: "العرض النهائي للمشروع",
    labTestId: "final-presentation-lab",
    answer: "4",
  },
  {
    path: "/lessons/peer-feedback-and-refinement",
    heading: "التغذية الراجعة من الأقران وتحسين المشروع",
    labTestId: "peer-feedback-lab",
    answer: "نعم",
  },
  {
    path: "/lessons/final-evaluation",
    heading: "التقييم الختامي وقياس الأثر",
    labTestId: "final-evaluation-lab",
    answer: "84",
  },
  {
    path: "/lessons/program-closure-next-steps",
    heading: "خاتمة البرنامج والخطوات التالية",
    labTestId: "final-evaluation-lab",
    answer: "نعم",
  },
];

test.describe("day 15 — lesson pages and labs", () => {
  for (const lesson of DAY15_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { level: 1, name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await page.getByTestId(lesson.labTestId).locator("input").first().fill(lesson.answer);
      await page.getByTestId(lesson.labTestId).getByRole("button", { name: /تحقق/ }).click();
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/صحيحة|✓|رائع|تلميح|غير مكتملة/i);
    });
  }
});

test.describe("day 15 — progress footer", () => {
  test("saves lesson completion on final-project-presentation", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/final-project-presentation");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 15 — day hub", () => {
  test("day-15 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-15");
    await expect(page.getByRole("link", { name: /1\.\s*العرض النهائي للمشروع/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*التغذية الراجعة من الأقران/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*التقييم الختامي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*خاتمة البرنامج/ })).toBeVisible();
  });
});
