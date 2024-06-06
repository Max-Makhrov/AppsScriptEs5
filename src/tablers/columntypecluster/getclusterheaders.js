import { getBigQueryValidatedFieldName_ } from "@/names/getbigqueryfield";
/** @typedef {import("./cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/talbler").RangeValues} RangeValues */
/** @typedef {import("@/names/getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */

/**
 * @typedef {Object} SheetColumnNamedClusterHeader
 * @prop {ValidatedStringValueResponse} header_response
 * @prop {Number} row_index
 * @prop {Number} column_index
 */

/**
 * @param {RangeValues} values
 * @param {SheetsValuesColumnCluster} cluster
 *
 * @returns {SheetColumnNamedClusterHeader[]}
 */
export function getPossibleColumnClusterHeaders_(values, cluster) {
  /** @type {SheetColumnNamedClusterHeader[]} */
  const result = [];
  if (!cluster) return result;

  if (cluster.type === "null") return result;
  if (cluster.string_like_type === "null") return result;

  let lastHeaderSearchIndex = cluster.start_index - 1;
  if (cluster.string_like_type === "string") {
    lastHeaderSearchIndex = cluster.end_index - 1;
  }
  if (lastHeaderSearchIndex < 0) return result;

  /**
   * @param {*} value
   * @param {Number} index
   */
  function _addPossibleHeader_(value, index) {
    if (typeof value !== "string") return;
    const headerResponse = getBigQueryValidatedFieldName_(value, []);
    result.push({
      header_response: headerResponse,
      row_index: index,
      column_index: cluster.column_index,
    });
  }

  for (let i = 0; i <= lastHeaderSearchIndex; i++) {
    const value = values[i][cluster.column_index];
    _addPossibleHeader_(value, i);
  }

  return result;
}
