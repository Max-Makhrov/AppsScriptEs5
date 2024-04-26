import { getBasicType_ } from "./gettype";
/** @typedef {import("./gettype").TypeCheckResult} TypeCheckResult */

/**
 * @constructor
 * @param {*} value
 */
export function typerStore_(value) {
  const self = this;
  self.value = value;
  /** @type {TypeCheckResult} */
  self.type = null;

  /**
   * @method
   * @returns {TypeCheckResult}
   */
  self.getType = function () {
    if (self.type) return self.type;
    self.type = getBasicType_(self.value);
    return self.type;
  };
}
