import { validateMaxBigQueryFieldChars_ } from "@/names/validations/textlength";

import { expect, test } from "vitest";

/** @typedef {import("@/names/getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */

/**
 * @typedef {Object} TestCase
 * @prop {ValidatedStringValueResponse} input
 * @prop {Boolean} is_valid
 * @prop {String|null} suggested_value
 */

/**
 * @prop {String} text
 * @returns {ValidatedStringValueResponse}
 */
function getTestInput_(text) {
  return {
    is_valid: true,
    suggested_value: text,
    original_value: text,
    message: "ok",
  };
}

/**
 * @param {String} char
 * @param {Number} times
 * @returns
 */
function repeatChar(char, times) {
  return Array(times + 1).join(char);
}

/** @type {TestCase[]} */
const testCases = [
  {
    input: getTestInput_("booo"),
    is_valid: true,
    suggested_value: "booo",
  },
  {
    input: getTestInput_(repeatChar("b", 300)),
    is_valid: true,
    suggested_value: repeatChar("b", 300),
  },
  {
    input: getTestInput_(repeatChar("b", 301)),
    is_valid: false,
    suggested_value: null,
  },
  {
    input: getTestInput_(repeatChar("b", 3001)),
    is_valid: false,
    suggested_value: null,
  },
];

testCases.forEach((value, i) => {
  test("Test letter underscore validation #" + i, () => {
    const result = validateMaxBigQueryFieldChars_(value.input);
    expect(result.is_valid).toBe(value.is_valid);
    expect(result.suggested_value).toBe(value.suggested_value);
  });
});
