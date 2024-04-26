/**
 * Converting colum index to column letter. Start of column index is 0.
 * Ref: https://stackoverflow.com/a/53678158
 * @param {Number} index Column index.
 * @return {String} Column letter.
 */
export function columnIndexToLetters_(index = null) {
  var a;
  return (a = Math.floor(index / 26)) >= 0
    ? columnIndexToLetters_(a - 1) + String.fromCharCode(65 + (index % 26))
    : "";
}
