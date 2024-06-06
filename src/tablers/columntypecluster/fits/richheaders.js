import { getSerialName_ } from "@/names/getserialname";

/**
 * @typedef {Object} RichColumnValuesHeader
 * @prop {String} original_value
 * @prop {String} database_value
 * @prop {Number} row_index
 * @prop {Number} column_index
 * @prop {Boolean} is_generic
 */

/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/

/**
 * @param {SheetColumnNamedClusterHeader[]} iniHeaders
 * @param {Number} [charsLimit]
 *
 * @returns {RichColumnValuesHeader[]}
 */
export function getRichColumnValuesClustersHeaders_(
  iniHeaders,
  charsLimit = 500
) {
  /** @type {RichColumnValuesHeader[]} */
  const result = [];
  let nextIndex = 0;

  /**
   * @returns {String}
   */
  function _genericHeader_() {
    nextIndex++;
    return "Col" + nextIndex;
  }

  const prefix = "_";

  const previousValues = [];
  iniHeaders.forEach((h) => {
    let header;
    let isGeneric = false;
    if (h.header_response.is_valid) {
      header = h.header_response.suggested_value.toLowerCase();
    } else {
      header = _genericHeader_();
      isGeneric = true;
    }

    const serialHeader = getSerialName_(header, {
      chars_limit: charsLimit,
      other_names: previousValues,
      prefix,
    });

    if (!serialHeader.is_valid) {
      header = _genericHeader_();
      isGeneric = true;
      header = getSerialName_(header, {
        prefix,
        other_names: previousValues,
      }).name;
    } else {
      header = serialHeader.name;
    }

    result.push({
      column_index: h.column_index,
      database_value: header,
      original_value: h.header_response.original_value,
      row_index: h.row_index,
      is_generic: isGeneric,
    });

    previousValues.push(header);
  });

  return result;
}
