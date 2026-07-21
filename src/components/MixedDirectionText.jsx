import { LtrInlineToken } from "./BilingualTextBlocks";
import { splitDirectionalParts } from "../lib/bidi/directionalTokens";

function toDirectionalNodes(text) {
  if (typeof text !== "string" || !text.length) return text;
  const parts = splitDirectionalParts(text);
  if (parts.length <= 1) return text;
  return parts.map((part, idx) => {
    if (!part?.text) return null;
    if (part.dir === "ltr") {
      return <LtrInlineToken key={`ltr-${idx}`} token={part.text} />;
    }
    return <span key={`rtl-${idx}`}>{part.text}</span>;
  });
}

export function MixedDirectionText({ text, as = "span", className = "" }) {
  const Component = as;
  return <Component className={className}>{toDirectionalNodes(text)}</Component>;
}

export function renderMixedDirectionText(text) {
  return toDirectionalNodes(text);
}
