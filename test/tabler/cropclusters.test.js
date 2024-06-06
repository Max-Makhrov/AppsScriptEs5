import { tryToCropColumnValuesClusters_ } from "@/tablers/columntypecluster/clusterstoschema/cropclusters";
import { expect, test } from "vitest";

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @typedef {Object} TestSet
 * @prop {Number} start
 * @prop {Number} end
 * @prop {Number[]} nulls
 */
/**
 * @typedef {Object} TestCases
 * @prop {TestSet[]} set
 * @prop {Number} row_crop
 */
/**
 *
 * @param {Number} rowStart
 * @param {Number} rowEnd
 * @param {Number[]} nullRows
 * @returns {SheetsValuesColumnCluster}
 */
function getTestCluster_(rowStart, rowEnd, nullRows) {
  return {
    start_index: rowStart,
    end_index: rowEnd,
    string_like_type: "string",
    type: "string",
    column_index: 1,
    indexes_null: nullRows,
    max_precision: 1,
    max_scale: 1,
    max_size: 1,
    position: 0,
  };
}

/**
 * @param {TestSet[]} s
 *
 * @returns {SheetsValuesColumnCluster[]}
 */
function getTestClusters_(s) {
  const res = s.map((t) => getTestCluster_(t.start, t.end, t.nulls));
  return res;
}

/** @type {TestCases[]} */
const testCases = [
  {
    row_crop: 8,
    set: [
      {
        start: 3,
        end: 8,
        nulls: [],
      },
      {
        start: 3,
        end: 10,
        nulls: [9],
      },
      {
        start: 3,
        end: 10,
        nulls: [9],
      },
    ],
  },
  {
    row_crop: 8,
    set: [
      {
        start: 3,
        end: 8,
        nulls: [],
      },
      {
        start: 3,
        end: 10,
        nulls: [4, 5, 9],
      },
      {
        start: 3,
        end: 10,
        nulls: [9],
      },
    ],
  },
  {
    row_crop: 8,
    set: [
      {
        start: 3,
        end: 8,
        nulls: [],
      },
      {
        start: 3,
        end: 10,
        nulls: [4, 5, 9],
      },
      {
        start: 3,
        end: 6,
        nulls: [],
      },
    ],
  },
  {
    row_crop: 8,
    set: [
      {
        start: 3,
        end: 8,
        nulls: [],
      },
      {
        start: 3,
        end: 11,
        nulls: [9],
      },
      {
        start: 3,
        end: 11,
        nulls: [9],
      },
    ],
  },
  {
    row_crop: 8,
    set: [
      {
        start: 3,
        end: 8,
        nulls: [],
      },
      {
        start: 3,
        end: 8,
        nulls: [5],
      },
      {
        start: 3,
        end: 9,
        nulls: [],
      },
    ],
  },
  {
    row_crop: 8,
    set: [
      {
        start: 3,
        end: 8,
        nulls: [],
      },
      {
        start: 3,
        end: 10,
        nulls: [9],
      },
      {
        start: 3,
        end: 11,
        nulls: [],
      },
    ],
  },
  {
    row_crop: 8,
    set: [
      {
        start: 3,
        end: 8,
        nulls: [],
      },
      {
        start: 3,
        end: 12,
        nulls: [9, 10],
      },
      {
        start: 3,
        end: 12,
        nulls: [9, 10],
      },
    ],
  },
  {
    row_crop: 8,
    set: [
      {
        start: 3,
        end: 8,
        nulls: [],
      },
      {
        start: 3,
        end: 12,
        nulls: [9, 10, 11],
      },
      {
        start: 3,
        end: 12,
        nulls: [9, 10],
      },
    ],
  },
];

/** @typedef {import("@/tablers/columntypecluster/fits/getfitclustersoptions").FitColumnValuesClustersInfo} FitColumnValuesClustersInfo */

const nextCluster = getTestCluster_(0, 10, []);
nextCluster.position++;

/** @type {FitColumnValuesClustersInfo} */
const options = {
  options: {
    max_row_start_offset: 1,
    max_skipped_columns: 1,
    max_values_crop: 1,
    max_header_lenght: 300,
  },
  master_cluster: getTestCluster_(0, 10, []),
  clusters: [
    [getTestCluster_(0, 10, [])],
    [getTestCluster_(0, 10, []), nextCluster],
  ],
  master_possible_headers: [],
  master_rows_possible_start: [0],
  values: [["boo"]],
};

function getCropRes_(testIndex) {
  const testClusters = getTestClusters_(testCases[testIndex].set);
  const cropCluster = getTestCluster_(0, testCases[testIndex].row_crop, []);
  const testCrop = tryToCropColumnValuesClusters_(
    cropCluster,
    testClusters,
    options
  );
  return testCrop;
}

test("Crop is allowed with 1 value after blank", () => {
  const res = getCropRes_(0);
  expect(res.can_crop).toBe(true);
});
test("Crop deletes blank rows after crop", () => {
  const res = getCropRes_(0);
  expect(res.croppeed[1].indexes_null.length).toBe(0);
  expect(res.croppeed[2].indexes_null.length).toBe(0);
});
test("Crop deletes only blank rows after crop", () => {
  const res = getCropRes_(1);
  expect(res.croppeed[1].indexes_null.length).toBe(2);
  expect(res.croppeed[2].indexes_null.length).toBe(0);
});
test("Crop is allowed with 1 col shorter", () => {
  const res = getCropRes_(2);
  expect(res.can_crop).toBe(true);
  expect(res.croppeed[2].end_index).toBe(6);
});
test("Crop is allowed with 0-2-2 non-blanks", () => {
  const res = getCropRes_(3);
  expect(res.can_crop).toBe(true);
});
test("Crop is allowed with 1 'total'-like row", () => {
  const res = getCropRes_(4);
  expect(res.can_crop).toBe(true);
});
test("Crop is NOT allowed with 2 'total'-like row", () => {
  const res = getCropRes_(5);
  expect(res.can_crop).toBe(false);
});
test("Crop is allowed with 0-2-2 + 2 blanks + blanks cut out", () => {
  const res = getCropRes_(6);
  expect(res.can_crop).toBe(true);
  expect(res.croppeed[1].indexes_null.length).toBe(0);
  expect(res.croppeed[2].indexes_null.length).toBe(0);
});

test("Crop is allowed with 0-1-2 + 2 blanks + blanks cut out", () => {
  const res = getCropRes_(7);
  expect(res.can_crop).toBe(true);
  expect(res.croppeed[1].indexes_null.length).toBe(0);
  expect(res.croppeed[2].indexes_null.length).toBe(0);
  console.log(JSON.stringify(res));
});
