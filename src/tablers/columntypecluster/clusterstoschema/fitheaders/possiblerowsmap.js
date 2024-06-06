/** @typedef {import("./fullclusterheadersinfo").SchemaValuesCluster} SchemaValuesCluster */

/**
 * @typedef {Object} FullColumnValuesClustersPossibleRowsMap
 * @prop {number} collection_position
 * @prop {FullColumnValuesClustersPossibleRowsMapElement[]} elements
 * @prop {number} num_of_elements
 */

/**
 * @typedef {Object} FullColumnValuesClustersPossibleRowsMapElement
 * @prop {number} index
 * @prop {number[]} rows
 * @prop {number} min_row
 */

/**
 *
 * @param {SchemaValuesCluster[][]}  collection
 *
 * @returns {FullColumnValuesClustersPossibleRowsMap[]}
 */
export function _getFullColumnValuesClustersPossibleRowsMap_(collection) {
  const possibleRowsMap = collection
    .map((c) =>
      c
        .map((cc, i) => {
          const rws = cc.possible_rows_start.filter(
            (r) => r > cc.header.row_index
          );
          return {
            index: i,
            rows: rws,
            min_row: Math.min(...rws),
          };
        })
        .filter((el) => el.rows.length > 0)
    )
    .map((el, collection_position) => {
      return {
        collection_position,
        elements: el,
        num_of_elements: el.length,
      };
    })
    .filter((el) => el.num_of_elements > 0);
  return possibleRowsMap;
}
