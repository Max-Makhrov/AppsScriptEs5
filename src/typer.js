import { typerStore_ } from "./typers/typerstore";
/** @typedef {import("@/typers/gettype").TypeCheckResult} TypeCheckResult */

/**
 * @constructor
 * @param {*} value
 */
export function Typer_(value) {
  const self = this;
  const store = new typerStore_(value);

  /**
   * @method
   * @returns {TypeCheckResult}
   */
  self.getType = function () {
    return store.getType();
  };
}
