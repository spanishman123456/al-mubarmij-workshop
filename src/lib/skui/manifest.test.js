import { describe, expect, it } from "vitest";
import {
  SKUI_COMPONENTS,
  SKUI_EVENTS,
  getSkuiAutocompleteSuggestions,
  getSkuiConstructorProps,
  validateSkuiProject,
} from "./manifest.js";

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

  it("declares the complete event API", () => {
    expect(SKUI_EVENTS).toEqual([
      "on_click", "on_change", "on_input", "on_submit", "on_select", "on_key_press", "on_focus", "on_blur",
    ]);
  });

  it("offers component and constructor autocomplete", () => {
    expect(getSkuiAutocompleteSuggestions("Bu").map((item) => item.label)).toEqual(["Button"]);
    expect(getSkuiConstructorProps("Button")).toEqual(expect.arrayContaining(["text", "variant", "on_click", "disabled"]));
    expect(getSkuiConstructorProps("Grid")).toEqual(expect.arrayContaining(["columns", "gap"]));
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
