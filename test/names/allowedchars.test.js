import { validateFieldNameAllowedDatabaseChars_ } from "@/names/validations/allowedchars";

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
    input: getTestInput_("booo*"),
    is_valid: true,
    suggested_value: "booo",
  },
  {
    input: getTestInput_("booo**"),
    is_valid: true,
    suggested_value: "booo",
  },
  {
    input: getTestInput_("bo oo**"),
    is_valid: true,
    suggested_value: "bo_oo",
  },
  {
    input: getTestInput_("bo*oo**"),
    is_valid: true,
    suggested_value: "booo",
  },
  {
    input: getTestInput_("bo**oo**"),
    is_valid: true,
    suggested_value: "booo",
  },
  {
    input: getTestInput_("bo***oo**"),
    is_valid: false,
    suggested_value: null,
  },
  {
    input: getTestInput_("Добрий вечор"),
    is_valid: false,
    suggested_value: null,
  },
  {
    input: getTestInput_("HELLOmax"),
    is_valid: true,
    suggested_value: "HELLOmax",
  },
  {
    input: getTestInput_("HELLOmax11"),
    is_valid: true,
    suggested_value: "HELLOmax11",
  },
  {
    input: getTestInput_("HELLO____max11"),
    is_valid: true,
    suggested_value: "HELLO____max11",
  },
  {
    input: getTestInput_("HELLO max"),
    is_valid: true,
    suggested_value: "hello_max",
  },
  {
    input: getTestInput_("1234"),
    is_valid: true,
    suggested_value: "1234",
  },
  {
    input: getTestInput_("Peppa_Pig_Is_123_very_biG"),
    is_valid: true,
    suggested_value: "Peppa_Pig_Is_123_very_biG",
  },
  {
    input: getTestInput_("A nice day yeah"),
    is_valid: true,
    suggested_value: "a_nice_day_yeah",
  },
  {
    input: getTestInput_("Whota                  Foo"),
    is_valid: true,
    suggested_value: "whota__________________foo",
  },
  {
    input: getTestInput_("whoTa__________________foo"),
    is_valid: true,
    suggested_value: "whoTa__________________foo",
  },
  {
    input: getTestInput_("who*a__________________foo"),
    is_valid: true,
    suggested_value: "whoa__________________foo",
  },
];

testCases.forEach((value) => {
  test(
    "Test validate for not allowed chars in BQ " + value.input.original_value,
    () => {
      const result = validateFieldNameAllowedDatabaseChars_(value.input);
      console.log(result.message);
      expect(result.is_valid).toBe(value.is_valid);
      expect(result.suggested_value).toBe(value.suggested_value);
    }
  );
});
