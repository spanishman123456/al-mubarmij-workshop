import { HARDWARE_DRIVER } from "../hardware/hardwareDriver.js";
import { assertValidMakeCodePython } from "../hardware/validateCode.js";
import { GAME_LOGIC } from "./gameLogic.js";

/** @typedef {import('../types.js').GameId} GameId */

/**
 * Game Engine Layer — توليد كود MakeCode Python مع validation إلزامي
 * @param {GameId} gameId
 */
export function generateGameCode(gameId) {
  const logic = GAME_LOGIC[gameId];
  if (!logic) {
    throw new Error(`Unknown game: ${gameId}`);
  }
  const full = `${HARDWARE_DRIVER}\n# Game: ${gameId}\n${logic.trim()}\n`;
  assertValidMakeCodePython(full, `game:${gameId}`);
  return full;
}
