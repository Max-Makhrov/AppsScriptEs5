/** @typedef {import("../clusterstoschema/fitheaders/fullclusterheadersinfo").SchemaValuesCluster} SchemaValuesCluster */

// TODO: check cluster quality?
// Check if
//   1) Cluster group has more non-string clusters?
//   2) Longer clusters?
//   3) Clusters with less empty cells?

/*
  1. if clusters have non-string types => lower headers?...
  2. clusters have bigger number of elements?
  3. 
*/

/** @typedef {import("@/typers/gettype").BasicDataType} BasicDataType */

/**
 * @typedef {Object} ColumnValuesClusterIslandQuality
 * @prop {Number} max_values [v]
 * @prop {Number} number_of_elements [v]
 * @prop {Number} min_column [v]
 * @prop {Number} header_row
 * @prop {BasicDataType[]} types_or_string_types
 */

/**
 * @param {SchemaValuesCluster[][]} fitClusterOptions
 *
 * @returns {SchemaValuesCluster[]} best cluster set
 */
export function getBestValueClustersFullInfoForSchema_(fitClusterOptions) {
  if (!fitClusterOptions) return [];
  if (!fitClusterOptions.length) return [];
  /** @type {ColumnValuesClusterIslandQuality[]} */
  const qualities = [];
  fitClusterOptions.forEach((island) => {
    const rowNums = island.map((i) => {
      return (
        i.cluster.end_index -
        i.cluster.end_index +
        1 -
        i.cluster.indexes_null.length
      );
    });
    const maxValues = Math.max(...rowNums);
    const types = island.map((i) => {
      let typ = i.cluster.type;
      if (typ === "string") typ = i.cluster.string_like_type;
      return typ;
    });
    const columns = island.map((i) => i.cluster.column_index);
    const minColumn = Math.min(...columns);

    /** @type {ColumnValuesClusterIslandQuality} */
    const quality = {
      min_column: minColumn,
      header_row: island[0].header.row_index,
      max_values: maxValues,
      number_of_elements: island.length,
      types_or_string_types: types,
    };
    qualities.push(quality);
  });

  // try to find clusters with max number of values
  const arrayMaxValues = qualities.map((q) => q.max_values);
  const maxValues = Math.max(...arrayMaxValues);
  const groupsMaxValues = fitClusterOptions.filter(
    (island, indx) => qualities[indx].max_values === maxValues
  );
  if (groupsMaxValues.length === 1) {
    return groupsMaxValues[0];
  }

  // try find cluster with more elements
  const maxElements = Math.max(...qualities.map((q) => q.number_of_elements));
  const groupsMaxElements = groupsMaxValues.filter(
    (island, indx) => qualities[indx].number_of_elements === maxElements
  );
  if (groupsMaxElements.length === 1) {
    return groupsMaxElements[0];
  }

  // try get group from left-most column
  const minColumn = Math.min(...qualities.map((q) => q.min_column));
  const groupsMinColumnElements = groupsMaxElements.filter(
    (island, indx) => qualities[indx].min_column === minColumn
  );
  if (groupsMinColumnElements.length === 1) {
    return groupsMinColumnElements[0];
  }

  // get element with the minimal header row
  const headerRows = qualities.map((q) => q.header_row);
  const minHeader = Math.min(...headerRows);
  const minHeaderElement = groupsMinColumnElements.find(
    (island, indx) => qualities[indx].header_row === minHeader
  );
  return minHeaderElement;
}
