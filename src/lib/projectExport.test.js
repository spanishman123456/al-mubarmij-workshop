import { describe, expect, it } from "vitest";
import {
  analyzeExportCapabilities,
  sha256Hex,
  stripSensitiveData,
  validateExportProject,
} from "./projectExport.js";
import { buildPwaManifest, buildServiceWorker, buildWebAppHtml } from "./webAppBundle.js";

const CODE = `import skui as ui
app = ui.App(title="اختبار")
app.add(ui.Text("مرحبًا"))
app.run()`;

describe("project export", () => {
  it("validates a skui project for all web targets", () => {
    const result = validateExportProject(CODE, { title: "تطبيق" });
    expect(result.ok).toBe(true);
    expect(result.readiness).toMatchObject({ source: true, webapp: true, pwa: true, windows: true });
  });

  it("rejects unsupported imports", () => {
    expect(validateExportProject(`${CODE}\nimport os`, { title: "x" }).ok).toBe(false);
  });

  it("strips national IDs, tokens and passwords", () => {
    const clean = stripSensitiveData("id=1234567890 token='abc' password=\"secret\"");
    expect(clean).not.toContain("1234567890");
    expect(clean).not.toContain("secret");
    expect(clean).toContain("[REMOVED]");
  });

  it("generates deterministic SHA-256", async () => {
    expect(await sha256Hex("skui")).toMatch(/^[0-9a-f]{64}$/);
    expect(await sha256Hex("skui")).toBe(await sha256Hex("skui"));
  });

  it("builds an installable manifest and versioned offline worker", () => {
    const manifest = JSON.parse(buildPwaManifest({ title: "تطبيق", direction: "rtl" }));
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons).toHaveLength(2);
    expect(manifest.dir).toBe("rtl");
    const worker = buildServiceWorker({ cacheVersion: "2.0.0" });
    expect(worker).toContain("skui-2.0.0");
    expect(worker).toContain("caches.keys()");
    expect(worker).toContain("skulpt.min.js");
  });

  it("uses only relative local runtime paths", () => {
    const html = buildWebAppHtml({ title: "تطبيق", pwa: true });
    expect(html).toContain("./app.js");
    expect(html).toContain('sandbox="allow-scripts"');
    expect(html).not.toMatch(/cdn\.|jsdelivr|https?:\/\//);
  });

  it("does not advertise Windows when validation fails", () => {
    const caps = analyzeExportCapabilities("print('x')", "console", { title: "x" });
    expect(caps.exe.ok).toBe(false);
    expect(caps.pwa.ok).toBe(false);
  });
});
