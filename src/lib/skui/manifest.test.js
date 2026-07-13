import { describe, expect, it } from "vitest";
import {
  SKUI_COMPONENTS,
  SKUI_COMPONENT_API,
  SKUI_EVENTS,
  getSkuiAutocompleteSuggestions,
  getSkuiConstructorProps,
  validateSkuiProject,
} from "./manifest.js";
import { SKUI_BRIDGE_MODULE, SKUI_PYTHON_MODULE } from "./moduleSources.js";
import { buildSkuiWorkerSource } from "./workerSource.js";

describe("skui API manifest", () => {
  it("declares every first-release component without duplicates", () => {
    const expected = [
      "App", "Page", "Container", "Row", "Column", "Grid", "Card", "Text", "Heading", "Button",
      "Input", "TextArea", "Checkbox", "Radio", "Select", "Slider", "Progress", "Alert", "Badge",
      "Image", "List", "Table", "Tabs", "Accordion", "Modal", "Canvas",
    ];
    expect(SKUI_COMPONENTS).toEqual(expect.arrayContaining(expected));
    expect(new Set(SKUI_COMPONENTS).size).toBe(SKUI_COMPONENTS.length);
  });

  it("declares the advanced-project component set", () => {
    const advanced = [
      "Scene", "HeroSection", "GameBoard", "MetricCard", "StatusPanel", "Timeline",
      "MissionCard", "MapPanel", "AnimatedCounter", "ProgressRing", "LevelBadge",
      "Dialog", "Drawer", "Toast", "Tooltip", "StepIndicator", "DataGrid",
      "CharacterGuide",
    ];
    expect(SKUI_COMPONENTS).toEqual(expect.arrayContaining(advanced));
    expect(getSkuiConstructorProps("DataGrid")).toEqual(expect.arrayContaining(["columns", "data"]));
    expect(getSkuiConstructorProps("MissionCard")).toEqual(
      expect.arrayContaining(["title", "description", "status", "progress"]),
    );
  });

  it("declares the complete event API", () => {
    expect(SKUI_EVENTS).toEqual([
      "on_click", "on_change", "on_input", "on_submit", "on_select", "on_key_press", "on_focus", "on_blur",
    ]);
  });

  it("offers component and constructor autocomplete", () => {
    expect(getSkuiAutocompleteSuggestions("Bu").map((item) => item.label)).toEqual(["Button"]);
    expect(getSkuiConstructorProps("Button")).toEqual(expect.arrayContaining(["text", "variant", "on_click", "disabled"]));
    expect(getSkuiConstructorProps("Grid")).toEqual(expect.arrayContaining(["columns", "gap"]));
    expect(SKUI_COMPONENT_API.Canvas.methods).toEqual(
      expect.arrayContaining([
        "set_visible", "set_variant", "set_items", "set_data", "draw_line", "draw_circle",
      ]),
    );
  });

  it("exposes typed callback adapters and the expanded Canvas API", () => {
    const worker = buildSkuiWorkerSource();
    expect(SKUI_PYTHON_MODULE).toContain("_bridge.bind(self._id, event, handler)");
    expect(SKUI_BRIDGE_MODULE).toContain("function acceptsEventPayload(handler)");
    expect(SKUI_BRIDGE_MODULE).toContain("target.$memoiseFlags()");
    expect(SKUI_PYTHON_MODULE).toContain("def draw_line(");
    expect(SKUI_PYTHON_MODULE).toContain("def draw_circle(");
    expect(worker).toContain("Sk.ffi.remapToPy(payload");
    expect(worker).toContain('node.type === "Canvas"');
    expect(worker).not.toContain("func_code.co_argcount");
    expect(worker).not.toContain("catch (arityErr)");
  });

  it("accepts a supported project", () => {
    const result = validateSkuiProject(`
import skui as ui
app = ui.App(title="مرحبا")
app.add(ui.Button(text="تشغيل", on_click=lambda: None))
app.run()
`);
    expect(result.ok).toBe(true);
    expect(result.components).toEqual(["App", "Button"]);
  });

  it("rejects unsupported widgets and browser escape attempts", () => {
    const result = validateSkuiProject("import skui as ui\nx = ui.UnknownWidget()\nwindow.location = 'x'");
    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(["unsupported-component", "browser-access"]),
    );
    expect(result.issues.find((issue) => issue.component === "UnknownWidget")?.message).toContain("غير مدعوم");
  });
});
