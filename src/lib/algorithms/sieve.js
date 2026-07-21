function toSafeInteger(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export function sievePrimesUpTo(limit) {
  const max = toSafeInteger(limit);
  if (max < 2) {
    return {
      limit: max,
      primes: [],
      steps: [{ prime: null, crossedOut: [], messageAr: "لا توجد أعداد أولية أقل من 2." }],
      marks: Array.from({ length: max + 1 }, () => false),
    };
  }

  const marks = Array.from({ length: max + 1 }, () => true);
  marks[0] = false;
  marks[1] = false;
  const steps = [];

  for (let p = 2; p * p <= max; p += 1) {
    if (!marks[p]) continue;
    const crossedOut = [];
    for (let multiple = p * p; multiple <= max; multiple += p) {
      if (marks[multiple]) {
        marks[multiple] = false;
        crossedOut.push(multiple);
      }
    }
    steps.push({
      prime: p,
      crossedOut,
      messageAr:
        crossedOut.length > 0
          ? `نثبت أن ${p} أولي ثم نحذف مضاعفاته: ${crossedOut.join("، ")}.`
          : `العدد ${p} أولي ولا توجد مضاعفات جديدة للحذف.`,
    });
  }

  const primes = [];
  for (let i = 2; i <= max; i += 1) {
    if (marks[i]) primes.push(i);
  }

  if (!steps.length) {
    steps.push({
      prime: 2,
      crossedOut: [],
      messageAr: "المجال صغير؛ الأعداد الأولية تُحدَّد مباشرة.",
    });
  }

  return { limit: max, primes, steps, marks };
}
