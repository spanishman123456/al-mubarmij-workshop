/**
 * وحدة appkit لـ Skulpt — تُحقَن في Sk.builtinFiles.files['src/lib/appkit.js']
 * Skulpt يحمّل الوحدات عبر Sk.read وليس عبر window.$builtinmodule
 *
 * ملاحظة: دوال الوحدة لا تستقبل self — الوسيط الأول هو أول وسيط بايثون.
 */

export const APPKIT_SKULPT_MODULE_SRC = `var $builtinmodule = function(name) {
  var registry = window.__mubarmijAppKitRegistry;
  if (!registry) {
    registry = window.__mubarmijAppKitRegistry = {
      title: "", elements: [], handlers: {}, values: {}, canvasOps: {}
    };
  }
  function jsStr(v) {
    return v === undefined || v === Sk.builtin.none.none$ ? "" : Sk.ffi.remapToJs(v);
  }
  function pyNone() { return Sk.builtin.none.none$; }
  var mod = {};
  mod.title = new Sk.builtin.func(function(t) {
    registry.title = jsStr(t);
    return pyNone();
  });
  mod.text = new Sk.builtin.func(function(content) {
    registry.elements.push({ type: "text", content: jsStr(content) });
    return pyNone();
  });
  mod.input = new Sk.builtin.func(function(id, label, defaultVal, placeholder) {
    var i = jsStr(id);
    registry.elements.push({
      type: "input", id: i, label: jsStr(label), inputType: "text",
      placeholder: jsStr(placeholder) || ""
    });
    registry.values[i] = jsStr(defaultVal);
    return pyNone();
  });
  mod.number_input = new Sk.builtin.func(function(id, label, defaultVal, placeholder) {
    var i = jsStr(id);
    registry.elements.push({
      type: "input", id: i, label: jsStr(label), inputType: "number",
      placeholder: jsStr(placeholder) || ""
    });
    registry.values[i] = jsStr(defaultVal) || "0";
    return pyNone();
  });
  mod.output = new Sk.builtin.func(function(id, label) {
    var i = jsStr(id);
    registry.elements.push({ type: "output", id: i, label: jsStr(label) });
    registry.values[i] = "";
    return pyNone();
  });
  mod.button = new Sk.builtin.func(function(id, label) {
    registry.elements.push({ type: "button", id: jsStr(id), label: jsStr(label) });
    return pyNone();
  });
  mod.get = new Sk.builtin.func(function(id) {
    var v = registry.values[jsStr(id)];
    if (v === undefined) v = "";
    return new Sk.builtin.str(String(v));
  });
  mod.set = new Sk.builtin.func(function(id, value) {
    registry.values[jsStr(id)] = jsStr(value);
    return pyNone();
  });
  mod.on_click = new Sk.builtin.func(function(id, handler) {
    registry.handlers[jsStr(id)] = handler;
    return pyNone();
  });
  mod.canvas = new Sk.builtin.func(function(id, w, h) {
    var cid = jsStr(id);
    registry.elements.push({
      type: "canvas", id: cid,
      width: Number(jsStr(w)) || 300,
      height: Number(jsStr(h)) || 180
    });
    registry.canvasOps[cid] = [];
    return pyNone();
  });
  mod.draw_rect = new Sk.builtin.func(function(canvasId, x, y, w, h, color) {
    var cid = jsStr(canvasId);
    if (!registry.canvasOps[cid]) registry.canvasOps[cid] = [];
    registry.canvasOps[cid].push({
      op: "rect",
      x: Number(jsStr(x)), y: Number(jsStr(y)),
      w: Number(jsStr(w)), h: Number(jsStr(h)),
      color: jsStr(color) || "#7c3aed"
    });
    return pyNone();
  });
  mod.draw_text = new Sk.builtin.func(function(canvasId, x, y, txt, color) {
    var cid = jsStr(canvasId);
    if (!registry.canvasOps[cid]) registry.canvasOps[cid] = [];
    registry.canvasOps[cid].push({
      op: "text",
      x: Number(jsStr(x)), y: Number(jsStr(y)),
      text: jsStr(txt), color: jsStr(color) || "#1e1b4b"
    });
    return pyNone();
  });
  mod.clear_canvas = new Sk.builtin.func(function(canvasId) {
    var cid = jsStr(canvasId);
    registry.canvasOps[cid] = [];
    return pyNone();
  });
  mod.build = new Sk.builtin.func(function() {
    if (typeof window.__mubarmijAppKitOnBuild === "function") {
      window.__mubarmijAppKitOnBuild();
    }
    return pyNone();
  });
  return mod;
};`;

export function installAppkitForSkulpt(Sk, registry) {
  if (!Sk?.builtinFiles?.files) {
    throw new Error("Skulpt stdlib غير محمّل — أعد تحميل الصفحة.");
  }
  window.__mubarmijAppKitRegistry = registry;
  Sk.builtinFiles.files["src/lib/appkit.js"] = APPKIT_SKULPT_MODULE_SRC;
}

export function makeAppkitRead(Sk, registry, fallbackRead) {
  installAppkitForSkulpt(Sk, registry);
  return function appkitRead(path) {
    if (path === "src/lib/appkit.js") return APPKIT_SKULPT_MODULE_SRC;
    return fallbackRead(path);
  };
}
