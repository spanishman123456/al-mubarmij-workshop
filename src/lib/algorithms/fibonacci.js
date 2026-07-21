/** متتالية فيبوناتشي — حلقة وتكرار */

/** @param {number} n */
export function fibIterative(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i += 1) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

/** @param {number} n */
export function fibRecursive(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

/** @param {number} count */
export function fibSequence(count) {
  const n = Math.max(0, Math.floor(count));
  const seq = [];
  for (let i = 0; i < n; i += 1) {
    if (i === 0) seq.push(0);
    else if (i === 1) seq.push(1);
    else seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

/** @param {number[]} seq */
export function nextFibTerm(seq) {
  if (!seq?.length) return 0;
  if (seq.length === 1) return 1;
  return seq[seq.length - 1] + seq[seq.length - 2];
}
