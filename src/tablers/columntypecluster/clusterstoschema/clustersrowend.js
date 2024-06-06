import { getGridValuesClustersMerged_ } from "./clustersmerged";
import { getNonStringColumnValuesClusters_ } from "./nonstringclusters";
import { tryToCropColumnValuesClusters_ } from "./cropclusters";
import { getStringsValuesClustersLastDataRow_ } from "./stringclustersrowends";
/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/tablers/columntypecluster/fits/getfitclustersoptions").FitColumnValuesClustersInfo} FitColumnValuesClustersInfo */

/** @typedef {import("./stringclustersrowends").LastValuesClusterRowResponse} LastValuesClusterRowResponse */

/**
 * @param {SheetsValuesColumnCluster[]} fitClusters
 * @param {FitColumnValuesClustersInfo} info
 *
 * @returns {LastValuesClusterRowResponse} last_row
 */
export function getValuesClustersLastDataRow_(fitClusters, info) {
  let nonStringClusters = getNonStringColumnValuesClusters_(fitClusters);
  if (nonStringClusters.length === 0) {
    return getStringsValuesClustersLastDataRow_(fitClusters, info.clusters);
  }

  /**
   * @param {SheetsValuesColumnCluster[]} clusterGroup
   * @param {Number} greaterThan
   *
   * @returns {SheetsValuesColumnCluster}
   */
  function _minGreaterRowCluster_(clusterGroup, greaterThan) {
    let minGreaterThanRow = clusterGroup.reduce((p, c) => {
      return c.end_index > greaterThan &&
        (p === null || c.end_index < p.end_index)
        ? c
        : p;
    }, null);
    return minGreaterThanRow;
  }

  let canCrop = false;
  let cropResults = null;
  /** @type {Number} */
  let rowEnd = 0;
  let minRowCluster = null;

  let nextClusters = fitClusters;
  let forseEnd = false;
  while (!canCrop && !forseEnd) {
    minRowCluster = _minGreaterRowCluster_(nextClusters, rowEnd);

    if (minRowCluster) {
      rowEnd = minRowCluster.end_index;
      // can merge clusters?
      nextClusters = getGridValuesClustersMerged_(
        nextClusters,
        rowEnd,
        info.clusters
      );
    } else {
      forseEnd = true;
    }

    cropResults = tryToCropColumnValuesClusters_(
      minRowCluster,
      nextClusters,
      info
    );
    canCrop = cropResults.can_crop;
  }

  return {
    last_row: rowEnd,
    matching_clusters: cropResults.croppeed,
  };
}
