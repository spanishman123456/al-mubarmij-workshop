import skulptMinUrl from "../assets/skulpt/skulpt.min.js?url";
import skulptStdlibUrl from "../assets/skulpt/skulpt-stdlib.js?url";
import { SKUI_LIMITS, validateSkuiProject } from "./skui/manifest.js";
import { buildSkuiWorkerSource } from "./skui/workerSource.js";

function makeError(feedback) {
  const error = new Error(feedback?.headlineAr || "تعذر تشغيل مشروع skui.");
  error.feedback = feedback;
  return error;
}

export class PythonAppSession {
  constructor() {
    this.worker = null;
    this.workerUrl = null;
    this.ui = null;
    this.console = "";
    this.alive = false;
    this.pending = null;
  }

  async load(code) {
    const legacy = /\bimport\s+appkit\b/.test(String(code || ""));
    const validation = legacy ? { ok: !validatePythonCode(code), issues: [] } : validateSkuiProject(code);
    if (!validation.ok) {
      const message = validation.issues?.[0]?.message || validatePythonCode(code);
      throw makeError({
        headlineAr: message,
        hintAr: "استخدم مكونات skui المدعومة فقط واحذف الأوامر غير المسموحة.",
        detail: validation.issues?.map((item) => item.message).join("\n") || "",
      });
    }
    this.destroy();
    const source = buildSkuiWorkerSource();
    this.workerUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    this.worker = new Worker(this.workerUrl);
    this.worker.onmessage = (event) => this.handleMessage(event.data || {});
    this.worker.onerror = (event) => {
      this.rejectPending({
        headlineAr: "تعذر تشغيل عامل skui المعزول.",
        hintAr: "أعد تشغيل المعاينة.",
        detail: event.message || "",
      });
    };
    const ready = this.waitFor("ready", 5000);
    this.worker.postMessage({ type: "init", skulptUrl: skulptMinUrl, stdlibUrl: skulptStdlibUrl });
    await ready;
    const complete = this.waitFor("run-complete", SKUI_LIMITS.runTimeoutMs + 1000);
    this.worker.postMessage({ type: "run", code });
    const result = await complete;
    this.alive = true;
    this.console = result.console || "";
    return { ui: this.ui, console: this.console };
  }

  handleMessage(message) {
    if (message.type === "snapshot") {
      this.ui = message.ui;
      if (typeof this.onSnapshot === "function") this.onSnapshot(message.ui);
      return;
    }
    if (message.type === "error") {
      this.rejectPending(message.feedback);
      if (typeof this.onError === "function") this.onError(message.feedback);
      return;
    }
    if (this.pending?.type === message.type) {
      const { resolve, timer } = this.pending;
      clearTimeout(timer);
      this.pending = null;
      resolve(message);
    }
  }

  rejectPending(feedback) {
    if (!this.pending) return;
    const { reject, timer } = this.pending;
    clearTimeout(timer);
    this.pending = null;
    reject(makeError(feedback));
  }

  waitFor(type, timeoutMs) {
    if (this.pending) this.rejectPending({ headlineAr: "عملية skui أخرى قيد التنفيذ." });
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending = null;
        this.destroy();
        reject(
          makeError({
            headlineAr: "تجاوز المشروع زمن التنفيذ المسموح.",
            hintAr: "تحقق من الحلقات والمؤقتات ثم أعد التشغيل.",
            detail: "",
          }),
        );
      }, timeoutMs);
      this.pending = { type, resolve, reject, timer };
    });
  }

  async event(id, eventName, value) {
    if (!this.alive) throw new Error("أعد تشغيل المشروع أولاً.");
    const complete = this.waitFor("event-complete", SKUI_LIMITS.eventTimeoutMs + 1000);
    this.worker.postMessage({ type: "event", id, event: eventName, value });
    const result = await complete;
    return { ui: this.ui, console: result.console || "" };
  }

  click(buttonId, inputValues = {}) {
    const value = inputValues?.[buttonId];
    return this.event(buttonId, "on_click", value);
  }

  destroy() {
    this.alive = false;
    if (this.pending) {
      clearTimeout(this.pending.timer);
      this.pending = null;
    }
    this.worker?.terminate();
    this.worker = null;
    if (this.workerUrl) URL.revokeObjectURL(this.workerUrl);
    this.workerUrl = null;
    this.ui = null;
  }
}

export function validatePythonCode(code) {
  const result = validateSkuiProject(
    /\bimport\s+appkit\b/.test(String(code || "")) ? `${code}\nimport skui` : code,
  );
  return result.ok ? null : result.issues[0]?.message;
}
