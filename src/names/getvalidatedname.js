/**
 * @typedef {Object} ValidatedStringValueResponse
 * @prop {String|null} suggested_value
 * @prop {Boolean} is_valid
 * @prop {String} [message]
 * @prop {String} [original_value]
 * @prop {String[]} [previous_values]
 */

/**
 * @typedef {Object} ValidHeaderRule
 * @prop {String} key
 * @prop {Function} test_function
 * @prop {String} [description]
 * @prop {String} [message] - optional extra message for rule.
 */

/**
 * @typedef {Object} ValidatedStringValueOptions
 * @prop {ValidHeaderRule[]} rules
 * @prop {String[]} previous_values
 */

/**
 * Checks all rules
 * ⚠️Rules order matters as some rules modofy value
 * @param {String} value
 * @param {ValidatedStringValueOptions} [options]
 *
 * @returns {ValidatedStringValueResponse}
 */
export function getValidDatabaseFieldName_(value, options) {
  /**
   * @param {String} message
   * @returns {ValidatedStringValueResponse}
   */
  function _okSame(message) {
    return {
      is_valid: true,
      suggested_value: value,
      message,
      original_value: value,
    };
  }
  /**
   * @param {String} message
   * @param {String} [extra_message]
   * @returns {ValidatedStringValueResponse}
   */
  function _invalid(message, extra_message) {
    if (extra_message) message += ". " + extra_message;
    return {
      is_valid: false,
      suggested_value: null,
      message,
      original_value: value,
    };
  }

  if (!options) return _okSame("No options provided");
  if (!options.rules) return _okSame("No rules to check provided");
  if (!options.rules.length) return _okSame("Rules provided are empty");

  let result = _okSame("Rules are passed, use same name");

  function setResultDefaults_() {
    if (options.previous_values) {
       // @ts-ignore
      result.previous_values = options.previous_values;
    }
    result.original_value = value;
  }

  for (let index = 0; index < options.rules.length; index++) {
    const rule = options.rules[index];
    if (!rule) {
      throw new Error("Cannot validate with null or empty rule");
    }
    if (!rule.test_function) {
      throw new Error("Rule test function is not provided or null");
    }
    if (typeof rule.test_function !== "function") {
      throw new Error("Rule test function is not a function");
    }
    setResultDefaults_();
    result = rule.test_function(result);
    if (!result.is_valid) return _invalid(result.message, rule.message);
  }

  return result;
}
