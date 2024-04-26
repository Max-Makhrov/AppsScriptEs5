/** @typedef {import("../grid").RangeGrid} RangeGrid */

/**
 * @typedef {Object} RangeGridMeasure
 * @prop {Number|null} num_rows
 * @prop {Number|null} num_columns
 * @prop {RangeA1EndType} end_type
 * @prop {RangeA1CellsType} cells_type
 * @prop {RangeA1Orientation} orientation
 */

/** @typedef {'open' | 'closed'} RangeA1EndType */
/** @typedef {'cell' | 'range' | 'line'} RangeA1CellsType */
/** @typedef {'vertical' | 'horizontal' | 'none'} RangeA1Orientation */

/**
 * @param {RangeGrid} grid
 *
 * @returns {RangeGridMeasure}
 */
export function getGridA1Measures_(grid) {
  let numRows = null;
  if (grid.endRowIndex) {
    numRows = grid.endRowIndex - grid.startRowIndex;
  }
  let numColumns = null;
  if (grid.endColumnIndex) {
    numColumns = grid.endColumnIndex - grid.startColumnIndex;
  }
  /** @type RangeA1CellsType */
  let cellsType = "cell";
  /** @type RangeA1EndType */
  let endType = "closed";
  /** @type RangeA1Orientation */
  let orientation = "none";

  if (!numRows || !numColumns) {
    cellsType = "line";
    endType = "open";
  } else if (numRows === 1 && numColumns === 1) {
    cellsType = "cell";
  } else if (numColumns > 1 && numRows > 1) {
    cellsType = "range";
  } else {
    cellsType = "line";
  }

  if (!numRows && !numColumns) {
    orientation = "none";
  } else if (!numRows) {
    orientation = "vertical";
  } else if (!numColumns) {
    orientation = "horizontal";
  } else if (numRows > numColumns) {
    orientation = "vertical";
  } else if (numRows < numColumns) {
    orientation = "horizontal";
  } else {
    orientation = "none";
  }

  return {
    num_rows: numRows,
    num_columns: numColumns,
    cells_type: cellsType,
    end_type: endType,
    orientation,
  };
}
