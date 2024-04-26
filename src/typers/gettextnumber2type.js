/**
 * @typedef {'int' | 'number'} BasicDataType
 */

/**
 * @typedef {Object} ScaleAndPrecision
 * @prop {BasicDataType} string_like_type
 * @prop {Number} precision
 * @prop {Number} scale
 */

/**
 *
 * @param {String} value
 * @returns {ScaleAndPrecision}
 */
export function textAsNumber2Type_(value) {
  // remove negative sign, if any, for count
  const numberValue = value.charAt(0) === "-" ? value.substring(1) : value;
  const dotIndex = numberValue.indexOf(".");

  let precision = numberValue.length;
  let scale = 0;
  /** @type {BasicDataType} */
  let type = "number";
  if (dotIndex !== -1) {
    const absValueStr = numberValue.replace(/0+$/, ""); // remove trailing zeros
    if (/\.$/.test(absValueStr)) type = "int";
    precision = absValueStr.replace(".", "").length; // recount precision after removal of zeros
    scale = absValueStr.length - dotIndex - 1; // recount scale after removal of zeros
  } else {
    type = "int";
  }
  return {
    precision,
    scale,
    string_like_type: type,
  };
}
