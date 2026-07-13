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
        raw = _bridge.get_value(self._id)
        if raw is None:
            return ""
        return raw

    def set_value(self, value):
        _bridge.set_prop(self._id, "value", value)
        return self

    def set_text(self, text):
        _bridge.set_prop(self._id, "text", text)
        return self

    def set_disabled(self, disabled=True):
        _bridge.set_prop(self._id, "disabled", bool(disabled))
        return self

    def set_visible(self, visible=True):
        _bridge.set_prop(self._id, "visible", bool(visible))
        return self

    def set_variant(self, variant):
        _bridge.set_prop(self._id, "variant", variant)
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

    def set_background(self, color):
        _bridge.set_prop(self._id, "background", color)
        return self


class App(Widget):
    def __init__(self, title="", width=520, height=380, theme="auto", appearance="dark", direction="auto", scene="", **props):
        resolved_theme = theme
        if appearance in ("dark", "light"):
            resolved_theme = appearance if theme in ("auto", "", None) or theme == "modern" else theme
        props.update({
            "title": title,
            "width": width,
            "height": height,
            "theme": resolved_theme if resolved_theme else "dark",
            "appearance": appearance,
            "direction": direction,
            "scene": scene,
        })
        Widget.__init__(self, "App", [], props)

    def run(self):
        _bridge.run(self._id)
        return self


class Guide(Widget):
    def __init__(self, title="مرحبًا", message="", character="assistant", position="top", open=True, **props):
        props.update({
            "title": title,
            "message": message,
            "character": character,
            "position": position,
            "open": bool(open),
            "text": title,
        })
        Widget.__init__(self, "Guide", [], props)

    def hide(self):
        self.set_open(False)
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
    def __init__(self, text=None, variant="primary", depth="flat", **props):
        if text is None:
            raise ValueError("يتطلب Button الخاصية text.")
        props.update({"text": text, "variant": variant, "depth": depth})
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

    def set_options(self, options):
        _bridge.set_prop(self._id, "options", list(options or []))
        return self


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

    def draw_line(self, x1, y1, x2, y2, color="#111827", width=2):
        _bridge.canvas(self._id, "line", {
            "x1": x1, "y1": y1, "x2": x2, "y2": y2, "color": color, "width": width
        })
        return self

    def draw_circle(self, x, y, radius, color="#7c3aed", width=0):
        _bridge.canvas(self._id, "circle", {
            "x": x, "y": y, "radius": radius, "color": color, "width": width
        })
        return self

    def clear(self):
        _bridge.canvas(self._id, "clear", {})
        return self


class Scene(Widget):
    def __init__(self, *children, title="", background="", **props):
        props.update({"title": title, "background": background})
        Widget.__init__(self, "Scene", list(children), props)


class HeroSection(Widget):
    def __init__(self, *children, title="", subtitle="", image="", **props):
        props.update({"title": title, "subtitle": subtitle, "image": image})
        Widget.__init__(self, "HeroSection", list(children), props)


class GameBoard(Widget):
    def __init__(self, *children, rows=3, columns=3, items=None, **props):
        props.update({"rows": rows, "columns": columns, "items": list(items or [])})
        Widget.__init__(self, "GameBoard", list(children), props)


class MetricCard(Widget):
    def __init__(self, title="", value=0, unit="", trend="", **props):
        props.update({"title": title, "value": value, "unit": unit, "trend": trend})
        Widget.__init__(self, "MetricCard", [], props)


class StatusPanel(Widget):
    def __init__(self, *children, title="", status="", items=None, **props):
        props.update({"title": title, "status": status, "items": list(items or [])})
        Widget.__init__(self, "StatusPanel", list(children), props)


class Timeline(Widget):
    def __init__(self, items=None, **props):
        props["items"] = list(items or [])
        Widget.__init__(self, "Timeline", [], props)


