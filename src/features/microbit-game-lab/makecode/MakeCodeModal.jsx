import { useEffect, useRef, useState } from "react";
import {
  MAKECODE_IFRAME_URL,
  HEX_USER_GUIDE,
  handleMakeCodeMessage,
  postCompileRequest,
  postImportProject,
} from "./bridge.js";

/**
 * @param {{ open: boolean, code: string, onClose: () => void }} props
 */
export default function MakeCodeModal({ open, code, onClose }) {
  const iframeRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    function onMessage(event) {
      handleMakeCodeMessage(event, (data) => {
        if (data.type === "ready" || data.type === "iframe-ready") {
          setStatus("ready");
        }
        if (data.type === "compile" && data.state === "compiled") {
          setStatus("compiled");
          setMessage(
            "تم التجميع داخل MakeCode — استخدم زر Download الرسمي أسفل المحرر لتنزيل HEX.",
          );
        }
        if (data.type === "compile" && data.state === "error") {
          setStatus("error");
          setMessage("فشل التجميع — راجع الأخطاء داخل MakeCode. لم يُنشأ HEX.");
        }
        if (data.type === "download" || data.type === "hexdownload") {
          setStatus("hex-downloaded");
          setMessage("بدأ تنزيل HEX من MakeCode.");
        }
      });
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open]);

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => {
        setStatus("idle");
        setMessage("");
      });
    }
  }, [open]);

  function handleIframeLoad() {
    setStatus("loading");
    setTimeout(() => {
      if (iframeRef.current) {
        const ok = postImportProject(iframeRef.current, code);
        if (ok) {
          setStatus("imported");
          setMessage("تم استيراد المشروع — انتظر التحميل أو اضغط Compile.");
        } else {
          setStatus("error");
          setMessage("تعذّر الاستيراد — انسخ الكود يدويًا داخل MakeCode.");
        }
      }
    }, 1500);
  }

  function handleCompile() {
    if (iframeRef.current) {
      postCompileRequest(iframeRef.current);
      setMessage("جارٍ التجميع...");
    }
  }

  if (!open) return null;

  return (
    <div className="mgl-modal" role="dialog" aria-modal="true" aria-label="MakeCode">
      <div className="mgl-modal__backdrop" onClick={onClose} aria-hidden />
      <div className="mgl-modal__panel">
        <header className="mgl-modal__header">
          <h3 className="mgl-modal__title">Microsoft MakeCode — Python</h3>
          <div className="mgl-modal__actions">
            <button type="button" className="mgl-modal__btn" onClick={handleCompile}>
              Compile
            </button>
            <button type="button" className="mgl-modal__btn mgl-modal__btn--close" onClick={onClose}>
              إغلاق
            </button>
          </div>
        </header>
        <p className="mgl-modal__status">
          الحالة: {status}
          {message ? ` — ${message}` : ""}
        </p>
        <p className="mgl-modal__hint">{HEX_USER_GUIDE}</p>
        <iframe
          ref={iframeRef}
          className="mgl-modal__iframe"
          title="MakeCode micro:bit"
          src={MAKECODE_IFRAME_URL}
          onLoad={handleIframeLoad}
          allow="microphone; clipboard-write"
        />
      </div>
    </div>
  );
}
