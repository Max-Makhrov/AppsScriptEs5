import { check2ClustersRowsFit_ } from "./checkclustersrowfit";
import { getDedupedFitColumnValuesCluaters_ } from "./dedupefitclusters";

/** @typedef {import("./getfitclustersoptions").FitColumnValuesClustersInfo} FitColumnValuesClustersInfo */
/** @typedef {import("../cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/**
 * @typedef {Object} ClustersRowStartsFitCheckResponse
 * @prop {SheetsValuesColumnCluster[]} clusters_rows_fit
 * @prop {Number[][]} possible_rows_map
 */

/**
 * @param {FitColumnValuesClustersInfo} info
 *
 * @returns {ClustersRowStartsFitCheckResponse}
 */
export function getColumnValueClustersRowFit_(info) {
  const clusters = [];
  const rows = [];

  /**
   * @param {SheetsValuesColumnCluster} cluster
   */
  function _addFittingCluster_(cluster) {
    if (cluster.column_index === info.master_cluster.column_index) {
      // do not check master cluster column
      return;
    }
    const test = check2ClustersRowsFit_(info, cluster);
    if (!test.fits) return;
    clusters.push(cluster);
    // @ts-ignore
    rows.push(test.rows_possible_start);
  }

  for (let i = 0; i < info.clusters.length; i++) {
    for (let ii = 0; ii < info.clusters[i].length; ii++) {
      _addFittingCluster_(info.clusters[i][ii]);
    }
  }

  const rowsFit = {
    clusters_rows_fit: clusters,
    possible_rows_map: rows,
  };
  return rowsFit;
}
