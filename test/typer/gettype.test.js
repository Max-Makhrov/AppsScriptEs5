import { getBasicType_ } from "@/typers/gettype";

import { expect, test } from "vitest";

/** @typedef {import("@/typers/gettype").TypeCheckResult} TypeCheckResult */

/**
 * @typedef {Object} TestCase
 * @prop {*} input
 * @prop {TypeCheckResult} output
 */

/** @type {TestCase[]} */
const testCases = [
  {
    input: "",
    output: {
      type: "string",
      string_like_type: "null",
      size: 0,
    },
  },
  {
    input: null,
    output: {
      type: "null",
      size: 4,
    },
  },
  {
    input: undefined,
    output: {
      type: "null",
      size: 9,
    },
  },
  {
    input: true,
    output: {
      type: "boolean",
      size: 4,
    },
  },
  {
    input: false,
    output: {
      type: "boolean",
      size: 5,
    },
  },
  {
    input: [],
    output: {
      type: "array",
      size: 2,
    },
  },
  {
    input: [{}],
    output: {
      type: "array",
      size: 4,
    },
  },
  {
    input: [null],
    output: {
      type: "array",
      size: 6,
    },
  },
  {
    input: ["1", "2"],
    output: {
      type: "array",
      size: 9,
    },
  },
  {
    input: [{}, {}, {}],
    output: {
      type: "array",
      size: 10,
    },
  },
  {
    input: [[], [], []],
    output: {
      type: "array",
      size: 10,
    },
  },
  {
    input: [[], new Date(), true],
    output: {
      type: "array",
      size: 36,
    },
  },
  {
    input: 0,
    output: {
      type: "int",
      precision: 1,
      scale: 0,
      size: 1,
    },
  },
  {
    input: 1,
    output: {
      type: "int",
      precision: 1,
      scale: 0,
      size: 1,
    },
  },
  {
    input: 999999999,
    output: {
      type: "int",
      precision: 9,
      scale: 0,
      size: 9,
    },
  },
  {
    input: -999999999,
    output: {
      type: "int",
      precision: 9,
      scale: 0,
      size: 10,
    },
  },
  {
    input: -999999999.0,
    output: {
      type: "int",
      precision: 9,
      scale: 0,
      size: 10,
    },
  },
  {
    input: 1.1,
    output: {
      type: "number",
      precision: 2,
      scale: 1,
      size: 3,
    },
  },
  {
    input: 1.123456789,
    output: {
      type: "number",
      precision: 10,
      scale: 9,
      size: 11,
    },
  },
  {
    input: 12345678.12345678,
    output: {
      type: "number",
      precision: 16,
      scale: 8,
      size: 17,
    },
  },
  {
    input: -12345678.12345678,
    output: {
      type: "number",
      precision: 16,
      scale: 8,
      size: 18,
    },
  },
  {
    input: new Date("2023-02-10T04:30:00"),
    output: {
      type: "datetime",
      size: 26,
    },
  },
  {
    input: new Date("2023-02-10T00:00:00"),
    output: {
      type: "date",
      size: 26,
    },
  },
  {
    input: {},
    output: {
      type: "object",
      size: 2,
    },
  },
  {
    input: { getTime: "" },
    output: {
      type: "object",
      size: 14,
    },
  },
  {
    input: { 0: "1" },
    output: {
      type: "object",
      size: 9,
    },
  },
  {
    input: { 0: null },
    output: {
      type: "object",
      size: 10,
    },
  },
  {
    input: () => true,
    output: {
      type: "unknown",
      size: 10,
    },
  },

  {
    input: "",
    output: {
      type: "string",
      string_like_type: "null",
      size: 0,
    },
  },
  {
    input: "null",
    output: {
      type: "string",
      string_like_type: "null",
      size: 4,
    },
  },
  {
    input: "NULl",
    output: {
      type: "string",
      string_like_type: "null",
      size: 4,
    },
  },
  {
    input: "TRUE",
    output: {
      type: "string",
      string_like_type: "boolean",
      size: 4,
    },
  },
  {
    input: "FALSE",
    output: {
      type: "string",
      string_like_type: "boolean",
      size: 5,
    },
  },
  {
    input: "false",
    output: {
      type: "string",
      string_like_type: "boolean",
      size: 5,
    },
  },
  {
    input: "TrUe",
    output: {
      type: "string",
      string_like_type: "boolean",
      size: 4,
    },
  },
  {
    input: " ",
    output: {
      type: "string",
      string_like_type: "string",
      size: 1,
    },
  },
  {
    input: "null ",
    output: {
      type: "string",
      string_like_type: "string",
      size: 5,
    },
  },
  {
    input: "0000-00-00",
    output: {
      type: "string",
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "0100-00-00",
    output: {
      type: "string",
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "0100-01-00",
    output: {
      type: "string",
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "0100-13-01",
    output: {
      type: "string",
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "0100-01-32",
    output: {
      type: "string",
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "2018-01-30",
    output: {
      type: "string",
      string_like_type: "date",
      size: 10,
    },
  },
  {
    input: "0100-01-30",
    output: {
      type: "string",
      string_like_type: "date",
      size: 10,
    },
  },
  {
    input: "0100-01-30 00:00:00",
    output: {
      type: "string",
      string_like_type: "datetime",
      size: 19,
    },
  },
  {
    input: "0100-01-30 23:00:00",
    output: {
      type: "string",
      string_like_type: "datetime",
      size: 19,
    },
  },
  {
    input: "0100-01-30 23:59:00",
    output: {
      type: "string",
      string_like_type: "datetime",
      size: 19,
    },
  },
  {
    input: "0100-01-30 23:59:59",
    output: {
      type: "string",
      string_like_type: "datetime",
      size: 19,
    },
  },
  {
    input: "0100-01-30 23:59:60",
    output: {
      type: "string",
      string_like_type: "string",
      size: 19,
    },
  },
  {
    input: "0100-01-30 23:60:59",
    output: {
      type: "string",
      string_like_type: "string",
      size: 19,
    },
  },
  {
    input: "0100-01-30 24:59:59",
    output: {
      type: "string",
      string_like_type: "string",
      size: 19,
    },
  },
  {
    input: "100",
    output: {
      type: "string",
      string_like_type: "int",
      precision: 3,
      scale: 0,
      size: 3,
    },
  },
  {
    input: "100.0000",
    output: {
      type: "string",
      string_like_type: "int",
      precision: 3,
      scale: 0,
      size: 8,
    },
  },
  {
    input: "-100.0000",
    output: {
      type: "string",
      string_like_type: "int",
      precision: 3,
      scale: 0,
      size: 9,
    },
  },
  {
    input: "-100.0001",
    output: {
      type: "string",
      string_like_type: "number",
      precision: 7,
      scale: 4,
      size: 9,
    },
  },
  {
    input: "123456789.0123456789",
    output: {
      type: "string",
      string_like_type: "number",
      precision: 19,
      scale: 10,
      size: 20,
    },
  },
  {
    input: "123 567",
    output: {
      type: "string",
      string_like_type: "string",
      size: 7,
    },
  },
  {
    input: "123\n567",
    output: {
      type: "string",
      string_like_type: "string",
      size: 7,
    },
  },
];

testCases.forEach((value, i) => {
  test(`Get expected type`, () => {
    const res = getBasicType_(value.input);
    expect(res).toEqual(value.output);
  });
});
