import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import http from "node:http";
import { Buffer } from "node:buffer";
import { unzipSync } from "fflate";
import { E2E_CALCULATOR_APP, E2E_EXAMPLES, E2E_WELCOME_APP } from "./fixtures/skuiApps.js";
import { SKUI_ADVANCED_APPS } from "../src/data/skuiAdvancedApps.js";
import { loginStudentWithOnboarding } from "./helpers.js";

async function loginStudent(page) {
  await loginStudentWithOnboarding(page);
}

async function openAppLab(page, appId = "app-guess-number") {
  await page.goto(`/python?mode=app&app=${appId}`);
  await expect(page.getByRole("heading", { name: "مختبر بايثون" })).toBeVisible();
  await page.getByTestId("app-tab-code").click();
}

async function runCode(page, code) {
  await page.getByTestId("app-tab-code").click();
  await page.getByTestId("python-code-editor").fill(code);
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();
}

async function readDownload(download) {
  const path = await download.path();
  return unzipSync(new Uint8Array(await fs.readFile(path)));
}

async function serveZip(files) {
  const indexName = Object.keys(files).find((name) => name.endsWith("/index.html"));
  const prefix = indexName.slice(0, -"index.html".length);
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname).replace(/^\/+/, "");
    const key = `${prefix}${pathname || "index.html"}`;
    const body = files[key] || (pathname === "" ? files[indexName] : null);
    if (!body) {
      response.writeHead(404).end("not found");
      return;
    }
    const type =
      key.endsWith(".html") ? "text/html" :
        key.endsWith(".js") ? "text/javascript" :
          key.endsWith(".json") || key.endsWith(".webmanifest") ? "application/json" :
            key.endsWith(".py") ? "text/plain" : "application/octet-stream";
    response.writeHead(200, { "content-type": type, "cache-control": "no-cache" }).end(Buffer.from(body));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

test("selecting a project syncs title hints and clears previous preview", async ({ page }) => {
  await loginStudent(page);
  await page.goto("/python?mode=app&app=app-guess-number");
  await expect(page.getByTestId("skui-project-title")).toContainText("لعبة تخمين الرقم");
  await expect(page.getByRole("heading", { name: "المشروعات النهائية المتقدمة" })).toBeVisible();
  await expect(page.getByText("ستظهر المشروعات النهائية هنا عند اعتمادها للنشر.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "نماذج متقدمة قيد التقييم" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "تمارين ومشروعات تدريبية مصغرة" })).toBeVisible();
  await page.getByTestId("start-project-app-calculator").click();
  await expect(page.getByTestId("skui-project-title")).toContainText("آلة حاسبة");
  await page.getByTestId("app-tab-code").click();
  await expect(page.getByTestId("python-code-editor")).toContainText("آلة حاسبة");
  await page.getByTestId("app-tab-preview").click();
  await expect(page.getByText("طريقة الاستخدام")).toBeVisible();
});

test("student runs an isolated skui app and updates state", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page);
  await runCode(page, E2E_WELCOME_APP);

  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("مرحبًا بك")).toBeVisible({ timeout: 20_000 });
  const studentName = frame.getByPlaceholder("اكتب اسمك");
  await studentName.pressSequentially("طالب");
  await expect(studentName).toHaveValue("طالب");
  await frame.getByRole("button", { name: "تشغيل" }).click();
  await expect(frame.getByText("مرحبًا طالب")).toBeVisible();

  const sandbox = await page.locator('[data-testid="skui-preview-frame"]').getAttribute("sandbox");
  expect(sandbox).toBe("allow-scripts");
});

