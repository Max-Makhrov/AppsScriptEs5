import { validateDataBaseStringStartsWith_ } from "@/names/validations/databasestartswith";
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
    input: getTestInput_("boooТЕРБРОБ"),
    is_valid: true,
    suggested_value: "boooТЕРБРОБ",
  },
  {
    input: getTestInput_("_/*-!@#$#%%^^12344444"),
    is_valid: true,
    suggested_value: "_/*-!@#$#%%^^12344444",
  },
  {
    input: getTestInput_("Бабабаб"),
    is_valid: false,
    suggested_value: null,
  },
  {
    input: getTestInput_("_"),
    is_valid: true,
    suggested_value: "_",
  },
  {
    input: getTestInput_("A"),
    is_valid: true,
    suggested_value: "A",
  },
  {
    input: getTestInput_("V"),
    is_valid: true,
    suggested_value: "V",
  },
  {
    input: getTestInput_("1b"),
    is_valid: true,
    suggested_value: "_1b",
  },
];

testCases.forEach((value) => {
  test(
    "Test letter underscore validation for " + value.input.original_value,
    () => {
      const result = validateDataBaseStringStartsWith_(value.input);
      expect(result.is_valid).toBe(value.is_valid);
      expect(result.suggested_value).toBe(value.suggested_value);
    }
  );
});
