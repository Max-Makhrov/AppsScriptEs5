/** @typedef {import("@/rangers/grid").RangeGrid} RangeGrid */
/** @typedef {import("../fits/richheaders").RichColumnValuesHeader} RichColumnValuesHeader */

/**
 * @param {RichColumnValuesHeader[]} headers
 *
 * @returns {RangeGrid[]}
 */
export function getValuesheaderHeadersRangeGrids_(headers) {
  if (!headers) return [];
  if (!headers.length) return [];
  headers.sort((a, b) => {
    return a.column_index - b.column_index;
  });

  const rowStart = headers[0].row_index;
  const rowEnd = rowStart;

  /**
   * @param {RichColumnValuesHeader} header
   * @returns {RangeGrid}
   */
  function _get_(header) {
    return {
      startRowIndex: rowStart,
      startColumnIndex: header.column_index,
      endRowIndex: rowEnd + 1,
      endColumnIndex: header.column_index + 1,
    };
  }

  /** @type {RangeGrid[]} */
  const grids = [];
  let fromIndex = 0;

  /**
   * @param {RangeGrid} grid
   */
  function _populate_(grid) {
    grids.push(grid);
  }

  /**
   * @param {RichColumnValuesHeader} header
   * @param {Number} index
   */
  function _add_(header, index) {
    const isLast = index === headers.length - 1;
    if (isLast && index === 0) {
      _populate_(_get_(header));
      return;
    }
    if (index === 0) return;
    let grid0 = null;
    if (header.column_index - headers[index - 1].column_index > 1) {
      grid0 = _get_(headers[fromIndex]);
      grid0.endColumnIndex += index - fromIndex - 1;
      _populate_(grid0);
      fromIndex = index;
    }
    if (isLast) {
      if (grid0) {
        // already have break
        _populate_(_get_(header));
        return;
      }
      grid0 = _get_(headers[fromIndex]);
      grid0.endColumnIndex += index - fromIndex;
      _populate_(grid0);
    }
  }

  headers.forEach(_add_);

  return grids;
}