test("student opens the current project as a direct WebApp preview", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page, "app-guess-number");
  await page.getByTestId("app-tab-code").click();
  await expect(page.getByTestId("python-code-editor")).toContainText("scene=");
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();
  const labFrame = page.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(labFrame.getByText("تخمين الرقم السري")).toBeVisible({ timeout: 20_000 });

  await page.getByTestId("app-tab-export").click();
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /فتح WebApp في تبويب جديد/ }).click();
  const previewPage = await popupPromise;
  await expect(previewPage.getByText("معاينة WebApp مباشرة")).toBeVisible();
  const frame = previewPage.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("تخمين الرقم السري")).toBeVisible({ timeout: 20_000 });
  await expect(previewPage.getByText("لا توجد واجهة للعرض")).toHaveCount(0);
  await expect(previewPage.getByText("تعذر بناء واجهة التطبيق")).toHaveCount(0);
});

test("skui autocomplete and unsupported component feedback are educational", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page);

  const editor = page.getByTestId("python-code-editor");
  await editor.fill("import skui as ui\nui.Bu");
  await expect(page.getByTestId("python-autocomplete").getByText("Button")).toBeVisible();

  await editor.fill("import skui as ui\nui.UnknownWidget()");
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();
  await expect(page.getByTestId("skui-run-status")).toContainText("UnknownWidget");
});

test("published e2e fixtures execute in the isolated runtime", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page);
  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  for (const example of E2E_EXAMPLES) {
    await runCode(page, example.code);
    await expect(frame.locator(".sk-App"), `example ${example.id}`).toBeAttached({ timeout: 20_000 });
  }
});

test("calculator keeps working through a multi-step expression", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page, "app-calculator");
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();
  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("احسب بسرعة")).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(7000);
  await frame.getByRole("button", { name: "7", exact: true }).click();
  await frame.getByRole("button", { name: "+", exact: true }).click();
  await expect(frame.getByText("اختر الرقم الثاني")).toBeVisible();
  await page.waitForTimeout(2000);
  await frame.getByRole("button", { name: "8", exact: true }).click();
  await frame.getByRole("button", { name: "=", exact: true }).click();
  await expect(frame.getByPlaceholder("0")).toHaveValue("15.0");
  await expect(page.getByText("TimeLimitError")).toHaveCount(0);
  await expect(page.getByText("حدث خطأ داخل دالة on_click")).toHaveCount(0);
});

test("click handlers still work after the initial run timer budget elapses", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page, "app-guess-number");
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();
  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("تخمين الرقم السري")).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(6500);
  await frame.getByRole("button", { name: "ابدأ الجولة", exact: true }).click();
  await expect(frame.getByText("بدأت الجولة").first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("TimeLimitError")).toHaveCount(0);
  await expect(page.getByText("حدث خطأ داخل دالة on_click")).toHaveCount(0);
});

test("WebApp preview handles button clicks without timing out", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page, "app-calculator");
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();
  const labFrame = page.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(labFrame.getByText("احسب بسرعة")).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(6500);
  await page.getByTestId("app-tab-export").click();
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /فتح WebApp في تبويب جديد/ }).click();
  const previewPage = await popupPromise;
  const frame = previewPage.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("احسب بسرعة")).toBeVisible({ timeout: 20_000 });
  await previewPage.waitForTimeout(6500);
  await frame.getByRole("button", { name: "7", exact: true }).click();
  await expect(frame.getByPlaceholder("0")).toHaveValue("7");
  await expect(previewPage.getByText("TimeLimitError")).toHaveCount(0);
  await expect(previewPage.getByText("حدث خطأ داخل دالة on_click")).toHaveCount(0);
});

