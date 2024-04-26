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
    },
  },
  {
    input: null,
    output: {
      type: "null",
    },
  },
  {
    input: undefined,
    output: {
      type: "null",
    },
  },
  {
    input: true,
    output: {
      type: "boolean",
    },
  },
  {
    input: false,
    output: {
      type: "boolean",
    },
  },
  {
    input: [],
    output: {
      type: "array",
    },
  },
  {
    input: [{}],
    output: {
      type: "array",
    },
  },
  {
    input: [null],
    output: {
      type: "array",
    },
  },
  {
    input: ["1", "2"],
    output: {
      type: "array",
    },
  },
  {
    input: [{}, {}, {}],
    output: {
      type: "array",
    },
  },
  {
    input: [[], [], []],
    output: {
      type: "array",
    },
  },
  {
    input: [[], new Date(), true],
    output: {
      type: "array",
    },
  },
  {
    input: 0,
    output: {
      type: "int",
      precision: 1,
      scale: 0,
    },
  },
  {
    input: 1,
    output: {
      type: "int",
      precision: 1,
      scale: 0,
    },
  },
  {
    input: 999999999,
    output: {
      type: "int",
      precision: 9,
      scale: 0,
    },
  },
  {
    input: -999999999,
    output: {
      type: "int",
      precision: 9,
      scale: 0,
    },
  },
  {
    input: -999999999.0,
    output: {
      type: "int",
      precision: 9,
      scale: 0,
    },
  },
  {
    input: 1.1,
    output: {
      type: "number",
      precision: 2,
      scale: 1,
    },
  },
  {
    input: 1.123456789,
    output: {
      type: "number",
      precision: 10,
      scale: 9,
    },
  },
  {
    input: 12345678.12345678,
    output: {
      type: "number",
      precision: 16,
      scale: 8,
    },
  },
  {
    input: -12345678.12345678,
    output: {
      type: "number",
      precision: 16,
      scale: 8,
    },
  },
  {
    input: new Date("2023-02-10T04:30:00"),
    output: {
      type: "datetime",
    },
  },
  {
    input: new Date("2023-02-10T00:00:00"),
    output: {
      type: "date",
    },
  },
  {
    input: {},
    output: {
      type: "object",
    },
  },
  {
    input: { getTime: "" },
    output: {
      type: "object",
    },
  },
  {
    input: { 0: "1" },
    output: {
      type: "object",
    },
  },
  {
    input: { 0: null },
    output: {
      type: "object",
    },
  },
  {
    input: () => true,
    output: {
      type: "unknown",
    },
  },

  {
    input: "",
    output: {
      type: "string",
      string_like_type: "null",
    },
  },
  {
    input: "null",
    output: {
      type: "string",
      string_like_type: "null",
    },
  },
  {
    input: "NULl",
    output: {
      type: "string",
      string_like_type: "null",
    },
  },
  {
    input: "TRUE",
    output: {
      type: "string",
      string_like_type: "boolean",
    },
  },
  {
    input: "FALSE",
    output: {
      type: "string",
      string_like_type: "boolean",
    },
  },
  {
    input: "false",
    output: {
      type: "string",
      string_like_type: "boolean",
    },
  },
  {
    input: "TrUe",
    output: {
      type: "string",
      string_like_type: "boolean",
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
    },
  },
  {
    input: "0100-01-30",
    output: {
      type: "string",
      string_like_type: "date",
    },
  },
  {
    input: "0100-01-30 00:00:00",
    output: {
      type: "string",
      string_like_type: "datetime",
    },
  },
  {
    input: "0100-01-30 23:00:00",
    output: {
      type: "string",
      string_like_type: "datetime",
    },
  },
  {
    input: "0100-01-30 23:59:00",
    output: {
      type: "string",
      string_like_type: "datetime",
    },
  },
  {
    input: "0100-01-30 23:59:59",
    output: {
      type: "string",
      string_like_type: "datetime",
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
    },
  },
  {
    input: "100.0000",
    output: {
      type: "string",
      string_like_type: "int",
      precision: 3,
      scale: 0,
    },
  },
  {
    input: "-100.0000",
    output: {
      type: "string",
      string_like_type: "int",
      precision: 3,
      scale: 0,
    },
  },
  {
    input: "-100.0001",
    output: {
      type: "string",
      string_like_type: "number",
      precision: 7,
      scale: 4,
    },
  },
  {
    input: "123456789.0123456789",
    output: {
      type: "string",
      string_like_type: "number",
      precision: 19,
      scale: 10,
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
