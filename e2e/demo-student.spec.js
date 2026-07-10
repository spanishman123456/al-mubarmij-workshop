import { test, expect } from "@playwright/test";
import { loginDemoStudent } from "./helpers.js";

test.describe("demo student entry", () => {
  test("can enter from login button and remains restricted from teacher area", async ({ page }) => {
    await loginDemoStudent(page);

    await expect(page.getByTestId("demo-account-banner")).toBeVisible();
    await expect(page.getByText(/نوع الحساب:\s*طالب تجريبي/)).toBeVisible();

    await page.goto("/path/day/day-01");
    await expect(page.getByText(/ابدأ الدرس|دروس اليوم|اليوم/).first()).toBeVisible();

    await page.goto("/simulations");
    await expect(page.getByText(/المحاكاة|التجارب/).first()).toBeVisible();

    await page.goto("/python");
    const editor = page.getByTestId("python-code-editor");
    await expect(editor).toBeVisible();
    await editor.fill("print('demo student session')");
    let dialogMessage = "";
    page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    await page.getByRole("button", { name: /حفظ الكود/ }).first().click({ timeout: 10_000 });
    await expect.poll(() => dialogMessage, { timeout: 10_000 }).toMatch(/تم حفظ الكود|تم حفظ المشروع/);

    await page.goto("/teacher");
    await expect(page).toHaveURL(/\/student/);
  });

  test("direct /demo route starts demo session", async ({ page }) => {
    await page.goto("/demo");
    await page.getByTestId("demo-start").click();
    await expect(page).toHaveURL(/\/student/);
    await expect(page.getByTestId("demo-account-banner")).toBeVisible();
  });
});
