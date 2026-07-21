/** محاكاة رمي النرد — للمختبر والاختبارات */

/** @param {() => number} [rng] */
export function rollDie(rng = Math.random) {
  const r = rng();
  return 1 + Math.floor(r * 6);
}

/** @param {() => number} [rng] */
export function rollTwoDice(rng = Math.random) {
  return [rollDie(rng), rollDie(rng)];
}

export function diceSum(a, b) {
  return a + b;
}

/** @param {number} sum */
export function sumCategory(sum) {
  if (sum <= 6) return "منخفض";
  if (sum <= 9) return "متوسط";
  return "مرتفع";
}
