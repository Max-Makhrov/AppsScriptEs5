// @ts-nocheck

/** @typedef {import("./gettype").TypeCheckResult} TypeCheckResult */
/** @typedef {import("./gettype").BasicDataType} BasicDataType */

/**
 * @param {TypeCheckResult[]} types
 *
 * @returns {TypeCheckResult}
 */
export function getMergeCommonDataTypesType_(types) {
  let maxScale = null;
  let maxPrecision = null;
  let maxSize = 0;

  /** @param {TypeCheckResult} t */
  function _updateMaxMeasures_(t) {
    if (t.precision) {
      maxPrecision = Math.max(t.precision, maxPrecision);
    }
    if (t.scale) {
      maxScale = maxScale || 0;
      maxScale = Math.max(t.scale, maxScale);
    }
    if (t.size) {
      maxSize = maxSize || 0;
      maxSize = Math.max(t.size, maxSize);
    }
  }

  /**
   * @param {TypeCheckResult} t
   * @returns {String}
   */
  function _typeKey_(t) {
    const type = t.type;
    /** @type {String} */
    let stringLikeType = t.string_like_type;
    if (!stringLikeType) stringLikeType = "_";
    return type + "#" + stringLikeType;
  }
  /**
   * @param {TypeCheckResult} t
   * @returns {BasicDataType}
   */
  function _stringLikeTypeKey_(t) {
    let type = t.type;
    if (t.string_like_type) type = t.string_like_type;
    return type;
  }
  const typesObj = {};
  const stringLikeTypes = {};
  types.forEach((type) => {
    const key = _typeKey_(type);
    const stringKey = _stringLikeTypeKey_(type);
    typesObj[key] = type;
    stringLikeTypes[stringKey] = type;
    _updateMaxMeasures_(type);
  });

  /**
   * @param {BasicDataType} type
   * @param {BasicDataType} stringLikeType
   *
   * @returns {TypeCheckResult}
   */
  function _result_(type, stringLikeType) {
    /** @type TypeCheckResult */
    const result = {
      type: type,
      string_like_type: stringLikeType,
      size: maxSize,
    };
    if (maxPrecision) {
      result.precision = maxPrecision;
    }
    if (maxScale) {
      result.scale = maxScale;
    }
    return result;
  }

  // same type merging
  const keys = Object.keys(typesObj);
  if (keys.length === 1) {
    return _result_(types[0].type, types[0].string_like_type);
  }
  /** @type {*} */
  const stringLikeKeys = Object.keys(stringLikeTypes);
  // single string-like type
  if (stringLikeKeys.length === 1) {
    return _result_("string", stringLikeKeys[0]);
  }

  return {
    size: maxSize,
    type: "string",
    string_like_type: "string",
  };
}
