import { getBigQueryFieldNamingRules_ } from "./validations/bigqueryrules";
import { getValidDatabaseFieldName_ } from "./getvalidatedname";

/** @typedef {import("./getvalidatedname").ValidatedStringValueOptions} ValidatedStringValueOptions */
/** @typedef {import("./getvalidatedname").ValidatedStringValueResponse} ValidatedStringValueResponse */

/**
 * @param {String} name
 * @param {String[]} [previousNames]
 *
 * @returns {ValidatedStringValueResponse}
 */
export function getBigQueryValidatedFieldName_(name, previousNames) {
  const rules = getBigQueryFieldNamingRules_();
  /** @type {ValidatedStringValueOptions} */
  const options = {
    previous_values: previousNames,
    rules,
  };

  const result = getValidDatabaseFieldName_(name, options);
  result.original_value = name;

  return result;
}
