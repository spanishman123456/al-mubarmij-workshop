import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import http from "node:http";
import { Buffer } from "node:buffer";
import { unzipSync } from "fflate";

async function unlockFreeRun(page) {
  const check = page.getByRole("button", { name: /تحقق من الحل/ });
  await check.click();
  await check.click();
  await check.click();
  await page.getByRole("button", { name: "عرض الحل الكامل" }).click();
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

test("student runs an isolated skui app and updates state", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("رقم الهوية الوطنية").fill("1165814631");
  await page.getByRole("button", { name: "دخول", exact: true }).click();
  await expect(page).toHaveURL(/\/student/);

  await page.goto("/python?mode=app&app=app-number-convert");
  await expect(page.getByRole("heading", { name: "مختبر بايثون" })).toBeVisible();
  await unlockFreeRun(page);
  await page.getByRole("button", { name: "إدراج مثال جاهز" }).click();
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();

  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  await expect(frame.getByText("مرحبًا بك")).toBeVisible({ timeout: 20_000 });
  await frame.getByPlaceholder("اكتب اسمك").fill("طالب");
  await frame.getByRole("button", { name: "تشغيل" }).click();
  await expect(frame.getByText("مرحبًا طالب")).toBeVisible();

  const sandbox = await page.locator('[data-testid="skui-preview-frame"]').getAttribute("sandbox");
  expect(sandbox).toBe("allow-scripts");
});

test("skui autocomplete and unsupported component feedback are educational", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("رقم الهوية الوطنية").fill("1165814631");
  await page.getByRole("button", { name: "دخول", exact: true }).click();
  await page.goto("/python?mode=app&app=app-number-convert");
  await unlockFreeRun(page);

  const editor = page.getByTestId("python-code-editor");
  await editor.fill("import skui as ui\nui.Bu");
  await expect(page.getByTestId("python-autocomplete").getByText("Button")).toBeVisible();

  await editor.fill("import skui as ui\nui.UnknownWidget()");
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();
  await expect(page.getByRole("paragraph").filter({ hasText: "المكوّن UnknownWidget غير مدعوم" })).toBeVisible();
});

test("every declared first-release component renders in the sandbox", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("رقم الهوية الوطنية").fill("1165814631");
  await page.getByRole("button", { name: "دخول", exact: true }).click();
  await page.goto("/python?mode=app&app=app-number-convert");
  await unlockFreeRun(page);

  const code = `import skui as ui
app = ui.App(title="اختبار المكونات")
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
app.add(page)
app.run()`;
  await page.getByTestId("python-code-editor").fill(code);
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();
  const frame = page.frameLocator('[data-testid="skui-preview-frame"]');
  const components = [
    "App", "Page", "Container", "Row", "Column", "Grid", "Card", "Text", "Heading", "Button",
    "Input", "TextArea", "Checkbox", "Radio", "Select", "Slider", "Progress", "Alert", "Badge",
    "Image", "List", "Table", "Tabs", "Accordion", "Modal", "Canvas", "Chart", "Timer", "Audio",
  ];
  for (const component of components) {
    await expect(frame.locator(`.sk-${component}`).first()).toBeAttached();
  }
});

test("all declared callbacks cross the worker bridge safely", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("رقم الهوية الوطنية").fill("1165814631");
  await page.getByRole("button", { name: "دخول", exact: true }).click();
  await page.goto("/python?mode=app&app=app-number-convert");
  await unlockFreeRun(page);
  await page.getByTestId("python-code-editor").fill(`import skui as ui
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
app.run()`);
  await page.getByRole("button", { name: "تشغيل المشروع" }).click();
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

test("exported WebApp and PWA bundles run with local runtime and offline cache", async ({ page, context }) => {
  await page.goto("/login");
  await page.getByLabel("رقم الهوية الوطنية").fill("1165814631");
  await page.getByRole("button", { name: "دخول", exact: true }).click();
  await page.goto("/python?mode=app&app=app-number-convert");
  await unlockFreeRun(page);
  await page.getByRole("button", { name: "إدراج مثال جاهز" }).click();

  const webDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /تصدير WebApp ZIP/ }).click();
  const webFiles = await readDownload(await webDownloadPromise);
  expect(Object.keys(webFiles).some((name) => name.endsWith("/runtime/skulpt.min.js"))).toBe(true);
  expect(Object.keys(webFiles).some((name) => name.endsWith("/build-info.json"))).toBe(true);

  const pwaDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /تصدير PWA/ }).click();
  const pwaFiles = await readDownload(await pwaDownloadPromise);
  const manifestName = Object.keys(pwaFiles).find((name) => name.endsWith("/manifest.webmanifest"));
  const manifest = JSON.parse(Buffer.from(pwaFiles[manifestName]).toString("utf8"));
  expect(manifest.display).toBe("standalone");
  expect(Object.keys(pwaFiles).some((name) => name.endsWith("/service-worker.js"))).toBe(true);

  const hosted = await serveZip(pwaFiles);
  try {
    await page.goto(hosted.url);
    const exported = page.frameLocator("#preview");
    await expect(exported.getByText("مرحبًا بك")).toBeVisible({ timeout: 20_000 });
    await exported.getByPlaceholder("اكتب اسمك").fill("خارجي");
    await exported.getByRole("button", { name: "تشغيل" }).click();
    await expect(exported.getByText("مرحبًا خارجي")).toBeVisible();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole("heading", { name: /مثالي الأول|أداة تحويل/ })).toBeVisible();
  } finally {
    await context.setOffline(false);
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
