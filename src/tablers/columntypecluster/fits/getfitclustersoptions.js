import { getPossibleColumnClusterHeaders_ } from "../getclusterheaders";
import { getColumnValuesClusterPossibleRowsStart_ } from "./getclusterpossiblerowsstart";
/** @typedef {import("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/tablers/columntypecluster/getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader */
/** @typedef {import("@/talbler").RangeValues} RangeValues */

/**
 * @typedef {Object} FitColumnValuesClustersOptions
 * @prop {Number} max_row_start_offset - number of rows we can skip assuming it is subtotals
 * @prop {Number} max_row_start_string_rows_percent - max percent on rows in depth for string clusters
 * @prop {Number} max_skipped_columns - max number of skipped columns between clusters
 * @prop {Number} max_values_crop - max average rounded values allowed to crop after other cluster
 * @prop {Number} max_header_lenght - 300 https://cloud.google.com/bigquery/docs/schemas
 */

/**
 * @typedef {Object} FitColumnValuesClustersInfo
 * @prop {SheetsValuesColumnCluster} master_cluster
 * @prop {FitColumnValuesClustersOptions} options
 * @prop {RangeValues} values
 * @prop {SheetsValuesColumnCluster[][]} clusters
 * @prop {Number[]} master_rows_possible_start
 * @prop {SheetColumnNamedClusterHeader[]} master_possible_headers
 */

/**
 * @returns {FitColumnValuesClustersOptions}
 */
function getFitValuesClustersOptions_() {
  return {
    max_row_start_offset: 2,
    max_row_start_string_rows_percent: 0.3,
    max_skipped_columns: 1,
    max_values_crop: 1,
    max_header_lenght: 300,
  };
}

/**
 * @param {SheetsValuesColumnCluster} masterCluster
 * @param {RangeValues} values
 * @param {SheetsValuesColumnCluster[][]} clusters
 *
 * @returns {FitColumnValuesClustersInfo}
 */
export function getInitialFitColumnValuesClustersInfo_(
  masterCluster,
  values,
  clusters
) {
  const headers = getPossibleColumnClusterHeaders_(values, masterCluster);
  const options = getFitValuesClustersOptions_();
  const possibleRowsStart = getColumnValuesClusterPossibleRowsStart_(
    masterCluster,
    values,
    options.max_row_start_offset,
    options.max_row_start_string_rows_percent
  );
  return {
    master_cluster: masterCluster,
    options,
    values,
    master_rows_possible_start: possibleRowsStart,
    master_possible_headers: headers,
    clusters,
  };
}
