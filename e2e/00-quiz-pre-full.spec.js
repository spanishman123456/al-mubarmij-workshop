import { test, expect } from "@playwright/test";

const STUDENT_POOL = [
  "1167060266", "1161185713", "1168058988", "1169897301", "1162034662",
  "1166217404", "1167726064", "1168174041", "1164805762", "1162716078",
  "1169721964", "1167619236", "1170757924", "1165324292", "1167568268",
  "1166809952", "1168088449", "1171156852", "1167676921",
];
const TEACHER_NID = "2297033843";
const TEACHER_PASS = process.env.E2E_TEACHER_PASSWORD || "";

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

async function loginStudentWithFreshQuiz(page) {
  for (const nid of STUDENT_POOL) {
    await page.goto("/login");
    await page.getByTestId("student-national-id").fill(nid);
    await page.getByTestId("student-submit").click();
    await expect(page).toHaveURL(/\/student/);
    await completeRequiredOnboardingViaApi(page);
    await page.goto("/quizzes/run/quiz-pre");
    await page.waitForURL(/\/quizzes\/(run\/quiz-pre|review\/\d+)/, { timeout: 15000 });
    if (!page.url().includes("/review/")) {
      await expect(page.getByRole("heading", { name: /الاختبار القبلي/i })).toBeVisible();
      await expect(page.getByText(/السؤال \d+ من 105/)).toBeVisible({ timeout: 20000 });
      return nid;
    }
  }
  throw new Error("No student with an in-progress quiz-pre attempt available in E2E pool");
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

function acceptNextDialog(page) {
  page.once("dialog", (d) => d.accept());
}

async function gotoQuestion(page, questionId) {
  const btn = page.getByTestId(`quiz-nav-${questionId}`);
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await expect(page.getByTestId("quiz-question-card")).toBeVisible();
}

async function fillFlowchartSlots(page) {
  const mapping = [
    ["1", "oval"],
    ["2", "parallelogram"],
    ["3", "diamond"],
    ["4", "rectangle"],
    ["5", "oval"],
  ];
  for (const [slot, sym] of mapping) {
    await page.getByTestId(`flowchart-slot-${slot}`).selectOption(sym);
  }
}

async function fillFlowchartSymbolMatch(page) {
  const mapping = [
    ["oval", "start-end"],
    ["parallelogram", "io"],
    ["diamond", "decision"],
    ["rectangle", "process"],
  ];
  for (const [sym, role] of mapping) {
    await page.getByTestId(`flowchart-symbol-${sym}`).selectOption(role);
  }
}

async function waitForServerAnswer(page, questionId, expected) {
  const cookies = await page.context().cookies();
  const csrf = cookies.find((c) => c.name === "platform_csrf")?.value || "";
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
  await expect
    .poll(
      async () => {
        const res = await page.request.get("http://127.0.0.1:3011/api/quiz/quiz-pre/attempt", {
          headers: { Cookie: cookieHeader, "X-CSRF-Token": csrf },
        });
        const body = await res.json();
        return body.attempt?.answers?.[questionId] ?? "";
      },
      { timeout: 15000 },
    )
    .toBe(expected);
}

test.describe("quiz-pre full E2E scenario", () => {
  test("16-step flow: interactive answers, save, submit, review, teacher pending", async ({ page, browser }) => {
    // 1 — تسجيل دخول الطالب
    await loginStudentWithFreshQuiz(page);

    // 2 — بدء الاختبار القبلي (already on quiz page from login)

    // 3 — سؤال اختيار من متعدد
    await gotoQuestion(page, "pre-06a");
    await page.getByTestId("quiz-mcq-1").click();

    // 4 — سؤال ترتيب (تحريك خطوة لتسجيل الإجابة)
    await gotoQuestion(page, "pre-algo-order");
    await expect(page.getByTestId("quiz-order")).toBeVisible();
    await page.getByRole("button", { name: "تحريك لأسفل" }).nth(1).click();

    // 5 — بناء مخطط تدفق
    await gotoQuestion(page, "pre-18-flow");
    await expect(page.getByTestId("quiz-flowchart")).toBeVisible();
    await fillFlowchartSlots(page);
    await gotoQuestion(page, "pre-19");
    await fillFlowchartSymbolMatch(page);

    // 6 — كتابة كود
    const codeSnippet = "n = int(input())\nprint(abs(n))";
    await gotoQuestion(page, "pre-18");
    await page.getByTestId("quiz-code-input").fill(codeSnippet);

    // 7 — حفظ تلقائي (بعد كل الإجابات)
    await expect(page.getByText("تم حفظ تقدمك.")).toBeVisible({ timeout: 15000 });
    await gotoQuestion(page, "pre-18-flow");
    await expect(page.getByTestId("flowchart-slot-3")).toHaveValue("diamond");
    await waitForServerAnswer(page, "pre-18", codeSnippet);

    // 8–9 — تحديث الصفحة واستعادة الإجابات
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(/السؤال \d+ من 105/)).toBeVisible({ timeout: 15000 });
    await gotoQuestion(page, "pre-18");
    await expect(page.getByTestId("quiz-code-input")).toHaveValue(codeSnippet, { timeout: 15000 });
    await gotoQuestion(page, "pre-18-flow");
    await expect(page.getByTestId("flowchart-slot-3")).toHaveValue("diamond");

    // 10 — إرسال الاختبار
    acceptNextDialog(page);
    await page.getByTestId("quiz-submit").click();
    await expect(page).toHaveURL(/\/quizzes\/review\/\d+/, { timeout: 25000 });
    const reviewUrl = page.url();

    // 11 — صفحة المراجعة
    await expect(page.getByRole("heading", { name: /شكرًا لإكمال التقويم القبلي/ })).toBeVisible();

    // 12 — الشرح يظهر بعد الإرسال فقط
    await expect(page.getByText("الشرح:").first()).toBeVisible();
    await expect(page.getByText("بانتظار مراجعة المعلم").first()).toBeVisible();

    // 13 — منع التعديل بعد الإرسال
    await page.goto("/quizzes/run/quiz-pre");
    await expect(page).toHaveURL(/\/quizzes\/review\/\d+/);

    // 14–15 — المعلم يراجع الأسئلة اليدوية
    if (TEACHER_PASS) {
      const teacherCtx = await browser.newContext();
      const teacherPage = await teacherCtx.newPage();
      await loginTeacher(teacherPage);
      await teacherPage.goto("/teacher/quiz-review");
      await expect(teacherPage.getByRole("heading", { name: /مراجعة اختبارات الطلاب/i })).toBeVisible();
      const viewBtn = teacherPage.getByRole("button", { name: "عرض الإجابات" }).first();
      if (await viewBtn.count()) {
        await viewBtn.click();
        await expect(teacherPage.getByText(/بانتظار المعلم|القيمة المطلقة|pre-18/i).first()).toBeVisible({
          timeout: 15000,
        });
      }
      await teacherCtx.close();
    }

    // 16 — الطالب يرى حالة «بانتظار المعلم» على صفحة المراجعة
    await page.goto(reviewUrl);
    await expect(page.getByText("بانتظار مراجعة المعلم").first()).toBeVisible();
    await expect(page.getByText(codeSnippet.split("\n")[0])).toBeVisible();
  });
});
