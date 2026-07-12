export const SKUI_VERSION = "1.0.0";
export const SKULPT_BUILD = Object.freeze({
  gitHash: "e3c1c1a4e081362d96ba8afc5997be516b437f30",
  date: "2021-03-25T11:36:32.075Z",
});

export const SKUI_LIMITS = Object.freeze({
  maxElements: 500,
  maxHandlers: 1000,
  maxCanvasOperations: 5000,
  maxTimers: 20,
  runTimeoutMs: 10000,
  eventTimeoutMs: 5000,
  maxTextLength: 20000,
});

export const SKUI_EVENTS = Object.freeze([
  "on_click",
  "on_change",
  "on_input",
  "on_submit",
  "on_select",
  "on_key_press",
  "on_focus",
  "on_blur",
]);

export const SKUI_COMPONENTS = Object.freeze([
  "App",
  "Page",
  "Container",
  "Row",
  "Column",
  "Grid",
  "Card",
  "Text",
  "Heading",
  "Button",
  "Input",
  "TextArea",
  "Checkbox",
  "Radio",
  "Select",
  "Slider",
  "Progress",
  "Alert",
  "Badge",
  "Image",
  "List",
  "Table",
  "Tabs",
  "Accordion",
  "Modal",
  "Canvas",
  "Chart",
  "Timer",
  "Audio",
]);

export const SKUI_STYLE_PROPS = Object.freeze([
  "width",
  "height",
  "padding",
  "margin",
  "align",
  "justify",
  "gap",
  "background",
  "text_color",
  "border_radius",
  "variant",
  "size",
  "columns",
]);

export const SKUI_COMPONENT_API = Object.freeze(
  Object.fromEntries(
    SKUI_COMPONENTS.map((name) => [
      name,
      {
        name,
        events: SKUI_EVENTS,
        methods: ["add", "dispose", "value", "set_value", "set_text", "set_disabled"],
      },
    ]),
  ),
);

export function getSkuiAutocompleteSuggestions(prefix = "") {
  const normalized = String(prefix).toLowerCase();
  return SKUI_COMPONENTS.filter((name) => name.toLowerCase().startsWith(normalized)).map((name) => ({
    label: name,
    insertText: name,
    kind: "skui-component",
    detail: `skui.${name}`,
  }));
}

export function getSkuiConstructorProps(component) {
  const common = [...SKUI_STYLE_PROPS, "disabled"];
  const map = {
    App: ["title", "width", "height", "theme", "direction"],
    Button: ["text", "variant", "size", "on_click", "disabled"],
    Input: ["placeholder", "value", "on_input", "on_change", "on_key_press", "disabled"],
    TextArea: ["placeholder", "value", "rows", "on_input", "on_change"],
    Heading: ["text", "level"],
    Select: ["options", "value", "on_select", "on_change"],
    Grid: ["columns", "gap"],
    Modal: ["title", "open"],
    Canvas: ["width", "height"],
    Timer: ["interval", "running", "on_change"],
  };
  return [...new Set([...(map[component] || []), ...common, ...SKUI_EVENTS])];
}

export function validateSkuiProject(code) {
  const source = String(code || "");
  const issues = [];
  if (!/\b(import\s+skui|from\s+skui\s+import)\b/.test(source)) {
    issues.push({ code: "missing-skui", message: "أضف import skui as ui إلى المشروع." });
  }
  const blocked = [
    [/\b(import|from)\s+(os|sys|subprocess|socket|requests|http)\b/i, "unsupported-import"],
    [/\b(eval|exec|compile|__import__)\s*\(/, "unsafe-execution"],
    [/\b(open)\s*\(/, "filesystem-access"],
    [/\b(document|window|localStorage|sessionStorage)\b/, "browser-access"],
  ];
  for (const [pattern, codeName] of blocked) {
    if (pattern.test(source)) {
      issues.push({ code: codeName, message: "المشروع يحتوي أمرًا غير مسموح في بيئة skui الآمنة." });
    }
  }
  const used = [...source.matchAll(/\bui\.([A-Z][A-Za-z0-9_]*)\s*\(/g)].map((match) => match[1]);
  for (const component of used) {
    if (!SKUI_COMPONENTS.includes(component)) {
      issues.push({
        code: "unsupported-component",
        component,
        message: `المكوّن ${component} غير مدعوم في مكتبة skui. راجع قائمة المكونات المدعومة.`,
      });
    }
  }
  return { ok: issues.length === 0, issues, components: [...new Set(used)] };
}
