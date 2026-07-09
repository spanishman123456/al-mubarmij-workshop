const LTR_TOKEN_RE = /([A-Za-z0-9][A-Za-z0-9_+\-*/=()[\]{}<>.,:%#'"\\|&^~]*)/g;
const HAS_LTR_RE = /[A-Za-z0-9]/;

function toDirectionalNodes(text) {
  if (typeof text !== "string" || !text.length) return text;
  const parts = text.split(LTR_TOKEN_RE);
  if (parts.length <= 1) return text;
  return parts.map((part, idx) => {
    if (!part) return null;
    if (HAS_LTR_RE.test(part)) {
      return (
        <span key={`ltr-${idx}`} dir="ltr" className="inline-block unicode-bidi-isolate">
          {part}
        </span>
      );
    }
    return <span key={`rtl-${idx}`}>{part}</span>;
  });
}

export function MixedDirectionText({ text, as = "span", className = "" }) {
  const Component = as;
  return <Component className={className}>{toDirectionalNodes(text)}</Component>;
}

export function renderMixedDirectionText(text) {
  return toDirectionalNodes(text);
}
