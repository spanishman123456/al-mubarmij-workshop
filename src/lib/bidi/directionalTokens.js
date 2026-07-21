const IDENTIFIER_RE = String.raw`[A-Za-z_$][A-Za-z0-9_$]*(?:[₀-₉]+)?`;
const HEX_RE = String.raw`0[xX][\dA-Fa-f](?:_?[\dA-Fa-f])*`;
const BINARY_RE = String.raw`0[bB][01](?:_?[01])*`;
const NUMBER_RE = String.raw`\d+(?:\.\d+)?(?:[₀-₉]+|%)?`;
const TECHNICAL_CHARS_RE = String.raw`[\[\]{}()A-Za-z0-9_$₀-₉.,:'"+\-*/%<>=!&|^~\s]`;
const ACCESSOR_RE = String.raw`(?:\s*(?:\[${TECHNICAL_CHARS_RE}+\]|\.[A-Za-z_$][A-Za-z0-9_$]*|\(${TECHNICAL_CHARS_RE}*\)))*`;
const ARRAY_RE = String.raw`\[${TECHNICAL_CHARS_RE}+\]`;
const ATOM_RE = String.raw`(?:${HEX_RE}|${BINARY_RE}|${IDENTIFIER_RE}${ACCESSOR_RE}|${NUMBER_RE})`;
const COMPOUND_RE = String.raw`${ATOM_RE}(?:\s*[+\-*/=<>!&|^~%:]\s*${ATOM_RE})+`;

const LTR_TOKEN_RE = new RegExp(
  `(${ARRAY_RE}|${COMPOUND_RE}|${ATOM_RE})`,
  "gu",
);
const HAS_LTR_RE = /[A-Za-z0-9₀-₉]/u;

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

