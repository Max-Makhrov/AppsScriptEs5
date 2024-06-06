import { getSerialName_ } from "@/names/getserialname";

import { expect, test } from "vitest";

/** @typedef {import("@/names/getserialname").GetSerialNameOptions} GetSerialNameOptions */

/**
 * @typedef {Object} TestCase
 * @prop {GetSerialNameOptions|null} [options]
 * @prop {String} name
 * @prop {String|null} output
 * @prop {Boolean} [is_valid]
 */

/** @type {TestCase[]} */
const testCases = [
  {
    name: "boooo",
    output: "boooo",
  },
  {
    name: "boooo",
    options: {},
    output: "boooo",
  },
  {
    name: "boooo",
    options: { other_names: null },
    output: "boooo",
  },
  {
    name: "boooo",
    options: { other_names: [] },
    output: "boooo",
  },
  {
    name: "boooo",
    options: { other_names: ["foo", "baz", "bar"] },
    output: "boooo",
  },
  {
    name: "boooo",
    options: { other_names: ["foo", "baz", "bar", "boooo", "meeee"] },
    output: "boooo1",
  },
  {
    name: "boooo",
    options: { other_names: ["foo", "boooo1", "bar", "boooo", "meeee"] },
    output: "boooo2",
  },
  {
    name: "boooo",
    options: { other_names: ["boooo2", "boooo1", "bar", "boooo", "meeee"] },
    output: "boooo3",
  },
  {
    name: "boooo",
    options: { other_names: ["boooo2", "boooo1", "boooo3", "boooo", "meeee"] },
    output: "boooo4",
  },
  {
    name: "boooo",
    options: { other_names: ["boooo2", "boooo1", "boooo3", "boooo", "boooo4"] },
    output: "boooo5",
  },
  {
    name: "Boooo",
    options: { other_names: ["boooo2", "boooo1", "boooo3", "boooo", "boooo4"] },
    output: "Boooo5",
  },
  {
    name: "BoooO",
    options: { other_names: ["boooo2", "boooo1", "boooo3", "boooo", "boooo4"] },
    output: "BoooO5",
  },
  {
    name: "BoOoO",
    options: { other_names: ["boooo2", "boooo1", "boooo3", "boooo", "boooo4"] },
    output: "BoOoO5",
  },
  {
    name: "BoOoO",
    options: {
      other_names: ["boooo2", "boooo1", "boooo3", "boooo", "boooo4"],
      case_insensitive: true,
    },
    output: "BoOoO",
  },
  {
    name: "BoOoO",
    options: {
      other_names: ["boooo2", "BoOoO1", "BoOoO", "boooo", "boooo4"],
      case_insensitive: true,
    },
    output: "BoOoO2",
  },
  {
    name: "BoOoO",
    options: {
      other_names: ["boooo2", "BoOoO1", "BoOoO", "boooo", "boooo4"],
      case_insensitive: true,
      prefix: "(",
      postfix: ")",
    },
    output: "BoOoO(1)",
  },
  {
    name: "BoOoO",
    options: {
      other_names: ["BoOoO(1)", "BoOoO1", "BoOoO", "boooo", "boooo4"],
      case_insensitive: true,
      prefix: "(",
      postfix: ")",
    },
    output: "BoOoO(2)",
    is_valid: true,
  },
  {
    name: "BoOoO",
    options: {
      other_names: ["BoOoO(1)", "BoOoO1", "BoOoO", "boooo", "boooo4"],
      case_insensitive: true,
      prefix: "(",
      postfix: ")",
      chars_limit: 7,
    },
    output: null,
    is_valid: false,
  },
  {
    name: "12345678",
    options: {
      other_names: ["BoOoO(1)", "BoOoO1", "BoOoO", "boooo", "boooo4"],
      case_insensitive: true,
      prefix: "(",
      postfix: ")",
      chars_limit: 7,
    },
    output: null,
    is_valid: false,
  },
  {
    name: "12345678",
    options: {
      other_names: ["BoOoO(1)", "BoOoO1", "BoOoO", "boooo", "boooo4"],
      case_insensitive: true,
      prefix: "(",
      postfix: ")",
      chars_limit: 50,
    },
    output: "12345678",
    is_valid: true,
  },
  {
    name: "BoOoOss",
    options: {
      other_names: ["BoOoO(1)", "BoOoO1", "BoOoO", "boooo", "boooo4"],
      case_insensitive: true,
      prefix: "(",
      postfix: ")",
      chars_limit: 7,
    },
    output: "BoOoOss",
    is_valid: true,
  },
];

testCases.forEach((value) => {
  test("Serial name is correct for " + value.name, () => {
    const result = getSerialName_(value.name, value.options);
    expect(result.name).toBe(value.output);
    if (value.is_valid !== undefined) {
      expect(result.is_valid).toBe(value.is_valid);
    }
    console.log(result.message);
  });
});
