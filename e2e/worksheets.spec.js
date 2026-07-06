/**
 * Worksheets visibility E2E — PUBLISHED_DAYS=2, sequential unlock.
 */
import { test, expect } from "@playwright/test";
import { loginStudent, seedStudentDay1Complete, seedStudentDay1Incomplete, isDay2LockedForStudent } from "./helpers.js";

const ELIGIBLE_STUDENT = "1165814631";
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

test.describe("worksheets access", () => {
  test("eligible student sees day 1 and day 2 worksheets", async ({ page }) => {
    await seedStudentDay1Complete(page, ELIGIBLE_STUDENT);
    await page.goto("/worksheets");
    await expect(page.getByTestId("worksheets-path-grid")).toBeVisible();
    await expect(page.getByTestId("worksheet-card-ws-day-01")).toBeVisible();
    await expect(page.getByTestId("worksheet-card-ws-day-02")).toBeVisible();
    await expect(page.getByTestId("worksheet-card-ws-day-02")).toContainText("التحويلات");
  });

  test("eligible student opens day 2 worksheet", async ({ page }) => {
    await seedStudentDay1Complete(page, ELIGIBLE_STUDENT);
    await page.goto("/worksheets");
    await page.getByTestId("worksheet-card-ws-day-02").getByRole("link", { name: "فتح" }).click();
    await expect(page).toHaveURL(/\/worksheets\/ws-day-02/);
    await expect(page.getByText(/التحويلات \(نشاط تمهيدي\)/)).toBeVisible();
  });

  test("locked student sees day 2 worksheet as locked", async ({ page }) => {
    await seedStudentDay1Incomplete(page, ELIGIBLE_STUDENT);
    if (!(await isDay2LockedForStudent(page))) {
      test.skip(true, "student already unlocked day 2 in E2E DB");
    }
    await page.goto("/worksheets");
    const day2 = page.getByTestId("worksheet-card-ws-day-02");
    await expect(day2).toBeVisible();
    await expect(day2.getByText("مقفل")).toBeVisible();
    await expect(day2.getByText(/أكمل اليوم السابق/i)).toBeVisible();
  });

  test("teacher sees all worksheets including unpublished days", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/worksheets");
    await expect(page.getByTestId("worksheet-card-ws-day-01")).toBeVisible();
    await expect(page.getByTestId("worksheet-card-ws-day-02")).toBeVisible();
    await expect(page.getByTestId("worksheet-card-ws-day-05")).toBeVisible();
    await expect(page.getByText(/معاينة معلم فقط|منشورة/i).first()).toBeVisible();
  });

  test("teacher opens day 5 worksheet preview", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/worksheets/ws-day-05");
    await expect(page.getByText(/معاينة المعلم/i).first()).toBeVisible();
    await expect(page.getByText(/المحتوى غير متاح|ورقة العمل مقفلة/i)).toHaveCount(0);
  });

  test("teacher sees model answers on day 2 worksheet", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/worksheets/ws-day-02");
    await expect(page.getByText(/الإجابة النموذجية \(للمعلم\)/i).first()).toBeVisible();
  });
});
