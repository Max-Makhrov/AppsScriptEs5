import { check2ClustersFirstRowsEdgeCases_ } from "./checkclustersrowsmatch";
import { getColumnValuesClusterPossibleRowsStart_ } from "./getclusterpossiblerowsstart";

/** @typedef {import("./getfitclustersoptions").FitColumnValuesClustersInfo} FitColumnValuesClustersInfo */
/** @typedef {import("../cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @typedef {Object} ClustersRowStartsFitCheckResponse
 * @prop {Boolean} fits
 * @prop {String} [message]
 * @prop {Number[]} [rows_possible_start]
 */

/**
 *
 * @param {FitColumnValuesClustersInfo} info
 * @param {SheetsValuesColumnCluster} cluster2
 *
 * @returns {ClustersRowStartsFitCheckResponse}
 */
export function check2ClustersRowsFit_(info, cluster2) {
  const cluster1 = info.master_cluster;
  /**
   * @prop {String} message
   * @returns {ClustersRowStartsFitCheckResponse}
   */
  function _nullResponse_(message) {
    return {
      fits: false,
      message,
    };
  }

  const edgeCases = check2ClustersFirstRowsEdgeCases_(cluster1, cluster2);
  if (edgeCases.mismatch) return _nullResponse_(edgeCases.message);

  const possibleRowsStart2 = getColumnValuesClusterPossibleRowsStart_(
    cluster2,
    info.values,
    info.options.max_row_start_offset,
    info.options.max_row_start_string_rows_percent
  );

  const possibleRowsStart1 = info.master_rows_possible_start;

  const possibleRowsStart = [];
  for (let i = 0; i < possibleRowsStart2.length; i++) {
    const rowIndex = possibleRowsStart2[i];
    if (possibleRowsStart1.indexOf(rowIndex) > -1) {
      possibleRowsStart.push(rowIndex);
    }
  }

  if (possibleRowsStart.length === 0) {
    return _nullResponse_("No common rows to start data with");
  }

  return {
    fits: true,
    message: "ok",
    rows_possible_start: possibleRowsStart,
  };
}
