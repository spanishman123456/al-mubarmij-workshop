/**
 * Day 4 QA — requires PUBLISHED_DAYS>=4 (default in playwright.config webServer).
 */
import { test, expect } from "@playwright/test";
import { loginStudent, assertLessonProgressSaved } from "./helpers.js";

const DAY04_LESSONS = [
  {
    path: "/lessons/karnaugh-maps",
    heading: /خريطة كارنوف/i,
    labTestId: "karnaugh-map-lab",
    labAction: async (page) => {
      await page.getByTestId("kmap-cell-3").click();
      await page.getByRole("button", { name: /أضف مجموعة/ }).click();
      await page.getByRole("button", { name: /تحقق من التبسيط/ }).click();
    },
  },
  {
    path: "/lessons/logic-equivalence",
    heading: /الاقترانات المنطقية/i,
    labTestId: "logic-equivalence-lab",
    labAction: async (page) => {
      const lab = page.getByTestId("logic-equivalence-lab");
      await lab.getByPlaceholder("نعم / لا").fill("نعم");
      await lab.getByRole("button", { name: "تحقق" }).click();
    },
  },
  {
    path: "/lessons/python-tuples",
    heading: /الحقول المترابطة/i,
    labTestId: "tuple-lab",
    labAction: async (page) => {
      await page.getByRole("button", { name: /تحقق من الفهرس/ }).click();
    },
  },
  {
    path: "/lessons/nested-loops-lab",
    heading: /الحلقات المتداخلة/i,
    labTestId: "nested-loops-lab",
    labAction: async (page) => {
      await page.getByRole("button", { name: /املأ الصف/ }).first().click();
    },
  },
];

test.describe("day 04 — lesson pages and labs", () => {
  for (const lesson of DAY04_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await lesson.labAction(page);
      if (lesson.path === "/lessons/karnaugh-maps") {
        await expect(page.getByTestId("karnaugh-map-lab")).toContainText(/ممتاز|جمّع|تمت إضافة/i);
        return;
      }
      const completeBtn = page.getByRole("button", { name: /أكملت هذا الدرس/i });
      const completedMsg = page.getByText(/سُجّل إكمال/i);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(completeBtn.or(completedMsg)).toBeVisible();
    });
  }
});

test.describe("day 04 — progress footer", () => {
  test("saves lesson completion on logic-equivalence", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/logic-equivalence");
    await assertLessonProgressSaved(page);
  });
});

test.describe("day 04 — day hub", () => {
  test("day-04 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-04");
    await expect(page.getByRole("link", { name: "1. خريطة كارنوف" })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*الاقترانات المنطقية/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*الحقول المترابطة/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*الحلقات المتداخلة/ })).toBeVisible();
  });
});

test.describe("day 04 — mobile viewport", () => {
  test("karnaugh lesson usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await loginStudent(page);
    await page.goto("/lessons/karnaugh-maps");
    await expect(page.getByTestId("karnaugh-map-lab")).toBeVisible();
    await page.getByTestId("kmap-cell-3").click();
  });
});

test.describe("day 04 — keyboard", () => {
  test("tuple lab inputs focusable via keyboard", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/python-tuples");
    await page.getByTestId("tuple-lab").getByRole("spinbutton").first().focus();
    await expect(page.getByTestId("tuple-lab").getByRole("spinbutton").first()).toBeFocused();
  });
});
