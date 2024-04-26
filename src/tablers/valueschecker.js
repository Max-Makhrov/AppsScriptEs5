/** @typedef {import("../talbler").RangeValues} RangeValues */

/**
 * @typedef {Object} ValuesCheckResponse
 * @prop {Boolean} is_valid
 * @prop {String} message
 */

/**
 * @constructor
 * @param {RangeValues} values
 */
export function ValuesChecker_(values) {
  const self = this;
  self.values = values;

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

  /**
   * @method
   * @returns {ValuesCheckResponse}
   */
  self.check = function () {
    if (!self.values) return _notValid("No values provided");
    if (!Array.isArray(self.values)) return _notValid("Values is not array");
    if (!self.values.length) return _notValid("Values have no rows");
    if (!self.values[0]) return _notValid("Values have empty row");
    if (!self.values[0].length) return _notValid("Values have no columns");
    const numCols = self.values[0].length;
    for (let i = 1; i < self.values.length; i++) {
      if (self.values[i].length !== numCols) {
        return _notValid("Values are not a rectangle");
      }
    }
    return {
      is_valid: true,
      message: "ok",
    };
  };
}
