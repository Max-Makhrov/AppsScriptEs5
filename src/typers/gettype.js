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
 * @prop {number} [size] - The size or length (for string types).
 * @prop {number} [precision] - The total number of digits (for numeric types).
 * @prop {number} [scale] - The number of digits after the decimal point (for numeric types).
 */

/**
 * @param {*} value
 *
 * @returns {TypeCheckResult}
 */
export function getBasicType_(value) {
  if (value === null || value === undefined) {
    return {
      type: "null",
    };
  }

  if (value === true || value === false) {
    return {
      type: "boolean",
    };
  }

  if (Array.isArray(value)) {
    return {
      type: "array",
    };
  }

  if (typeof value === "number") {
    return getBasicNumberType_(value);
  }

  if (value instanceof Date) {
    return getDateBasicType_(value);
  }

  if (value && typeof value === "object" && value.constructor === Object) {
    return {
      type: "object",
    };
  }

  if (typeof value === "string") {
    return {
      type: "string",
      ...getStringLikeType_(value),
    };
  }

  return {
    type: "unknown",
  };
}
