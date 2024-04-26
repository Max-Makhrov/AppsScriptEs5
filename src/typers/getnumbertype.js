/** @typedef {'int' | 'number'} BasicNumberType */

/**
 * @typedef {Object} BasicNumberTypeResponse
 * @prop {BasicNumberType} type
 * @prop {number} precision - The total number of digits (for numeric types).
 * @prop {number} scale - The number of digits after the decimal point (for numeric types).
 */

/**
 *
 * @param {Number} number
 * @returns {BasicNumberTypeResponse}
 */
export function getBasicNumberType_(number) {
  const absoluteNumber = Math.abs(number);
  if (Math.round(number) - number === 0) {
    return {
      type: "int",
      precision: Math.round(absoluteNumber).toString().length,
      scale: 0,
    };
  }
  const numberString = absoluteNumber.toString();
  const splitNumber = numberString.split(".");
  return {
    type: "number",
    precision: numberString.replace(".", "").length,
    scale: splitNumber.length > 1 ? splitNumber[1].length : 0,
  };
}
