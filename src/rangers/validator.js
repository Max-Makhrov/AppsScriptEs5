import { validateRangeA1Notation_ } from "./validators/validate_a1";
import { getGridA1Measures_ } from "./validators/grid_measure";
import { validateRangeGrid_ } from "./validators/validate_grid";

/**
 * @typedef {Object} RangeValidationResults
 * @prop {String} message - last message from any of validations
 * @prop {Boolean|null} is_valid
 * @prop {BasicValidation|null} range_validation
 * @prop {BasicValidation|null} grid_validation
 */

/**
 * @typedef {Object} BasicValidation
 * @prop {Boolean} is_valid
 * @prop {String} [message]
 */

/** @typedef {import("./grid").RangeGrid} RangeGrid */
/** @typedef {import("./validators/grid_measure").RangeGridMeasure} RangeGridMeasure */

/**
 * @constructor
 *
 * @param {String} rangeA1
 */
export function RangeValidator_(rangeA1) {
  const self = this;
  self.range_a1 = rangeA1;

  /** @type {RangeValidationResults} */
  self.results = {
    message: "pending",
    is_valid: null,
    range_validation: null,
    grid_validation: null,
  };
  /** @type {RangeGridMeasure|null} */
  self.measures = null;

  /**
   * @method
   * @returns {BasicValidation}
   */
  self.rangeValidate = function () {
    if (self.results.range_validation) return self.results.range_validation;
    const rangeValidation = validateRangeA1Notation_(self.range_a1);
    self.results.range_validation = rangeValidation;
    _updateIsValid(rangeValidation);
    return rangeValidation;
  };

  /**
   * @method
   * @param {RangeGrid} grid
   */
  self.gridValidate = function (grid) {
    if (!self.measures) {
      self.measures = getGridA1Measures_(grid);
    }
    const gridValidation = validateRangeGrid_(grid, self.measures);
    self.results.grid_validation = gridValidation;
    _updateIsValid(gridValidation);
    return gridValidation;
  };

  /**
   * @method
   * @returns {RangeValidationResults}
   */
  self.getValidations = function () {
    return self.results;
  };

  /**
   * @param {BasicValidation} validation
   */
  function _updateIsValid(validation) {
    const isValid = validation.is_valid;
    if (isValid === false) {
      self.results.is_valid = false;
      self.results.message = validation.message;
    }
    if (isValid === true) {
      if (self.results.is_valid === false) return;
      self.results.is_valid = true;
      self.results.message = validation.message;
    }
  }
}
