const LTR_TOKEN_RE = /([A-Za-z0-9][A-Za-z0-9_+\-*/=()[\]{}<>.,:%#'"\\|&^~]*)/g;
const HAS_LTR_RE = /[A-Za-z0-9]/;

export function splitDirectionalParts(text) {
  if (typeof text !== "string" || !text.length) return [];
  return text
    .split(LTR_TOKEN_RE)
    .filter(Boolean)
    .map((part) => ({
      text: part,
      dir: HAS_LTR_RE.test(part) ? "ltr" : "rtl",
    }));
}

