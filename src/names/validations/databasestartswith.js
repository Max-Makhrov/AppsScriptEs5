/** @typedef {import("@/names/getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */

/**
 * @param {ValidatedStringValueResponse} initial
 * @returns {ValidatedStringValueResponse}
 */
export function validateDataBaseStringStartsWith_(initial) {
  let text = initial.suggested_value;
  if (!/[a-z_]/i.test(text)) {
    return {
      is_valid: false,
      message: "Provided text has no letters and no underscore",
      suggested_value: null,
    };
  }
  if (/^[0-9].*/.test(text)) {
    text = "_" + text;
  }
  return {
    is_valid: true,
    message: "ok",
    suggested_value: text,
  };
}
