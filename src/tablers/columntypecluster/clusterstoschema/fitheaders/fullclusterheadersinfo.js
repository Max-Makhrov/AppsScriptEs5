/** @typedef {import("../../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/
/** @typedef {import("../../fits/getmatchedclustersheaders").PossibleSchemaClustersInfo} PossibleSchemaClustersInfo */
/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

import { _getFullInfoSortingColumnValueClusterCollections_ } from "./sortingcollections";
import { _getFullColumnValuesClustersPossibleRowsMap_ } from "./possiblerowsmap";
import { _getBestColumnValuesClusterRowOptions_ } from "./bestclusterrowoptions";
import { _getReducedColumnValuesClusterCollection_ } from "./reducecollection";

/**
 * @typedef {Object} SchemaValuesCluster
 * @prop {SheetsValuesColumnCluster} cluster
 * @prop {SheetColumnNamedClusterHeader} header
 * @prop {Number[]} possible_rows_start
 */

/**
 * @param {SheetColumnNamedClusterHeader[][]} biggestIslands
 * @param {PossibleSchemaClustersInfo} possibleSchemaInfo
 *
 * @returns {SchemaValuesCluster[][]} possible group > schema cluster
 */
export function getFullValuesClusterHeaderInfoMap_(
  biggestIslands,
  possibleSchemaInfo
) {
  if (!biggestIslands) return [];
  if (!biggestIslands.length) return [];

  /** @type {SchemaValuesCluster[][][]} */
  const sortingCollections = _getFullInfoSortingColumnValueClusterCollections_(
    biggestIslands,
    possibleSchemaInfo
  );

  /** @type {SchemaValuesCluster[][]} */
  const finalRes = [];
  sortingCollections.forEach((collectionFull) => {
    const collection =
      _getReducedColumnValuesClusterCollection_(collectionFull);
    // const collection = collectionFull;
    // decide what clusters to use
    // exclude using matching possible rows data can start from
    const possibleRowsMap =
      _getFullColumnValuesClustersPossibleRowsMap_(collection);
    if (possibleRowsMap.length === 0) {
      return;
    }
    const minElements = Math.min(
      ...possibleRowsMap.map((e) => e.num_of_elements)
    );
    const bestRowMapMatch = possibleRowsMap.find(
      (e) => e.num_of_elements === minElements
    );
    let minRowBestMapStarts;
    if (bestRowMapMatch.elements.length > 1) {
      // try to find by minimal row data starts
      minRowBestMapStarts = Math.min(
        ...bestRowMapMatch.elements.map((e) => e.min_row)
      );
      bestRowMapMatch.elements = [
        bestRowMapMatch.elements.find((e) => e.min_row === minRowBestMapStarts),
      ];
    }

    const bestClusterRowOptions = _getBestColumnValuesClusterRowOptions_(
      possibleRowsMap,
      bestRowMapMatch,
      collection
    );
    finalRes.push(bestClusterRowOptions);
  });

  return finalRes;
}
