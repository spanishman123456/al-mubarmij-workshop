/** منطق برج هانوي — التحقق من الحركات والتقييم */

/**
 * @param {number[][]} towers
 * @param {number} from
 * @param {number} to
 * @returns {{ ok: true, disk: number } | { ok: false, reason: string }}
 */
export function validateHanoiMove(towers, from, to) {
  if (from === to) return { ok: false, reason: "اختر عمودًا مختلفًا للنقل." };
  if (from < 0 || to < 0 || from > 2 || to > 2) {
    return { ok: false, reason: "عمود غير صالح." };
  }
  const fromStack = towers[from];
  if (!fromStack?.length) {
    return { ok: false, reason: "لا يوجد قرص في هذا العمود." };
  }
  const disk = fromStack[fromStack.length - 1];
  const destTop = towers[to][towers[to].length - 1];
  if (destTop !== undefined && disk > destTop) {
    return { ok: false, reason: "لا يمكن وضع قرص أكبر فوق قرص أصغر." };
  }
  return { ok: true, disk };
}

/** @param {number[][]} towers @param {number} from @param {number} to */
export function applyHanoiMove(towers, from, to) {
  const check = validateHanoiMove(towers, from, to);
  if (!check.ok) return { ok: false, reason: check.reason, towers };
  const next = towers.map((col) => [...col]);
  const disk = next[from].pop();
  if (disk === undefined) return { ok: false, reason: "خطأ غير متوقع.", towers };
  next[to].push(disk);
  return { ok: true, disk, towers: next };
}

/** @param {number} n @param {number} [from] @param {number} [to] @param {number} [aux] @param {{ disk: number, from: number, to: number }[]} [moves] */
export function generateOptimalMoves(n, from = 0, to = 2, aux = 1, moves = []) {
  if (n <= 0) return moves;
  if (n === 1) {
    moves.push({ disk: 1, from, to });
    return moves;
  }
  generateOptimalMoves(n - 1, from, aux, to, moves);
  moves.push({ disk: n, from, to });
  generateOptimalMoves(n - 1, aux, to, from, moves);
  return moves;
}

/** @param {number} diskCount */
export function createInitialTowers(diskCount) {
  const towers = [[], [], []];
  for (let d = diskCount; d >= 1; d -= 1) towers[0].push(d);
  return towers;
}

/** @param {number[][]} towers @param {number} diskCount */
export function isHanoiSolved(towers, diskCount) {
  const target = towers[2];
  if (target.length !== diskCount) return false;
  for (let i = 0; i < diskCount; i += 1) {
    if (target[i] !== i + 1) return false;
  }
  return true;
}

/** @param {number} moves @param {number} diskCount @param {number} wrongAttempts @param {number} elapsedMs */
export function scoreHanoiAttempt(moves, diskCount, wrongAttempts, elapsedMs) {
  const optimal = 2 ** diskCount - 1;
  const moveScore = Math.max(0, 100 - Math.max(0, moves - optimal) * 8);
  const wrongScore = Math.max(0, 100 - wrongAttempts * 12);
  const timeScore = Math.max(0, 100 - Math.floor(elapsedMs / 60000) * 5);
  const total = Math.round((moveScore + wrongScore + timeScore) / 3);
  let grade = "جيد";
  if (total >= 90) grade = "ممتاز";
  else if (total >= 75) grade = "جيد جدًا";
  else if (total >= 55) grade = "مقبول";
  else grade = "يحتاج تحسين";
  return { optimal, moveScore, wrongScore, timeScore, total, grade };
}

export const HANOI_COLUMNS = ["A", "B", "C"];
