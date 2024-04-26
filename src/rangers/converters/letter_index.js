/**
 * Converting colum letter to column index. Start of column index is 0.
 * https://gist.github.com/tanaikech/457b5545a48890ed6dce66d67324ec47
 * @param {String} str Column letter
 * @return {Number} Column index.
 */
export function columnLettersToIndex_(str = null) {
  str = str.toUpperCase();
  let total = -1;
  const l = str.length;
  for (let i = 0; i < str.length; i++) {
    total += (str[i].charCodeAt(0) - 64) * Math.pow(26, l - i - 1);
  }
  return total;
}
