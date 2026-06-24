import { formatSkulptError } from "./pythonErrorHelp.js";
import { ensureSkulptLoaded } from "./skulptRun.js";
import {
  createAppRegistry,
  snapshotRegistry,
  buildAppKitExports,
  validatePythonCode,
} from "./pyAppKit.js";

function builtinRead(Sk, x) {
  if (!Sk.builtinFiles?.files?.[x]) {
    throw new Error("File not found: " + x);
  }
  return Sk.builtinFiles.files[x];
}

function withAppKitModule(Sk, registry, fn) {
  const prev = window.$builtinmodule;
  window.$builtinmodule = function (name) {
    if (name === "appkit") return buildAppKitExports(Sk, registry);
    return prev ? prev(name) : undefined;
  };
  return fn().finally(() => {
    window.$builtinmodule = prev;
  });
}

export class PythonAppSession {
  constructor() {
    this.registry = createAppRegistry();
    this.Sk = null;
    this.code = "";
    this.alive = false;
  }

  async load(code) {
    const security = validatePythonCode(code);
    if (security) {
      const e = new Error(security);
      e.feedback = { headlineAr: security, hintAr: "احذف الأوامر غير المسموحة." };
      throw e;
    }

    this.code = code;
    this.Sk = await ensureSkulptLoaded();
    this.registry = createAppRegistry();
    const out = [];
    const outf = (t) => out.push(t);

    this.Sk.configure({
      output: outf,
      read: (x) => builtinRead(this.Sk, x),
      __future__: this.Sk.python3,
      execLimit: 10000,
    });

    try {
      await withAppKitModule(this.Sk, this.registry, async () => {
        await this.Sk.misceval.asyncToPromise(
          () => this.Sk.importMainWithBody("<stdin>", false, code, true),
          10000,
        );
      });
      this.alive = true;
      return { ui: snapshotRegistry(this.registry), console: out.join("") };
    } catch (err) {
      this.alive = false;
      const feedback = formatSkulptError(err);
      const e = new Error(feedback.headlineAr);
      e.feedback = feedback;
      throw e;
    }
  }

  async click(buttonId, inputValues) {
    if (!this.alive) throw new Error("أعد تشغيل المشروع أولاً.");
    this.registry.values = { ...this.registry.values, ...inputValues };
    const handler = this.registry.handlers[buttonId];
    if (!handler) return { ui: snapshotRegistry(this.registry), console: "" };

    const out = [];
    this.Sk.configure({
      output: (t) => out.push(t),
      read: (x) => builtinRead(this.Sk, x),
      __future__: this.Sk.python3,
      execLimit: 5000,
    });

    try {
      await this.Sk.misceval.asyncToPromise(() => this.Sk.misceval.callsimOrSuspend(handler), 5000);
      return { ui: snapshotRegistry(this.registry), console: out.join("") };
    } catch (err) {
      const feedback = formatSkulptError(err);
      const e = new Error(feedback.headlineAr);
      e.feedback = feedback;
      throw e;
    }
  }

  destroy() {
    this.alive = false;
    this.registry = createAppRegistry();
    if (this.Sk) this.Sk.execLimit = 1;
  }
}

export { validatePythonCode };
