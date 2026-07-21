import { expect, test } from "@playwright/test";
import process from "node:process";
import { loginStudentWithOnboarding } from "./helpers.js";

const VIEWPORTS = {
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 393, height: 851 },
};

async function loginTeacher(page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "دخول المعلم" }).click();
  await page.getByTestId("teacher-national-id").fill("2297033843");
  await page.getByTestId("teacher-password").fill(process.env.E2E_TEACHER_PASSWORD || "");
  await page.getByTestId("teacher-submit").click();
  await expect(page).toHaveURL(/\/teacher/);
}

async function expectTechnicalLtr(locator) {
  await expect(locator).toBeVisible();
  await expect(locator).toHaveAttribute("dir", "ltr");
  await expect(locator).toHaveCSS("direction", "ltr");
  await expect(locator).toHaveCSS("text-align", "left");
}

test.describe("technical content direction and visual regression", () => {
  test("keeps Karnaugh and truth-table order stable on desktop", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await loginStudentWithOnboarding(page);

    await page.goto("/lessons/karnaugh-maps");
    const lab = page.getByTestId("karnaugh-map-lab");
    const grid = lab.getByTestId("karnaugh-grid");
    await expectTechnicalLtr(grid);
    await expect(grid.locator("[data-gray-column]")).toHaveText(["0", "1"]);
    await expect(grid.locator("th").first()).toContainText("A\\B");
    await expect(grid.locator("[data-kmap-index]")).toHaveCount(4);
    expect(await grid.locator("[data-kmap-index]").evaluateAll((cells) => (
      cells.map((cell) => cell.getAttribute("data-truth-table-index"))
    ))).toEqual(["0", "1", "2", "3"]);
    await expect(lab).toHaveScreenshot("karnaugh-desktop.png", {
      animations: "disabled",
      mask: [grid.locator("button")],
    });

    await page.goto("/simulations#truth");
    const truthSection = page.locator("#truth");
    const table = truthSection.locator(".technical-table").first();
    await expectTechnicalLtr(table);
    const truthHeaders = table.locator("thead th");
    await expect(truthHeaders).toHaveCount(4);
    await expect(truthHeaders.nth(0)).toHaveText("A");
    await expect(truthHeaders.nth(1)).toHaveText("B");
    await expect(truthHeaders.last()).toHaveText("V");
    await expect(truthSection).toHaveScreenshot("truth-table-desktop-dark.png", { animations: "disabled" });
  });

  test("isolates number, binary, and ASCII content on tablet", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await loginStudentWithOnboarding(page);

    await page.goto("/lessons/number-systems");
    const numberValue = page.locator(".technical-value").first();
    await expectTechnicalLtr(numberValue);
    await expect(numberValue.locator("xpath=ancestor::article[1]")).toHaveScreenshot("number-systems-tablet.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });

    await page.goto("/lessons/binary-cards");
    await expectTechnicalLtr(page.locator('[data-technical-kind="binary"]').first());

    await page.goto("/lessons/ascii-unicode");
    const asciiValue = page.locator(".technical-value, pre[dir=ltr], code[dir=ltr]").first();
    await expectTechnicalLtr(asciiValue);
    await expect(asciiValue.locator("xpath=ancestor::article[1]")).toHaveScreenshot("ascii-binary-tablet.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  });

  test("keeps loops, arrays, and skui preview technical surfaces LTR on mobile", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await loginStudentWithOnboarding(page);

    await page.goto("/lessons/nested-loops-lab");
    const technical = page.locator(".technical-value, pre[dir=ltr], code[dir=ltr]").first();
    await expectTechnicalLtr(technical);
    await expect(technical.locator("xpath=ancestor::article[1]")).toHaveScreenshot("loops-arrays-mobile.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });

    await page.goto("/python?mode=app&app=app-calculator");
    await page.getByTestId("app-tab-preview").click();
    const frameElement = page.getByTestId("skui-preview-frame");
    await expect(frameElement).toBeVisible();
    const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
    await expect(frame.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(frame.locator("html")).toHaveAttribute("lang", "ar");
    await expect(frameElement).toHaveScreenshot("skui-preview-mobile-dark.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  });

  test("isolates technical values in teacher-only day 4 answers", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/teacher/day-04-answers");

    const technical = page.locator(".technical-value").first();
    await expectTechnicalLtr(technical);
    await expect(page.getByText(/للمعلم فقط/).first()).toBeVisible();
  });
});
