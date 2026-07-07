/**
 * Day 6 QA — requires PUBLISHED_DAYS>=6 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY06_LESSONS = [
  {
    path: "/lessons/caesar-cipher",
    heading: "شفرة قيصر وعلم التشفير",
    labTestId: "caesar-cipher-lab",
    labAction: async (page) => {
      await page.getByTestId("caesar-cipher-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/memory-hierarchy",
    heading: "الذاكرة والتخزين المؤقت",
    labTestId: "memory-hierarchy-lab",
    labAction: async (page) => {
      await page.getByTestId("memory-hierarchy-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/cpu-scheduling",
    heading: "جدولة عمليات وحدة المعالج",
    labTestId: "cpu-scheduling-lab",
    labAction: async (page) => {
      await page.getByTestId("cpu-scheduling-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
];

test.describe("day 06 — lesson pages and labs", () => {
  for (const lesson of DAY06_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { level: 1, name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await lesson.labAction(page);
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/تلميح|إجابة|راجع|✓|صحيحة|غير صحيح/i);
    });
  }
});

test.describe("day 06 — progress footer", () => {
  test("saves lesson completion on caesar-cipher", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/caesar-cipher");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 06 — day hub", () => {
  test("day-06 page lists all three lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-06");
    await expect(page.getByRole("link", { name: /1\.\s*شفرة قيصر/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*الذاكرة/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*جدولة/ })).toBeVisible();
  });
});
