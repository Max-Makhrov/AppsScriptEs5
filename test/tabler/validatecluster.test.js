import { validateColumnValuesCluster_ } from "@/tablers/columntypecluster/validatecluster";
import { expect, test } from "vitest";

/** @typedef {import("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/typers/gettype").BasicDataType} BasicDataType  */

/**
 * @typedef {Object} TestCase
 * @prop {SheetsValuesColumnCluster} cluster
 * @prop {Boolean} is_valid
 */

/**
 * @param {Number} [startIndex]
 * @param {Number} [endIndex]
 * @param {BasicDataType} [type]
 * @param {BasicDataType} [stringLikeType]
 *
 * @returns {SheetsValuesColumnCluster}
 */
function getTestCluster(startIndex, endIndex, type, stringLikeType) {
  return {
    start_index: startIndex || 0,
    end_index: endIndex || 0,
    string_like_type: stringLikeType,
    type: type || "null",
    column_index: 0,
    indexes_null: [],
  };
}

/** @type {TestCase[]} */
const testCases = [
  {
    cluster: getTestCluster(),
    is_valid: false,
  },
  {
    cluster: getTestCluster(0, 1, "string", "null"),
    is_valid: false,
  },
  {
    cluster: getTestCluster(0, 10, "number", null),
    is_valid: false,
  },
  {
    cluster: getTestCluster(1, 1, "number", null),
    is_valid: true,
  },
];

testCases.forEach((value) => {
  test(`Cluster validation gives correct Boolean`, () => {
    const res = validateColumnValuesCluster_(value.cluster);
    console.log(res.message); //
    expect(res.is_valid).toBe(value.is_valid);
  });
});
