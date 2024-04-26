import { textAsNumber2Type_ } from "@/typers/gettextnumber2type";
/** @typedef {import("@/typers/gettextnumber2type").ScaleAndPrecision} ScaleAndPrecision */

import { expect, test } from "vitest";

/**
 * @typedef {Object} TestSample
 * @prop {String} input
 * @prop {ScaleAndPrecision} output
 */

/** @type {TestSample[]} */
const testCases = [
  {
    input: "0",
    output: {
      string_like_type: "int",
      precision: 1,
      scale: 0,
    },
  },
  {
    input: "10",
    output: {
      string_like_type: "int",
      precision: 2,
      scale: 0,
    },
  },
  {
    input: "-10",
    output: {
      string_like_type: "int",
      precision: 2,
      scale: 0,
    },
  },
  {
    input: "-10.0",
    output: {
      string_like_type: "int",
      precision: 2,
      scale: 0,
    },
  },
  {
    input: "-10.00000",
    output: {
      string_like_type: "int",
      precision: 2,
      scale: 0,
    },
  },
  {
    input: "-10.01",
    output: {
      string_like_type: "number",
      precision: 4,
      scale: 2,
    },
  },
  {
    input: "12345678.90123456789",
    output: {
      string_like_type: "number",
      precision: 19,
      scale: 11,
    },
  },
  {
    input: "12345678.901234567890000000000000000",
    output: {
      string_like_type: "number",
      precision: 19,
      scale: 11,
    },
  },
  {
    input: "1000000",
    output: {
      string_like_type: "int",
      precision: 7,
      scale: 0,
    },
  },
];

testCases.forEach((value, i) => {
  test(`Test correct scale and precision"`, () => {
    const res = textAsNumber2Type_(value.input);
    expect(res.precision).toBe(value.output.precision);
    expect(res.scale).toBe(value.output.scale);
    expect(res.string_like_type).toBe(value.output.string_like_type);
  });
});
