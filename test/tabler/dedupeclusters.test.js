import { getDedupedFitColumnValuesCluaters_ } from "@/tablers/columntypecluster/fits/dedupefitclusters";

import { expect, test } from "vitest";

/** @typedef {import("@/tablers/columntypecluster/fits/getfitclustersoptions").FitColumnValuesClustersInfo} FitColumnValuesClustersInfo */
/** @typedef {import("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/**
 * @typedef {Object} ClustersRowStartsFitCheckResponse
 * @prop {SheetsValuesColumnCluster[]} clusters_rows_fit
 * @prop {Number[][]} possible_rows_map
 */

/** @type {ClustersRowStartsFitCheckResponse} */
const dt = {
  clusters_rows_fit: [
    {
      type: "string",
      string_like_type: "int",
      start_index: 6,
      end_index: 32,
      max_scale: 0,
      max_precision: 2,
      max_size: 2,
      indexes_null: [12, 20],
      column_index: 1,
      position: 1,
    },
    {
      type: "string",
      string_like_type: "string",
      start_index: 33,
      end_index: 39,
      max_scale: 0,
      max_precision: 0,
      max_size: 18,
      indexes_null: [36, 38],
      column_index: 1,
      position: 2,
    },
    {
      type: "string",
      string_like_type: "int",
      start_index: 6,
      end_index: 37,
      max_scale: 0,
      max_precision: 3,
      max_size: 3,
      indexes_null: [12, 20, 33, 34, 35, 36],
      column_index: 3,
      position: 1,
    },
    {
      type: "string",
      string_like_type: "string",
      start_index: 5,
      end_index: 32,
      max_scale: 0,
      max_precision: 0,
      max_size: 7,
      indexes_null: [12, 20],
      column_index: 5,
      position: 0,
    },
    {
      type: "string",
      string_like_type: "string",
      start_index: 5,
      end_index: 32,
      max_scale: 0,
      max_precision: 0,
      max_size: 6,
      indexes_null: [12, 20],
      column_index: 6,
      position: 0,
    },
    {
      type: "string",
      string_like_type: "date",
      start_index: 6,
      end_index: 32,
      max_scale: 0,
      max_precision: 0,
      max_size: 10,
      indexes_null: [12, 20],
      column_index: 8,
      position: 1,
    },
  ],
  possible_rows_map: [
    [8, 7, 6],
    [36, 35, 34, 33],
    [8, 7, 6],
    [
      31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14,
      13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
    ],
    [
      31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14,
      13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
    ],
    [8, 7, 6],
  ],
};

const res = getDedupedFitColumnValuesCluaters_(dt);

console.log(JSON.stringify(res));

test("Deduped cluster successfully", () => {
  expect(res.clusters_rows_fit.length).toBe(res.possible_rows_map.length);
  expect(res.clusters_rows_fit.length + 1).toBe(dt.clusters_rows_fit.length);
});
