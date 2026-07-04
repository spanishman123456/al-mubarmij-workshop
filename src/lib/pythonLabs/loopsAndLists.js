/** محاكاة range و for و while */

export function simulateRange(start, stop, step = 1) {
  const out = [];
  if (step === 0) return { ok: false, error: "zero_step" };
  if (step > 0) {
    for (let i = start; i < stop; i += step) out.push(i);
  } else {
    for (let i = start; i > stop; i += step) out.push(i);
  }
  return { ok: true, values: out };
}

export function simulateForLoop(bodyMultiplier, start, stop, step = 1) {
  const r = simulateRange(start, stop, step);
  if (!r.ok) return r;
  return { ok: true, trace: r.values.map((i) => ({ i, output: i * bodyMultiplier })) };
}

export function simulateWhile(initial, conditionFn, updateFn, maxIter = 1000) {
  let n = initial;
  const trace = [];
  let iter = 0;
  while (conditionFn(n)) {
    if (iter++ >= maxIter) return { ok: false, error: "infinite_loop" };
    trace.push(n);
    n = updateFn(n);
  }
  return { ok: true, trace, final: n };
}

export function listAccess(items, index) {
  if (!Array.isArray(items)) return { ok: false, error: "not_list" };
  if (!Number.isInteger(index)) return { ok: false, error: "index_type" };
  if (index < 0 || index >= items.length) return { ok: false, error: "index_error" };
  return { ok: true, value: items[index] };
}

export function listSet(items, index, value) {
  if (!Array.isArray(items)) return { ok: false, error: "not_list" };
  if (index < 0 || index >= items.length) return { ok: false, error: "index_error" };
  const copy = [...items];
  copy[index] = value;
  return { ok: true, list: copy };
}
