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
    const info = resolveCharDetailed(ch, lang);
    if (!info) {
      const skipNote =
        lang === "en"
          ? "Not in English A–Z (unchanged)"
          : lang === "ar"
            ? "ليس حرفًا عربيًا (بدون تغيير)"
            : "بدون تغيير (مسافة أو علامة ترقيم أو حرف خارج الأبجدية المختارة)";
      steps.push({
        original: ch,
        position: null,
        shift: delta,
        newPosition: null,
        result: ch,
        note: skipNote,
        explanation: skipNote,
        alphabetType: null,
        wrapped: false,
      });
      continue;
    }
    const len = info.alphabet.length;
    const ni = shiftedIndex(info.index, delta, len);
    const wrapped = didWrap(info.index, delta, len);
    const explanation = buildStepExplanation(
      info.alphabetType,
      ch,
      info.index,
      delta,
      ni,
      info.alphabet[ni],
      wrapped,
    );
    steps.push({
      original: ch,
      position: info.index,
      shift: delta,
      newPosition: ni,
      result: info.alphabet[ni],
      note: `${info.index} + ${delta} → ${ni}${wrapped ? " (wrap)" : ""}`,
      explanation,
      alphabetType: info.alphabetType,
      wrapped,
      positionLabel:
        info.alphabetType === "en"
          ? `${ch.toUpperCase()} = ${info.index}`
          : `${ch} = ${info.index}`,
      resultLabel:
        info.alphabetType === "en"
          ? `${info.alphabet[ni]} = ${ni}`
          : `${info.alphabet[ni]} = ${ni}`,
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

/**
 * @param {number} index
 * @param {number} delta
 * @param {number} len
 */
function shiftedIndex(index, delta, len) {
  return (index + delta + len * 1000) % len;
}

/**
 * @param {number} index
 * @param {number} delta
 * @param {number} len
 */
function didWrap(index, delta, len) {
  const raw = index + delta;
  return raw < 0 || raw >= len;
}

/**
 * @param {'en'|'ar'} alphabetType
 * @param {string} original
 * @param {number} position
 * @param {number} delta
 * @param {number} newPosition
 * @param {string} result
 * @param {boolean} wrapped
 */
function buildStepExplanation(alphabetType, original, position, delta, newPosition, result, wrapped) {
  const sign = delta >= 0 ? "+" : "";
  const wrapNote =
    alphabetType === "en"
      ? wrapped
        ? " — wrap-around (e.g. Z → A)"
        : ""
      : wrapped
        ? " — التفاف عند نهاية الأبجدية"
        : "";

  if (alphabetType === "en") {
    return `${original} (index ${position}) ${sign}${delta} → (${position}${sign}${delta}) mod 26 = ${newPosition} → ${result}${wrapNote}`;
  }
  return `${original} (موضع ${position}) ${sign}${delta} → موضع ${newPosition} → ${result}${wrapNote}`;
}

/**
 * @param {string} ch
 * @param {CaesarLanguage} lang
 * @returns {{ alphabet: string, index: number, kind: 'letter', alphabetType: 'en'|'ar' } | null}
 */
function resolveCharDetailed(ch, lang) {
  const ai = ARABIC_ALPHABET.indexOf(ch);
  if (ai >= 0 && (lang === "ar" || lang === "both")) {
    return { alphabet: ARABIC_ALPHABET, index: ai, kind: "letter", alphabetType: "ar" };
  }
  const lower = ch.toLowerCase();
  const ei = ENGLISH_LOWER.indexOf(lower);
  if (ei >= 0 && (lang === "en" || lang === "both")) {
    const upper = ch === ch.toUpperCase();
    return {
      alphabet: upper ? ENGLISH_UPPER : ENGLISH_LOWER,
      index: ei,
      kind: "letter",
      alphabetType: "en",
    };
  }
  return null;
}
