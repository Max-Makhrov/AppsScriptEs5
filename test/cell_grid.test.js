import { cellA1NotationToCellGrid_ } from "../src/converters/cell_grid";
import { expect, test } from "vitest";

/** @typedef {import("../src/converters/cell_grid").CellGrid} CellGrid */

/**
 * @typedef {Object} TestCase
 * @prop {String} input
 * @prop {CellGrid} output
 */

/** @type {TestCase[]} */
const testCases = [
  {
    input: "A1",
    output: {
      columnIndex: 0,
      rowIndex: 0,
    },
  },
  {
    input: "a1",
    output: {
      columnIndex: 0,
      rowIndex: 0,
    },
  },
  {
    input: "$a$1",
    output: {
      columnIndex: 0,
      rowIndex: 0,
    },
  },
  {
    input: "$a1",
    output: {
      columnIndex: 0,
      rowIndex: 0,
    },
  },
  {
    input: "$A1",
    output: {
      columnIndex: 0,
      rowIndex: 0,
    },
  },
  {
    input: "a$1",
    output: {
      columnIndex: 0,
      rowIndex: 0,
    },
  },
  {
    input: "A",
    output: {
      columnIndex: 0,
    },
  },
  {
    input: "a",
    output: {
      columnIndex: 0,
    },
  },
  {
    input: "50",
    output: {
      rowIndex: 49,
    },
  },
  {
    input: "1",
    output: {
      rowIndex: 0,
    },
  },
  {
    input: "ZZZ5000",
    output: {
      columnIndex: 18277,
      rowIndex: 4999,
    },
  },
  {
    input: "AB13",
    output: {
      columnIndex: 27,
      rowIndex: 12,
    },
  },
  {
    input: "1",
    output: {
      rowIndex: 0,
    },
  },
];

testCases.forEach(({ input, output }) => {
  test(`columnIndexToLetters_ converts correctly: ${input} = ${JSON.stringify(
    output
  )}`, () => {
    const result = cellA1NotationToCellGrid_(input);
    expect(result).toEqual(output);
  });
});
