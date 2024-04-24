import { columnIndexToLetters_ } from "../src/converters/index_letter";
import { expect, test } from "vitest";

/**
 * @typedef {Object} TestCase
 * @prop {String} output
 * @prop {Number} input
 */

/** @type {TestCase[]} */
const inverseTestCases = [
  {
    input: 0,
    output: "A",
  },
  {
    input: 18277,
    output: "ZZZ",
  },
  {
    input: 1,
    output: "B",
  },
  {
    input: 26,
    output: "AA",
  },
  {
    input: 25,
    output: "Z",
  },
];

inverseTestCases.forEach(({ input, output }) => {
  test(`columnIndexToLetters_ converts correctly: ${input} = ${output}`, () => {
    const result = columnIndexToLetters_(input);
    expect(result).toBe(output);
  });
});
