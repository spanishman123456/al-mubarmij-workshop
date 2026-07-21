/**
 * Day 12 QA — requires PUBLISHED_DAYS>=12 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY12_LESSONS = [
  {
    path: "/lessons/regex-automata",
    heading: "التعبيرات العادية وربطها بآلات الحالة",
    labTestId: "automata-lab",
    answer: "نعم",
  },
  {
    path: "/lessons/dfa-nfa-design",
    heading: "الفرق بين DFA و NFA وتصميم أمثلة",
    labTestId: "automata-lab",
    answer: "لا",
  },
  {
    path: "/lessons/p-vs-np-intro",
    heading: "مقدمة P و NP والتفكير في التعقيد",
    labTestId: "complexity-lab",
    answer: "P",
  },
  {
    path: "/lessons/graph-theory-basics",
    heading: "أساسيات نظرية المخططات وتطبيقاتها",
    labTestId: "graph-lab",
    answer: "10",
  },
];

test.describe("day 12 — lesson pages and labs", () => {
  for (const lesson of DAY12_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { level: 1, name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await page.getByTestId(lesson.labTestId).locator("input").first().fill(lesson.answer);
      await page.getByTestId(lesson.labTestId).getByRole("button", { name: /تحقق/ }).click();
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/صحيحة|✓|ممتاز|تلميح|غير دقيقة/i);
    });
  }
});

test.describe("day 12 — progress footer", () => {
  test("saves lesson completion on regex-automata", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/regex-automata");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 12 — day hub", () => {
  test("day-12 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-12");
    await expect(page.getByRole("link", { name: /1\.\s*التعبيرات العادية وآلات الحالة/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*الفرق بين DFA و NFA/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*مقدمة P و NP/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*أساسيات نظرية المخططات/ })).toBeVisible();
  });
});
