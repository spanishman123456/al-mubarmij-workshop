import { SKUI_COMPONENTS, SKUI_EVENTS, SKUI_LIMITS, SKUI_VERSION } from "./manifest.js";

const COMPONENTS_JSON = JSON.stringify(SKUI_COMPONENTS);
const EVENTS_JSON = JSON.stringify(SKUI_EVENTS);
const LIMITS_JSON = JSON.stringify(SKUI_LIMITS);

export const SKUI_PYTHON_MODULE = `
"""skui ${SKUI_VERSION} — واجهات تعليمية أصلية لمتصفح Skulpt."""
import _skui_bridge as _bridge

_EVENTS = ${JSON.stringify(SKUI_EVENTS)}

class Widget:
    def __init__(self, kind, children=None, props=None):
        props = dict(props or {})
        handlers = {}
        for event in _EVENTS:
            if event in props:
                handlers[event] = props.pop(event)
        self._id = _bridge.create(kind, props)
        for event, handler in handlers.items():
            if not callable(handler):
                raise TypeError(event + " يجب أن يكون دالة")
            _bridge.bind(self._id, event, handler)
        for child in children or []:
            self.add(child)

    def add(self, child):
        if not hasattr(child, "_id"):
            raise TypeError("يمكن إضافة مكوّن skui فقط")
        _bridge.add(self._id, child._id)
        return self

    def dispose(self):
        _bridge.dispose(self._id)

    def value(self):
        return _bridge.get_value(self._id)

    def set_value(self, value):
        _bridge.set_prop(self._id, "value", value)
        return self

    def set_text(self, text):
        _bridge.set_prop(self._id, "text", text)
        return self

    def set_disabled(self, disabled=True):
        _bridge.set_prop(self._id, "disabled", bool(disabled))
        return self

    def set_open(self, opened=True):
        _bridge.set_prop(self._id, "open", bool(opened))
        return self

    def set_progress(self, value):
        return self.set_value(value)

    def set_items(self, items):
        _bridge.set_prop(self._id, "items", list(items))
        return self

    def set_data(self, data):
        _bridge.set_prop(self._id, "data", list(data))
        return self


class App(Widget):
    def __init__(self, title="", width=520, height=380, theme="auto", direction="auto", **props):
        props.update({"title": title, "width": width, "height": height, "theme": theme, "direction": direction})
        Widget.__init__(self, "App", [], props)

    def run(self):
        _bridge.run(self._id)
        return self


class Text(Widget):
    def __init__(self, text="", **props):
        props["text"] = text
        Widget.__init__(self, "Text", [], props)


class Heading(Widget):
    def __init__(self, text=None, level=1, **props):
        if text is None:
            raise ValueError("يتطلب Heading الخاصية text.")
        props.update({"text": text, "level": level})
        Widget.__init__(self, "Heading", [], props)


class Button(Widget):
    def __init__(self, text=None, **props):
        if text is None:
            raise ValueError("يتطلب Button الخاصية text.")
        props["text"] = text
        Widget.__init__(self, "Button", [], props)


class Input(Widget):
    def __init__(self, placeholder="", value="", **props):
        props.update({"placeholder": placeholder, "value": value})
        Widget.__init__(self, "Input", [], props)


class TextArea(Widget):
    def __init__(self, placeholder="", value="", rows=4, **props):
        props.update({"placeholder": placeholder, "value": value, "rows": rows})
        Widget.__init__(self, "TextArea", [], props)


class Checkbox(Widget):
    def __init__(self, text="", checked=False, **props):
        props.update({"text": text, "value": bool(checked)})
        Widget.__init__(self, "Checkbox", [], props)


class Radio(Widget):
    def __init__(self, text="", value="", group="default", checked=False, **props):
        props.update({"text": text, "value": value, "group": group, "checked": bool(checked)})
        Widget.__init__(self, "Radio", [], props)


class Select(Widget):
    def __init__(self, options=None, value="", **props):
        props.update({"options": list(options or []), "value": value})
        Widget.__init__(self, "Select", [], props)


class Slider(Widget):
    def __init__(self, value=0, min=0, max=100, step=1, **props):
        props.update({"value": value, "min": min, "max": max, "step": step})
        Widget.__init__(self, "Slider", [], props)


class Progress(Widget):
    def __init__(self, value=0, max=100, **props):
        props.update({"value": value, "max": max})
        Widget.__init__(self, "Progress", [], props)


class Image(Widget):
    def __init__(self, src="", alt="", **props):
        props.update({"src": src, "alt": alt})
        Widget.__init__(self, "Image", [], props)


class Canvas(Widget):
    def __init__(self, width=480, height=280, **props):
        props.update({"width": width, "height": height, "operations": []})
        Widget.__init__(self, "Canvas", [], props)

    def draw_rect(self, x, y, width, height, color="#7c3aed"):
        _bridge.canvas(self._id, "rect", {"x": x, "y": y, "width": width, "height": height, "color": color})
        return self

    def draw_text(self, text, x, y, color="#111827", size=16):
        _bridge.canvas(self._id, "text", {"text": text, "x": x, "y": y, "color": color, "size": size})
        return self

    def clear(self):
        _bridge.canvas(self._id, "clear", {})
        return self


def _simple(name):
    class SimpleWidget(Widget):
        def __init__(self, *children, **props):
            Widget.__init__(self, name, list(children), props)
    return SimpleWidget

Page = _simple("Page")
Container = _simple("Container")
Row = _simple("Row")
Column = _simple("Column")
Grid = _simple("Grid")
Card = _simple("Card")
Alert = _simple("Alert")
Badge = _simple("Badge")
List = _simple("List")
Table = _simple("Table")
Tabs = _simple("Tabs")
Accordion = _simple("Accordion")
Modal = _simple("Modal")
Chart = _simple("Chart")
Timer = _simple("Timer")
Audio = _simple("Audio")
`;

