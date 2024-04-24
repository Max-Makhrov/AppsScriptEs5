import { getValidatedRangeA1GridByRanger_ } from "../src/grid";
import { RangeValidator_ } from "../src/validator";
import { expect, test } from "vitest";

/** @typedef {import("../src/grid").RangeGrid} RangeGrid */

/**
 * @typedef {Object} TestCase
 * @prop {String} rangeA1From
 * @prop {String} rangeA1To
 * @prop {RangeGrid} grid
 */

/** @type {TestCase[]} */
const trueCases = [
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

/** @type {TestCase[]} */
const falseCases = [
  {
    rangeA1From: "AAAA32",
    rangeA1To: "30",
    grid: null,
  },

  {
    rangeA1From: "A1",
    rangeA1To: "",
    grid: null,
  },

  {
    rangeA1From: "A",
    rangeA1To: "1",
    grid: null,
  },

  {
    rangeA1From: "A10000001",
    rangeA1To: "A10000001",
    grid: null,
  },

  {
    rangeA1From: "J1",
    rangeA1To: "A1000001",
    grid: null,
  },

  {
    rangeA1From: "CW1",
    rangeA1To: "A100000",
    grid: null,
  },

  {
    rangeA1From: "AAAA1",
    rangeA1To: "AAAA1",
    grid: null,
  },

  {
    rangeA1From: "Hello",
    rangeA1To: "World",
    grid: null,
  },

  {
    rangeA1From:
      "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
    rangeA1To: "World",
    grid: null,
  },

  {
    rangeA1From: "Hi Bunny",
    rangeA1To: "World",
    grid: null,
  },

  {
    rangeA1From: "A$",
    rangeA1To: "B1",
    grid: null,
  },

  {
    rangeA1From: "A1",
    rangeA1To: "B1$",
    grid: null,
  },

  {
    rangeA1From: "A1",
    rangeA1To: "B$$1",
    grid: null,
  },

  {
    rangeA1From: "A1:",
    rangeA1To: "B1",
    grid: null,
  },
];

trueCases.forEach((c) => {
  test(`Getting validated range grid from cells: ${c.rangeA1From}:${c.rangeA1To}`, () => {
    const rA1 = c.rangeA1From + ":" + c.rangeA1To;
    const validator = new RangeValidator_(rA1);
    const result = getValidatedRangeA1GridByRanger_(validator);
    const isValid = validator.getValidations().is_valid;
    expect(result).toEqual(c.grid);
    expect(isValid).toBe(true);
  });
});

falseCases.forEach((c) => {
  test(`Getting null grid for invalid ranges: ${c.rangeA1From}:${c.rangeA1To}`, () => {
    const rA1 = c.rangeA1From + ":" + c.rangeA1To;
    const validator = new RangeValidator_(rA1);
    const result = getValidatedRangeA1GridByRanger_(validator);
    const isValid = validator.getValidations().is_valid;
    console.log(validator.results.message);
    expect(result).toEqual(c.grid);
    expect(isValid).toBe(false);
  });
});