test("every registered starter mounts and responds to a primary action", async ({ page }) => {
  test.setTimeout(240_000);
  await loginStudent(page);
  const apps = [
    { id: "app-guess-number", ready: "تخمين الرقم السري", action: "ابدأ الجولة", after: "بدأت الجولة" },
    { id: "app-calculator", ready: "احسب بسرعة", action: "7", after: null },
    { id: "app-registration", ready: "إنشاء حساب", action: "تسجيل", after: "أدخل اسمًا صحيحًا" },
    { id: "app-todo", ready: "مهامي", action: "إضافة", after: "عدد المهام المعروضة: 1" },
    { id: "app-quiz", ready: "اختبار سريع", action: "التالي", after: "إجابة" },
    { id: "app-timer", ready: "مؤقت 30 ثانية", action: "تشغيل", after: "المؤقت يعمل" },
    { id: "app-dashboard", ready: "لوحة بسيطة", action: "تحديث", after: "تم تحديث البيانات" },
    { id: "app-colors", ready: "ألوان RGB", action: null, after: null },
    { id: "app-canvas-demo", ready: "مطاردة النقاط", action: "تحريك", after: "النقاط:" },
    { id: "app-linear-search", ready: "محاكاة البحث الخطي", action: "ابحث", after: "وُجد في الموقع" },
    { id: "app-caesar", ready: "برنامج التشفير", action: "تشفير", after: "Kl" },
    { id: "app-edu-game", ready: "مسابقة الضرب", action: "تحقق", after: "خطأ" },
    { id: "app-number-convert", ready: "تحويل أنظمة العد", action: "تحويل", after: "أدخل عددًا صحيحًا" },
  ];

  for (const app of apps) {
    await page.goto(`/python?mode=app&app=${app.id}`);
    await page.getByTestId("app-tab-code").click();
    await expect(page.getByTestId("python-code-editor"), app.id).toContainText("app.run()");
    await page.getByRole("button", { name: "تشغيل المشروع" }).click();
    const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
    await expect(frame.locator(".sk-App"), app.id).toBeAttached({ timeout: 20_000 });
    await expect(frame.getByText(app.ready).first(), app.id).toBeVisible();
    if (app.action) {
      if (app.id === "app-todo") await frame.getByPlaceholder("مهمة جديدة").fill("واجب");
      if (app.id === "app-edu-game") await frame.getByPlaceholder("إجابتك").fill("0");
      if (app.id === "app-linear-search") await frame.getByPlaceholder("العدد المطلوب").fill("15");
      if (app.id === "app-caesar") await frame.getByPlaceholder("نص إنجليزي").fill("Hi");
      if (app.id === "app-calculator") {
        await frame.getByRole("button", { name: "7", exact: true }).click();
        await expect(frame.getByPlaceholder("0")).toHaveValue("7");
      } else {
        await frame.getByRole("button", { name: app.action, exact: true }).click();
        if (app.after) {
          await expect(frame.getByText(app.after).first(), app.id).toBeVisible({ timeout: 10_000 });
        }
      }
    }
    await expect(page.getByText("حدث خطأ داخل دالة on_click")).toHaveCount(0);
    await expect(page.getByText("حدث خطأ أثناء تشغيل الكود")).toHaveCount(0);
  }
});

test("every declared first-release component renders in the sandbox", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page);

  const code = `import skui as ui
app = ui.App(title="اختبار المكونات")
guide = ui.Guide(title="دليل", message="مرحبا", character="assistant")
page = ui.Page()
container = ui.Container()
row = ui.Row()
column = ui.Column()
grid = ui.Grid()
card = ui.Card()
card.add(ui.Text("نص"))
card.add(ui.Heading(text="عنوان", level=2))
card.add(ui.Button(text="زر", on_click=lambda: None))
card.add(ui.Input(placeholder="إدخال"))
card.add(ui.TextArea(placeholder="نص طويل"))
card.add(ui.Checkbox(text="اختيار"))
card.add(ui.Radio(text="خيار", value="a"))
card.add(ui.Select(options=["أ", "ب"]))
card.add(ui.Slider(value=25))
card.add(ui.Progress(value=50))
card.add(ui.Alert(text="تنبيه"))
card.add(ui.Badge(text="شارة"))
card.add(ui.Image(src="", alt="صورة"))
card.add(ui.List(items=["أ", "ب"]))
card.add(ui.Table(headers=["أ"], items=[["ب"]]))
card.add(ui.Tabs(tabs=["الأول", "الثاني"]))
card.add(ui.Accordion(title="تفاصيل", text="محتوى"))
card.add(ui.Modal(title="نافذة", open=False))
canvas = ui.Canvas(width=200, height=100)
canvas.draw_rect(5, 5, 30, 20, "#7c3aed")
card.add(canvas)
card.add(ui.Chart(data=[2, 4, 3]))
card.add(ui.Timer(value=0, running=False))
card.add(ui.Audio(src="", controls=True))
grid.add(card)
column.add(grid)
row.add(column)
container.add(row)
page.add(container)
app.add(guide)
app.add(page)
app.run()`;
  await runCode(page, code);
  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  const components = [
    "App", "Page", "Container", "Row", "Column", "Grid", "Card", "Text", "Heading", "Button",
    "Input", "TextArea", "Checkbox", "Radio", "Select", "Slider", "Progress", "Alert", "Badge",
    "Image", "List", "Table", "Tabs", "Accordion", "Modal", "Canvas", "Chart", "Timer", "Audio",
  ];
  for (const component of components) {
    await expect(frame.locator(`.sk-${component}`).first()).toBeAttached();
  }
  await expect(frame.locator(".sk-Guide").first()).toBeAttached();
});

