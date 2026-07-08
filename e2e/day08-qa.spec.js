/**
 * Day 8 QA — requires PUBLISHED_DAYS>=8 for student access.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";
import { simulateWrite, countWords } from "../src/lib/python/fileIO.js";

const DAY08_LESSONS = [
  {
    path: "/lessons/fibonacci-sequence",
    heading: "متتالية فيبوناتشي والاستدعاء الذاتي",
    labTestId: "fibonacci-sequence-lab",
    labAction: async (page) => {
      await page.getByTestId("fibonacci-answer-input").fill("8");
      await page.getByTestId("fibonacci-sequence-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/algorithm-complexity",
    heading: "تعقيد الخوارزميات وترميز Big-O",
    labTestId: "algorithm-complexity-lab",
    labAction: async (page) => {
      await page.getByTestId("complexity-option-O(1)").click();
      await page.getByTestId("algorithm-complexity-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/tower-of-hanoi",
    heading: "لغز برج هانوي والحل الاستدعائي",
    labTestId: "tower-of-hanoi-lab",
    labAction: async (page) => {
      const lab = page.getByTestId("tower-of-hanoi-lab");
      await lab.getByRole("button", { name: /إعادة/ }).click();
      const moves = [
        ["A", "C"],
        ["A", "B"],
        ["C", "B"],
        ["A", "C"],
        ["B", "A"],
        ["B", "C"],
        ["A", "C"],
      ];
      for (const [from, to] of moves) {
        await lab.getByTestId(`hanoi-column-${from}`).click();
        await lab.getByTestId(`hanoi-column-${to}`).click();
      }
      await lab.getByRole("button", { name: /^تحقق$/ }).click();
    },
  },
  {
    path: "/lessons/python-files-io",
    heading: "الملفات: فتح وقراءة وكتابة البيانات في بايثون",
    labTestId: "python-files-io-lab",
    labAction: async (page) => {
      const lab = page.getByTestId("python-files-io-lab");
      await lab.getByRole("button", { name: /ملء القالب/ }).click();
      const content = await page.getByTestId("file-content-textarea").inputValue();
      const file = simulateWrite("report.txt", content);
      const words = countWords(content);
      await page.getByTestId("line-count-guess").fill(String(file.lineCount));
      await page.getByTestId("word-count-guess").fill(String(words));
      await lab.getByRole("button", { name: /تحقق/ }).click();
    },
  },
];

test.describe("day 08 — lesson pages and labs", () => {
  for (const lesson of DAY08_LESSONS) {
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

test.describe("day 08 — progress footer", () => {
  test("saves lesson completion on fibonacci-sequence", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/fibonacci-sequence");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 08 — day hub", () => {
  test("day-08 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-08");
    await expect(page.getByRole("link", { name: /1\.\s*متتالية فيبوناتشي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*تعقيد/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*برج هانوي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*الملفات/ })).toBeVisible();
  });
});
