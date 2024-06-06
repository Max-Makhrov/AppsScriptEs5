import { _findMatchingColumnValuesClusters_ } from "./matchingclustersbyheader";
/** @typedef {import("./fullclusterheadersinfo").SchemaValuesCluster} SchemaValuesCluster */
/** @typedef {import("../../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/
/** @typedef {import("../../fits/getmatchedclustersheaders").PossibleSchemaClustersInfo} PossibleSchemaClustersInfo */

/**
 *
 * @param {SheetColumnNamedClusterHeader[][]} biggestIslands
 *  @param {PossibleSchemaClustersInfo} possibleSchemaInfo
 *
 * @returns {SchemaValuesCluster[][][]}
 */
export function _getFullInfoSortingColumnValueClusterCollections_(
  biggestIslands,
  possibleSchemaInfo
) {
  /** @type {SchemaValuesCluster[][][]} */
  const sortingCollections = [];

  biggestIslands.forEach((island) => {
    /** @type {SchemaValuesCluster[][]} */
    const collection = [];
    island.forEach((header) => {
      const elements = _findMatchingColumnValuesClusters_(
        header,
        possibleSchemaInfo
      );
      collection.push(elements);
    });
    if (collection.length) {
      sortingCollections.push(collection);
    }
  });

  return sortingCollections;
}
