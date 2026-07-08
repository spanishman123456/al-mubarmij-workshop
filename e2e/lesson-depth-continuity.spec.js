import { test, expect } from "@playwright/test";
import { loginStudent, seedStudentCompletedDays, STUDENT_NID } from "./helpers.js";

const TEACHER_NID = "2297033843";
const TEACHER_PASS = process.env.E2E_TEACHER_PASSWORD || "";

async function loginTeacher(page) {
  if (!TEACHER_PASS) {
    test.skip(true, "E2E_TEACHER_PASSWORD not set");
  }
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.goto("/login");
    await page.getByRole("button", { name: "دخول المعلم" }).click();
    await page.getByTestId("teacher-national-id").fill(TEACHER_NID);
    await page.getByTestId("teacher-password").fill(TEACHER_PASS);
    await page.getByTestId("teacher-submit").click();
    try {
      await expect(page).toHaveURL(/\/teacher/, { timeout: 12_000 });
      return;
    } catch {
      await page.waitForTimeout(700);
    }
  }
  await expect(page).toHaveURL(/\/teacher/);
}

async function assertDetailedLessonStructure(page) {
  await expect(page.getByRole("heading", { name: "شرح تفصيلي" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /أمثلة محلولة/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "تدريب موجّه" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "تدريب مستقل" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "تحقق سريع" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ملخص" })).toBeVisible();
}

test.describe("lesson depth continuity", () => {
  test("teacher sees day lesson links and can open detailed pages for days 6-9", async ({ page }) => {
    await loginTeacher(page);
    const checks = [
      { day: "day-06", lessonId: "caesar-cipher", route: /\/lessons\/caesar-cipher/ },
      { day: "day-07", lessonId: "python-scope", route: /\/lessons\/python-scope/ },
      { day: "day-08", lessonId: "fibonacci-sequence", route: /\/lessons\/fibonacci-sequence/ },
      { day: "day-09", lessonId: "python-recursion", route: /\/lessons\/python-recursion/ },
    ];

    for (const check of checks) {
      await page.goto(`/path/day/${check.day}`);
      await expect(page.getByTestId("day-lessons-section")).toBeVisible();
      await expect(page.getByRole("heading", { name: "دروس اليوم" })).toBeVisible();
      await page.getByTestId(`day-lesson-link-${check.lessonId}`).click();
      await expect(page).toHaveURL(check.route);
      await assertDetailedLessonStructure(page);
    }
  });

  test("eligible student reaches day 6 detailed lesson after publish/unlock", async ({ page }) => {
    await seedStudentCompletedDays(page, [1, 2, 3, 4, 5], STUDENT_NID);
    await page.goto("/path/day/day-06");
    await expect(page.getByTestId("day-lessons-section")).toBeVisible();
    await page.getByTestId("day-lesson-link-caesar-cipher").click();
    await expect(page).toHaveURL(/\/lessons\/caesar-cipher/);
    await assertDetailedLessonStructure(page);
    await expect(page.getByText(/الإجابة النموذجية \(للمعلم\)/i)).toHaveCount(0);
  });

  test("days 10-15 currently have no detailed lesson links", async ({ page }) => {
    await loginTeacher(page);
    for (const day of ["day-10", "day-11", "day-12", "day-13", "day-14", "day-15"]) {
      await page.goto(`/path/day/${day}`);
      await expect(page.getByTestId("day-lessons-section")).toBeVisible();
      await expect(page.getByText("لا توجد دروس تفصيلية مرتبطة بهذا اليوم بعد.")).toBeVisible();
    }
  });
});
