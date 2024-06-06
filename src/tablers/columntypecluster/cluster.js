import { validateColumnValuesCluster_ } from "./validatecluster";
/** @typedef {import("@/typers/gettype").BasicDataType} BasicDataType  */
/** @typedef {import("@/typers/gettype").TypeCheckResult} TypeCheckResult */

/**
 * @typedef {Object} SheetsValuesColumnCluster
 * @prop {BasicDataType} type
 * @prop {BasicDataType} [string_like_type]
 * @prop {Number} start_index
 * @prop {Number} end_index
 * @prop {Number} [max_size]
 * @prop {Number} [max_precision]
 * @prop {Number} [max_scale]
 * @prop {Number} [column_index]
 * @prop {Number[]} [indexes_null]
 * @prop {Number} [position]
 */

/**
 * @constructor
 *
 * @param {TypeCheckResult} iniTypeInfo
 * @param {Number} index
 * @param {Number} [columnIndex]
 */
export function ColumnClusterType_(iniTypeInfo, index, columnIndex) {
  const self = this;
  let currentIndex = index - 1;

  /** @type {SheetsValuesColumnCluster} */
  self.info = {
    type: iniTypeInfo.type,
    string_like_type: iniTypeInfo.string_like_type,
    start_index: index,
    end_index: index,
    max_scale: 0,
    max_precision: 0,
    max_size: 0,
    indexes_null: [],
    column_index: columnIndex,
  };

  /**
   * @method
   * @param {TypeCheckResult} typeInfo
   * @param {Boolean} [isNull]
   */
  self.addItem = function (typeInfo, isNull) {
    currentIndex++;
    if (isNull) {
      self.info.indexes_null.push(currentIndex);
      return;
    }
    self.info.end_index = currentIndex;
    if (typeInfo.scale > self.info.max_scale) {
      self.info.max_scale = typeInfo.scale;
    }
    if (typeInfo.precision > self.info.max_precision) {
      self.info.max_precision = typeInfo.precision;
    }
    if (typeInfo.size > self.info.max_size) {
      self.info.max_size = typeInfo.size;
    }
  };

  /**
   * @method
   * @param {Number} [position]
   * @returns {SheetsValuesColumnCluster}
   */
  self.getInfo = function (position) {
    self.info.indexes_null = self.info.indexes_null.filter(
      (elt) => elt <= self.info.end_index
    );
    if (position !== undefined && position !== null)
      self.info.position = position;
    return self.info;
  };

  self.validate = function () {
    return validateColumnValuesCluster_(self.getInfo());
  };

  self.addItem(iniTypeInfo);
}
