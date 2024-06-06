import { cropColumnValuesCluster_ } from "./cropcluster";
/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/tablers/columntypecluster/fits/getfitclustersoptions").FitColumnValuesClustersOptions} FitColumnValuesClustersOptions */
/** @typedef {import("@/tablers/columntypecluster/fits/getfitclustersoptions").FitColumnValuesClustersInfo} FitColumnValuesClustersInfo */

/**
 * @typedef {Object} ColumnValueClustersCropResponse
 * @prop {Boolean} can_crop
 * @prop {SheetsValuesColumnCluster[]} croppeed
 * @prop {String} [message]
 */

/**
 * @param {SheetsValuesColumnCluster} minCluster
 * @param {SheetsValuesColumnCluster[]} clusters
 * @param {FitColumnValuesClustersInfo} info
 *
 * @returns {ColumnValueClustersCropResponse}
 */
export function tryToCropColumnValuesClusters_(minCluster, clusters, info) {
  /**
   * @param {String} message
   * @returns {ColumnValueClustersCropResponse}
   */
  function _no_(message) {
    return {
      can_crop: false,
      message,
      croppeed: clusters,
    };
  }
  if (!minCluster) {
    return _no_("No min. cluster");
  }

  const rowTo = minCluster.end_index;
  const options = info.options;
  const clusterMinGroup = info.clusters[minCluster.column_index];
  const nextClusterAfterMin = clusterMinGroup.find(
    (cl) => cl.position > minCluster.position
  );
  if (!nextClusterAfterMin) return _no_("No clusters after the given");

  const lastRows = clusters.map((c) => c.end_index);
  const maxRow = Math.max(...lastRows);
  if (nextClusterAfterMin.start_index > maxRow) {
    return _no_("Next claster is far away...");
  }

  /**
   * @param {SheetsValuesColumnCluster} c
   * @returns {Boolean}
   */
  function cannotCrop_(c) {
    // +1 stands for the possible 1-row total in the end
    if (c.end_index <= rowTo + 1) return false;
    if (c.indexes_null.indexOf(rowAfterCrop) > -1) return false;
    return true;
  }

  const rowAfterCrop = rowTo + 1;
  const nonBlanksAfterBlank = [];
  for (let i = 0; i < clusters.length; i++) {
    const cl = clusters[i];
    if (cannotCrop_(cl)) return _no_("k=" + i);
    if (cl.end_index < rowAfterCrop) {
      nonBlanksAfterBlank.push(0);
    } else {
      const blanksAfter = cl.indexes_null.filter((n) => n > rowTo);
      const numBlanks = blanksAfter.length;
      const numTotal = cl.end_index - rowTo;
      const numNonBlanks = numTotal - numBlanks;
      if (numNonBlanks < 0) {
        throw new Error("Logical error in script. Cannot have less <0 values");
      }
      nonBlanksAfterBlank.push(numNonBlanks);
    }
  }
  const sumNonBlanks = nonBlanksAfterBlank.reduce((p, c) => p + c, 0);
  const averageNonBlank = Math.round(sumNonBlanks / nonBlanksAfterBlank.length);
  if (averageNonBlank > options.max_values_crop)
    return _no_("Not enough 'totals'");
  const newClusters = clusters.map((cls) =>
    cropColumnValuesCluster_(cls, rowTo)
  );
  return {
    can_crop: true,
    croppeed: newClusters,
  };
}
