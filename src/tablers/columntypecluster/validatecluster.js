/**
 * @typedef {Object} ColumnsValuesClusterValidation
 * @prop {Boolean} is_valid
 * @prop {String} message
 */

/** @typedef {import("./cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 *
 * @param {SheetsValuesColumnCluster} cluster
 *
 * @returns {ColumnsValuesClusterValidation}
 */
export function validateColumnValuesCluster_(cluster) {
  /**
   * @param {String} message
   * @returns {ColumnsValuesClusterValidation}
   */
  function _notValid(message) {
    return {
      is_valid: false,
      message,
    };
  }
  if (cluster.type === "null") {
    return _notValid("Cluster type is null");
  }
  if (cluster.string_like_type === "null") {
    return _notValid("Cluster type is empty string");
  }

  if (cluster.start_index === 0 && cluster.string_like_type !== "string") {
    return _notValid("Cluster have no header");
  }

  return {
    is_valid: true,
    message: "ok",
  };
}
