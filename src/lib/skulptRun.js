/** تشغيل بايثون في المتصفح عبر Skulpt (يُحمّل من index.html) */
export function runPythonWithSkulpt(code) {
  return new Promise((resolve, reject) => {
    const Sk = window.Sk;
    if (!Sk) {
      reject(new Error("Skulpt غير محمّل بعد"));
      return;
    }
    const out = [];
    function outf(text) {
      out.push(text);
    }
    function builtinRead(x) {
      if (!Sk.builtinFiles?.files?.[x]) {
        throw new Error("File not found: " + x);
      }
      return Sk.builtinFiles.files[x];
    }
    Sk.configure({
      output: outf,
      read: builtinRead,
      __future__: Sk.python3,
    });
    Sk.misceval
      .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true), Infinity)
      .then(() => resolve(out.join("") || "(لا يوجد إخراج)"))
      .catch((err) => reject(err));
  });
}
