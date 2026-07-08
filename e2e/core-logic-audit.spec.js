import { test, expect } from "@playwright/test";
import { loginStudent } from "./helpers.js";

const TEACHER_NID = "2297033843";
const TEACHER_PASS = process.env.E2E_TEACHER_PASSWORD || "";

async function loginTeacher(page) {
  if (!TEACHER_PASS) {
    test.skip(true, "E2E_TEACHER_PASSWORD not set");
  }
  await page.goto("/login");
  await page.getByRole("button", { name: "دخول المعلم" }).click();
  await page.getByTestId("teacher-national-id").fill(TEACHER_NID);
  await page.getByTestId("teacher-password").fill(TEACHER_PASS);
  await page.getByTestId("teacher-submit").click();
  await expect(page).toHaveURL(/\/teacher/);
}

async function completeRequiredOnboardingViaApi(page) {
  const cookies = await page.context().cookies();
  const csrf = cookies.find((c) => c.name === "platform_csrf")?.value || "";
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
  const headers = {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrf,
    Cookie: cookieHeader,
  };
  await page.request.post("http://127.0.0.1:3011/api/onboarding/bingo", {
    headers,
    data: { cells: { c0: "زميل" }, status: "submitted", submittedAt: new Date().toISOString() },
  });
  for (const docType of ["honor_code", "acceptable_use", "honor_agreement", "tech_contract"]) {
    await page.request.post("http://127.0.0.1:3011/api/onboarding/agreement", {
      headers,
      data: { docType, signatureText: "توقيع تجريبي", version: "1.0" },
    });
  }
}

test.describe("core logic audit blockers", () => {
  test("twos complement subtraction validates correct result", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/twos-complement");
    await page.getByTestId("twos-a-input").fill("7");
    await page.getByTestId("twos-b-input").fill("3");
    await page.getByTestId("twos-result-bits-input").fill("00000100");
    await page.getByTestId("twos-result-value-input").fill("4");
    await page.getByTestId("twos-subtraction-check-btn").click();
    await expect(page.getByText(/صحيح/)).toBeVisible();
  });

  test("algorithm steps accepts selected ordered answer", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/algorithms");
    await page.locator("li", { hasText: "اقرأ a و b" }).getByRole("button", { name: "↑" }).click();
    await page
      .locator("li", { hasText: "إذا a > b فاجعل max = a وإلا max = b" })
      .getByRole("button", { name: "↑" })
      .click();
    await page.getByTestId("algorithm-step-pick-3").uncheck();
    await page.getByTestId("algorithm-step-pick-4").uncheck();
    await page.getByRole("button", { name: "تحقق من الإجابة" }).click();
    await expect(page.getByText(/ترتيب صحيح/)).toBeVisible();
  });

  test("python editor supports auto indentation and saved library", async ({ page }) => {
    await loginStudent(page);
    await completeRequiredOnboardingViaApi(page);
    await page.goto("/python");
    const editor = page.getByTestId("python-code-editor");
    await expect(editor).toBeVisible({ timeout: 15000 });
    await editor.fill("if a < b:\nprint(b)\nelse:\nprint(a)");
    await page.getByRole("button", { name: "إصلاح المسافات تلقائيًا" }).click();
    await expect(editor).toHaveValue("if a < b:\n    print(b)\nelse:\n    print(a)");
    await page.getByRole("button", { name: /حفظ الكود/ }).click();
    await expect(page.getByTestId("python-saved-library")).toContainText("كود محفوظ");
  });

  test("teacher can open saved snippets library for student", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/teacher");
    await page.getByRole("button", { name: "مكتبة أكواد بايثون" }).first().click();
    await expect(page.getByText("مكتبة الأكواد المحفوظة")).toBeVisible();
  });
});
