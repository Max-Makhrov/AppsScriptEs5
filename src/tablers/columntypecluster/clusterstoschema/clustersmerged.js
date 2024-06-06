import { mergeColumnValuesClusters_ } from "./mergeclusters";

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/tablers/columntypecluster/fits/getfitclustersoptions").FitColumnValuesClustersInfo} FitColumnValuesClustersInfo */

/**
 * @param {SheetsValuesColumnCluster[]} clusters
 * @param {Number} rowNum
 * @param {SheetsValuesColumnCluster[][]} allClusters
 *
 * @returns {SheetsValuesColumnCluster[]} last_row
 */
export function getGridValuesClustersMerged_(clusters, rowNum, allClusters) {
  const result = [];

  /**
   * @param {SheetsValuesColumnCluster[]} clustersColumn
   * @param {Number} position
   *
   * @returns    {SheetsValuesColumnCluster|null}
   */
  function _getNextCluster_(clustersColumn, position) {
    const next = clustersColumn[position];
    if (!next) return null;
    if (next.start_index > rowNum) return null;
    return next;
  }
  /**
   * @param {SheetsValuesColumnCluster} cluster
   * @returns {SheetsValuesColumnCluster}
   */
  function _getMerged_(cluster) {
    if (cluster.end_index >= rowNum) return cluster;
    const clustersColumn = allClusters[cluster.column_index];
    let stop = false;
    let clusters = [cluster];
    let indexNext = cluster.position + 1; // next cluster
    let next = null;
    while (!stop) {
      next = _getNextCluster_(clustersColumn, indexNext);
      if (next) {
        clusters.push(next);
      } else {
        stop = true;
      }
      indexNext++;
    }
    if (clusters.length === 1) return cluster;
    return mergeColumnValuesClusters_(clusters);
  }

  clusters.forEach((cls) => {
    const merged = _getMerged_(cls);
    result.push(merged);
  });

  return result;
}
