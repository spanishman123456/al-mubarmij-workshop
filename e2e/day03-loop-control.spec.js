import { test, expect } from "@playwright/test";
import { loginStudent } from "./helpers.js";

async function runLoopMode(page, mode) {
  await page.getByRole("button", { name: new RegExp(`^${mode}$`, "i") }).click();
  await page.getByRole("button", { name: "تشغيل وتتبّع" }).click();
}

test.describe("day03 loop control interactive logic", () => {
  test("continue/break/pass/else produce expected output without false parser error", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/python-break-continue");

    await runLoopMode(page, "continue");
    await expect(page.getByText("لم أتعرف على المتغيرات")).toHaveCount(0);
    await expect(page.getByTestId("loop-output-line")).toHaveText(["0", "1", "3", "4"]);
    await expect(page.getByTestId("loop-trace-line").filter({ hasText: "continue" })).toBeVisible();

    await runLoopMode(page, "break");
    await expect(page.getByTestId("loop-output-line")).toHaveText(["0", "1", "2", "3", "4"]);
    await expect(page.getByTestId("loop-trace-line").filter({ hasText: "break" })).toBeVisible();

    await runLoopMode(page, "pass");
    await expect(page.getByTestId("loop-output-line")).toHaveText(["0", "1", "2"]);
    await expect(page.getByTestId("loop-trace-line").filter({ hasText: "pass" })).toBeVisible();

    await runLoopMode(page, "else");
    await expect(page.getByTestId("loop-output-line")).toHaveText(["0", "1", "2", "done"]);
  });

  test("multi-dimensional arrays lab validates row/col index order", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/python-multi-arrays");

    await page.getByRole("button", { name: "صف 0 عمود 1 قيمة 2" }).click();
    await page.getByRole("button", { name: /هل m\[0\]\[1\]/ }).click();
    await expect(page.getByText("✓ صحيح: تم اختيار m[0][1] بدقة")).toBeVisible();

    await page.getByRole("button", { name: "صف 1 عمود 0 قيمة 4" }).click();
    await page.getByRole("button", { name: /هل m\[0\]\[1\]/ }).click();
    await expect(page.getByText("غير صحيح: راجع ترتيب row ثم col")).toBeVisible();
  });
});
