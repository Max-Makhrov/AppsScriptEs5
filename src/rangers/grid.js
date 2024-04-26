import { cellA1NotationToCellGrid_ } from "./converters/cell_grid";
import { cellGridsToRangeGrid_ } from "./converters/cells_range_grid";

/**
 * @typedef {Object} RangeGrid
 * @property {Number} startRowIndex
 * @property {Number} [endRowIndex] 1-based
 * @property {Number} startColumnIndex
 * @property {Number} [endColumnIndex] 1-based
 */

/** @typedef {import("./validator").RangeValidator_} RangeValidator_ */

/**
 * start row/column indexes are 0-based
 * end row/column indexes are 1-based
 *
 * @param {RangeValidator_} validator
 * @returns {RangeGrid|null}
 */
export function getValidatedRangeA1GridByRanger_(validator) {
  const rangA1Validation = validator.rangeValidate();
  if (!rangA1Validation.is_valid) {
    return null;
  }

  const cells = validator.range_a1.split(":");
  const cellGrid1 = cellA1NotationToCellGrid_(cells[0]);

  /**
   * @param {RangeGrid} grid
   * @returns {RangeGrid|null}
   */
  function _return(grid) {
    const validation = validator.gridValidate(grid);
    if (validation.is_valid === false) {
      return null;
    }
    return grid;
  }

  /** @type RangeGrid */
  // single cell
  let grid;
  if (!cells[1]) {
    grid = {
      startRowIndex: cellGrid1.rowIndex,
      startColumnIndex: cellGrid1.columnIndex,
      endRowIndex: cellGrid1.rowIndex + 1,
      endColumnIndex: cellGrid1.columnIndex + 1,
    };
    return _return(grid);
  }

  const cellGrid2 = cellA1NotationToCellGrid_(cells[1]);
  grid = cellGridsToRangeGrid_(cellGrid1, cellGrid2);
  return _return(grid);
}
