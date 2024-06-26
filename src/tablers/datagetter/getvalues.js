/** @typedef {import("@/tablers/getSchema").SheetFieldSchema} SheetFieldSchema */

/**
 * @param {Array[][]} values
 * @param {SheetFieldSchema[]} fields
 * @param {Number} rowDataStarts
 * @param {Number} rowDataEnds
 * @param {Number[]} skippingRowIndexes
 *
 */
export function getTablerDataByCoorfinates_(
  values,
  fields,
  rowDataStarts,
  rowDataEnds,
  skippingRowIndexes
) {
  var header = [];
  fields.forEach(function (field) {
    header.push(field.database_value);
  });
  var resultingData = [header];

  /**
   * @param {Number} rowIndex
   */
  function _addToData(rowIndex) {
    if (skippingRowIndexes.indexOf(rowIndex) > -1) return;
    var newRow = [];
    fields.forEach(function (field) {
      var columnIndex = field.column_index;
      newRow.push(values[rowIndex][columnIndex]);
    });
    resultingData.push(newRow);
  }

  for (var i = rowDataStarts; i <= rowDataEnds; i++) {
    _addToData(i);
  }

  return resultingData;
}
