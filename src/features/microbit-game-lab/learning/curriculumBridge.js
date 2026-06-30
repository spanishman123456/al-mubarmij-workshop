import { getCurriculumById } from "./curriculum.js";

/** @typedef {import('../types.js').GameId} GameId */

/** Game Lab ID → progress storage ID (backward compatible) */
export const GAME_LEGACY_ID = {
  "guess-number": "guess-number",
  "binary-system": "number-systems",
  cipher: "cipher-message",
  "search-sort": "search-sort",
  "score-counter": "step-counter",
  "logic-gates": "logic-gate",
  "truth-table": "truth-table-sim",
  fibonacci: "fibonacci-microbit",
  hanoi: "hanoi-microbit",
};

/** @param {GameId} gameId */
export function getLegacyProjectId(gameId) {
  return GAME_LEGACY_ID[gameId] ?? gameId;
}

/** @param {GameId} gameId */
export function getCurriculumForGame(gameId) {
  return getCurriculumById(getLegacyProjectId(gameId));
}
