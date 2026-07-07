/** منطق تك-تak-تو — 3×3 */

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** @returns {string[]} */
export function createBoard() {
  return Array(9).fill("");
}

/** @param {string[]} board @param {number} index */
export function isValidMove(board, index) {
  return Number.isInteger(index) && index >= 0 && index < 9 && board[index] === "";
}

/** @param {string[]} board @param {number} index @param {'X'|'O'} player */
export function applyMove(board, index, player) {
  if (!isValidMove(board, index)) return null;
  const next = [...board];
  next[index] = player;
  return next;
}

/** @param {string[]} board @returns {'X'|'O'|'draw'|null} */
export function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  if (board.every((c) => c)) return "draw";
  return null;
}

/** @param {string[]} board @returns {number[]} */
export function emptyCells(board) {
  return board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
}
