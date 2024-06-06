import { checkValuesIsvalidRectangle_ } from "./checkisrectangle";
import { getTheFirstSheetSchema_ } from "./getSchema";

/** @typedef {import("./getSchema").SheetTableSchema} SheetTableSchema  */
/** @typedef {import("../talbler").RangeValues} RangeValues */
/** @typedef {import("./checkisrectangle").ValuesCheckResponse} ValuesCheckResponse */

/**
 * @constructor
 * @param {RangeValues|*} values
 */
export function TablerStore_(values) {
  const self = this;
  self.values = values;
  /** @type {ValuesCheckResponse|null} */
  self.validation = null;

  /**
   * @method
   * @returns {ValuesCheckResponse}
   */
  self.validate = function () {
    if (self.validation) return self.validation;
    self.validation = checkValuesIsvalidRectangle_(self.values);
    return self.validation;
  };

  /**
   * @method
   * @returns {SheetTableSchema|null}
   */
  self.getSchema = function () {
    const validation = self.validate();
    if (!validation.is_valid) {
      return null;
    }
    return getTheFirstSheetSchema_(self.values);
  };
}
