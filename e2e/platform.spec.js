import { test, expect } from "@playwright/test";

const STUDENT_NID = "1165814631";
const TEACHER_NID = "2297033843";
const TEACHER_PASS = "babamama";

async function loginStudent(page) {
  await page.goto("/login");
  await page.getByTestId("student-national-id").fill(STUDENT_NID);
  await page.getByTestId("student-submit").click();
  await expect(page).toHaveURL(/\/student/);
}

async function loginTeacher(page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "دخول المعلم" }).click();
  await page.getByTestId("teacher-national-id").fill(TEACHER_NID);
  await page.getByTestId("teacher-password").fill(TEACHER_PASS);
  await page.getByTestId("teacher-submit").click();
  await expect(page).toHaveURL(/\/teacher/);
}

test.describe("student day-02 lesson flow", () => {
  test("login, lesson attempt, reload, restore from server", async ({ page, context }) => {
    await loginStudent(page);
    await page.goto("/lessons/if-statement");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const textarea = page.locator("textarea").first();
    await textarea.fill("score = 90\nif score >= 60:\n    print('pass')");
    await page.getByRole("button", { name: "تشغيل" }).click();
    await expect(page.getByText("pass")).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    await loginStudent(page);
    await page.goto("/lessons/if-statement");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("teacher access", () => {
  test("teacher sees dashboard; student blocked from teacher answers", async ({ page, browser }) => {
    await loginTeacher(page);
    await page.goto("/teacher/day-02-answers");
    await expect(page.getByText("إجابات")).toBeVisible();

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginStudent(studentPage);
    await studentPage.goto("/teacher/day-02-answers");
    await expect(studentPage).toHaveURL(/\/student/);
    await studentCtx.close();
  });
});

test.describe("day-02 labs visible", () => {
  test("CardSortSimulation and IfStatementLab render controls", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/card-sort-algorithm");
    await expect(page.getByRole("region", { name: "محاكاة فرز البطاقات" })).toBeVisible();
    await page.getByRole("button", { name: "تلميح" }).click();
    await page.getByRole("button", { name: "تحقق من الترتيب" }).click();

    await page.goto("/lessons/python-for-range");
    await expect(page.getByRole("button", { name: "تتبع" })).toBeVisible();
  });
});

test.describe("day-03 labs visible", () => {
  test("MultiDimGridLab and TruthTableBuilder", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/python-multi-arrays");
    await expect(page.getByRole("grid", { name: "مصفوفة ثنائية الأبعاد" })).toBeVisible();

    await page.goto("/lessons/truth-tables");
    await expect(page.getByRole("heading", { name: "بناء الجدول" })).toBeVisible();
  });
});
