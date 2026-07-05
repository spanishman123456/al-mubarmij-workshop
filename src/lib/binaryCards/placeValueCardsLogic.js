/** Place-value card logic — works for binary [16,8,4,2,1], ternary [81,27,9,3,1], etc. */

export function createCardEngine(cardValues) {
  const values = [...cardValues];

  function initialCardState(allVisible = false) {
    return Object.fromEntries(values.map((v) => [v, allVisible]));
  }

  function toggleCard(state, value) {
    return { ...state, [value]: !state[value] };
  }

  function cardSum(state) {
    return values.filter((v) => state[v]).reduce((s, v) => s + v, 0);
  }

  function visibleCards(state) {
    return values.filter((v) => state[v]);
  }

  function toPlaceString(state) {
    return values.map((v) => (state[v] ? "1" : "0")).join("");
  }

  function cardsForTarget(target) {
    const state = initialCardState(false);
    let remaining = target;
    for (const v of values) {
      if (remaining >= v) {
        state[v] = true;
        remaining -= v;
      }
    }
    return state;
  }

  function checkTarget(state, target) {
    return cardSum(state) === target;
  }

  function parseState(raw) {
    if (!raw) return initialCardState(false);
    if (typeof raw === "object" && !Array.isArray(raw)) return { ...initialCardState(false), ...raw };
    try {
      return { ...initialCardState(false), ...JSON.parse(raw) };
    } catch {
      return initialCardState(false);
    }
  }

  function serializeState(state) {
    return JSON.stringify(state);
  }

  return {
    cardValues: values,
    initialCardState,
    toggleCard,
    cardSum,
    visibleCards,
    toPlaceString,
    cardsForTarget,
    checkTarget,
    parseState,
    serializeState,
  };
}

export const BINARY_CARD_ENGINE = createCardEngine([16, 8, 4, 2, 1]);
export const TERNARY_CARD_ENGINE = createCardEngine([81, 27, 9, 3, 1]);

/** @deprecated use BINARY_CARD_ENGINE */
export const BINARY_CARD_VALUES = BINARY_CARD_ENGINE.cardValues;
export const initialCardState = BINARY_CARD_ENGINE.initialCardState;
export const toggleCard = BINARY_CARD_ENGINE.toggleCard;
export const cardSum = BINARY_CARD_ENGINE.cardSum;
export const visibleCards = BINARY_CARD_ENGINE.visibleCards;
export const toBinaryString = BINARY_CARD_ENGINE.toPlaceString;
export const cardsForTarget = BINARY_CARD_ENGINE.cardsForTarget;
export const checkTarget = BINARY_CARD_ENGINE.checkTarget;
