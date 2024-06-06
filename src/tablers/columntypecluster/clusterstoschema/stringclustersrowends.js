import { mergeColumnValuesClusters_ } from "./mergeclusters";
/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @typedef {Object} LastValuesClusterRowResponse
 * @prop {SheetsValuesColumnCluster[]} matching_clusters - some clusters are merged or cropeed
 * @prop {Number} last_row
 */

/**
 * If all cluster columns are strings
 * @param {SheetsValuesColumnCluster[]} fitClusters
 * @param {SheetsValuesColumnCluster[][]} clustersMap
 *
 * @returns {LastValuesClusterRowResponse} last_row
 */
export function getStringsValuesClustersLastDataRow_(fitClusters, clustersMap) {
  const mergedClusters = [];

  fitClusters.forEach((cl) => {
    const columnIndex = cl.column_index;
    const position = cl.position;
    const otherClusters = clustersMap[columnIndex].filter((cl) => {
      return cl.position >= position;
    });
    if (otherClusters.length === 0) {
      throw new Error(
        "Programm logic error. No clusters found for set indexes"
      );
    }
    const merged = mergeColumnValuesClusters_(otherClusters);
    mergedClusters.push(merged);
  });

  let maxEnd = mergedClusters.reduce((p, c) => {
    return Math.max(c.end_index, p);
  }, 0);

  return {
    matching_clusters: mergedClusters,
    last_row: maxEnd,
  };
}
