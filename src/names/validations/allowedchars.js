/** @typedef {import("@/names/getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */

/**
 * @param {ValidatedStringValueResponse} initial
 * @returns {ValidatedStringValueResponse}
 */
export function validateFieldNameAllowedDatabaseChars_(initial) {
  const text = initial.suggested_value;
  const allowedCharsTest = /^[A-Za-z0-9_]*$/.test(text);
  if (allowedCharsTest) {
    return {
      is_valid: true,
      suggested_value: text,
      message: "ok",
    };
  }

  let spaceReplacedLovercase = text.toLowerCase().replace(/ /g, "_");

  const invalidChars = spaceReplacedLovercase.replace(/[A-Za-z0-9_]/g, "");
  let validString = spaceReplacedLovercase.replace(/[^A-Za-z0-9_]/g, "");

  if (validString.length < invalidChars.length) {
    return {
      is_valid: false,
      suggested_value: null,
      message:
        "Given column name is too broad and contains more than a half invalid field name chars.",
    };
  }

  return {
    is_valid: true,
    suggested_value: validString,
    message: "Transformed given text to valid field name",
  };
}
