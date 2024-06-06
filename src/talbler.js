import { TablerStore_ } from "./tablers/tablerstore";

/**
 * @typedef {Array<Array>} RangeValues
 */
/** @typedef {import("./tablers/getSchema").SheetTableSchema} SheetTableSchema */

/**
 * @constructor
 * @param {RangeValues} values
 */
export function Tabler_(values) {
  const store = new TablerStore_(values);
  const self = this;

  /**
   * @method
   * @returns {SheetTableSchema}
   */
  self.getSchema = function () {
    return store.getSchema();
  };
}
