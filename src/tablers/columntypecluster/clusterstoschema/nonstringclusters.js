/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @param {SheetsValuesColumnCluster[]} clusters
 *
 * @returns {SheetsValuesColumnCluster[]}
 */
export function getNonStringColumnValuesClusters_(clusters) {
  const res = clusters.filter((cl) => {
    /** @type {String} */
    const stringLikeType = cl.string_like_type || "";
    if (stringLikeType === "string") return false;
    return true;
  });
  return res;
}
