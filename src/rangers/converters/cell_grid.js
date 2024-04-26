import { columnLettersToIndex_ } from "./letter_index";

/**
 * @typedef {Object} CellGrid
 * @property {Number|null} [rowIndex]
 * @property {Number|null} [columnIndex]
 */

/**
 * indexes are zero-based
 *
 * @param {String} a1Notation
 * @returns {CellGrid}
 */
export function cellA1NotationToCellGrid_(a1Notation) {
  const a1 = a1Notation.replace(/\$/g, "").toUpperCase();

  /**
   * @param {String} txt
   * @returns {Number}
   */
  function _row(txt) {
    return parseInt(txt) - 1;
  }

  // column
  if (/^[A-Z]+$/.test(a1)) {
    return {
      columnIndex: columnLettersToIndex_(a1),
    };
  }

  // row
  if (/^\d+$/i.test(a1)) {
    return {
      rowIndex: _row(a1),
    };
  }

  const parts = a1.match(/[A-Z]+|\d+/g);

  return {
    rowIndex: _row(parts[1]),
    columnIndex: columnLettersToIndex_(parts[0]),
  };
}
