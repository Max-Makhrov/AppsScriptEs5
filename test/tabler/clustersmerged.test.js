import { getGridValuesClustersMerged_ } from "@/tablers/columntypecluster/clusterstoschema/clustersmerged";

import { expect, test } from "vitest";

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @typedef {Object} TestSet
 * @prop {Number} start
 * @prop {Number} end
 */

/**
 * @typedef {Object} TestCase
 * @prop {TestSet[][]} set
 * @prop {TestSet[]} chain
 * @prop {Number} row_merge
 */

/**
 *
 * @param {Number} rowStart
 * @param {Number} rowEnd
 * @param {Number} columnIndex
 * @returns {SheetsValuesColumnCluster}
 */
function getTestCluster_(rowStart, rowEnd, columnIndex) {
  return {
    start_index: rowStart,
    end_index: rowEnd,
    string_like_type: "string",
    type: "string",
    column_index: columnIndex,
    indexes_null: [],
    max_precision: 1,
    max_scale: 1,
    max_size: 1,
    position: 0,
  };
}

/** @type {TestCase[]} */
const testCases = [
  {
    row_merge: 19,
    chain: [
      {
        start: 1,
        end: 4,
      },
    ],
    set: [
      [
        {
          start: 1,
          end: 4,
        },
        {
          start: 6,
          end: 9,
        },
        {
          start: 12,
          end: 15,
        },
        {
          start: 16,
          end: 19,
        },
      ],
    ],
  },
  {
    row_merge: 6,
    chain: [
      {
        start: 1,
        end: 4,
      },
    ],
    set: [
      [
        {
          start: 1,
          end: 4,
        },
        {
          start: 6,
          end: 9,
        },
      ],
    ],
  },
  {
    row_merge: 19,
    chain: [
      {
        start: 1,
        end: 4,
      },
    ],
    set: [
      [
        {
          start: 1,
          end: 4,
        },
      ],
    ],
  },
];

/**
 * @param {TestSet[][]} s
 *
 * @returns {SheetsValuesColumnCluster[][]}
 */
function getTestClusters_(s) {
  const res = s.map((tr, i) =>
    tr.map((t) => getTestCluster_(t.start, t.end, i))
  );
  return res;
}

/**
 * @param {TestSet[]} s
 *
 * @returns {SheetsValuesColumnCluster[]}
 */
function getTestClustersChain_(s) {
  const res = s.map((t, i) => getTestCluster_(t.start, t.end, i));
  return res;
}

testCases.forEach((testCase, i) => {
  test("Test #" + i, () => {
    const clusters = getTestClustersChain_(testCase.chain);
    const allClusters = getTestClusters_(testCase.set);
    const finalSet = testCase.set[0][testCase.set[0].length - 1];

    const res = getGridValuesClustersMerged_(
      clusters,
      testCase.row_merge,
      allClusters
    );
    expect(res[0].end_index).toBe(finalSet.end);

    if (i == testCases.length - 1) {
      console.log(JSON.stringify(res)); // 1
    }
  });
});