class MissionCard(Widget):
    def __init__(self, *children, title="", description="", status="", progress=0, **props):
        props.update({"title": title, "description": description, "status": status, "progress": progress})
        Widget.__init__(self, "MissionCard", list(children), props)


class MapPanel(Widget):
    def __init__(self, markers=None, center=None, zoom=1, **props):
        props.update({"markers": list(markers or []), "center": list(center or []), "zoom": zoom})
        Widget.__init__(self, "MapPanel", [], props)


class AnimatedCounter(Widget):
    def __init__(self, value=0, duration=1000, **props):
        props.update({"value": value, "duration": duration})
        Widget.__init__(self, "AnimatedCounter", [], props)


class ProgressRing(Widget):
    def __init__(self, value=0, max=100, **props):
        props.update({"value": value, "max": max})
        Widget.__init__(self, "ProgressRing", [], props)


class LevelBadge(Widget):
    def __init__(self, level=1, text="", **props):
        props.update({"level": level, "text": text})
        Widget.__init__(self, "LevelBadge", [], props)


class Dialog(Widget):
    def __init__(self, *children, title="", open=False, **props):
        props.update({"title": title, "open": bool(open)})
        Widget.__init__(self, "Dialog", list(children), props)


class Drawer(Widget):
    def __init__(self, *children, title="", open=False, position="end", **props):
        props.update({"title": title, "open": bool(open), "position": position})
        Widget.__init__(self, "Drawer", list(children), props)


class Toast(Widget):
    def __init__(self, message="", variant="info", open=True, duration=3000, **props):
        props.update({"message": message, "variant": variant, "open": bool(open), "duration": duration})
        Widget.__init__(self, "Toast", [], props)


class Tooltip(Widget):
    def __init__(self, *children, text="", content="", position="top", **props):
        props.update({"text": text, "content": content, "position": position})
        Widget.__init__(self, "Tooltip", list(children), props)


class StepIndicator(Widget):
    def __init__(self, steps=None, current=0, **props):
        props.update({"steps": list(steps or []), "current": current})
        Widget.__init__(self, "StepIndicator", [], props)


class DataGrid(Widget):
    def __init__(self, columns=None, data=None, **props):
        props.update({"columns": list(columns or []), "data": list(data or [])})
        Widget.__init__(self, "DataGrid", [], props)


class CharacterGuide(Guide):
    def __init__(self, title="مرحبًا", message="", character="assistant", position="top", open=True, **props):
        props.update({
            "title": title, "message": message, "character": character,
            "position": position, "open": bool(open), "text": title
        })
        Widget.__init__(self, "CharacterGuide", [], props)


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
Audio = _simple("Audio")


