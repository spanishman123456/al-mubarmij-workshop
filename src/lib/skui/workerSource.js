import { createSkuiModuleFiles } from "./moduleSources.js";
import { SKUI_LIMITS } from "./manifest.js";

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
    self.postMessage({ type: "run-complete", console: output.join("") });
  } catch (err) {
    running = false;
    self.postMessage({ type: "error", feedback: friendlyError(err, null) });
  }
}

async function dispatchEvent(message) {
  if (!running) throw new Error("أعد تشغيل المشروع أولاً.");
  var state = self.__skuiState;
  var node = state.nodes[message.id];
  if (!node) return;
  if (message.values && typeof message.values === "object") {
    Object.keys(message.values).forEach(function(id) {
      if (state.nodes[id]) state.nodes[id].props.value = message.values[id];
    });
  }
  if (Object.prototype.hasOwnProperty.call(message, "value")) {
    node.props.value = message.value;
    if (node.type === "Checkbox") node.props.checked = Boolean(message.value);
  }
  var handler = state.handlers[message.id + ":" + message.event];
  if (!handler) {
    if (typeof self.postMessage === "function") {
      var nodes = {};
      Object.keys(state.nodes).forEach(function(id) {
        var item = state.nodes[id];
        nodes[id] = { id: id, type: item.type, props: Object.assign({}, item.props), children: item.children.slice() };
      });
      self.postMessage({ type: "snapshot", ui: { version: "1.0.0", appId: state.appId, roots: state.roots.slice(), nodes: nodes } });
    }
    self.postMessage({ type: "event-complete", console: "" });
    return;
  }
  output = [];
  Sk.execLimit = LIMITS.eventTimeoutMs;
  try {
    await Sk.misceval.asyncToPromise(function() {
      return Sk.misceval.callsimOrSuspend(handler);
    }, LIMITS.eventTimeoutMs);
    self.postMessage({ type: "event-complete", console: output.join("") });
  } catch (err) {
    self.postMessage({ type: "error", feedback: friendlyError(err, message.event) });
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
