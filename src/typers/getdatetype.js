/** @typedef {'date' | 'datetime'} BasicDateType */

/**
 * @typedef {Object} BasicDateTypeResponse
 * @prop {BasicDateType} type
 */

/**
 *
 * @param {Date} date
 * @returns {BasicDateTypeResponse}
 */
export function getDateBasicType_(date) {
  if (
    date.getHours() !== 0 ||
    date.getMinutes() !== 0 ||
    date.getSeconds() !== 0
  ) {
    return { type: "datetime" };
  }

  return { type: "date" };
}
