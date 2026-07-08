export function validateAlgorithmStepOrder(pool, order, selected, correct) {
  const selectedSet = selected instanceof Set ? selected : new Set(selected || []);
  const picked = (order || []).filter((i) => selectedSet.has(i)).map((i) => pool[i]);
  const ok = picked.length === correct.length && picked.every((s, i) => s === correct[i]);
  return { ok, picked };
}
