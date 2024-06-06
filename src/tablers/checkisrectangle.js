/** @typedef {import("../talbler").RangeValues} RangeValues */

/**
 * @typedef {Object} ValuesCheckResponse
 * @prop {Boolean} is_valid
 * @prop {String} message
 */

/**
 * @param {RangeValues|*} values
 * @returns {ValuesCheckResponse}
 */
export function checkValuesIsvalidRectangle_(values) {
  /**
   * @param {String} message
   *
   * @returns {ValuesCheckResponse}
   */
  function _notValid(message) {
    return {
      is_valid: false,
      message,
    };
  }

  if (!values) return _notValid("No values provided");
  if (!Array.isArray(values)) return _notValid("Values is not array");
  if (!values.length) return _notValid("Values have no rows");
  if (!values[0]) return _notValid("Values have empty row");
  if (!values[0].length) return _notValid("Values have no columns");
  const numCols = values[0].length;
  for (let i = 1; i < values.length; i++) {
    if (values[i].length !== numCols) {
      return _notValid("Values are not a rectangle");
    }
  }
  return {
    is_valid: true,
    message: "ok",
  };
}
