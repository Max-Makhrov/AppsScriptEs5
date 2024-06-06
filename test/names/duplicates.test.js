import { validateDatabaseValueForDuplicates_ } from "@/names/validations/duplicates";
import { expect, test } from "vitest";
/** @typedef {import("@/names/getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */
/** @typedef {import("@/names/getserialname").GetSerialNameOptions} GetSerialNameOptions */

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

/** @type {TestCase[]} */
const testCases = [
  {
    input: { ...getTestInput_("booo"), previous_values: [] },
    is_valid: true,
    suggested_value: "booo",
  },
  {
    input: { ...getTestInput_("booo"), previous_values: ["booo"] },
    is_valid: true,
    suggested_value: "booo_1",
  },
  {
    input: {
      ...getTestInput_("booo"),
      previous_values: ["booo", "booo_1", "booo_2"],
    },
    is_valid: true,
    suggested_value: "booo_3",
  },
  {
    input: {
      ...getTestInput_("booo"),
      previous_values: ["bOoo", "Booo_1", "bOOo_2"],
    },
    is_valid: true,
    suggested_value: "booo_3",
  },
  {
    input: {
      ...getTestInput_("booo"),
      previous_values: ["f", "g", "h"],
    },
    is_valid: true,
    suggested_value: "booo",
  },
  {
    input: {
      ...getTestInput_("Date_"),
      previous_values: ["Date_", "g", "h"],
    },
    is_valid: true,
    suggested_value: "Date__1",
  },
];

testCases.forEach((value) => {
  test("Serial duplicates check ", () => {
    const result = validateDatabaseValueForDuplicates_(value.input);
    expect(result.suggested_value).toBe(value.suggested_value);
    expect(result.is_valid).toBe(value.is_valid);
  });
});