test("all declared callbacks cross the worker bridge safely", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page);
  await runCode(
    page,
    `import skui as ui
app = ui.App(title="الأحداث")
seen = []
status = ui.Text("")
def mark(name):
    seen.append(name)
    status.set_text(",".join(seen))
field = ui.Input(
    placeholder="حدث",
    on_focus=lambda: mark("focus"),
    on_input=lambda: mark("input"),
    on_change=lambda: mark("change"),
    on_key_press=lambda: mark("key"),
    on_submit=lambda: mark("submit"),
    on_blur=lambda: mark("blur")
)
choice = ui.Select(options=["أ", "ب"], on_select=lambda: mark("select"))
button = ui.Button(text="حدث النقر", on_click=lambda: mark("click"))
app.add(field)
app.add(choice)
app.add(button)
app.add(status)
app.run()`,
  );
  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  const field = frame.getByPlaceholder("حدث");
  await field.focus();
  await field.fill("قيمة");
  await field.press("Enter");
  await frame.locator("select").selectOption("ب");
  await frame.getByRole("button", { name: "حدث النقر" }).click();
  const status = frame.locator(".sk-Text").last();
  await expect(status).toContainText("focus");
  await expect(status).toContainText("input");
  await expect(status).toContainText("change");
  await expect(status).toContainText("key");
  await expect(status).toContainText("submit");
  await expect(status).toContainText("blur");
  await expect(status).toContainText("select");
  await expect(status).toContainText("click");
});

test("value and Canvas callbacks preserve typed payloads", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page);
  await runCode(
    page,
    `import skui as ui
app = ui.App(title="عقد الأحداث")
slider_status = ui.Text("slider:waiting")
timer_status = ui.Text("timer:waiting")
canvas_status = ui.Text("canvas:waiting")

def slider_changed(value):
    slider_status.set_text("slider:" + str(int(value)))

def timer_changed(count):
    timer_status.set_text("timer:" + str(int(count)))
    timer.set_running(False)

def canvas_clicked(point):
    canvas_status.set_text("canvas:" + str(int(point["x"])))

slider = ui.Slider(value=5, min=0, max=10, on_input=slider_changed)
timer = ui.Timer(value=0, interval=100, running=True, on_change=timer_changed)
canvas = ui.Canvas(width=240, height=120, on_click=canvas_clicked)
canvas.draw_circle(80, 60, 18, "#7c3aed")
app.add(slider)
app.add(slider_status)
app.add(timer)
app.add(timer_status)
app.add(canvas)
app.add(canvas_status)
app.run()`,
  );
  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  const slider = frame.locator('input[type="range"]');
  await slider.fill("8");
  await expect(frame.getByText("slider:8")).toBeVisible();
  await expect(frame.getByText(/timer:\d+/)).toBeVisible({ timeout: 5_000 });
  await frame.locator("canvas").click({ position: { x: 80, y: 60 } });
  await expect(frame.getByText(/canvas:\d+/)).toBeVisible();
  await expect(page.getByText(/TypeError|حدث خطأ داخل دالة/)).toHaveCount(0);
});

