import { columnIndexToLetters_ } from "../converters/index_letter";

/** @typedef {import("../grid").RangeGrid} RangeGrid */
/** @typedef {import("../validator").BasicValidation} BasicValidation */
/** @typedef {import("../validators/grid_measure").RangeGridMeasure} RangeGridMeasure */

/**
 * @param {RangeGrid} grid
 * @param {RangeGridMeasure} measures
 *
 * @returns {BasicValidation}
 */
export function validateRangeGrid_(grid, measures) {
  const numMaxColumns = 18278;
  const numMaxCells = Math.pow(10, 7);

  /**
   * @param {String} message
   * @returns {BasicValidation}
   */
  function _invalid(message) {
    return {
      is_valid: false,
      message,
    };
  }

  if (measures.num_columns === null && measures.num_rows === null) {
    return _invalid("Range must have last row or last column");
  }

  let numCells = 0;
  let message = "";
  const responses = {
    cells: `Sheet cannot have more than ${numMaxCells} cells`,
    columns: `Sheet cannot have more than ${numMaxColumns}(${columnIndexToLetters_(
      numMaxColumns - 1
    )}) columns`,
  };

  // C2:50
  if (measures.num_columns === null) {
    numCells = grid.endRowIndex * (grid.startColumnIndex + 1);
    if (numCells > numMaxCells) {
      message =
        "The last row " +
        grid.endRowIndex +
        " multiplied by the first column " +
        (grid.startColumnIndex + 1) +
        `(${columnIndexToLetters_(grid.startColumnIndex)})` +
        " gave " +
        numCells +
        " cells. " +
        responses.cells;
      return _invalid(message);
    }
    if (grid.startColumnIndex + 1 > numMaxColumns) {
      message =
        "The first column '" +
        columnIndexToLetters_(grid.startColumnIndex) +
        " reached the limit. " +
        responses.columns;
      return _invalid(message);
    }
  }

  // H2:J
  if (measures.num_rows === null) {
    numCells = grid.endColumnIndex * (grid.startRowIndex + 1);
    if (numCells > numMaxCells) {
      message =
        "The first row " +
        (grid.startRowIndex + 1) +
        " multiplied by the last column " +
        columnIndexToLetters_(grid.endColumnIndex - 1) +
        ` (${grid.endColumnIndex})` +
        " gave " +
        numCells +
        " cells. " +
        responses.cells;
      return _invalid(message);
    }
    if (grid.endColumnIndex > numMaxColumns) {
      message =
        "The last column " +
        columnIndexToLetters_(grid.endColumnIndex - 1) +
        `(${grid.endColumnIndex})` +
        " reached the limit. " +
        responses.columns;
      return _invalid(message);
    }
  }

  numCells = grid.endColumnIndex * grid.endRowIndex;
  if (numCells > numMaxCells) {
    message =
      "The last row " +
      grid.endRowIndex +
      " multiplied by the last column " +
      grid.endColumnIndex +
      `(${columnIndexToLetters_(grid.endColumnIndex - 1)})` +
      " gave " +
      numCells +
      " cells. " +
      responses.cells;
    if (measures.cells_type === "cell") {
      message =
        "Cell is outside the bounds. The cell row " +
        grid.endRowIndex +
        " multiplied by the cell column " +
        grid.endColumnIndex +
        `(${columnIndexToLetters_(grid.endColumnIndex - 1)})` +
        " gave " +
        numCells +
        " cells. " +
        responses.cells;
    }
    return _invalid(message);
  }

  if (grid.endColumnIndex > numMaxColumns) {
    message =
      (measures.cells_type === "cell"
        ? "The cell column "
        : "The range column ") +
      columnIndexToLetters_(grid.endColumnIndex - 1) +
      " of index " +
      grid.endColumnIndex +
      " reached the limit. " +
      responses.columns;
    return _invalid(message);
  }

  return {
    is_valid: true,
    message: "ok",
  };
}
