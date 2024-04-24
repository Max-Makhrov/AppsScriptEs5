import { getValidatedRangeA1GridByRanger_ } from "./grid";
import { RangeValidator_ } from "./validator";

/** @typedef {import("./grid").RangeGrid} RangeGrid */
/** @typedef {import("./validator").RangeValidationResults} RangeValidationResults */

/**
 * @constructor
 * @param {string} rangeA1
 */
export function Ranger_(rangeA1) {
  const self = this;
  /** @type {RangeGrid|null} */
  let grid = null;
  const validator = new RangeValidator_(rangeA1);

  /**
   * @method
   * @returns {RangeGrid|null}
   */
  self.grid = function () {
    if (grid) return grid;
    grid = getValidatedRangeA1GridByRanger_(validator);
    return grid;
  };

  /**
   * @returns {RangeValidationResults}
   */
  self.validation = function () {
    return validator.getValidations();
  };
}
