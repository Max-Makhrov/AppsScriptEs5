import { validateForDatabaseReservedNamesList_ } from "@/names/validations/databasereservedwords";
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

/** @type {TestCase[]} */
const testCases = [
  {
    input: getTestInput_("booo"),
    is_valid: true,
    suggested_value: "booo",
  },
  {
    input: getTestInput_("select"),
    is_valid: true,
    suggested_value: "select_",
  },
  {
    input: getTestInput_("SELECT"),
    is_valid: true,
    suggested_value: "SELECT_",
  },
  {
    input: getTestInput_("GET_MASTER_PUBLIC_KEY"),
    is_valid: true,
    suggested_value: "GET_MASTER_PUBLIC_KEY_",
  },
];

testCases.forEach((value) => {
  test(
    "Test validate reserved keyword for  " + value.input.original_value,
    () => {
      const result = validateForDatabaseReservedNamesList_(value.input);
      expect(result.is_valid).toBe(value.is_valid);
      expect(result.suggested_value).toBe(value.suggested_value);
    }
  );
});
