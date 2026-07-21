import { test, expect } from "@playwright/test";

const STUDENT_NID = "1165814631";

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
  await page.request.post("http://127.0.0.1:3011/api/progress/sync", {
    headers,
    data: { progress: { preTest: { percent: 0, submitted: true } } },
  });
}

async function loginStudent(page) {
  await page.goto("/login");
  await page.getByTestId("student-national-id").fill(STUDENT_NID);
  await page.getByTestId("student-submit").click();
  await expect(page).toHaveURL(/\/student/);
  await completeRequiredOnboardingViaApi(page);
}

test.describe("python lab autocomplete", () => {
  test("suggests print and inserts name only", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/python?ex=intro-print");
    await expect(page.getByTestId("python-code-editor")).toBeVisible({ timeout: 15000 });

    const editor = page.getByTestId("python-code-editor");
    await editor.fill("");
    await editor.pressSequentially("pri", { delay: 80 });

    await expect(page.getByTestId("python-autocomplete-list")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("python-autocomplete-item-print")).toBeVisible();

    await page.getByTestId("python-autocomplete-item-print").click();
    await expect(editor).toHaveValue("print");

    await editor.type('("Hi")');
    await page.getByRole("button", { name: /تشغيل الكود/ }).click();
    await expect(page.locator("pre").filter({ hasText: "Hi" }).first()).toBeVisible({ timeout: 15000 });
  });

  test("Ctrl+Space opens suggestions when mode is reduced", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/python");
    const editor = page.getByTestId("python-code-editor");
    await editor.fill("p");
    await editor.press("Control+Space");
    await expect(page.getByTestId("python-autocomplete-list")).toBeVisible({ timeout: 5000 });
    await editor.press("Escape");
    await expect(page.getByTestId("python-autocomplete-list")).toHaveCount(0);
  });
});
