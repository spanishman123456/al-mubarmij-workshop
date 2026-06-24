/**
 * جسر appkit — واجهة تعليمية لبناء تطبيقات داخل المتصفح (بديل Tkinter/Pygame)
 * يعمل مع Skulpt عبر وحدة $builtinmodule
 */

export function createAppRegistry() {
  return {
    title: "",
    elements: [],
    handlers: {},
    values: {},
    canvasOps: {},
    stopped: false,
  };
}

export function snapshotRegistry(registry) {
  return {
    title: registry.title,
    elements: registry.elements.map((e) => ({ ...e })),
    values: { ...registry.values },
    canvasOps: { ...registry.canvasOps },
  };
}

function jsStr(Sk, v) {
  return v === undefined || v === Sk.builtin.none.none$ ? "" : Sk.ffi.remapToJs(v);
}

function pyNone(Sk) {
  return Sk.builtin.none.none$;
}

export function buildAppKitExports(Sk, registry) {
  const exp = {};

  exp.title = new Sk.builtin.func(function (t) {
    registry.title = jsStr(Sk, t);
    return pyNone(Sk);
  });

  exp.text = new Sk.builtin.func(function (content) {
    registry.elements.push({ type: "text", content: jsStr(Sk, content) });
    return pyNone(Sk);
  });

  exp.input = new Sk.builtin.func(function (id, label, defaultVal, placeholder) {
    const i = jsStr(Sk, id);
    const d = jsStr(Sk, defaultVal);
    registry.elements.push({
      type: "input",
      id: i,
      label: jsStr(Sk, label),
      inputType: "text",
      placeholder: jsStr(Sk, placeholder) || "",
    });
    registry.values[i] = d;
    return pyNone(Sk);
  });

  exp.number_input = new Sk.builtin.func(function (id, label, defaultVal, placeholder) {
    const i = jsStr(Sk, id);
    const d = jsStr(Sk, defaultVal) || "0";
    registry.elements.push({
      type: "input",
      id: i,
      label: jsStr(Sk, label),
      inputType: "number",
      placeholder: jsStr(Sk, placeholder) || "",
    });
    registry.values[i] = d;
    return pyNone(Sk);
  });

  exp.output = new Sk.builtin.func(function (id, label) {
    const i = jsStr(Sk, id);
    registry.elements.push({ type: "output", id: i, label: jsStr(Sk, label) });
    registry.values[i] = "";
    return pyNone(Sk);
  });

  exp.button = new Sk.builtin.func(function (id, label) {
    registry.elements.push({ type: "button", id: jsStr(Sk, id), label: jsStr(Sk, label) });
    return pyNone(Sk);
  });

  exp.get = new Sk.builtin.func(function (id) {
    const v = registry.values[jsStr(Sk, id)] ?? "";
    return new Sk.builtin.str(String(v));
  });

  exp.set = new Sk.builtin.func(function (id, value) {
    registry.values[jsStr(Sk, id)] = jsStr(Sk, value);
    return pyNone(Sk);
  });

  exp.on_click = new Sk.builtin.func(function (id, handler) {
    registry.handlers[jsStr(Sk, id)] = handler;
    return pyNone(Sk);
  });

  exp.canvas = new Sk.builtin.func(function (id, w, h) {
    const cid = jsStr(Sk, id);
    registry.elements.push({
      type: "canvas",
      id: cid,
      width: Number(jsStr(Sk, w)) || 300,
      height: Number(jsStr(Sk, h)) || 180,
    });
    registry.canvasOps[cid] = [];
    return pyNone(Sk);
  });

  exp.draw_rect = new Sk.builtin.func(function (canvasId, x, y, w, h, color) {
    const cid = jsStr(Sk, canvasId);
    if (!registry.canvasOps[cid]) registry.canvasOps[cid] = [];
    registry.canvasOps[cid].push({
      op: "rect",
      x: Number(jsStr(Sk, x)),
      y: Number(jsStr(Sk, y)),
      w: Number(jsStr(Sk, w)),
      h: Number(jsStr(Sk, h)),
      color: jsStr(Sk, color) || "#7c3aed",
    });
    return pyNone(Sk);
  });

  exp.draw_text = new Sk.builtin.func(function (canvasId, x, y, text, color) {
    const cid = jsStr(Sk, canvasId);
    if (!registry.canvasOps[cid]) registry.canvasOps[cid] = [];
    registry.canvasOps[cid].push({
      op: "text",
      x: Number(jsStr(Sk, x)),
      y: Number(jsStr(Sk, y)),
      text: jsStr(Sk, text),
      color: jsStr(Sk, color) || "#1e1b4b",
    });
    return pyNone(Sk);
  });

  exp.clear_canvas = new Sk.builtin.func(function (canvasId) {
    const cid = jsStr(Sk, canvasId);
    registry.canvasOps[cid] = [];
    return pyNone(Sk);
  });

  exp.build = new Sk.builtin.func(function () {
    return pyNone(Sk);
  });

  return exp;
}

export function validatePythonCode(code) {
  const blocked = [
    /import\s+os\b/i,
    /import\s+subprocess\b/i,
    /import\s+sys\b/i,
    /__import__/,
    /\beval\s*\(/,
    /\bexec\s*\(/,
    /open\s*\(/,
    /document\./,
    /window\./,
  ];
  for (const re of blocked) {
    if (re.test(code)) {
      return "هذا الكود يحتوي على أوامر غير مسموحة في المختبر الآمن.";
    }
  }
  return null;
}
