/** @typedef {import("../cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/talbler").RangeValues} RangeValues */

/**
 * @param {SheetsValuesColumnCluster} cluster
 * @param {RangeValues} values
 * @param {Number} [maxNonStringStartOffset]
 * @param {Number} [maxPercentStringStartOffset]
 *
 * @returns {Number[]}
 */
export function getColumnValuesClusterPossibleRowsStart_(
  cluster,
  values,
  maxNonStringStartOffset = 0,
  maxPercentStringStartOffset
) {
  const rowsPossibleStart = [];

  if (!cluster) return rowsPossibleStart;

  let endIndex = cluster.start_index + maxNonStringStartOffset;
  if (cluster.string_like_type === "string") {
    // with string type evety cell inside can be a header
    endIndex = cluster.end_index - 1;
    if (maxPercentStringStartOffset > 0) {
      const rowsLen = cluster.end_index - cluster.start_index + 1;
      const stringOffset = Math.floor(rowsLen * maxPercentStringStartOffset);
      const minusOffset = rowsLen - stringOffset;
      let newEnd = cluster.end_index - minusOffset;
      if (newEnd < endIndex && newEnd > cluster.start_index) {
        endIndex = newEnd;
      }
    }
  }

  /**
   * @param {Number} rowIndex
   * @returns {Boolean} stop this function
   *
   */
  function _add_(rowIndex) {
    if (rowIndex >= cluster.start_index) {
      rowsPossibleStart.push(rowIndex);
      return false;
    }
    const value = values[rowIndex][cluster.column_index];
    if (value !== "") return true;
    rowsPossibleStart.push(rowIndex);
    return false;
  }
  // we cannot start data from first row as it should have headers
  // so we loop until index >= 1
  for (let rowIndex = endIndex; rowIndex >= 1; rowIndex--) {
    if (_add_(rowIndex)) return rowsPossibleStart;
  }

  return rowsPossibleStart;
}
