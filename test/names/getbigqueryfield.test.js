import { getBigQueryValidatedFieldName_ } from "@/names/getbigqueryfield";
import { expect, test } from "vitest";
/** @typedef {import("@/names/getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */

/**
 * @typedef {Object} TestCase
 * @prop {String} name
 * @prop {String[]} [previousNames]
 * @prop {String|null} suggested_value
 * @prop {Boolean} is_valid
 */

/**
 * @param {String} char
 * @param {Number} times
 * @returns
 */
function repeatChar(char, times) {
  return Array(times + 1).join(char);
}

/** @type TestCase[] */
const testCases = [
  {
    name: "booo",
    previousNames: [],
    is_valid: true,
    suggested_value: "booo",
  },
  {
    name: "booo",
    is_valid: true,
    suggested_value: "booo",
  },
  {
    name: "Booo",
    is_valid: true,
    suggested_value: "Booo",
  },
  {
    name: "Booo",
    is_valid: true,
    suggested_value: "Booo",
  },
  {
    name: "1Booo",
    is_valid: true,
    suggested_value: "_1Booo",
  },
  {
    name: "1111",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "1111_",
    is_valid: true,
    suggested_value: "_1111_",
  },
  {
    name: "11 11_",
    is_valid: true,
    suggested_value: "_11_11_",
  },
  {
    name: "1 1 1 1_",
    is_valid: true,
    suggested_value: "_1_1_1_1_",
  },
  {
    name: "1 1   1 1_",
    is_valid: true,
    suggested_value: "_1_1___1_1_",
  },
  {
    name: "1 1   1 1 ",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "Вася ти шоnormal table name",
    is_valid: true,
    suggested_value: "__normal_table_name",
  },
  {
    name: "Вnoасrmal tabя le naти шоme",
    is_valid: true,
    suggested_value: "normal_tab_le_na_me",
  },
  {
    name: "___",
    is_valid: true,
    suggested_value: "___",
  },
  {
    name: "BodyMody",
    is_valid: true,
    suggested_value: "BodyMody",
  },
  {
    name: "Body123Mody_",
    is_valid: true,
    suggested_value: "Body123Mody_",
  },
  {
    name: "B123456789",
    is_valid: true,
    suggested_value: "B123456789",
  },
  {
    name: "B12345 6789",
    is_valid: true,
    suggested_value: "b12345_6789",
  },
  {
    name: "HELLO MAX",
    is_valid: true,
    suggested_value: "hello_max",
  },
  {
    name: "HELLO MaX",
    is_valid: true,
    suggested_value: "hello_max",
  },
  {
    name: "_TABLE_HELLO MaX",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "_ROW_TIMESTAMP_HELLO MaX",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "_COLIDENTIFIER",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "__COLIDENTIFIER",
    is_valid: true,
    suggested_value: "__COLIDENTIFIER",
  },
  {
    name: "select",
    is_valid: true,
    suggested_value: "select_",
  },
  {
    name: "SELECT",
    is_valid: true,
    suggested_value: "SELECT_",
  },
  {
    name: "Date",
    is_valid: true,
    suggested_value: "Date_",
  },
  {
    name: "Date",
    is_valid: true,
    previousNames: ["Date"],
    suggested_value: "Date_",
  },
  {
    name: "A",
    is_valid: true,
    previousNames: ["A"],
    suggested_value: "A_1",
  },
  {
    name: "Date",
    is_valid: true,
    previousNames: ["Date_"],
    suggested_value: "Date__1",
  },
  {
    name: "Date ",
    is_valid: true,
    previousNames: ["Date_"],
    suggested_value: "date__1",
  },
  {
    name: "1Date ",
    is_valid: true,
    previousNames: ["_1Date_"],
    suggested_value: "_1date__1",
  },
  {
    name: "Date*",
    is_valid: true,
    previousNames: ["Date_"],
    suggested_value: "date__1",
  },
  {
    name: "Date*",
    is_valid: true,
    previousNames: ["Date_", "date__1", "date__2"],
    suggested_value: "date__3",
  },
  {
    name: "Date*",
    is_valid: true,
    previousNames: ["Date_", "ff", "date__1", "", "date__2"],
    suggested_value: "date__3",
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: "",
    is_valid: false,
    suggested_value: null,
  },
  {
    name: " Date*",
    is_valid: true,
    previousNames: ["_Date", "ff", "date__1", "", "date__2"],
    suggested_value: "_date_1",
  },
  {
    name: repeatChar("d", 300),
    is_valid: true,
    suggested_value: repeatChar("d", 300),
  },
  {
    name: repeatChar("d", 301),
    is_valid: false,
    suggested_value: null,
  },
  {
    name: repeatChar("d", 299),
    previousNames: [repeatChar("d", 299)],
    is_valid: false,
    suggested_value: null,
  },
  {
    name: repeatChar("d", 298),
    previousNames: [repeatChar("d", 298)],
    is_valid: true,
    suggested_value: repeatChar("d", 298) + "_1",
  },
];

testCases.forEach((value) => {
  test("Check valid name for " + value.name, () => {
    const result = getBigQueryValidatedFieldName_(
      value.name,
      value.previousNames
    );
    if (!result.is_valid) {
      console.log(result.message);
    }
    expect(result.suggested_value).toBe(value.suggested_value);
    expect(result.is_valid).toBe(value.is_valid);
  });
});
