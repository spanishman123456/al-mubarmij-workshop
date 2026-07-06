/**
 * Teacher preview access — path days + quiz-pre without student restrictions.
 */
import { test, expect } from "@playwright/test";

const TEACHER_NID = "2297033843";
const TEACHER_PASS = process.env.E2E_TEACHER_PASSWORD || "";
const STUDENT_NID = "1165814631";

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

async function loginStudent(page) {
  await page.goto("/login");
  await page.getByTestId("student-national-id").fill(STUDENT_NID);
  await page.getByTestId("student-submit").click();
  await expect(page).toHaveURL(/\/student/);
}

function dayCard(page, dayId) {
  return page.locator(`article[data-day-id="${dayId}"]`);
}

test.describe("teacher preview access", () => {
  test("teacher opens day 2 from path without schedule lock", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/path");
    const day2 = dayCard(page, "day-02");
    await expect(day2.getByText(/سيتم فتحه وفق الجدول/i)).toHaveCount(0);
    const cta = day2.getByRole("link", { name: /معاينة اليوم|ابدأ الدرس/i }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/path\/day\/day-02/);
    await expect(page.getByText(/المحتوى غير متاح بعد|اليوم مقفل/i)).toHaveCount(0);
  });

  test("teacher sees preview badge on unpublished day", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/path/day/day-05");
    await expect(page.getByText(/معاينة المعلم|غير منشور للطلاب/i).first()).toBeVisible();
  });

  test("teacher quiz-pre loads in preview mode", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/quizzes/run/quiz-pre");
    await expect(page.getByTestId("teacher-quiz-preview")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/معاينة المعلم/i).first()).toBeVisible();
    await expect(page.getByText(/تعذر تحميل الاختبار/i)).toHaveCount(0);
    await expect(page.getByText(/الإجابة النموذجية/i).first()).toBeVisible();
  });

  test("post assessment visible on quizzes page", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/quizzes");
    await expect(page.getByText(/التقويم البعدي|الاختبار البعدي/i).first()).toBeVisible();
  });

  test("student blocked from locked day-02 URL when not eligible", async ({ page }) => {
    await loginStudent(page);
    const unlock = await page.request.get("/api/student/day-unlock");
    const map = (await unlock.json()).dayUnlockMap;
    if (map?.["day-02"] !== "locked") {
      test.skip(true, "student already has day 2 unlocked in E2E DB");
    }
    await page.goto("/path/day/day-02");
    await expect(page.getByRole("heading", { name: /اليوم مقفل|المحتوى غير متاح/i })).toBeVisible();
  });
});
