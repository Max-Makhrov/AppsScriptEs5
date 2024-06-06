/** @typedef {import("./cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @typedef {Object} BestValuesClusterResponse
 * @prop {SheetsValuesColumnCluster|null} best_cluster
 * @prop {Number|null} best_cluster_index
 */

/**
 * Finding the longest cluster
 * Trying to find not sring-type cluster
 * Returns the first cluster meeting conditions
 *
 * @param {SheetsValuesColumnCluster[][]} clustersMap
 * @param {Object} [skipClusters] {"1": [0]} column: cluster indexes
 *
 * @returns {BestValuesClusterResponse}
 */
export function findNextBestFitValuesCluster_(clustersMap, skipClusters) {
  let maxLength = 0;
  let currentLength = 0;
  /** @type {SheetsValuesColumnCluster} */
  let cluster;
  /** @type {SheetsValuesColumnCluster} */
  let bestCluster = null;
  /** @type {Number|null} */
  let resultIndex = null;

  /**
   * @param {Number} columnIndex
   * @param {Number} clusterIndex
   * @returns {Boolean}
   */
  function _skipThisCluster_(columnIndex, clusterIndex) {
    if (!skipClusters) return false;
    /** @type {Number[]} */
    const clusterIndexes = skipClusters["" + columnIndex];
    if (!clusterIndexes) return false;
    if (!clusterIndexes.length) return false;
    return clusterIndexes.indexOf(clusterIndex) > -1;
  }

  /**
   * @param {SheetsValuesColumnCluster} cluster
   * @param {Number} index
   */
  function _setBestCluster(cluster, index) {
    bestCluster = cluster;
    resultIndex = index;
  }

  /**
   * @param {SheetsValuesColumnCluster} cluster
   * @param {Number} columnIndex
   * @param {Number} clusterIndex
   */
  function _checkBestCluster_(cluster, columnIndex, clusterIndex) {
    if (_skipThisCluster_(columnIndex, clusterIndex)) {
      return;
    }
    if (!bestCluster) _setBestCluster(cluster, clusterIndex);
    currentLength = cluster.end_index - cluster.start_index;
    if (currentLength < maxLength) {
      return false;
    } else if (currentLength > maxLength) {
      _setBestCluster(cluster, clusterIndex);
      maxLength = currentLength;
      return;
    }

    if (bestCluster.type !== "string") return;
    if (cluster.type !== "string") {
      _setBestCluster(cluster, clusterIndex);
      return;
    }
    if (bestCluster.string_like_type !== "string") return;
    if (cluster.string_like_type !== "string") {
      _setBestCluster(cluster, clusterIndex);
    }
  }

  for (let i = 0; i < clustersMap.length; i++) {
    // we are in column
    for (let ii = 0; ii < clustersMap[i].length; ii++) {
      cluster = clustersMap[i][ii];
      _checkBestCluster_(cluster, i, ii);
    }
  }

  return {
    best_cluster: bestCluster,
    best_cluster_index: resultIndex,
  };
}