test("exported WebApp ZIP runs with local runtime; PWA and Windows stay gated", async ({ page }) => {
  await loginStudent(page);
  await openAppLab(page);
  await runCode(page, E2E_WELCOME_APP);
  await page.getByTestId("app-tab-export").click();

  await expect(page.getByTestId("export-action-pwa")).toBeDisabled();
  await expect(page.getByTestId("export-action-exe")).toBeDisabled();

  const webDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /تنزيل WebApp ZIP/ }).click();
  const webFiles = await readDownload(await webDownloadPromise);
  expect(Object.keys(webFiles).some((name) => name.endsWith("/runtime/skulpt.min.js"))).toBe(true);
  expect(Object.keys(webFiles).some((name) => name.endsWith("/build-info.json"))).toBe(true);

  const hosted = await serveZip(webFiles);
  try {
    await page.goto(hosted.url);
    const exported = page.frameLocator("#preview");
    await expect(exported.getByText("مرحبًا بك")).toBeVisible({ timeout: 20_000 });
    const exportedName = exported.getByPlaceholder("اكتب اسمك");
    await exportedName.pressSequentially("خارجي");
    await expect(exportedName).toHaveValue("خارجي");
    await exported.getByRole("button", { name: "تشغيل" }).click();
    await expect(exported.getByText("مرحبًا خارجي")).toBeVisible();
  } finally {
    await new Promise((resolve) => hosted.server.close(resolve));
  }
});

test("Windows export jobs protect worker and download operations with capability tokens", async ({ request }) => {
  const create = await request.post("/api/exports", {
    data: {
      ownerId: "student-e2e",
      projectId: "project-e2e",
      target: "windows",
      metadata: { name: "E2E" },
      source: "webapp-zip-bytes",
    },
  });
  expect(create.status()).toBe(201);
  const created = await create.json();
  expect(created.ownerToken).toBeTruthy();
  expect(created.buildToken).toBeTruthy();
  expect(created.downloadToken).toBeTruthy();

  const denied = await request.get(`/api/exports/${created.job.id}/source`);
  expect(denied.status()).toBe(401);
  const source = await request.get(`/api/exports/${created.job.id}/source`, {
    headers: { "x-export-build-token": created.buildToken },
  });
  expect(await source.text()).toBe("webapp-zip-bytes");

  const artifact = Buffer.from("signed-installer-placeholder");
  const complete = await request.put(`/api/exports/${created.job.id}/result`, {
    headers: {
      "content-type": "application/octet-stream",
      "x-export-build-token": created.buildToken,
      "x-export-filename": "project-e2e-setup.exe",
      "x-export-content-type": "application/vnd.microsoft.portable-executable",
    },
    data: artifact,
  });
  expect(complete.ok()).toBe(true);
  const completed = await complete.json();
  expect(completed.job.status).toBe("completed");
  expect(completed.job.artifact.sha256).toMatch(/^[0-9a-f]{64}$/);

  const status = await request.get(`/api/exports/${created.job.id}/status`, {
    headers: { "x-export-owner-token": created.ownerToken },
  });
  expect((await status.json()).job.status).toBe("completed");
  const download = await request.get(`/api/exports/${created.job.id}/download?token=${created.downloadToken}`);
  expect(Buffer.from(await download.body()).toString()).toBe(artifact.toString());
});

test("teacher solution API rejects students and serves teachers", async ({ request }) => {
  const denied = await request.get("/api/teacher/skui-projects/app-calculator/solution");
  expect(denied.status()).toBe(403);
  const allowed = await request.get("/api/teacher/skui-projects/app-calculator/solution", {
    headers: { "x-user-role": "teacher" },
  });
  expect(allowed.ok()).toBeTruthy();
  const body = await allowed.json();
  expect(body.code).toContain("import skui as ui");
  expect(body.code).toContain("آلة حاسبة");

  const advanced = await request.get("/api/teacher/skui-projects/advanced-algorithm-lab/solution", {
    headers: { "x-user-role": "teacher" },
  });
  expect(advanced.ok()).toBeTruthy();
  expect((await advanced.json()).code).toContain("def bubble_steps");
});

