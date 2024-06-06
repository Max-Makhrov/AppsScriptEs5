/** @typedef {import("../cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @typedef {Object} ClustersFirstRowsFitEdgeCasesResponse
 * @prop {Boolean} mismatch
 * @prop {String} [message]
 */

/**
 * @param {SheetsValuesColumnCluster} cluster1 - master cluster
 * @param {SheetsValuesColumnCluster} cluster2
 *
 * @returns {ClustersFirstRowsFitEdgeCasesResponse}
 */
export function check2ClustersFirstRowsEdgeCases_(cluster1, cluster2) {
  /**
   * @param {String} message
   * @returns {ClustersFirstRowsFitEdgeCasesResponse}
   */
  function _mismatch_(message) {
    return {
      mismatch: true,
      message,
    };
  }

  if (cluster1.start_index >= cluster2.end_index) {
    return _mismatch_("Master-cluster is below Check-cluster");
  }

  if (cluster2.start_index >= cluster1.end_index) {
    return _mismatch_("Check-cluster is below Master-cluster");
  }

  return { mismatch: false, message: "ok" };
}
