/** @typedef {import("../validator").BasicValidation} BasicValidation */

/**
 * @param {String} rangeA1
 *
 * @returns {BasicValidation}
 */
export function validateRangeA1Notation_(rangeA1) {
  /**
   *  @param {String} message
   * @returns {BasicValidation}
   */
  function _bad(message) {
    return {
      is_valid: false,
      message,
    };
  }
  /**
   * @param {String} str
   * @param {RegExp} re
   *
   * @returns {String|null}
   */
  function _regexExtract(str, re) {
    const match = str.match(re);
    return match ? match[0] : null;
  }

  if (typeof rangeA1 !== "string") {
    return _bad("Range must be a string");
  }

  if (rangeA1 === "") {
    return _bad("Range cannot be empty string");
  }

  const unexpectedChar = _regexExtract(rangeA1, /[^$A-Z:0-9]/i);
  if (unexpectedChar) {
    if (unexpectedChar === " ") {
      return _bad("Range has unexpected space: ' '");
    }
    return _bad("Range has unexpected char: " + unexpectedChar);
  }

  if (/:{2,}/.test(rangeA1)) {
    return _bad("Range has more than 1 ':' in a row");
  }

  if (/\${2,}/.test(rangeA1)) {
    return _bad("Range has more than 1 '$' in a row");
  }

  if (/^\d+$/.test(rangeA1)) {
    return _bad("Range cannot be of numbers only");
  }

  if (/^[A-Z]+$/i.test(rangeA1)) {
    return _bad("Range cannot be of letters only");
  }

  if (/^\$+$/.test(rangeA1)) {
    return _bad("Range cannot be of '$' only");
  }

  if (/^:+$/.test(rangeA1)) {
    return _bad("Range cannot be of ':' only");
  }

  if (/^:.*$/.test(rangeA1)) {
    return _bad("Range cannot start with ':'");
  }

  if (/^.*:$/.test(rangeA1)) {
    return _bad("Range cannot end with ':'");
  }

  if (/\$:/.test(rangeA1)) {
    return _bad("Range cannot have lock '$' after colon ':'");
  }

  if (/\$$/.test(rangeA1)) {
    return _bad("Range cannot have lock '$' in the end");
  }

  if (/^\d+[A-Z]+.*/i.test(rangeA1)) {
    return _bad("Range cannot start with number before letter");
  }

  if (/\d+[A-Z]+/i.test(rangeA1)) {
    return _bad("Range cannot have number before letter");
  }

  if (/\d+\$[A-Z]+/i.test(rangeA1)) {
    return _bad("Range cannot have number before '$' and letter");
  }

  if (/\d+\$\d+/i.test(rangeA1)) {
    return _bad("Range cannot have '$' below to numbers");
  }

  if (/[A-Z]+\$[A-Z]+/i.test(rangeA1)) {
    return _bad("Range cannot have '$' below to letters");
  }

  const parts = rangeA1.split(":");
  if (parts.length > 2) {
    return _bad("Range cannot have more than 2 parts: star and ending cell");
  }

  const _ok = {
    is_valid: true,
    message: "ok",
  };

  /**
   * @param {String} str
   * @returns {'cell' | 'column' | 'row'}
   */
  function _getSemiRangeType(str) {
    const cleaned = str.replace(/\$/g, "");
    if (/^\d+$/.test(cleaned)) return "row";
    if (/^[A-Z]+$/i.test(cleaned)) return "column";
    return "cell";
  }

  if (parts.length === 2) {
    const type1 = _getSemiRangeType(parts[0]);
    if (type1 === "cell") return _ok;
    const type2 = _getSemiRangeType(parts[1]);
    if (type2 === "cell") return _ok;
    if (type1 !== type2) {
      return _bad(`Cannot form range from ${type1} and ${type2}`);
    }
  }

  return _ok;
}