test("visual algorithm lab completes, reports, and resets a run", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginStudent(page);
  await openAppLab(page, "advanced-algorithm-lab");
  await runCode(page, SKUI_ADVANCED_APPS["advanced-algorithm-lab"]);

  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("مختبر الخوارزميات", { exact: true }).first()).toBeVisible({ timeout: 20_000 });
  await frame.getByRole("button", { name: "تشغيل للنهاية" }).click();
  await expect(frame.getByRole("dialog").getByText(/تقرير: Bubble Sort/)).toBeVisible();
  await frame.getByRole("dialog").getByRole("button", { name: "إغلاق" }).click();
  await frame.getByRole("button", { name: "إعادة التجربة" }).click();
  await expect(frame.getByText("أعيدت التجربة من البداية")).toBeVisible();
});

test("cipher escape completes all generated stages and replays", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await loginStudent(page);
  await openAppLab(page, "advanced-cipher-escape");
  await runCode(page, SKUI_ADVANCED_APPS["advanced-cipher-escape"]);

  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  const answer = frame.getByPlaceholder("اكتب رمز الفتح هنا");
  const mission = frame.locator(".sk-MissionCard p");

  const caesarClue = await mission.textContent();
  const caesarMatch = caesarClue.match(/([A-Z]+).*?(\d+)/);
  expect(caesarMatch).toBeTruthy();
  const shift = Number(caesarMatch[2]);
  const decoded = [...caesarMatch[1]]
    .map((character) => String.fromCharCode(((character.charCodeAt(0) - 65 - shift + 26) % 26) + 65))
    .join("");
  await answer.fill(decoded);
  await frame.getByRole("button", { name: "تحقق من الرمز" }).click();
  await expect(mission).toContainText("حوّل");

  const binaryClue = await mission.textContent();
  const binary = binaryClue.match(/[01]{7,8}/)?.[0];
  expect(binary).toBeTruthy();
  await answer.fill(String.fromCharCode(Number.parseInt(binary, 2)));
  await frame.getByRole("button", { name: "تحقق من الرمز" }).click();
  await expect(mission).toContainText("أكمل النمط");

  const patternClue = await mission.textContent();
  const values = patternClue.match(/\d+/g)?.map(Number) ?? [];
  expect(values.length).toBeGreaterThanOrEqual(4);
  await answer.fill(String(values.at(-1) + 2));
  await frame.getByRole("button", { name: "تحقق من الرمز" }).click();

  await expect(frame.getByRole("dialog").getByText(/الهروب رقم 1/)).toBeVisible();
  await frame.getByRole("dialog").getByRole("button", { name: "إغلاق" }).click();
  await frame.getByRole("button", { name: "غرفة جديدة" }).click();
  await expect(frame.getByText("تغيّرت رموز الغرفة؛ بدأت جولة جديدة")).toBeVisible();
});

test("smart city operations completes three decisions and starts a new shift", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginStudent(page);
  await openAppLab(page, "advanced-smart-city-ops");
  await runCode(page, SKUI_ADVANCED_APPS["advanced-smart-city-ops"]);

  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("مركز عمليات المدينة", { exact: true }).first()).toBeVisible({ timeout: 20_000 });
  await frame.locator(".sk-Scene > button").first().click();
  await expect(frame.getByText("الجولة 2 / 3")).toBeVisible();
  await frame.locator(".sk-Scene > button").nth(1).click();
  await expect(frame.getByText("الجولة 3 / 3")).toBeVisible();
  await frame.locator(".sk-Scene > button").nth(1).click();
  await expect(frame.getByRole("dialog").getByText(/مؤشر المدينة/)).toBeVisible();
  await frame.getByRole("dialog").getByRole("button", { name: "إغلاق" }).click();
  await frame.getByRole("button", { name: "وردية جديدة" }).click();
  await expect(frame.getByText("بدأت وردية جديدة بحوادث مختلفة")).toBeVisible();
});
