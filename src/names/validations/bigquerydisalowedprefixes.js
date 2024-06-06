/** @typedef {import("@/names/getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */

/**
 * @param {ValidatedStringValueResponse} initial
 * @returns {ValidatedStringValueResponse}
 */
export function validateTextForDisallowedBigQeryFieldPrefixes_(initial) {
  // https://cloud.google.com/bigquery/docs/schemas#column_names
  const disallowedPrefixes = [
    "_TABLE_",
    "_FILE_",
    "_PARTITION",
    "_ROW_TIMESTAMP",
    "__ROOT__",
    "_COLIDENTIFIER",
  ];
  const text = initial.suggested_value;
  const upper = text.toUpperCase();
  for (let index = 0; index < disallowedPrefixes.length; index++) {
    const element = disallowedPrefixes[index];
    if (upper.indexOf(element) === 0) {
      return {
        is_valid: false,
        suggested_value: null,
        message: "Field cannot start with " + element + " in BigQuery",
      };
    }
  }
  return {
    is_valid: true,
    message: "ok",
    suggested_value: text,
  };
}
