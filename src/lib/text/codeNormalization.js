const CURLY_QUOTES_REPLACEMENTS = [
  [/[\u201C\u201D]/g, '"'],
  [/[\u2018\u2019]/g, "'"],
];

const OPERATOR_FIXES = [
  [/(^|[^!<>])=\s*=/g, "$1=="],
  [/\+\s+=/g, "+="],
  [/-\s+=/g, "-="],
  [/!\s+=/g, "!="],
  [/<\s+=/g, "<="],
  [/>\s+=/g, ">="],
];

const DASH_MINUS_RE = /\u2212/g;

export const CODE_LIKE_FIELD_NAMES = new Set([
  "code",
  "starterCode",
  "solutionCode",
  "expectedCode",
  "snippet",
  "expression",
  "expectedOutput",
]);

export function normalizeExecutablePythonCode(text) {
  let value = String(text ?? "");
  for (const [re, replacement] of CURLY_QUOTES_REPLACEMENTS) {
    value = value.replace(re, replacement);
  }
  value = value.replace(DASH_MINUS_RE, "-");
  for (const [re, replacement] of OPERATOR_FIXES) {
    value = value.replace(re, replacement);
  }
  value = value.replace(/\r\n/g, "\n");
  return value;
}

function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

export function normalizeCodeFieldsDeep(input, fieldNames = CODE_LIKE_FIELD_NAMES) {
  if (typeof input === "string") return input;
  if (Array.isArray(input)) return input.map((item) => normalizeCodeFieldsDeep(item, fieldNames));
  if (!isPlainObject(input)) return input;

  const out = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string" && fieldNames.has(key)) {
      out[key] = normalizeExecutablePythonCode(value);
      continue;
    }
    out[key] = normalizeCodeFieldsDeep(value, fieldNames);
  }
  return out;
}