export const APPKIT_COMPAT_MODULE = `
"""Legacy appkit compatibility. New projects should import skui."""
import skui

_app = skui.App()
_nodes = {}

def title(value):
    _app.set_text(value)

def text(content):
    _app.add(skui.Text(str(content)))

def input(id, label="", default="", placeholder=""):
    node = skui.Input(placeholder=placeholder, value=default)
    _nodes[id] = node
    if label:
        _app.add(skui.Text(label))
    _app.add(node)

def number_input(id, label="", default=0, placeholder=""):
    input(id, label, default, placeholder)

def output(id, label=""):
    node = skui.Alert(text="", variant="info")
    _nodes[id] = node
    if label:
        _app.add(skui.Text(label))
    _app.add(node)

def button(id, label):
    node = skui.Button(text=label)
    _nodes[id] = node
    _app.add(node)

def get(id):
    return _nodes[id].value()

def set(id, value):
    _nodes[id].set_text(value)
    _nodes[id].set_value(value)

def on_click(id, handler):
    _bridge_id = _nodes[id]._id
    skui._bridge.bind(_bridge_id, "on_click", handler)

def canvas(id, width=300, height=180):
    node = skui.Canvas(width=width, height=height)
    _nodes[id] = node
    _app.add(node)

def draw_rect(id, x, y, width, height, color="#7c3aed"):
    _nodes[id].draw_rect(x, y, width, height, color)

def draw_text(id, x, y, content, color="#111827"):
    _nodes[id].draw_text(content, x, y, color)

def clear_canvas(id):
    _nodes[id].clear()

def build():
    _app.run()
`;

