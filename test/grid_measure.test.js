import { getGridA1Measures_ } from "../src/validators/grid_measure";
import { expect, test } from "vitest";

/** @typedef {import("../src/validators/grid_measure").RangeGridMeasure} RangeGridMeasure */
/** @typedef {import("../src/grid").RangeGrid} RangeGrid */

/**
 * @typedef {Object} TestCase
 * @prop {RangeGrid} input
 * @prop {RangeGridMeasure} output
 */

/** @type {TestCase[]} */
const testCases = [
  {
    input: {
      startRowIndex: 0,
      startColumnIndex: 0,
      endColumnIndex: 1,
      endRowIndex: 1,
    },
    output: {
      cells_type: "cell",
      end_type: "closed",
      orientation: "none",
      num_columns: 1,
      num_rows: 1,
    },
  },

  {
    input: {
      startRowIndex: 0,
      startColumnIndex: 0,
      endColumnIndex: 1,
      endRowIndex: 2,
    },
    output: {
      cells_type: "line",
      end_type: "closed",
      orientation: "vertical",
      num_columns: 1,
      num_rows: 2,
    },
  },

  {
    input: {
      startRowIndex: 0,
      startColumnIndex: 0,
      endColumnIndex: 2,
      endRowIndex: 1,
    },
    output: {
      cells_type: "line",
      end_type: "closed",
      orientation: "horizontal",
      num_columns: 2,
      num_rows: 1,
    },
  },

  {
    input: {
      startRowIndex: 0,
      startColumnIndex: 0,
      endColumnIndex: 2,
      endRowIndex: 2,
    },
    output: {
      cells_type: "range",
      end_type: "closed",
      orientation: "none",
      num_columns: 2,
      num_rows: 2,
    },
  },

  {
    input: {
      startRowIndex: 0,
      startColumnIndex: 0,
      endColumnIndex: 2,
      endRowIndex: 2,
    },
    output: {
      cells_type: "range",
      end_type: "closed",
      orientation: "none",
      num_columns: 2,
      num_rows: 2,
    },
  },

  {
    input: {
      startRowIndex: 0,
      startColumnIndex: 0,
      endColumnIndex: 2,
    },
    output: {
      cells_type: "line",
      end_type: "open",
      orientation: "vertical",
      num_columns: 2,
      num_rows: null,
    },
  },

  {
    input: {
      startRowIndex: 0,
      startColumnIndex: 0,
      endRowIndex: 2,
    },
    output: {
      cells_type: "line",
      end_type: "open",
      orientation: "horizontal",
      num_columns: null,
      num_rows: 2,
    },
  },

  {
    input: {
      startRowIndex: 0,
      startColumnIndex: 0,
      endRowIndex: 1,
    },
    output: {
      cells_type: "line",
      end_type: "open",
      orientation: "horizontal",
      num_columns: null,
      num_rows: 1,
    },
  },

  {
    input: {
      startRowIndex: 0,
      startColumnIndex: 0,
    },
    output: {
      cells_type: "line",
      end_type: "open",
      orientation: "none",
      num_columns: null,
      num_rows: null,
    },
  },
];

testCases.forEach(({ input, output }) => {
  test(`Measuring grid: ${JSON.stringify(input)} = ${JSON.stringify(
    output
  )}`, () => {
    const result = getGridA1Measures_(input);
    expect(result).toEqual(output);
  });
});
