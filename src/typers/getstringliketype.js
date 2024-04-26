import { textAsNumber2Type_ } from "./gettextnumber2type";

/** @typedef {import("./gettype").BasicDataType} BasicDataType */

/**
 * @typedef {Object} StringValueTypeResponse
 * @prop {BasicDataType} string_like_type
 * @prop {number} [size] - The size or length (for string types).
 * @prop {number} [precision] - The total number of digits (for numeric types).
 * @prop {number} [scale] - The number of digits after the decimal point (for numeric types).
 */

/**
 *
 * @param {String} value
 * @returns {StringValueTypeResponse}
 */
export function getStringLikeType_(value) {
  if (value === "") return { string_like_type: "null" };
  const lower = value.toLocaleLowerCase();
  if (lower === "null") return { string_like_type: "null" };

  if (lower === "true" || lower === "false")
    return { string_like_type: "boolean" };

  // TODO => write correct date-time processor. No allow 30th February
  if (
    /^(0[1-9]\d{2}|[1-9]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(
      value
    )
  ) {
    return { string_like_type: "date" };
  }
  if (
    /^(0[1-9]\d{2}|[1-9]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(
      value
    )
  ) {
    return { string_like_type: "datetime" };
  }

  if (/^\d+$/.test(value)) {
    return {
      string_like_type: "int",
      precision: value.length,
      scale: 0,
    };
  }

  if (/^\-?\d+(\.\d+)?$/.test(value)) {
    return {
      ...textAsNumber2Type_(value),
    };
  }

  // ...   // 'object' | 'array' | TODO?
  return {
    string_like_type: "string",
    size: value.length,
  };
}
