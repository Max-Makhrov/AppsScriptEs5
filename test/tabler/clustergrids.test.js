import { getRangeGridByRangeA1_ } from "@/rangers/converters/grid_to_range";
import { getValuesClustersRangeGrids_ } from "@/tablers/columntypecluster/grids/clustergrids";

import { expect, test } from "vitest";
/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/** @type {SheetsValuesColumnCluster[]} */
const clusters = [
  {
    type: "string",
    string_like_type: "int",
    start_index: 8,
    end_index: 34,
    max_scale: 0,
    max_precision: 2,
    max_size: 2,
    indexes_null: [14, 22],
    column_index: 2,
    position: 1,
  },
  {
    start_index: 8,
    end_index: 34,
    string_like_type: "string",
    type: "string",
    max_size: 12,
    max_precision: 0,
    max_scale: 0,
    column_index: 3,
    indexes_null: [14, 22, 25, 26, 27, 28],
  },
  {
    type: "int",
    start_index: 8,
    end_index: 34,
    max_scale: 0,
    max_precision: 3,
    max_size: 3,
    indexes_null: [14, 22, 30, 31, 32],
    column_index: 4,
    position: 1,
  },
  {
    start_index: 7,
    end_index: 30,
    string_like_type: "string",
    type: "string",
    max_size: 7,
    max_precision: 0,
    max_scale: 0,
    column_index: 6,
    indexes_null: [14, 22],
  },
  {
    type: "string",
    string_like_type: "string",
    start_index: 5,
    end_index: 34,
    max_scale: 0,
    max_precision: 0,
    max_size: 11,
    indexes_null: [7, 14, 22],
    column_index: 7,
    position: 0,
  },
  {
    type: "string",
    string_like_type: "date",
    start_index: 8,
    end_index: 30,
    max_scale: 0,
    max_precision: 0,
    max_size: 10,
    indexes_null: [10, 14, 22, 26],
    column_index: 9,
    position: 1,
  },
];

const res = getValuesClustersRangeGrids_(clusters, 8, 34, [14, 22]);

const a1 = res.map(getRangeGridByRangeA1_);

console.log(JSON.stringify(res));
console.log(JSON.stringify(a1));

test("Dummy", () => {
  expect(0).toBe(0);
});
