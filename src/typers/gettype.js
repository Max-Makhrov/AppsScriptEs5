import { getBasicNumberType_ } from "./getnumbertype";
import { getDateBasicType_ } from "./getdatetype";
import { getStringLikeType_ } from "./getstringliketype";

/**
 * @typedef {'date' | 'datetime' | 'int' | 'number' | 'string' | 'boolean' | 'object' | 'array' | 'null' | 'unknown'} BasicDataType
 */

/**
 * @typedef {Object} TypeCheckResult
 * @prop {BasicDataType} type
 * @prop {BasicDataType} [string_like_type] - type by text if type is text
 * @prop {number} size - The size or length
 * @prop {number} [precision] - The total number of digits (for numeric types).
 * @prop {number} [scale] - The number of digits after the decimal point (for numeric types).
 */

/**
 * @param {*} value
 *
 * @returns {TypeCheckResult}
 */
export function getBasicType_(value) {
  const size = ("" + value).length;
  const jsonValue = JSON.stringify(value) || "";
  const jsonSize = jsonValue.length;
  if (value === null || value === undefined) {
    return {
      type: "null",
      size,
    };
  }

  if (value === true || value === false) {
    return {
      type: "boolean",
      size: jsonSize,
    };
  }

  if (Array.isArray(value)) {
    return {
      type: "array",
      size: jsonSize,
    };
  }

  if (typeof value === "number") {
    return { ...getBasicNumberType_(value), size };
  }

  if (value instanceof Date) {
    return { ...getDateBasicType_(value), size: jsonSize };
  }

  if (value && typeof value === "object" && value.constructor === Object) {
    return {
      type: "object",
      size: jsonSize,
    };
  }

  if (typeof value === "string") {
    return {
      type: "string",
      ...getStringLikeType_(value),
      size,
    };
  }

  return {
    type: "unknown",
    size,
  };
}
