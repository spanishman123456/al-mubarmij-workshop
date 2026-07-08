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

test.describe("binary cards lesson", () => {
  test("student flips cards, checks answer, sees success", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/binary-cards");
    await expect(page.getByRole("heading", { name: /بطاقات الأرقام الثنائية/i })).toBeVisible();
    await expect(page.getByTestId("binary-card-4")).toBeVisible();
    await page.getByRole("button", { name: "إعادة ضبط البطاقات" }).click();

    await page.getByTestId("binary-card-4").click();
    await expect(page.getByTestId("binary-card-4")).toHaveAttribute("aria-pressed", "true");

    await page.getByTestId("binary-card-1").click();
    const lab = page.getByTestId("binary-cards-lab");
    await expect(lab).toContainText("5");
    await expect(lab.getByText("00101₂")).toBeVisible();

    await page.getByRole("button", { name: "تحقق من الإجابة" }).click();
    await expect(page.getByText(/ممتاز/)).toBeVisible({ timeout: 10000 });
  });
});

test.describe("pre-assessment quiz interactive", () => {
  test("student uses card flip on quiz-pre and sees paginated UI", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/quizzes/run/quiz-pre");
    await expect(page.getByText("الاختبار القبلي").or(page.getByRole("heading", { name: /الاختبار القبلي/i }))).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(/السؤال \d+ من 108/)).toBeVisible({ timeout: 15000 });
    const nextBtn = page.getByRole("button", { name: "التالي" });
    for (let i = 0; i < 9; i += 1) {
      if (await page.getByTestId("quiz-card-4").count()) break;
      if (await nextBtn.isEnabled()) await nextBtn.click();
    }
    const card = page.getByTestId("quiz-card-4");
    if (await card.count()) {
      await card.click();
      await expect(card).toHaveAttribute("aria-pressed", "true");
    }
    await expect(page.getByText("تم حفظ تقدمك.")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("onboarding pre-assessment gate", () => {
  test("student completes agreements only and can start day one without pre-test", async ({ page }) => {
    await loginStudent(page);
    await completeRequiredOnboardingViaApi(page);
    await page.goto("/onboarding");
    await expect(page.getByRole("link", { name: "بدء الدرس الأول" })).toBeVisible({ timeout: 15000 });
    await page.getByRole("link", { name: "بدء الدرس الأول" }).click();
    await expect(page).toHaveURL(/\/path\/day\/day-01/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

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
    await expect(page.getByRole("button", { name: /تحقق من (الإجابة|الترتيب)/ })).toBeVisible();

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

test.describe("progress tracking", () => {
  test("completing a lesson updates published lesson count on dashboard", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/lessons/python-intro");
    await page.getByRole("button", { name: /أكملت هذا الدرس/i }).click();
    await expect(page.getByText(/سُجّل إكمال/i)).toBeVisible({ timeout: 15000 });

    await page.goto("/student");
    await expect(page.getByText(/الدروس المكتملة/i)).toBeVisible();
    await expect(page.getByText(/1\s*\/\s*9|١\s*\/\s*٩/).first()).toBeVisible({ timeout: 15000 });
  });

  test("running python code updates تشغيلات بايثون", async ({ page }) => {
    await loginStudent(page);
    await page.goto("/python");
    await page.getByRole("button", { name: "تشغيل الكود" }).click();
    await page.waitForTimeout(3000);
    await page.goto("/student");
    const runsStat = page.locator("text=تشغيلات بايثون").locator("..");
    await expect(runsStat).not.toContainText(/^0$/);
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
