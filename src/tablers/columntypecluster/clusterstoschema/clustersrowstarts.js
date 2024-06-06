/**
 * @param {Number[][]} possibleFirstRowsMap
 * @param {Number} [headerRow]
 *
 * @returns {Number}
 */
export function getValuesClustersFirstDataRow_(
  possibleFirstRowsMap,
  headerRow
) {
  headerRow = headerRow || 0;
  if (!possibleFirstRowsMap.length) return 0;
  const commonRows = possibleFirstRowsMap.reduce((a, b) =>
    a.filter((c) => b.includes(c))
  );
  const commonRowsBelowHeader = commonRows.filter((r) => r > headerRow);
  return Math.min(...commonRowsBelowHeader);
}
