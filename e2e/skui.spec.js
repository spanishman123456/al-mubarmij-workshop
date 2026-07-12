import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import http from "node:http";
import { Buffer } from "node:buffer";
import { unzipSync } from "fflate";
import { E2E_CALCULATOR_APP, E2E_EXAMPLES, E2E_WELCOME_APP } from "./fixtures/skuiApps.js";

async function loginStudent(page) {
  await page.goto("/login");
  await page.getByLabel("رقم الهوية الوطنية").fill("1165814631");
  await page.getByRole("button", { name: "دخول", exact: true }).click();
  await expect(page).toHaveURL(/\/student/);
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
  await openAppLab(page);
  await runCode(page, E2E_WELCOME_APP);
  await page.getByTestId("app-tab-export").click();

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /فتح WebApp في تبويب جديد/ }).click();
  const previewPage = await popupPromise;
  await expect(previewPage.getByText("معاينة WebApp مباشرة")).toBeVisible();
  const frame = previewPage.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("مرحبًا بك")).toBeVisible({ timeout: 20_000 });
  const name = frame.getByPlaceholder("اكتب اسمك");
  await name.pressSequentially("مباشر");
  await frame.getByRole("button", { name: "تشغيل" }).click();
  await expect(frame.getByText("مرحبًا مباشر")).toBeVisible();
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

test("professional calculator keypad accepts input and computes a result", async ({ page }) => {
  await loginStudent(page);
  await page.goto("/python?mode=app");
  await page.getByTestId("start-project-app-calculator").click();
  await expect(page.getByTestId("skui-project-title")).toContainText("آلة حاسبة");
  await runCode(page, E2E_CALCULATOR_APP);
  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("احسب بسرعة")).toBeVisible({ timeout: 20_000 });
  await frame.getByRole("button", { name: "7", exact: true }).click();
  await frame.getByRole("button", { name: "+", exact: true }).click();
  await frame.getByRole("button", { name: "5", exact: true }).click();
  await frame.getByRole("button", { name: "=", exact: true }).click();
  await expect(frame.getByPlaceholder("0")).toHaveValue(/^12(?:\.0)?$/);
  await expect(frame.getByText("تم الحساب بنجاح")).toBeVisible();
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
});
