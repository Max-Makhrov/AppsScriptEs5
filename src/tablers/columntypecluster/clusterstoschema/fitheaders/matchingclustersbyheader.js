/** @typedef {import("../../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/
/** @typedef {import("../../fits/getmatchedclustersheaders").PossibleSchemaClustersInfo} PossibleSchemaClustersInfo */
/** @typedef {import("./fullclusterheadersinfo").SchemaValuesCluster} SchemaValuesCluster */

/**
 * @param {SheetColumnNamedClusterHeader} header
 * @param {PossibleSchemaClustersInfo} possibleSchemaInfo
 *
 * @returns {SchemaValuesCluster[]}
 */
export function _findMatchingColumnValuesClusters_(header, possibleSchemaInfo) {
  const columnIndex = header.column_index;
  /** @type SchemaValuesCluster[] */
  const results = [];
  possibleSchemaInfo.clusters_rows_fit.forEach((el, i) => {
    if (el.column_index !== columnIndex) return;
    results.push({
      cluster: el,
      header,
      possible_rows_start: possibleSchemaInfo.possible_rows_map[i],
    });
  });
  return results;
}
