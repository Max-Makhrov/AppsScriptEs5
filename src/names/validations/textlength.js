/** @typedef {import("@/names/getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */

/**
 * @param {ValidatedStringValueResponse} initial
 *
 * @returns {ValidatedStringValueResponse}
 */
export function validateMaxBigQueryFieldChars_(initial) {
  const maxChars = 300;
  return validateTextMaximumLength_(initial, maxChars);
}

/**
 * @param {ValidatedStringValueResponse} initial
 * @param {number} maxChars
 *
 * @returns {ValidatedStringValueResponse}
 */
function validateTextMaximumLength_(initial, maxChars) {
  const text = initial.suggested_value;
  if (text.length > maxChars) {
    return {
      is_valid: false,
      suggested_value: null,
      message: "Value is longer than maximum allowed " + maxChars + " chars.",
    };
  }
  return {
    is_valid: true,
    suggested_value: text,
    message: "ok",
  };
}
