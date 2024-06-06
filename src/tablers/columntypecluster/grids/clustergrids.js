/** @typedef {import("@/rangers/grid").RangeGrid} RangeGrid */
/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @param {SheetsValuesColumnCluster[]} clusters
 * @param {Number} rowStart
 * @param {Number} rowEnd
 * @param {Number[]} [missingRows]
 *
 * @returns {RangeGrid[]}
 */
export function getValuesClustersRangeGrids_(
  clusters,
  rowStart,
  rowEnd,
  missingRows
) {
  clusters.sort((a, b) => {
    return a.column_index - b.column_index;
  });

  /**
   * @param {Number} startRow
   * @param {Number} endRow
   * @parm {Number[]} [skipRows]
   *
   * @returns {Number[][]}
   */
  function _getStartEndPairs_(startRow, endRow, skipRows) {
    if (!skipRows) {
      return [[startRow, endRow]];
    }
    // Sort the skipRows array to ensure it is in ascending order
    skipRows.sort((a, b) => a - b);

    const pairs = [];
    let currentStart = startRow;

    for (let i = startRow; i <= endRow; i++) {
      // If the current row should be skipped
      if (skipRows.includes(i)) {
        if (i - 1 >= currentStart) {
          pairs.push([currentStart, i - 1]);
        }
        currentStart = i + 1;
      }
    }

    // Add the last segment if there's any remaining
    if (currentStart <= endRow) {
      pairs.push([currentStart, endRow]);
    }

    return pairs;
  }

  const rowIslands = _getStartEndPairs_(rowStart, rowEnd, missingRows);

  /**
   * @param {SheetsValuesColumnCluster} cluster
   * @returns {RangeGrid}
   */
  function _get_(cluster) {
    return {
      startRowIndex: rowStart,
      startColumnIndex: cluster.column_index,
      endRowIndex: rowEnd + 1,
      endColumnIndex: cluster.column_index + 1,
    };
  }

  /** @type {RangeGrid[]} */
  const grids = [];
  let fromIndex = 0;

  /**
   * @param {RangeGrid} grid
   */
  function _populate_(grid) {
    rowIslands.forEach((i) => {
      /** @type {RangeGrid} */
      const g = {
        startColumnIndex: grid.startColumnIndex,
        endColumnIndex: grid.endColumnIndex,
        startRowIndex: i[0],
        endRowIndex: i[1] + 1,
      };
      grids.push(g);
    });
  }

  /**
   * @param {SheetsValuesColumnCluster} cluster
   * @param {Number} index
   */
  function _add_(cluster, index) {
    const isLast = index === clusters.length - 1;
    if (isLast && index === 0) {
      _populate_(_get_(cluster));
      return;
    }
    if (index === 0) return;
    let grid0 = null;
    if (cluster.column_index - clusters[index - 1].column_index > 1) {
      grid0 = _get_(clusters[fromIndex]);
      grid0.endColumnIndex += index - fromIndex - 1;
      _populate_(grid0);
      fromIndex = index;
    }
    if (isLast) {
      if (grid0) {
        // already have break
        _populate_(_get_(cluster));
        return;
      }
      grid0 = _get_(clusters[fromIndex]);
      grid0.endColumnIndex += index - fromIndex;
      _populate_(grid0);
    }
  }

  clusters.forEach(_add_);

  return grids;
}
