/** شفرة قيصر — منطق منفصل عن الواجهة */

export const ARABIC_ALPHABET = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
export const ENGLISH_LOWER = "abcdefghijklmnopqrstuvwxyz";
export const ENGLISH_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** @typedef {'ar'|'en'|'both'} CaesarLanguage */

/**
 * @param {CaesarLanguage} lang
 * @returns {{ id: string, chars: string, label: string }[]}
 */
export function getAlphabetRows(lang) {
  if (lang === "en") {
    return ENGLISH_UPPER.split("").map((ch, i) => ({
      id: ch,
      chars: ch,
      label: `${ch} = ${i}`,
    }));
  }
  if (lang === "ar") {
    return ARABIC_ALPHABET.split("").map((ch, i) => ({
      id: ch,
      chars: ch,
      label: `${ch} = ${i}`,
    }));
  }
  return [
    ...getAlphabetRows("ar"),
    ...ENGLISH_UPPER.split("").map((ch, i) => ({
      id: `en-${ch}`,
      chars: ch,
      label: `${ch} = ${i}`,
    })),
  ];
}

/**
 * @param {string} ch
 * @param {CaesarLanguage} lang
 * @returns {{ alphabet: string, index: number, kind: 'letter'|'other' } | null}
 */
function resolveChar(ch, lang) {
  const ai = ARABIC_ALPHABET.indexOf(ch);
  if (ai >= 0 && (lang === "ar" || lang === "both")) {
    return { alphabet: ARABIC_ALPHABET, index: ai, kind: "letter" };
  }
  const lower = ch.toLowerCase();
  const ei = ENGLISH_LOWER.indexOf(lower);
  if (ei >= 0 && (lang === "en" || lang === "both")) {
    const upper = ch === ch.toUpperCase();
    return {
      alphabet: upper ? ENGLISH_UPPER : ENGLISH_LOWER,
      index: ei,
      kind: "letter",
    };
  }
  return null;
}

/**
 * @param {string} text
 * @param {number} shift
 * @param {{ decode?: boolean, lang?: CaesarLanguage }} [opts]
 */
export function caesarTransform(text, shift, opts = {}) {
  const { decode = false, lang = "both" } = opts;
  const delta = decode ? -shift : shift;
  return String(text || "")
    .split("")
    .map((ch) => {
      const info = resolveChar(ch, lang);
      if (!info) return ch;
      const len = info.alphabet.length;
      const ni = (info.index + delta + len * 1000) % len;
      return info.alphabet[ni];
    })
    .join("");
}

/**
 * @param {string} text
 * @param {number} shift
 * @param {{ decode?: boolean, lang?: CaesarLanguage }} [opts]
 */
export function caesarSteps(text, shift, opts = {}) {
  const { decode = false, lang = "both" } = opts;
  const delta = decode ? -shift : shift;
  const steps = [];

  for (const ch of text) {
    const info = resolveChar(ch, lang);
    if (!info) {
      steps.push({
        original: ch,
        position: null,
        shift: delta,
        newPosition: null,
        result: ch,
        note: "بدون تغيير (مسافة أو علامة ترقيم)",
      });
      continue;
    }
    const len = info.alphabet.length;
    const ni = (info.index + delta + len * 1000) % len;
    steps.push({
      original: ch,
      position: info.index,
      shift: delta,
      newPosition: ni,
      result: info.alphabet[ni],
      note: `${info.index} + ${delta} → ${ni} (مع الالتفاف)`,
    });
  }
  return steps;
}

/** @param {number} shift @param {boolean} [decode] */
export function normalizeShift(shift, decode = false) {
  let s = Number(shift) || 0;
  if (decode) s = -s;
  return s;
}