class Timer(Widget):
    def __init__(self, value=0, interval=1000, running=True, **props):
        props.update({"value": value, "interval": interval, "running": bool(running)})
        Widget.__init__(self, "Timer", [], props)

    def set_running(self, running=True):
        _bridge.set_prop(self._id, "running", bool(running))
        return self
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
  var allowedStyle = ["width","height","padding","margin","align","justify","gap","background","text_color","border_radius","variant","size","columns","depth","appearance","scene","layout","span","full_width"];
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
  function acceptsEventPayload(handler) {
    var target = handler && (handler.im_func || handler);
    if (!target) fail("دالة الحدث غير صالحة.");
    if (typeof target.$memoiseFlags === "function" && !target.memoised) target.$memoiseFlags();
    var code = target.func_code || {};
    var count = Number(target.co_argcount);
    if (!Number.isFinite(count)) count = Number(code.co_argcount);
    if (!Number.isFinite(count) && Array.isArray(code.co_varnames)) count = code.co_varnames.length;
    if (!Number.isFinite(count)) fail("تعذر تحديد معاملات دالة الحدث.");
    if (handler.im_self || handler.$self) count = Math.max(0, count - 1);
    var hasVarargs = Boolean(target.co_varargs || code.co_varargs);
    if (count > 1 && !hasVarargs) fail("دالة الحدث يجب أن تقبل صفر أو معاملًا واحدًا.");
    return hasVarargs || count === 1;
  }
  function sanitize(kind, raw) {
    var props = {};
    raw = raw && typeof raw === "object" ? raw : {};
    Object.keys(raw).slice(0, 80).forEach(function(key) {
      var value = raw[key];
      if (key === "src") {
        var src = String(value || "");
        props.src = /^(data:image\\/(png|jpeg|gif|webp);base64,|\\.\\/|assets\\/)/i.test(src) ? src : "";
      } else if (key === "background" || key === "text_color" || key === "color") {
        props[key] = safeColor(value);
      } else if (["width","height","padding","margin","gap","border_radius"].includes(key)) {
        props[key] = safeSize(value);
      } else if (key === "columns") {
        if (kind === "DataGrid" && Array.isArray(value)) props.columns = value.slice(0, 100);
        else {
          var columns = Math.round(Number(value));
          if (columns >= 1 && columns <= 6) props.columns = columns;
        }
      } else if (allowedStyle.includes(key) || ["title","text","message","subtitle","image","icon","character","position","placeholder","value","disabled","visible","theme","appearance","direction","level","rows","checked","group","options","min","max","step","alt","open","operations","headers","items","tabs","panels","interval","running","data","labels","autoplay","controls","scene","layout","span","full_width","unit","suffix","trend","status","description","progress","markers","center","zoom","duration","content","steps","current","mood","dismissible","dismiss_text","events","name","label"].includes(key)) {
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
  function emit() {
    if (self.__skuiDeferSnapshot) {
      self.__skuiSnapshotDirty = true;
      return;
    }
    self.postMessage({ type: "snapshot", ui: snapshot() });
  }
  mod.create = new Sk.builtin.func(function(kindValue, propsValue) {
    var kind = str(kindValue);
    if (!COMPONENTS.includes(kind)) fail("المكوّن " + kind + " غير مدعوم في مكتبة skui.");
    if (Object.keys(state.nodes).length >= LIMITS.maxElements) fail("تم بلوغ الحد الأقصى لعدد عناصر الواجهة.");
    if (kind === "Timer" && Object.keys(state.nodes).filter(function(id) { return state.nodes[id].type === "Timer"; }).length >= LIMITS.maxTimers) fail("تم بلوغ الحد الأقصى للمؤقتات.");
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
    state.handlers[id + ":" + event] = {
      callback: handler,
      acceptsPayload: acceptsEventPayload(handler)
    };
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
    if (!node) return new Sk.builtin.str("");
    var value = node.props.value;
    if (node.type === "Checkbox") {
      return (node.props.checked || value === true) ? Sk.builtin.bool.true$ : Sk.builtin.bool.false$;
    }
    if (node.type === "Slider" || node.type === "Progress" || node.type === "Timer") {
      var n = Number(value);
      return new Sk.builtin.float_(Number.isFinite(n) ? n : 0);
    }
    if (value == null) value = "";
    // Input/TextArea/Select: always a real Skulpt str so .strip() works after DOM sync.
    return new Sk.builtin.str(String(value));
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
    if (!["clear","rect","text","line","circle"].includes(op)) fail("عملية Canvas غير مدعومة.");
    if (op === "clear") node.props.operations = [];
    else {
      var operations = Array.isArray(node.props.operations) ? node.props.operations : [];
      if (operations.length >= LIMITS.maxCanvasOperations) fail("تم بلوغ الحد الأقصى لعمليات Canvas.");
      var clean = { op: op };
      ["x","y","x1","y1","x2","y2","width","height","size","radius"].forEach(function(k) {
        if (payload[k] != null) {
          var value = Math.max(-100000, Math.min(100000, finite(payload[k], 0)));
          if (["width","height","size","radius"].includes(k)) value = Math.max(0, Math.min(2000, value));
          clean[k] = value;
        }
      });
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
