import { columnLettersToIndex_ } from "@/rangers/converters/letter_index";
import { expect, test } from "vitest";

/**
 * @typedef {Object} TestCase
 * @prop {String} input
 * @prop {Number} output
 */

/** @type {TestCase[]} */
const testCases = [
  {
    input: "A",
    output: 0,
  },
  {
    input: "ZZZ",
    output: 18277,
  },
  {
    input: "B",
    output: 1,
  },
  {
    input: "AA",
    output: 26,
  },
  {
    input: "Z",
    output: 25,
  },
  {
    input: "a",
    output: 0,
  },
  {
    input: "ZzZ",
    output: 18277,
  },
  {
    input: "b",
    output: 1,
  },
  {
    input: "aa",
    output: 26,
  },
  {
    input: "z",
    output: 25,
  },
];

testCases.forEach(({ input, output }) => {
  test(`columnLettersToIndex_ converts correctly: ${input} = ${output}`, () => {
    const result = columnLettersToIndex_(input);
    expect(result).toBe(output);
  });
});
