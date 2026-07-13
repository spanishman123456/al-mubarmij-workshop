import {
  getSkuiAutocompleteSuggestions,
  getSkuiConstructorProps,
} from "../skui/manifest.js";
import {
  CONTEXT_AFTER_KEYWORD,
  getAllCatalogItems,
  getMethodCatalog,
  UNIT_PRIORITY_BOOST,
} from "./skulptCatalog.js";

/**
 * Detects whether `objectName` refers to the skui module in the current buffer
 * (e.g. `import skui as ui` → `ui`, or bare `skui`).
 * @param {string} code
 * @param {string} objectName
 */
export function isSkuiNamespace(code, objectName) {
  if (!objectName) return false;
  if (objectName === "skui") return true;
  const asAlias = [...code.matchAll(/\bimport\s+skui\s+as\s+([A-Za-z_]\w*)/g)].map((m) => m[1]);
  if (asAlias.includes(objectName)) return true;
  return false;
}

const IDENT = /[A-Za-z_\u0080-\uFFFF][\w\u0080-\uFFFF]*/;

/**
 * @param {string} code
 * @param {number} cursor
 */
export function parseCompletionContext(code, cursor) {
  if (cursor < 0 || cursor > code.length) return null;

  const before = code.slice(0, cursor);
  const lineStart = before.lastIndexOf("\n") + 1;
  const linePrefix = before.slice(lineStart);

  if (/^\s*#/.test(linePrefix)) return null;

  const inString = isInsideString(code, cursor);
  if (inString) return null;

  const dotMatch = before.match(/([A-Za-z_][\w]*)\.\s*([A-Za-z_]*)$/);
  if (dotMatch) {
    return {
      kind: "member",
      prefix: dotMatch[2] || "",
      objectName: dotMatch[1],
      replaceStart: cursor - (dotMatch[2]?.length || 0),
      replaceEnd: cursor,
    };
  }

  const wordMatch = before.match(/([A-Za-z_][\w]*)$/);
  if (!wordMatch && !before.endsWith(".")) {
    const ch = before[before.length - 1];
    if (!ch || !/[A-Za-z_]/.test(ch)) return null;
  }

  const prefix = wordMatch ? wordMatch[1] : "";
  const replaceStart = cursor - prefix.length;

  const prevWord = before.slice(0, replaceStart).trimEnd();
  const prevToken = prevWord.match(/([A-Za-z_][\w]*)\s*$/);
  const afterKeyword = prevToken ? CONTEXT_AFTER_KEYWORD[prevToken[1]] : null;

  return {
    kind: "identifier",
    prefix,
    replaceStart,
    replaceEnd: cursor,
    afterKeyword: afterKeyword || null,
  };
}

/**
 * @param {string} code
 * @param {number} cursor
 */
function isInsideString(code, cursor) {
  let inSingle = false;
  let inDouble = false;
  let escape = false;
  for (let i = 0; i < cursor; i += 1) {
    const c = code[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\") {
      escape = true;
      continue;
    }
    if (c === "'" && !inDouble) inSingle = !inSingle;
    if (c === '"' && !inSingle) inDouble = !inDouble;
  }
  return inSingle || inDouble;
}

/**
 * @param {string} code
 * @returns {{ variables: string[], functions: string[] }}
 */
export function extractUserSymbols(code) {
  const variables = new Set();
  const functions = new Set();

  for (const m of code.matchAll(/^\s*([A-Za-z_]\w*)\s*=/gm)) {
    variables.add(m[1]);
  }
  for (const m of code.matchAll(/\bdef\s+([A-Za-z_]\w*)\s*\(/g)) {
    functions.add(m[1]);
  }
  for (const m of code.matchAll(/\bfor\s+([A-Za-z_]\w*)\s+in\b/g)) {
    variables.add(m[1]);
  }

  return {
    variables: [...variables],
    functions: [...functions],
  };
}

/**
 * @param {string} code
 * @param {string} name
 * @returns {"str"|"list"|null}
 */
export function inferVariableType(code, name) {
  const assignStr = new RegExp(`\\b${name}\\s*=\\s*["'\`]`);
  const assignList = new RegExp(`\\b${name}\\s*=\\s*\\[`);
  const assignListCall = new RegExp(`\\b${name}\\s*=\\s*list\\s*\\(`);
  if (assignStr.test(code)) return "str";
  if (assignList.test(code) || assignListCall.test(code)) return "list";
  const lower = name.toLowerCase();
  if (/text|name|msg|str|word|title|label/.test(lower)) return "str";
  if (/list|items|arr|nums|numbers|scores/.test(lower)) return "list";
  return null;
}

/**
 * @param {string} a
 * @param {string} b
 */
export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/**
 * @param {string} prefix
 * @param {string[]} labels
 */
export function findTypoHint(prefix, labels) {
  if (!prefix || prefix.length < 3) return null;
  let best = null;
  let bestDist = 3;
  for (const label of labels) {
    if (label === prefix) return null;
    const d = levenshtein(prefix.toLowerCase(), label.toLowerCase());
    if (d < bestDist) {
      bestDist = d;
      best = label;
    }
  }
  return bestDist <= 2 ? best : null;
}

/**
 * @param {import('./skulptCatalog.js').CatalogItem & { source?: string }} item
 * @param {string} prefix
 */
function matchesPrefix(item, prefix) {
  if (!prefix) return true;
  return item.label.toLowerCase().startsWith(prefix.toLowerCase());
}

/**
 * @param {ReturnType<typeof parseCompletionContext>} ctx
 * @param {object} opts
 * @param {string} opts.code
 * @param {string} [opts.unitId]
 * @param {boolean} [opts.appMode]
 * @param {number} [opts.limit]
 */
export function getSuggestions(ctx, { code, unitId, appMode = false, limit = 12 } = {}) {
  if (!ctx) return { items: [], typoHint: null };

  const { variables, functions } = extractUserSymbols(code);
  const boost = UNIT_PRIORITY_BOOST[unitId] || [];

  /** @type {Array<import('./skulptCatalog.js').CatalogItem & { source?: string, boost?: number }>} */
  let pool = [];

  if (ctx.kind === "member") {
    if (appMode && isSkuiNamespace(code, ctx.objectName)) {
      pool = getSkuiAutocompleteSuggestions(ctx.prefix || "").map((item) => ({
        label: item.label,
        kind: "skui-component",
        descriptionAr: `مكوّن skui — ${item.detail || item.label}`,
        source: "skui",
      }));
    } else {
      const inferred = inferVariableType(code, ctx.objectName);
      pool = getMethodCatalog(inferred).map((item) => ({ ...item, source: "method" }));
    }
  } else {
    pool = getAllCatalogItems({ appMode }).map((item) => ({ ...item, source: "catalog" }));

    for (const v of variables) {
      pool.push({
        label: v,
        kind: "variable",
        descriptionAr: "متغير — عرّفته أنت في الكود",
        source: "user-var",
      });
    }
    for (const fn of functions) {
      pool.push({
        label: fn,
        kind: "function",
        descriptionAr: "دالة — أنشأتها أنت في الكود",
        source: "user-fn",
      });
    }
    if (ctx.afterKeyword) {
      pool = [...ctx.afterKeyword.map((item) => ({ ...item, source: "context" })), ...pool];
    }

    // Inside ui.Component(…): suggest constructor kwargs when app mode is on.
    const ctorPropMatch = appMode
      ? code
          .slice(0, ctx.replaceEnd)
          .match(/([A-Za-z_]\w*)\s*\.\s*([A-Za-z_]\w*)\s*\(\s*(?:[^)]*,\s*)*([A-Za-z_]*)$/)
      : null;
    if (
      ctorPropMatch &&
      isSkuiNamespace(code, ctorPropMatch[1]) &&
      getSkuiAutocompleteSuggestions(ctorPropMatch[2]).some((item) => item.label === ctorPropMatch[2])
    ) {
      const propPrefix = ctorPropMatch[3] || "";
      const skuiProps = getSkuiConstructorProps(ctorPropMatch[2])
        .filter((name) => !propPrefix || name.toLowerCase().startsWith(propPrefix.toLowerCase()))
        .map((name) => ({
          label: name,
          kind: "skui-property",
          descriptionAr: `خاصية skui.${ctorPropMatch[2]}`,
          source: "skui-prop",
        }));
      pool = [...skuiProps, ...pool];
    }
  }

  const prefix = ctx.prefix || "";
  let filtered = pool.filter((item) => matchesPrefix(item, prefix));

  filtered = filtered.map((item) => ({
    ...item,
    boost: boost.indexOf(item.label) >= 0 ? 10 - boost.indexOf(item.label) : 0,
  }));

  filtered.sort((a, b) => {
    if (b.boost !== a.boost) return b.boost - a.boost;
    if (a.label.length !== b.label.length) return a.label.length - b.label.length;
    return a.label.localeCompare(b.label);
  });

  const seen = new Set();
  const deduped = [];
  for (const item of filtered) {
    const key = item.label;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
    if (deduped.length >= limit) break;
  }

  const allLabels = pool.map((p) => p.label);
  const typoHint = deduped.length === 0 ? findTypoHint(prefix, allLabels) : null;

  return { items: deduped, typoHint };
}

/**
 * @param {string} code
 * @param {number} cursor
 * @param {string} label
 */
export function applyCompletion(code, cursor, label) {
  const ctx = parseCompletionContext(code, cursor);
  if (!ctx) return { code, cursor, selectionStart: cursor, selectionEnd: cursor };

  const before = code.slice(0, ctx.replaceStart);
  const after = code.slice(ctx.replaceEnd);
  const nextCode = before + label + after;
  const nextCursor = before.length + label.length;
  return {
    code: nextCode,
    cursor: nextCursor,
    selectionStart: nextCursor,
    selectionEnd: nextCursor,
  };
}

export function shouldAutoTrigger(prefix, mode) {
  if (mode === "off") return false;
  if (mode === "reduced") return prefix.length >= 2;
  return prefix.length >= 1;
}

export function kindLabelAr(kind) {
  if (kind === "keyword") return "كلمة محجوزة";
  if (kind === "builtin") return "دالة";
  if (kind === "method") return "Method";
  if (kind === "variable") return "متغير";
  if (kind === "function") return "دالة (تعريفك)";
  if (kind === "module") return "وحدة";
  if (kind === "skui-component") return "مكوّن skui";
  if (kind === "skui-property") return "خاصية skui";
  return "اقتراح";
}
