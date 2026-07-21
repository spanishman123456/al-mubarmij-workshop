/**
 * أداة التحكم في ظهور الكود — مسار المعلم الكامل + انعكاسه على الطالب + عدم تسرّب الحل.
 */
import { test, expect } from "@playwright/test";
import { completeRequiredOnboardingViaApi } from "./helpers.js";

const TEACHER_NID = "2297033843";
const TEACHER_PASS = process.env.E2E_TEACHER_PASSWORD || "";
const STUDENT_NID = "1165814631";
const APP_ID = "app-guess-number";

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
  await expect(page).toHaveURL(/\/student/, { timeout: 15_000 });
  await completeRequiredOnboardingViaApi(page);
}

async function setLevel(page, scope, level, { project } = {}) {
  await page.goto("/teacher/code-visibility");
  await page.getByTestId(`cv-scope-${scope}`).click();
  if (scope === "project" && project) {
    await page.getByTestId("cv-project-select").selectOption(project);
  }
  await page.getByTestId(`cv-level-${level}`).check();
  await page.getByTestId("cv-save").click();
}

test.describe("code visibility control", () => {
  test("teacher sets hide level, student sees hide notice, no solution in network", async ({ browser }) => {
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    await loginTeacher(teacherPage);

    // نطاق مشروع محدّد = إخفاء الكود كليًا
    await setLevel(teacherPage, "project", 1, { project: APP_ID });
    await expect(teacherPage.getByText("تم حفظ الإعداد وتطبيقه فورًا.")).toBeVisible();

    // معاينة كطالب: الحل غير مكشوف
    await teacherPage.getByTestId("cv-preview").click();
    await expect(teacherPage.getByTestId("cv-preview-full-solution")).toContainText("غير مكشوف");

    // سجل التغييرات ظاهر
    await expect(teacherPage.getByText("سجل التغييرات")).toBeVisible();

    // الطالب يرى إشعار الإخفاء + عدم وصول الحل عبر الشبكة
    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginStudent(studentPage);

    const allowedResponse = studentPage.waitForResponse(
      (r) => r.url().includes(`/api/lab/${APP_ID}/allowed-content`) && r.ok(),
    );
    await studentPage.goto(`/python?mode=app&app=${APP_ID}`);
    const res = await allowedResponse;
    const body = await res.json();
    expect(body.content.level).toBe(1);
    expect(body.content.fullSolution).toBeNull();
    expect(body.content.starterCode).toBeNull();

    await studentPage.getByTestId("app-tab-code").click();
    await expect(studentPage.getByTestId("cv-student-bar")).toBeVisible();
    await expect(studentPage.getByTestId("cv-hide-notice")).toBeVisible();

    await teacherCtx.close();
    await studentCtx.close();
  });

  test("full-solution level requires confirmation and teacher can revert", async ({ page }) => {
    await loginTeacher(page);
    await page.goto("/teacher/code-visibility");
    await page.getByTestId("cv-scope-project").click();
    await page.getByTestId("cv-project-select").selectOption(APP_ID);
    await page.getByTestId("cv-level-8").check();
    await page.getByTestId("cv-save").click();

    // نافذة تأكيد كشف الحل الكامل
    await expect(page.getByText("تأكيد كشف الحل الكامل")).toBeVisible();
    await page.getByTestId("cv-confirm-full").click();
    await expect(page.getByText("تم حفظ الإعداد وتطبيقه فورًا.")).toBeVisible();

    // استرجاع السابق
    await page.getByTestId("cv-revert").click();
    await expect(page.getByText("تم استرجاع الإعداد السابق.")).toBeVisible();
  });

  test("teacher lab shows current student mode with change link", async ({ page }) => {
    await loginTeacher(page);
    await setLevel(page, "project", 3, { project: APP_ID });
    await page.goto(`/python?mode=app&app=${APP_ID}`);
    await page.getByTestId("app-tab-code").click();
    await expect(page.getByTestId("cv-teacher-bar")).toBeVisible();
    await expect(page.getByTestId("cv-teacher-mode")).toContainText("التلميحات");
    await expect(page.getByTestId("cv-change-link")).toBeVisible();
  });
});
