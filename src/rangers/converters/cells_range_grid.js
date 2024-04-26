/** @typedef {import("./cell_grid").CellGrid} CellGrid */
/** @typedef {import("../grid").RangeGrid} RangeGrid */

/**
 * @param {CellGrid} c1
 * @param {CellGrid} c2
 *
 * @returns {RangeGrid}
 */
export function cellGridsToRangeGrid_(c1, c2) {
  // swap rows
  const row1 = c1.rowIndex;
  const row2 = c2.rowIndex;
  if (row1 > row2) {
    c1.rowIndex = row2;
    c2.rowIndex = row1;
  }

  // swap columns
  const col1 = c1.columnIndex;
  const col2 = c2.columnIndex;
  if (col1 > col2) {
    c1.columnIndex = col2;
    c2.columnIndex = col1;
  }

  const endColumnIndex = c2.columnIndex + 1 || null;
  const endRowIndex = c2.rowIndex + 1 || null;

  /** @type {RangeGrid} */
  const result = {
    startColumnIndex: c1.columnIndex,
    startRowIndex: c1.rowIndex,  
    endColumnIndex: undefined,
    endRowIndex: undefined
  };

  if (endColumnIndex !== null) result.endColumnIndex = endColumnIndex;
  if (endRowIndex !== null) result.endRowIndex = endRowIndex;

  return result;
}
