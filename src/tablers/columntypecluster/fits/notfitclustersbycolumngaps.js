/** @typedef {import("./getclustersrowfit").ClustersRowStartsFitCheckResponse} ClustersRowStartsFitCheckResponse */
/** @typedef {import("../cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @param {ClustersRowStartsFitCheckResponse} fittingInfo
 * @param {SheetsValuesColumnCluster} masterCluster
 * @param {Number} maxColumnGap
 *
 * @returns {ClustersRowStartsFitCheckResponse}
 */
export function reduceFittingClustersByMaxColumnGap_(
  fittingInfo,
  masterCluster,
  maxColumnGap
) {
  if (!masterCluster) return null;
  const fittingClusters = [];
  const possibleRows = [];

  const startingColumn = masterCluster.column_index;
  const allColumns = fittingInfo.clusters_rows_fit.map(
    (cls) => cls.column_index
  );

  const correctColumnIndexes = [];
  let gap = 0;
  /**
   * @param {Number} columnIndex
   * @returns {Boolean} break
   */
  function _break_(columnIndex) {
    gap++;
    if (allColumns.indexOf(columnIndex) > -1) {
      gap = 0;
      correctColumnIndexes.push(columnIndex);
    }
    if (gap > maxColumnGap) return true;
    return false;
  }
  for (let i = startingColumn - 1; i >= 0; i--) {
    if (_break_(i)) break;
  }
  gap = 0;
  for (let i = startingColumn + 1; i <= Math.max(...allColumns); i++) {
    if (_break_(i)) break;
  }

  fittingInfo.clusters_rows_fit.forEach((cls, i) => {
    if (correctColumnIndexes.indexOf(cls.column_index) === -1) return;
    fittingClusters.push(cls);
    possibleRows.push(fittingInfo.possible_rows_map[i]);
  });

  return {
    clusters_rows_fit: fittingClusters,
    possible_rows_map: possibleRows,
  };
}
