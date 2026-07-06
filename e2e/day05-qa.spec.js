/**
 * Day 5 QA — requires PUBLISHED_DAYS>=5.
 */
import { test, expect } from "@playwright/test";

const STUDENT_NID = "1165814631";

const DAY05_LESSONS = [
  {
    path: "/lessons/linear-search",
    heading: /البحث الخطي/i,
    labTestId: "linear-search-lab",
    labAction: async (page) => {
      await page.getByTestId("linear-search-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/binary-search",
    heading: /البحث الثنائي/i,
    labTestId: "binary-search-lab",
    labAction: async (page) => {
      await page.getByTestId("binary-search-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/sorting-algorithms",
    heading: /فرز الاختيار/i,
    labTestId: "selection-sort-lab",
    labAction: async (page) => {
      await page.getByTestId("selection-sort-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
  {
    path: "/lessons/sieve-primes",
    heading: /غربال إراتوستينس/i,
    labTestId: "sieve-primes-lab",
    labAction: async (page) => {
      await page.getByTestId("sieve-primes-lab").getByRole("button", { name: /تحقق/ }).click();
    },
  },
];

async function loginStudent(page) {
  await page.goto("/login");
  await page.getByTestId("student-national-id").fill(STUDENT_NID);
  await page.getByTestId("student-submit").click();
  await expect(page).toHaveURL(/\/student/);
}

test.describe("day 05 — lesson pages and labs", () => {
  for (const lesson of DAY05_LESSONS) {
    test(`opens ${lesson.path} with lab`, async ({ page }) => {
      await loginStudent(page);
      await page.goto(lesson.path);
      await expect(page.getByRole("heading", { name: lesson.heading })).toBeVisible();
      await expect(page.getByTestId(lesson.labTestId)).toBeVisible();
      await lesson.labAction(page);
      await expect(page.getByTestId(lesson.labTestId)).toContainText(/تلميح|إجابة|راجع|✓|صحيحة/i);
      const completeBtn = page.getByRole("button", { name: /أكملت هذا الدرس/i });
      const completedMsg = page.getByText(/سُجّل إكمال/i);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(completeBtn.or(completedMsg)).toBeVisible();
    });
  }
});

test.describe("day 05 — progress footer", () => {
  test("saves lesson completion on linear-search", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/linear-search");
    const completeBtn = page.getByRole("button", { name: /أكملت هذا الدرس/i });
    const completedMsg = page.getByText(/سُجّل إكمال/i);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    if ((await completeBtn.count()) > 0) {
      await completeBtn.click();
      await expect(completedMsg).toBeVisible({ timeout: 15000 });
    } else {
      await expect(completedMsg).toBeVisible();
    }
    await page.reload();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(completedMsg).toBeVisible({ timeout: 15000 });
  });
});

test.describe("day 05 — day hub", () => {
  test("day-05 page lists all four lessons", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/path/day/day-05");
    await expect(page.getByRole("link", { name: /1\.\s*البحث الخطي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /2\.\s*البحث الثنائي/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /3\.\s*فرز الاختيار/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /4\.\s*غربال إراتوستينس/ })).toBeVisible();
  });
});

test.describe("day 05 — mobile viewport", () => {
  test("binary search lesson usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await loginStudent(page);
    await page.goto("/lessons/binary-search");
    await expect(page.getByTestId("binary-search-lab")).toBeVisible();
    await page.getByTestId("binary-search-lab").getByRole("button", { name: /تلميح/ }).click();
  });
});

test.describe("day 05 — keyboard", () => {
  test("sieve input focusable via keyboard", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/sieve-primes");
    const input = page.getByTestId("sieve-primes-lab").getByRole("spinbutton").first();
    await input.focus();
    await expect(input).toBeFocused();
  });
});
