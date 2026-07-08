/**
 * مكمل العدد 2 — تمثيل الأعداد السالبة
 */

export function toBinaryUnsigned(n, bits) {
  if (n < 0) return { ok: false, error: "negative" };
  let x = n;
  const arr = [];
  for (let i = 0; i < bits; i++) {
    arr.unshift(x % 2);
    x = Math.floor(x / 2);
  }
  if (x > 0) return { ok: false, error: "overflow" };
  return { ok: true, bits: arr.join("") };
}

export function flipBits(bitStr) {
  return bitStr
    .split("")
    .map((b) => (b === "0" ? "1" : "0"))
    .join("");
}

export function addOneBinary(bitStr) {
  const arr = bitStr.split("");
  let carry = 1;
  for (let i = arr.length - 1; i >= 0 && carry; i--) {
    if (arr[i] === "0") {
      arr[i] = "1";
      carry = 0;
    } else {
      arr[i] = "0";
    }
  }
  if (carry) return { ok: false, error: "overflow" };
  return { ok: true, bits: arr.join("") };
}

/** n signed → twos complement in `bits` bits */
export function toTwosComplement(n, bits) {
  if (bits < 2) return { ok: false, error: "bits_too_small" };
  if (n >= 0) {
    const r = rangeForBits(bits);
    if (n > r.max) return { ok: false, error: "overflow" };
    const u = toBinaryUnsigned(n, bits);
    if (!u.ok) return u;
    return { ok: true, bits: u.bits, steps: ["positive: direct binary"] };
  }
  const abs = toBinaryUnsigned(-n, bits);
  if (!abs.ok) return abs;
  const flipped = flipBits(abs.bits);
  const plus1 = addOneBinary(flipped);
  if (!plus1.ok) return plus1;
  return {
    ok: true,
    bits: plus1.bits,
    steps: ["abs binary", "flip bits", "add 1"],
  };
}

export function fromTwosComplement(bitStr) {
  const s = String(bitStr).replace(/\s/g, "");
  if (!/^[01]+$/.test(s)) return { ok: false, error: "invalid" };
  const msb = s[0];
  if (msb === "0") {
    return { ok: true, value: parseInt(s, 2), positive: true };
  }
  const flipped = flipBits(s);
  const plus1 = addOneBinary(flipped);
  if (!plus1.ok) return plus1;
  const mag = parseInt(plus1.bits, 2);
  return { ok: true, value: -mag, positive: false };
}

export function subtractViaTwosComplement(a, b, bits) {
  const left = toTwosComplement(a, bits);
  const rightNeg = toTwosComplement(-b, bits);
  if (!left.ok) return left;
  if (!rightNeg.ok) return rightNeg;
  const sum = addBinaryFixed(left.bits, rightNeg.bits);
  if (!sum.ok) return sum;
  const signed = fromTwosComplement(sum.bits);
  return {
    ok: true,
    bits: sum.bits,
    value: signed.value,
    carryOut: sum.carryOut,
    discardedCarry: sum.carryOut,
    overflow: detectOverflow(a, -b, bits),
  };
}

function addBinaryFixed(a, b) {
  const max = Math.max(a.length, b.length);
  const da = a.padStart(max, "0").split("").reverse();
  const db = b.padStart(max, "0").split("").reverse();
  let carry = 0;
  const out = [];
  let carryIntoMsb = 0;
  for (let i = 0; i < max; i++) {
    if (i === max - 1) carryIntoMsb = carry;
    const s = Number(da[i]) + Number(db[i]) + carry;
    out.push(String(s % 2));
    carry = Math.floor(s / 2);
  }
  const bits = out.reverse().join("");
  const carryOut = carry;
  return {
    ok: true,
    bits,
    carryOut,
    carryIntoMsb,
    overflowByCarries: carryIntoMsb !== carryOut,
  };
}

export function rangeForBits(bits) {
  const maxPos = Math.pow(2, bits - 1) - 1;
  const minNeg = -Math.pow(2, bits - 1);
  return { min: minNeg, max: maxPos };
}

export function detectOverflow(a, b, bits) {
  const r = rangeForBits(bits);
  const sum = a + b;
  return sum > r.max || sum < r.min;
}
