import { useState } from "react";
import { validateMakeCodePython } from "../hardware/validateCode.js";
import { copyCode, downloadMainPy } from "./bridge.js";

/**
 * @param {{ code: string, onOpenMakeCode: () => void }} props
 */
export default function CodePanel({ code, onOpenMakeCode }) {
  const [validation, setValidation] = useState(null);
  const [copyMsg, setCopyMsg] = useState("");

  async function handleCopy() {
    const ok = await copyCode(code);
    setCopyMsg(ok ? "تم النسخ!" : "تعذّر النسخ");
    setTimeout(() => setCopyMsg(""), 2000);
  }

  function handleValidate() {
    setValidation(validateMakeCodePython(code));
  }

  return (
    <div className="mgl-code">
      <div className="mgl-code__toolbar">
        <button type="button" className="mgl-code__btn" onClick={handleCopy}>
          نسخ الكود
        </button>
        <button type="button" className="mgl-code__btn" onClick={() => downloadMainPy(code)}>
          تحميل main.py
        </button>
        <button type="button" className="mgl-code__btn mgl-code__btn--outline" onClick={handleValidate}>
          Validate Code
        </button>
        <button type="button" className="mgl-code__btn mgl-code__btn--primary" onClick={onOpenMakeCode}>
          Open MakeCode &amp; Generate HEX
        </button>
        {copyMsg ? <span className="mgl-code__hint">{copyMsg}</span> : null}
      </div>

      <pre className="mgl-code__block" dir="ltr">
        <code>{code}</code>
      </pre>

      {validation ? (
        <div
          className={`mgl-code__validation${
            validation.valid ? " mgl-code__validation--ok" : " mgl-code__validation--err"
          }`}
        >
          <p className="mgl-code__validation-title">
            {validation.valid ? "Valid" : "Errors"}
          </p>
          {validation.errors.length > 0 ? (
            <ul className="mgl-code__validation-list">
              {validation.errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          ) : null}
          {validation.warnings.length > 0 ? (
            <>
              <p className="mgl-code__validation-title mgl-code__validation-title--warn">Warnings</p>
              <ul className="mgl-code__validation-list mgl-code__validation-list--warn">
                {validation.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
