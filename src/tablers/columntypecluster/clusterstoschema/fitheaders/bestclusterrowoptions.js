/** @typedef {import("./fullclusterheadersinfo").SchemaValuesCluster} SchemaValuesCluster */
/** @typedef {import("./possiblerowsmap").FullColumnValuesClustersPossibleRowsMap } FullColumnValuesClustersPossibleRowsMap */
import { _checkTwoRowArraysHasCommonRows_ } from "./hascommonrows";

/**
 * @param {FullColumnValuesClustersPossibleRowsMap[]} possibleRowsMap
 * @param {FullColumnValuesClustersPossibleRowsMap} bestRowMapMatch
 * @param {SchemaValuesCluster[][]} collection
 *
 * @returns {SchemaValuesCluster[]}
 */
export function _getBestColumnValuesClusterRowOptions_(
  possibleRowsMap,
  bestRowMapMatch,
  collection
) {
  const bestClusterRowOptions = possibleRowsMap
    .map((subCol) => {
      if (subCol.collection_position === bestRowMapMatch.collection_position) {
        const matchedColl =
          collection[subCol.collection_position][subCol.elements[0].index];
        /** @type {SchemaValuesCluster} */
        const res = {
          cluster: matchedColl.cluster,
          header: matchedColl.header,
          possible_rows_start: bestRowMapMatch.elements[0].rows,
        };
        return res;
      }
      const matchingStartRows = subCol.elements.filter((e) => {
        const rows = e.rows;
        const hasCommon = _checkTwoRowArraysHasCommonRows_(
          rows,
          bestRowMapMatch.elements[0].rows
        );
        return hasCommon;
      });
      if (matchingStartRows.length == 1) {
        const matchElt = matchingStartRows[0];
        const matchedColl2 =
          collection[subCol.collection_position][matchElt.index];
        /** @type {SchemaValuesCluster} */
        const res1 = {
          cluster: matchedColl2.cluster,
          header: matchedColl2.header,
          possible_rows_start: matchElt.rows,
        };
        return res1;
      }
      if (matchingStartRows.length == 0) {
        return null;
      }
      const minRowStartLast = Math.min(
        ...matchingStartRows.map((e) => e.min_row)
      );
      const resMin = matchingStartRows.find(
        (e) => e.min_row === minRowStartLast
      );
      const grpLast = collection[subCol.collection_position][resMin.index];
      /** @type {SchemaValuesCluster} */
      const resLast = {
        cluster: grpLast.cluster,
        header: grpLast.header,
        possible_rows_start: resMin.rows,
      };
      return resLast;
    })
    .filter((e) => e !== null);
  return bestClusterRowOptions;
}
