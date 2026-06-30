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
 */

/**
 * @typedef {Object} CodeValidationResult
 * @property {boolean} valid
 * @property {string[]} errors
 * @property {string[]} warnings
 */

export const MGL_MAKECODE_ORIGIN = "https://makecode.microbit.org";
