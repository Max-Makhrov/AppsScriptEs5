import { getBasicType_ } from "@/typers/gettype";
import { ColumnClusterType_ } from "./cluster";
/** @typedef {import("@/talbler").RangeValues} RangeValues */

/** @typedef {import("@/typers/gettype").BasicDataType} BasicDataType  */
/** @typedef {import("@/typers/gettype").TypeCheckResult} TypeCheckResult */
/** @typedef {import ("./cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @param {RangeValues} values
 * @param {Number} columnIndex
 *
 * @returns {SheetsValuesColumnCluster[]}
 */
export function getColumnTableTypeClusters_(values, columnIndex) {
  /**
   * @param {TypeCheckResult} typeInfo
   *
   * @returns {Boolean}
   */
  function _isNullRow(typeInfo) {
    if (typeInfo.type === "null") return true;
    if (typeInfo.string_like_type === "null") return true;
    return false;
  }

  let currentClusterKey = "",
    preClusterKey = "";
  /**
   * @param {TypeCheckResult} typeInfo
   * @param {Boolean} isNull
   * @returns {String}
   */
  function _getClusterKey_(typeInfo, isNull) {
    const key = typeInfo.type + "#" + typeInfo.string_like_type;
    if (currentClusterKey === "") return key;
    if (isNull) return currentClusterKey;
    return key;
  }

  /** @type {ColumnClusterType_} */
  let Cluster = null;
  let isNull = false;
  /** @type {SheetsValuesColumnCluster[]} */
  const result = [];
  let position = 0;
  /**
   * @param {ColumnClusterType_|null} cluster
   */
  function _addClusterToResult_(cluster) {
    if (!cluster) return;
    const validation = cluster.validate();
    if (!validation.is_valid) return;
    result.push(cluster.getInfo(position));
    position++;
  }

  for (let index = 0; index < values.length; index++) {
    const element = values[index][columnIndex];
    const typeInfo = getBasicType_(element);
    isNull = _isNullRow(typeInfo);
    currentClusterKey = _getClusterKey_(typeInfo, isNull);
    if (currentClusterKey !== preClusterKey) {
      _addClusterToResult_(Cluster);
      Cluster = new ColumnClusterType_(typeInfo, index, columnIndex);
    } else if (Cluster) {
      Cluster.addItem(typeInfo, isNull);
    }
    preClusterKey = currentClusterKey;
  }
  _addClusterToResult_(Cluster);

  return result;
}
