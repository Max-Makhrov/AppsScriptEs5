import { cellGridsToRangeGrid_ } from "@/rangers/converters/cells_range_grid";
import { cellA1NotationToCellGrid_ } from "@/rangers/converters/cell_grid";
import { expect, test } from "vitest";
// @ts-ignore
/** @typedef {import("@/rangers/grid").RangeGrid} RangeGrid */

/**
 * @typedef {Object} TestCase
 * @prop {String} rangeA1From
 * @prop {String} rangeA1To
 * @prop {RangeGrid} grid
 */

/** @type {TestCase[]} */
const testCases = [
  {
    rangeA1From: "A1",
    rangeA1To: "A1",
    grid: {
      startColumnIndex: 0,
      startRowIndex: 0,
      endColumnIndex: 1,
      endRowIndex: 1,
    },
  },

  {
    rangeA1From: "a15",
    rangeA1To: "b3",
    grid: {
      startColumnIndex: 0,
      startRowIndex: 2,
      endColumnIndex: 2,
      endRowIndex: 15,
    },
  },

  {
    rangeA1From: "a15",
    rangeA1To: "b3",
    grid: {
      startColumnIndex: 0,
      startRowIndex: 2,
      endColumnIndex: 2,
      endRowIndex: 15,
    },
  },

  {
    rangeA1From: "Z30",
    rangeA1To: "B15",
    grid: {
      startRowIndex: 14,
      endRowIndex: 30,
      startColumnIndex: 1,
      endColumnIndex: 26,
    },
  },

  {
    rangeA1From: "Z30",
    rangeA1To: "xxx15",
    grid: {
      startRowIndex: 14,
      endRowIndex: 30,
      startColumnIndex: 25,
      endColumnIndex: 16872,
    },
  },

  {
    rangeA1From: "xxx15",
    rangeA1To: "Z30",
    grid: {
      startRowIndex: 14,
      endRowIndex: 30,
      startColumnIndex: 25,
      endColumnIndex: 16872,
    },
  },

  {
    rangeA1From: "Z30",
    rangeA1To: "x",
    grid: { startRowIndex: 29, startColumnIndex: 23, endColumnIndex: 26 },
  },

  {
    rangeA1From: "X30",
    rangeA1To: "Z",
    grid: { startRowIndex: 29, startColumnIndex: 23, endColumnIndex: 26 },
  },

  {
    rangeA1From: "Z30",
    rangeA1To: "32",
    grid: { startRowIndex: 29, endRowIndex: 32, startColumnIndex: 25 },
  },

  {
    rangeA1From: "Z32",
    rangeA1To: "30",
    grid: { startRowIndex: 29, endRowIndex: 32, startColumnIndex: 25 },
  },
];

testCases.forEach((c) => {
  test(`Getting range grid from cells: ${c.rangeA1From}:${c.rangeA1To}`, () => {
    const c1 = cellA1NotationToCellGrid_(c.rangeA1From);
    const c2 = cellA1NotationToCellGrid_(c.rangeA1To);
    const result = cellGridsToRangeGrid_(c1, c2);
    expect(result).toEqual(c.grid);
  });
});
