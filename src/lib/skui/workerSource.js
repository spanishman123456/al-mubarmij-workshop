import { createSkuiModuleFiles } from "./moduleSources.js";
import { SKUI_LIMITS, SKUI_VERSION } from "./manifest.js";

export function buildSkuiWorkerSource() {
  const moduleFiles = JSON.stringify(createSkuiModuleFiles());
  const limits = JSON.stringify(SKUI_LIMITS);
  return `
"use strict";
var moduleFiles = ${moduleFiles};
var LIMITS = ${limits};
var initialized = false;
var running = false;
var output = [];
var eventChain = Promise.resolve();

function resetState() {
  self.__skuiState = { nodes: {}, handlers: {}, roots: [], appId: null, nextId: 0 };
  output = [];
}

function readFile(path) {
  if (Object.prototype.hasOwnProperty.call(moduleFiles, path)) return moduleFiles[path];
  if (self.Sk && Sk.builtinFiles && Sk.builtinFiles.files[path]) return Sk.builtinFiles.files[path];
  throw new Error("File not found: " + path);
}

function lineFromError(err) {
  if (err && Array.isArray(err.traceback) && err.traceback[0]) return err.traceback[0].lineno || null;
  var match = String(err || "").match(/line\\s+(\\d+)/i);
  return match ? Number(match[1]) : null;
}

function serializeUi(state) {
  var nodes = {};
  Object.keys(state.nodes).forEach(function(id) {
    var node = state.nodes[id];
    nodes[id] = { id: id, type: node.type, props: Object.assign({}, node.props), children: node.children.slice() };
  });
  return { version: "${SKUI_VERSION}", appId: state.appId, roots: state.roots.slice(), nodes: nodes };
}

function resetExecBudget(timeoutMs) {
  // Skulpt measures elapsed time from Sk.execStart once per worker session.
  // Without resetting it, every on_click after the initial run looks "timed out".
  Sk.execStart = Date.now();
  Sk.lastYield = Date.now();
  Sk.execLimit = timeoutMs;
  Sk.configure({
    output: function(text) { output.push(String(text)); },
    read: readFile,
    __future__: Sk.python3,
    execLimit: timeoutMs
  });
}

function friendlyError(err, eventName) {
  var raw = String((err && err.toString && err.toString()) || err || "خطأ غير معروف");
  var unknown = raw.match(/has no attribute ['"]?([A-Za-z_][A-Za-z0-9_]*)/);
  if (unknown) raw = "المكوّن " + unknown[1] + " غير مدعوم في مكتبة skui. راجع قائمة المكونات المدعومة.";
  return {
    headlineAr: eventName ? "حدث خطأ داخل دالة " + eventName + "." : "تعذر تشغيل مشروع skui.",
    hintAr: "راجع السطر المشار إليه وتأكد من أسماء المكونات والخصائص.",
    detail: raw,
    line: lineFromError(err),
    event: eventName || null
  };
}

async function initialize(message) {
  if (initialized) return;
  if (!message.skulptUrl || !message.stdlibUrl) throw new Error("Skulpt assets are required");
  importScripts(message.skulptUrl);
  importScripts(message.stdlibUrl);
  Object.keys(moduleFiles).forEach(function(path) {
    Sk.builtinFiles.files[path] = moduleFiles[path];
  });
  initialized = true;
  self.postMessage({ type: "ready" });
}

async function runCode(code) {
  resetState();
  running = true;
  resetExecBudget(LIMITS.runTimeoutMs);
  Sk.configure({
    output: function(text) { output.push(String(text)); },
    read: readFile,
    __future__: Sk.python3,
    execLimit: LIMITS.runTimeoutMs
  });
  try {
    await Sk.misceval.asyncToPromise(function() {
      return Sk.importMainWithBody("<stdin>", false, String(code || ""), true);
    }, LIMITS.runTimeoutMs);
    running = true;
    var state = self.__skuiState || { nodes: {}, appId: null, roots: [] };
    var ui = serializeUi(state);
    Sk.execLimit = Number.POSITIVE_INFINITY;
    self.postMessage({ type: "run-complete", console: output.join(""), ui: ui });
  } catch (err) {
    running = false;
    self.postMessage({ type: "error", feedback: friendlyError(err, null) });
  }
}

async function dispatchEvent(message) {
  if (!running) throw new Error("أعد تشغيل المشروع أولاً.");
  var state = self.__skuiState;
  var node = state.nodes[message.id];
  if (!node) {
    self.postMessage({ type: "event-complete", console: "" });
    return;
  }
  if (message.values && typeof message.values === "object") {
    Object.keys(message.values).forEach(function(id) {
      if (state.nodes[id]) state.nodes[id].props.value = message.values[id];
    });
  }
  // Never clobber another widget's value with an on_click payload.
  if (
    Object.prototype.hasOwnProperty.call(message, "value") &&
    message.event !== "on_click" &&
    message.value !== undefined
  ) {
    node.props.value = message.value;
    if (node.type === "Checkbox") node.props.checked = Boolean(message.value);
  }
  var binding = state.handlers[message.id + ":" + message.event];
  if (!binding) {
    self.postMessage({ type: "event-complete", console: "" });
    return;
  }
  var handler = binding.callback || binding;
  var acceptsPayload = binding.callback ? binding.acceptsPayload === true : false;
  output = [];
  self.__skuiDeferSnapshot = true;
  self.__skuiSnapshotDirty = false;
  resetExecBudget(LIMITS.eventTimeoutMs);
  try {
    await Sk.misceval.asyncToPromise(function() {
      var valueEvent = ["on_key_press", "on_change", "on_input", "on_select", "on_submit"].indexOf(message.event) >= 0;
      var canvasEvent = node.type === "Canvas" && Object.prototype.hasOwnProperty.call(message, "value");
      if (acceptsPayload && (valueEvent || canvasEvent)) {
        var payload = message.value;
        if (payload === undefined && valueEvent) payload = node.props.value;
        return Sk.misceval.callsimOrSuspend(
          handler,
          Sk.ffi.remapToPy(payload === undefined ? null : payload)
        );
      }
      return Sk.misceval.callsimOrSuspend(handler);
    }, LIMITS.eventTimeoutMs);
    Sk.execLimit = Number.POSITIVE_INFINITY;
    var ui = serializeUi(state);
    self.postMessage({ type: "snapshot", ui: ui });
    self.postMessage({ type: "event-complete", console: output.join(""), ui: ui });
  } catch (err) {
    self.postMessage({ type: "error", feedback: friendlyError(err, message.event) });
    self.postMessage({ type: "event-complete", console: output.join("") });
  } finally {
    self.__skuiDeferSnapshot = false;
    self.__skuiSnapshotDirty = false;
  }
}

self.onmessage = function(event) {
  var message = event.data || {};
  if (message.type === "init") {
    initialize(message).catch(function(err) {
      self.postMessage({ type: "error", feedback: friendlyError(err, null) });
    });
  } else if (message.type === "run") {
    runCode(message.code);
  } else if (message.type === "event") {
    eventChain = eventChain.then(function() { return dispatchEvent(message); });
  } else if (message.type === "stop") {
    running = false;
    resetState();
  }
};
`;
}
