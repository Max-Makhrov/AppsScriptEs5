import { getSerialName_ } from "../getserialname";

/** @typedef {import("@/names/getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */

/**
 * @param {ValidatedStringValueResponse} initial
 * @returns {ValidatedStringValueResponse}
 */
export function validateDatabaseValueForDuplicates_(initial) {
  const text = initial.suggested_value;
  const list = initial.previous_values;
  const sameNamesValidation = getSerialName_(text, {
    other_names: list,
    prefix: "_",
  });
  if (!sameNamesValidation.is_valid) {
    return {
      is_valid: false,
      suggested_value: null,
      message: sameNamesValidation.message,
    };
  }
  return {
    is_valid: true,
    suggested_value: sameNamesValidation.name,
    message: "ok",
  };
}
