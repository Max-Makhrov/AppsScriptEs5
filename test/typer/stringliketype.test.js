import { getStringLikeType_ } from "@/typers/getstringliketype";
import { expect, test } from "vitest";

/** @typedef {import("@/typers/getstringliketype").StringValueTypeResponse} StringValueTypeResponse */

/**
 * @typedef {Object} TestCase
 * @prop {String} input
 * @prop {StringValueTypeResponse} output
 */

/** @type {TestCase[]} */
const testCases = [
  {
    input: "",
    output: {
      string_like_type: "null",
    },
  },
  {
    input: "null",
    output: {
      string_like_type: "null",
    },
  },
  {
    input: "NULl",
    output: {
      string_like_type: "null",
    },
  },
  {
    input: "TRUE",
    output: {
      string_like_type: "boolean",
    },
  },
  {
    input: "FALSE",
    output: {
      string_like_type: "boolean",
    },
  },
  {
    input: "false",
    output: {
      string_like_type: "boolean",
    },
  },
  {
    input: "TrUe",
    output: {
      string_like_type: "boolean",
    },
  },
  {
    input: " ",
    output: {
      string_like_type: "string",
      size: 1,
    },
  },
  {
    input: "null ",
    output: {
      string_like_type: "string",
      size: 5,
    },
  },
  {
    input: "0000-00-00",
    output: {
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "0100-00-00",
    output: {
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "0100-01-00",
    output: {
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "0100-13-01",
    output: {
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "0100-01-32",
    output: {
      string_like_type: "string",
      size: 10,
    },
  },
  {
    input: "2018-01-30",
    output: {
      string_like_type: "date",
    },
  },
  {
    input: "0100-01-30",
    output: {
      string_like_type: "date",
    },
  },
  {
    input: "0100-01-30 00:00:00",
    output: {
      string_like_type: "datetime",
    },
  },
  {
    input: "0100-01-30 23:00:00",
    output: {
      string_like_type: "datetime",
    },
  },
  {
    input: "0100-01-30 23:59:00",
    output: {
      string_like_type: "datetime",
    },
  },
  {
    input: "0100-01-30 23:59:59",
    output: {
      string_like_type: "datetime",
    },
  },
  {
    input: "0100-01-30 23:59:60",
    output: {
      string_like_type: "string",
      size: 19,
    },
  },
  {
    input: "0100-01-30 23:60:59",
    output: {
      string_like_type: "string",
      size: 19,
    },
  },
  {
    input: "0100-01-30 24:59:59",
    output: {
      string_like_type: "string",
      size: 19,
    },
  },
  {
    input: "100",
    output: {
      string_like_type: "int",
      precision: 3,
      scale: 0,
    },
  },
  {
    input: "100.0000",
    output: {
      string_like_type: "int",
      precision: 3,
      scale: 0,
    },
  },
  {
    input: "-100.0000",
    output: {
      string_like_type: "int",
      precision: 3,
      scale: 0,
    },
  },
  {
    input: "-100.0001",
    output: {
      string_like_type: "number",
      precision: 7,
      scale: 4,
    },
  },
  {
    input: "123456789.0123456789",
    output: {
      string_like_type: "number",
      precision: 19,
      scale: 10,
    },
  },
  {
    input: "123 567",
    output: {
      string_like_type: "string",
      size: 7,
    },
  },
  {
    input: "123\n567",
    output: {
      string_like_type: "string",
      size: 7,
    },
  },
];

testCases.forEach((value, i) => {
  test(`Test expocted text-like type"`, () => {
    const res = getStringLikeType_(value.input);
    expect(res).toEqual(value.output);
  });
});
