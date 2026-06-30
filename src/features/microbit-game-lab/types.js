/** @typedef {'guess-number'|'binary-system'|'cipher'|'search-sort'|'score-counter'|'logic-gates'|'truth-table'|'fibonacci'|'hanoi'} GameId */

/**
 * @typedef {Object} MglGame
 * @property {GameId} id
 * @property {string} title
 * @property {string} icon
 * @property {string} objective
 * @property {string[]} concepts
 * @property {string} controls
 * @property {string} description
 * @property {string} [hexPath]
 */

/**
 * @typedef {Object} CodeValidationResult
 * @property {boolean} valid
 * @property {string[]} errors
 * @property {string[]} warnings
 */

export const MGL_MAKECODE_ORIGIN = "https://makecode.microbit.org";

export const MGL_HARDWARE = {
  UP: 0,
  DOWN: 1,
  OK: 2,
  BACK: 8,
  LED_GREEN: 12,
  LED_RED: 16,
  SWITCH_A: 13,
  SWITCH_B: 14,
  LCD_SDA: 20,
  LCD_SCL: 19,
};
