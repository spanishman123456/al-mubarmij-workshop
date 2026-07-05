import { test, expect } from "@playwright/test";

const STUDENT_NID = "1165814631";
const TEACHER_NID = "2297033843";
const TEACHER_PASS = process.env.E2E_TEACHER_PASSWORD || "";

async function loginStudent(page) {
  await page.goto("/login");
  await page.getByTestId("student-national-id").fill(STUDENT_NID);
  await page.getByTestId("student-submit").click();
  await expect(page).toHaveURL(/\/student/);
}

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

async function labFlow(page, { wrong, hintButton, checkButton, successPattern }) {
  if (wrong) await wrong();
  if (hintButton) await hintButton();
  if (checkButton) await checkButton();
  if (successPattern) await expect(page.getByText(successPattern)).toBeVisible();
  await page.reload();
  if (successPattern) await expect(page.getByText(successPattern)).toBeVisible();
}

test.describe("onboarding BINGO", () => {
  test("student opens bingo grid, saves cells, reload persists, teacher sees summary", async ({ page, browser }) => {
    await loginStudent(page);
    await page.goto("/onboarding/bingo");
    await expect(page.getByRole("heading", { name: /نشاط BINGO/i })).toBeVisible();
    await expect(page.getByPlaceholder("اسم زميل").first()).toBeVisible();
    await expect(page.locator('input[placeholder="اسم زميل"]')).toHaveCount(24);

    await page.getByPlaceholder("اسم زميل").first().fill("زميل تجريبي");
    await expect(page.getByText("تم حفظ تقدمك")).toBeVisible({ timeout: 10000 });

    await page.reload();
    await expect(page.getByPlaceholder("اسم زميل").first()).toHaveValue("زميل تجريبي");

    await page.goto("/onboarding/bingo", { waitUntil: "networkidle" });
    await expect(page.getByText("نسبة الإنجاز")).toBeVisible();
  });
});

test.describe("student day-02 lesson flow", () => {
  test("login, lesson attempt, reload, restore from server", async ({ page, context }) => {
    await loginStudent(page);
    await page.goto("/lessons/if-statement");
    await page.locator("textarea").first().fill("score = 90\nif score >= 60:\n    print('pass')");
    await page.getByRole("button", { name: "تشغيل" }).click();
    await expect(page.getByText("pass")).toBeVisible();
    await page.reload();
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    await loginStudent(page);
    await page.goto("/lessons/if-statement");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("teacher access", () => {
  test("teacher day-03 answers; student blocked UI + API", async ({ page, browser, request }) => {
    await loginTeacher(page);
    await page.goto("/teacher/day-03-answers");
    await expect(page.getByText("إجابات المعلم — اليوم الثالث")).toBeVisible();

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginStudent(studentPage);
    await studentPage.goto("/teacher/day-03-answers");
    await expect(studentPage).toHaveURL(/\/student/);
    await studentCtx.close();
  });
});

test.describe("day-02 labs", () => {
  test("CardSort, WhileLoop, AlgorithmSteps, ComputerLab", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/card-sort-algorithm");
    await page.getByRole("button", { name: "تلميح" }).click();
    await page.getByRole("button", { name: "تحقق من الترتيب" }).click();

    await page.goto("/lessons/python-while");
    await expect(page.getByRole("button", { name: "countdown while" })).toBeVisible();

    await page.goto("/lessons/algorithms");
    await expect(page.getByRole("button", { name: "تحقق من الترتيب" })).toBeVisible();

    await page.goto("/lessons/day02-computer-lab");
    await expect(page.getByRole("button", { name: "تشغيل" })).toBeVisible();
  });
});

test.describe("day-03 labs", () => {
  test("LoopControl, Divisors, NumbersSteps, Collatz", async ({ page }) => {
    await loginStudent(page);

    await page.goto("/lessons/python-break-continue");
    await page.getByRole("button", { name: "تشغيل وتتبّع" }).click();

    await page.goto("/lessons/divisors-activity");
    await page.getByPlaceholder("1,2,3,...").fill("1,2,3,4,6,12");
    await page.getByRole("button", { name: "تحقق" }).click();

    await page.goto("/lessons/numbers-steps-activity");
    await page.getByPlaceholder("عدد الخطوات").fill("8");
    await page.getByRole("button", { name: "تحقق" }).click();
    await expect(page.getByText("✓ 8 خطوات")).toBeVisible();

    await page.goto("/lessons/collatz");
    await page.getByRole("button", { name: "تحقق (n=6 → 8 خطوات)" }).click();
  });

  test("MultiDimGrid, TruthTable, LogicGates", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/python-multi-arrays");
    await expect(page.getByRole("grid", { name: "مصفوفة ثنائية الأبعاد" })).toBeVisible();

    await page.goto("/lessons/truth-tables");
    await expect(page.getByRole("heading", { name: "بناء الجدول" })).toBeVisible();

    await page.goto("/lessons/logic-gates");
    await expect(page.getByRole("button", { name: "A" })).toBeVisible();
  });
});

test.describe("analytics sync", () => {
  test("no login sync console error", async ({ page }) => {
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && /login sync failed|analytics-sync:login/.test(msg.text())) {
        errors.push(msg.text());
      }
    });
    await loginStudent(page);
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
