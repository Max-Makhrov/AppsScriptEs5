import { getColumnTableTypeClusters_ } from "./getcolumnclusters";
/** @typedef {import ("./cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/talbler").RangeValues} RangeValues */

/**
 * @param {RangeValues} values
 *
 * @returns {SheetsValuesColumnCluster[][]} clusters collections by data columns
 */
export function getAllValuesClusters_(values) {
  const clustersMap = [];
  for (let i = 0; i < values[0].length; i++) {
    const clusters = getColumnTableTypeClusters_(values, i);
    clustersMap.push(clusters);
  }
  return clustersMap;
}
