/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @param {SheetsValuesColumnCluster} cluster
 * @param {Number} rowTo
 *
 * @returns {SheetsValuesColumnCluster}
 */
export function cropColumnValuesCluster_(cluster, rowTo) {
  if (cluster.end_index <= rowTo) return cluster;
  /** @type {SheetsValuesColumnCluster} */
  const newCluster = JSON.parse(JSON.stringify(cluster));
  newCluster.indexes_null = newCluster.indexes_null.filter((i) => i <= rowTo);
  newCluster.end_index = rowTo;
  return newCluster;
}
