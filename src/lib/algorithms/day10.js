/** خوارزميات اليوم العاشر: OOP + إخفاء معلومات + نمط متكرر + الخزانة + مثلث باسكال */

/** @param {number} radius */
export function circleArea(radius) {
  const r = Number(radius);
  if (!Number.isFinite(r) || r < 0) return 0;
  return Math.PI * r * r;
}

/** @param {number} side */
export function squareArea(side) {
  const s = Number(side);
  if (!Number.isFinite(s) || s < 0) return 0;
  return s * s;
}

/** @param {number} count */
export function lockerOpenNumbers(count) {
  const n = Math.max(0, Math.floor(Number(count)));
  const out = [];
  for (let k = 1; k * k <= n; k += 1) out.push(k * k);
  return out;
}

/** @param {number} rowIndex */
export function pascalRow(rowIndex) {
  const n = Math.max(0, Math.floor(Number(rowIndex)));
  let row = [1];
  for (let i = 1; i <= n; i += 1) {
    const next = [1];
    for (let j = 1; j < row.length; j += 1) next.push(row[j - 1] + row[j]);
    next.push(1);
    row = next;
  }
  return row;
}

/** @param {number} depth */
export function fractalTreeSegmentCount(depth) {
  const d = Math.max(0, Math.floor(Number(depth)));
  return 2 ** (d + 1) - 1;
}

/** @param {string} carrier */
export function extractStegoBits(carrier) {
  const chars = Array.from(String(carrier || ""));
  const bits = [];
  for (const c of chars) {
    if (!/[a-zA-Z]/.test(c)) continue;
    bits.push(c === c.toLowerCase() ? "1" : "0");
  }
  return bits.join("");
}

/** @param {string} bits */
export function bitsToAscii(bits) {
  const clean = String(bits || "").replace(/[^01]/g, "");
  let out = "";
  for (let i = 0; i + 7 < clean.length; i += 8) {
    const byte = clean.slice(i, i + 8);
    const code = Number.parseInt(byte, 2);
    if (code === 0) break;
    out += String.fromCharCode(code);
  }
  return out;
}

export const DAY10_CHALLENGES = {
  oop: [
    { id: "oop-area-circle-3", promptAr: "مساحة دائرة نصف قطرها 3 (قرّب إلى منزلتين)", expected: "28.27" },
    { id: "oop-area-square-5", promptAr: "مساحة مربع ضلعه 5", expected: "25" },
  ],
  stego: [
    {
      id: "stego-msg-1",
      promptAr: "استخرج الرسالة من البتات: 01010100 01100101 01100001 01100011 01101000 00000000",
      expected: "Teach",
    },
    {
      id: "stego-locker",
      promptAr: "أي عامل بايثون يُستخدم في أمثلة اليوم العاشر لدمج البتات؟",
      expected: "|",
    },
  ],
  fractal: [
    { id: "fractal-depth-2", promptAr: "شجرة متكررة بعمق 2 — كم قطعة رسم تقريبًا؟", expected: "7" },
    { id: "fractal-depth-4", promptAr: "شجرة متكررة بعمق 4 — كم قطعة رسم تقريبًا؟", expected: "31" },
  ],
  locker: [
    { id: "locker-10", promptAr: "في مشكلة الخزانة حتى 10 خزائن، ما أرقام الخزائن المفتوحة؟", expected: "1,4,9" },
    { id: "pascal-row-4", promptAr: "صف باسكال رقم 4", expected: "1,4,6,4,1" },
  ],
};

/** @param {string} id @param {string|number} answer */
export function checkDay10Answer(id, answer) {
  const raw = String(answer ?? "").trim();
  const compact = raw.replace(/\s+/g, "");
  const norm = compact.toLowerCase();
  const numeric = Number(raw);
  switch (id) {
    case "oop-area-circle-3":
      return Math.abs(numeric - circleArea(3)) < 0.02;
    case "oop-area-square-5":
      return numeric === squareArea(5);
    case "stego-msg-1":
      return norm === "teach";
    case "stego-locker":
      return raw === "|" || norm === "or" || norm === "bitwiseor";
    case "fractal-depth-2":
      return numeric === fractalTreeSegmentCount(2);
    case "fractal-depth-4":
      return numeric === fractalTreeSegmentCount(4);
    case "locker-10":
      return compact === "1,4,9" || compact === "1-4-9";
    case "pascal-row-4":
      return compact === "1,4,6,4,1" || compact === "1-4-6-4-1";
    default:
      return false;
  }
}
