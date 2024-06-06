// @ts-nocheck

import { getMergeCommonDataTypesType_ } from "@/typers/typesmergetype";
/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/typers/gettype").TypeCheckResult} TypeCheckResult */

/**
 * @param {SheetsValuesColumnCluster[]} clusters
 *
 * @returns {SheetsValuesColumnCluster}
 */
export function mergeColumnValuesClusters_(clusters) {
  let startingRow = null;
  let endingRow = null;
  let nullIndexes = [];
  /** @type {TypeCheckResult[]} */
  let types = [];

  clusters.sort((a, b) => a.start_index - b.start_index);
  /**
   * @param {Number} index
   * @returns {Number[]}
   */
  function _getGaps_(index) {
    if (index === 0) return [];
    const pre = clusters[index - 1];
    const cur = clusters[index];
    const sizeGap = cur.start_index - pre.end_index;
    if (sizeGap < 0) {
      throw new Error("Clusters in 1 column cannot intersect");
    }
    if (sizeGap === 1) return [];
    const res = [];
    for (let i = pre.end_index + 1; i < cur.start_index; i++) {
      res.push(i);
    }
    return res;
  }

  clusters.forEach((cl, i) => {
    const rowStart = cl.start_index;
    const rowEnd = cl.end_index;
    if (!startingRow || startingRow > rowStart) {
      startingRow = rowStart;
    }
    if (!endingRow || endingRow < rowEnd) {
      endingRow = rowEnd;
    }
    const gaps = _getGaps_(i);
    nullIndexes = nullIndexes.concat(gaps).concat(cl.indexes_null);
    types.push({
      type: cl.type,
      string_like_type: cl.string_like_type,
      size: cl.max_size,
      precision: cl.max_precision,
      scale: cl.max_scale,
    });
  });

  const finalType = getMergeCommonDataTypesType_(types);

  const result = {
    start_index: startingRow,
    end_index: endingRow,
    string_like_type: finalType.string_like_type,
    type: finalType.type,
    max_size: finalType.size,
    max_precision: finalType.precision || 0,
    max_scale: finalType.scale || 0,
    column_index: clusters[0].column_index,
    indexes_null: nullIndexes,
  };
  return result;
}
