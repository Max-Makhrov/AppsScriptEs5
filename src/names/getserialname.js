/**
 * @typedef {Object} GetSerialNameOptions
 * @prop {String[]} [other_names]
 * @prop {Boolean} [case_insensitive] - defaults `false`
 * @prop {String} [prefix]
 * @prop {String} [postfix]
 * @prop {Number|null} [chars_limit] - null if no given
 * @prop {Number} [start_index] - defaults to 1, start count from..
 */

/**
 * @typedef {Object} GetSerialNameResponse
 * @prop {String|null} name
 * @prop {Boolean} is_valid
 * @prop {String} [message]
 */

/**
 * @param {String} name
 * @param {GetSerialNameOptions} [options]
 *
 * @returns {GetSerialNameResponse}
 */
export function getSerialName_(name, options) {
  return getSerialNameRecousive_(name, options, null);
}

/**
 * @param {String} name
 * @param {GetSerialNameOptions} [options]
 * @param {String|null} [originalName] - only used inside the function
 *
 * @returns {GetSerialNameResponse}
 */
export function getSerialNameRecousive_(name, options, originalName) {
  /**
   * @param {String} message
   * @returns {GetSerialNameResponse}
   */
  function _same(message) {
    return {
      is_valid: true,
      message,
      name,
    };
  }

  if (!options) {
    return _same("With no options given the result is the same");
  }
  if (!options.other_names) {
    return _same("With no other names given the result is the same");
  }
  if (!options.other_names.length) {
    return _same("With other names empty the result is the same");
  }
  if (options.chars_limit) {
    if (name.length > options.chars_limit) {
      return {
        is_valid: false,
        name: null,
        message: "Name length is > " + options.chars_limit + " chars.",
      };
    }
  }

  /**
   * @param {String} value
   * @param {String} value2
   * @returns {Boolean}
   */
  function _isSameString_(value, value2) {
    if (options.case_insensitive) {
      return value === value2;
    }
    return value.toLowerCase() === value2.toLowerCase();
  }

  const startIndex = options.start_index || 1;
  const prefix = options.prefix || "";
  const postfix = options.postfix || "";
  originalName = originalName || name;

  for (let i = 0; i < options.other_names.length; i++) {
    if (_isSameString_(name, options.other_names[i])) {
      name = originalName + prefix + startIndex + postfix;
      options.start_index = startIndex + 1;
      return getSerialNameRecousive_(name, options, originalName);
    }
  }

  return _same("No conflicting names found");
}