export const SKUI_BRIDGE_MODULE = `var $builtinmodule = function(name) {
  "use strict";
  var COMPONENTS = ${COMPONENTS_JSON};
  var EVENTS = ${EVENTS_JSON};
  var LIMITS = ${LIMITS_JSON};
  var allowedStyle = ["width","height","padding","margin","align","justify","gap","background","text_color","border_radius","variant","size"];
  var state = self.__skuiState;
  var mod = {};
  function none() { return Sk.builtin.none.none$; }
  function js(value) { return value === undefined || value === Sk.builtin.none.none$ ? null : Sk.ffi.remapToJs(value); }
  function str(value) { var out = js(value); return out == null ? "" : String(out); }
  function fail(message) { throw new Sk.builtin.ValueError(message); }
  function finite(value, fallback) { var n = Number(value); return Number.isFinite(n) ? n : fallback; }
  function safeColor(value) {
    var v = String(value || "");
    return /^#[0-9a-f]{3,8}$/i.test(v) || /^(transparent|currentColor|white|black)$/i.test(v) ? v : "";
  }
  function safeSize(value) {
    if (typeof value === "number") return Math.max(0, Math.min(2000, value)) + "px";
    var v = String(value || "");
    return /^\\d+(\\.\\d+)?(px|%|rem|em|vh|vw)$/.test(v) ? v : "";
  }
  function sanitize(kind, raw) {
    var props = {};
    raw = raw && typeof raw === "object" ? raw : {};
    Object.keys(raw).slice(0, 80).forEach(function(key) {
      var value = raw[key];
      if (key === "src") {
        var src = String(value || "");
        props.src = /^(data:image\\/(png|jpeg|gif|webp);base64,|\\.\\/|assets\\/)/i.test(src) ? src : "";
      } else if (key === "background" || key === "text_color") {
        props[key] = safeColor(value);
      } else if (["width","height","padding","margin","gap","border_radius"].includes(key)) {
        props[key] = safeSize(value);
      } else if (allowedStyle.includes(key) || ["title","text","placeholder","value","disabled","theme","direction","level","rows","checked","group","options","min","max","step","alt","open","operations","headers","items","tabs","panels","interval","running","data","labels","autoplay","controls"].includes(key)) {
        if (typeof value === "string") props[key] = value.slice(0, LIMITS.maxTextLength);
        else if (Array.isArray(value)) props[key] = value.slice(0, 500);
        else if (value == null || ["number","boolean"].includes(typeof value)) props[key] = value;
      }
    });
    return props;
  }
  function snapshot() {
    var nodes = {};
    Object.keys(state.nodes).forEach(function(id) {
      var node = state.nodes[id];
      nodes[id] = { id: id, type: node.type, props: Object.assign({}, node.props), children: node.children.slice() };
    });
    return { version: "${SKUI_VERSION}", appId: state.appId, roots: state.roots.slice(), nodes: nodes };
  }
  function emit() { self.postMessage({ type: "snapshot", ui: snapshot() }); }
  mod.create = new Sk.builtin.func(function(kindValue, propsValue) {
    var kind = str(kindValue);
    if (!COMPONENTS.includes(kind)) fail("المكوّن " + kind + " غير مدعوم في مكتبة skui.");
    if (Object.keys(state.nodes).length >= LIMITS.maxElements) fail("تم بلوغ الحد الأقصى لعدد عناصر الواجهة.");
    var id = "skui-" + (++state.nextId);
    var props = sanitize(kind, js(propsValue));
    state.nodes[id] = { id: id, type: kind, props: props, children: [] };
    state.roots.push(id);
    if (kind === "App") state.appId = id;
    emit();
    return new Sk.builtin.str(id);
  });
  mod.add = new Sk.builtin.func(function(parentValue, childValue) {
    var parentId = str(parentValue), childId = str(childValue);
    var parent = state.nodes[parentId], child = state.nodes[childId];
    if (!parent || !child) fail("تعذر ربط مكوّن غير موجود.");
    if (!parent.children.includes(childId)) parent.children.push(childId);
    state.roots = state.roots.filter(function(id) { return id !== childId; });
    emit();
    return none();
  });
  mod.bind = new Sk.builtin.func(function(idValue, eventValue, handler) {
    var id = str(idValue), event = str(eventValue);
    if (!state.nodes[id]) fail("المكوّن غير موجود.");
    if (!EVENTS.includes(event)) fail("الحدث " + event + " غير مدعوم.");
    if (Object.keys(state.handlers).length >= LIMITS.maxHandlers) fail("تم بلوغ الحد الأقصى للأحداث.");
    state.handlers[id + ":" + event] = handler;
    return none();
  });
  mod.set_prop = new Sk.builtin.func(function(idValue, keyValue, value) {
    var id = str(idValue), key = str(keyValue), node = state.nodes[id];
    if (!node) fail("المكوّن غير موجود.");
    var patch = {}; patch[key] = js(value);
    var clean = sanitize(node.type, patch);
    if (Object.prototype.hasOwnProperty.call(clean, key)) node.props[key] = clean[key];
    emit();
    return none();
  });
  mod.get_value = new Sk.builtin.func(function(idValue) {
    var node = state.nodes[str(idValue)];
    var value = node ? node.props.value : "";
    return Sk.ffi.remapToPy(value == null ? "" : value);
  });
  mod.dispose = new Sk.builtin.func(function(idValue) {
    var id = str(idValue);
    delete state.nodes[id];
    state.roots = state.roots.filter(function(value) { return value !== id; });
    Object.keys(state.nodes).forEach(function(nodeId) {
      state.nodes[nodeId].children = state.nodes[nodeId].children.filter(function(value) { return value !== id; });
    });
    Object.keys(state.handlers).forEach(function(key) { if (key.indexOf(id + ":") === 0) delete state.handlers[key]; });
    emit();
    return none();
  });
  mod.canvas = new Sk.builtin.func(function(idValue, opValue, payloadValue) {
    var node = state.nodes[str(idValue)], op = str(opValue), payload = js(payloadValue) || {};
    if (!node || node.type !== "Canvas") fail("العملية تتطلب مكوّن Canvas.");
    if (op === "clear") node.props.operations = [];
    else {
      var operations = Array.isArray(node.props.operations) ? node.props.operations : [];
      if (operations.length >= LIMITS.maxCanvasOperations) fail("تم بلوغ الحد الأقصى لعمليات Canvas.");
      var clean = { op: op };
      ["x","y","width","height","size"].forEach(function(k) { if (payload[k] != null) clean[k] = finite(payload[k], 0); });
      if (payload.text != null) clean.text = String(payload.text).slice(0, 2000);
      if (payload.color != null) clean.color = safeColor(payload.color) || "#111827";
      operations.push(clean); node.props.operations = operations;
    }
    emit();
    return none();
  });
  mod.run = new Sk.builtin.func(function(idValue) {
    state.appId = str(idValue);
    emit();
    return none();
  });
  return mod;
};`;

export function createSkuiModuleFiles() {
  return {
    "src/lib/skui.py": SKUI_PYTHON_MODULE,
    "src/lib/_skui_bridge.js": SKUI_BRIDGE_MODULE,
    "src/lib/appkit.py": APPKIT_COMPAT_MODULE,
  };
}
