import { validateRangeGrid_ } from "@/rangers/validators/validate_grid";
import { getGridA1Measures_ } from "@/rangers/validators/grid_measure";
import { expect, test } from "vitest";
// @ts-ignore
/** @typedef {import("@/rangers/grid").RangeGrid} RangeGrid */

/** @type {RangeGrid[]} */
const trueResults = [
  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 1,
    endRowIndex: 1,
  },

  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 1,
    endRowIndex: 2,
  },

  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 2,
    endRowIndex: 1,
  },

  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 2,
    endRowIndex: 2,
  },

  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 2,
    endRowIndex: 2,
  },

  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 2,
  },

  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endRowIndex: 1,
  },

  // edge case cells
  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 10,
    endRowIndex: 1000000,
  },

  // edge case columns
  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 18278,
    endRowIndex: 547,
  },
];

/** @type {RangeGrid[]} */
const falseResults = [
  // last bound is missed
  {
    startRowIndex: 0,
    startColumnIndex: 0,
  },

  // cells limit open row
  {
    startRowIndex: 10000,
    startColumnIndex: 10,
    endColumnIndex: 1000,
  },

  // last column open row
  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 18279,
  },

  // last row open column
  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endRowIndex: 10000001,
  },

  // last row open columns
  {
    startRowIndex: 0,
    startColumnIndex: 9,
    endRowIndex: 1000001,
  },

  // cells more
  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 18278,
    endRowIndex: 548,
  },

  // cells more +
  {
    startRowIndex: 0,
    startColumnIndex: 0,
    endColumnIndex: 10,
    endRowIndex: 1000001,
  },

  // cells more - 1 cell
  {
    startRowIndex: 547,
    startColumnIndex: 18277,
    endColumnIndex: 18278,
    endRowIndex: 548,
  },

  // cell column >
  {
    startRowIndex: 0,
    startColumnIndex: 18278,
    endColumnIndex: 18279,
    endRowIndex: 1,
  },

  // range column >
  {
    startRowIndex: 0,
    startColumnIndex: 18278,
    endColumnIndex: 18279,
    endRowIndex: 2,
  },
];

trueResults.forEach((grid) => {
  test(`validate good ${JSON.stringify(grid)}`, () => {
    const measures = getGridA1Measures_(grid);
    const result = validateRangeGrid_(grid, measures);
    expect(result.is_valid).toBe(true);
  });
});

falseResults.forEach((grid) => {
  test(`validate bad ${JSON.stringify(grid)}`, () => {
    const measures = getGridA1Measures_(grid);
    const result = validateRangeGrid_(grid, measures);
    console.log(result.message);
    expect(result.is_valid).toBe(false);
  });
});
