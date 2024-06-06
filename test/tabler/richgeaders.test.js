import { getRichColumnValuesClustersHeaders_ } from "@/tablers/columntypecluster/fits/richheaders";

import { expect, test } from "vitest";

/** @typedef {import("@/tablers/columntypecluster/getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader */
/** @typedef {import("@/tablers/columntypecluster/fits/richheaders").RichColumnValuesHeader} RichColumnValuesHeader */

/**
 * @typedef {Object} TestCase
 * @prop {HeadersSet[]} set
 */
/**
 * @typedef {Object} HeadersSet
 * @prop {String} original_value
 * @prop {String} [suggested_value]
 */
/**
 * @param {String} originalValue
 * @param {String} [suggestedValue]
 *
 * @returns {SheetColumnNamedClusterHeader}
 */
function getTestIniHeader_(originalValue, suggestedValue) {
  let isValid = true;
  if (!suggestedValue) {
    (isValid = false), (suggestedValue = null);
  }

  /** @type {SheetColumnNamedClusterHeader} */
  const header = {
    column_index: 0,
    row_index: 0,
    header_response: {
      is_valid: isValid,
      suggested_value: suggestedValue,
      message: "test",
      original_value: originalValue,
    },
  };
  return header;
}

/**
 *
 * @param {HeadersSet[]} set
 * @returns {SheetColumnNamedClusterHeader[]}
 */
function getTestIniHeaders_(set) {
  return set.map((s) => {
    return getTestIniHeader_(s.original_value, s.suggested_value);
  });
}

/** @type {TestCase[]} */
const test_cases = [
  {
    set: [
      {
        original_value: "boo",
        suggested_value: "boo",
      },
      {
        original_value: "Boo",
        suggested_value: "boo",
      },
      {
        original_value: "boo",
      },
      {
        original_value: "boo",
      },
      {
        original_value: "boo",
      },
      {
        original_value: "boo",
      },
      {
        original_value: "Boo",
        suggested_value: "boo",
      },
      {
        original_value: "boo",
      },
      {
        original_value: "boo",
        suggested_value: "Col3",
      },
      {
        original_value: "boo",
        suggested_value: "Col3_1",
      },
    ],
  },
];

const tc = test_cases[0];
const hh = getTestIniHeaders_(tc.set);

const res = getRichColumnValuesClustersHeaders_(hh, 500);
console.log(JSON.stringify(res));

test("Dummy", () => {
  expect(0).toBe(0);
});
