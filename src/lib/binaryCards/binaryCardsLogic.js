/** Binary unplugged cards — pure logic (16, 8, 4, 2, 1). MSB → LSB left-to-right in LTR row. */

export const BINARY_CARD_VALUES = [16, 8, 4, 2, 1];

export function initialCardState(allVisible = false) {
  return Object.fromEntries(BINARY_CARD_VALUES.map((v) => [v, allVisible]));
}

export function toggleCard(state, value) {
  return { ...state, [value]: !state[value] };
}

export function cardSum(state) {
  return BINARY_CARD_VALUES.filter((v) => state[v]).reduce((s, v) => s + v, 0);
}

export function visibleCards(state) {
  return BINARY_CARD_VALUES.filter((v) => state[v]);
}

export function hiddenCards(state) {
  return BINARY_CARD_VALUES.filter((v) => !state[v]);
}

export function toBinaryString(state) {
  return BINARY_CARD_VALUES.map((v) => (state[v] ? "1" : "0")).join("");
}

export function sumExpression(state) {
  const vis = visibleCards(state);
  if (!vis.length) return "0";
  return vis.join(" + ");
}

export function checkTarget(state, target) {
  return cardSum(state) === target;
}

export function cardsForTarget(target) {
  const state = initialCardState(false);
  let remaining = target;
  for (const v of BINARY_CARD_VALUES) {
    if (remaining >= v) {
      state[v] = true;
      remaining -= v;
    }
  }
  return state;
}

export function getGraduatedHint(target, hintLevel) {
  const solution = cardsForTarget(target);
  const visible = visibleCards(solution);
  if (hintLevel <= 0) {
    const largest = BINARY_CARD_VALUES.find((v) => v <= target);
    return `ابدأ بأكبر بطاقة لا تتجاوز العدد المطلوب (${largest}).`;
  }
  if (hintLevel === 1) {
    return `العدد ${target} يتكون من ${visible.length} بطاقة${visible.length === 1 ? "" : "ات"} ظاهرة.`;
  }
  return `استخدم البطاقات: ${visible.join(" و")}.`;
}

export function getWrongFeedback(state, target) {
  const sum = cardSum(state);
  if (sum === target) return null;
  if (sum > target) {
    const diff = sum - target;
    const extra = visibleCards(state).find((v) => v === diff);
    if (extra) {
      return `مجموع البطاقات الظاهرة حاليًا هو ${sum}، بينما العدد المطلوب هو ${target}. جرّب إخفاء بطاقة قيمتها ${extra}.`;
    }
    return `المجموع ${sum} أكبر من ${target}. أخفِ بطاقة أو أكثر لتقليل المجموع.`;
  }
  const need = target - sum;
  return `تحتاج إلى زيادة المجموع بمقدار ${need}. ابحث عن بطاقة مناسبة لإظهارها.`;
}

export function solutionBinary(target) {
  return toBinaryString(cardsForTarget(target));
}
