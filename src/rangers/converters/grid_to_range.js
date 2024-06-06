// @ts-nocheck

import { columnIndexToLetters_ } from "./index_letter";

/** @typedef {import("../grid").RangeGrid} RangeGrid */

/**
 * @param {RangeGrid} grid
 * @returns {String}
 */
export function getRangeGridByRangeA1_(grid) {
  if (!grid) {
    throw new Error("Grid is required parameter for getting A1-Range");
  }

  let { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex } = grid;

  /**
   * @param {*} val
   */
  function isUndefined_(val) {
    return typeof val === "undefined";
  }

  if (isUndefined_(endRowIndex)) {
    endRowIndex = startRowIndex + 1;
  }
  if (isUndefined_(endColumnIndex)) {
    endColumnIndex = startColumnIndex + 1;
  }

  /**
   * @typedef {Object} GridEnd
   * @prop {Number} row
   * @prop {String} col
   */
  /** @type {GridEnd} */
  const start = {};
  /** @type {GridEnd} */
  const end = {};

  if (!isUndefined_(startColumnIndex)) {
    start.col = columnIndexToLetters_(startColumnIndex);
  } else if (isUndefined_(startColumnIndex) && !isUndefined_(endColumnIndex)) {
    start.col = "A";
  }

  if (!isUndefined_(startRowIndex)) {
    start.row = startRowIndex + 1;
  } else if (isUndefined_(startRowIndex) && !isUndefined_(endRowIndex)) {
    start.row = endRowIndex;
  }
  end.col = columnIndexToLetters_(endColumnIndex - 1);

  end.row = endRowIndex;

  const k = ["col", "row"];
  const st = k.map((e) => start[e]).join("");
  const en = k.map((e) => end[e]).join("");
  const a1Notation = st == en ? st : `${st}:${en}`;
  return a1Notation;
}
