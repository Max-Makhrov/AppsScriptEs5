import { validateTextForDisallowedBigQeryFieldPrefixes_ } from "@/names/validations/bigquerydisalowedprefixes";
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
    input: getTestInput_("_TABLE_booo"),
    is_valid: false,
    suggested_value: null,
  },
  {
    input: getTestInput_("_table_booo"),
    is_valid: false,
    suggested_value: null,
  },
  {
    input: getTestInput_("_COLIDENTIFIER_table_booo"),
    is_valid: false,
    suggested_value: null,
  },
  {
    input: getTestInput_("COLIDENTIFIER_table_booo"),
    is_valid: true,
    suggested_value: "COLIDENTIFIER_table_booo",
  },
];

testCases.forEach((value) => {
  test(
    "Test validate for not allowed in BQ prefix " + value.input.original_value,
    () => {
      const result = validateTextForDisallowedBigQeryFieldPrefixes_(
        value.input
      );
      expect(result.is_valid).toBe(value.is_valid);
      expect(result.suggested_value).toBe(value.suggested_value);
    }
  );
});
