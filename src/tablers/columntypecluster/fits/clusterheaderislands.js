/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/

/**
 * @param {SheetColumnNamedClusterHeader[][]} validHeadersMap
 * @param {Number[][]} possibleFirstDataRows
 *
 * @returns {SheetColumnNamedClusterHeader[][][]} headerIslands - row > island > header
 */
export function getColumnValueClusterHeaderIslands_(
  validHeadersMap,
  possibleFirstDataRows
) {
  /** @type SheetColumnNamedClusterHeader[][][] */
  const result = [];

  let maxHeaderRow = 0;
  possibleFirstDataRows.forEach((rs) => {
    const maxRow = Math.max(...rs);
    const maxHRow = maxRow - 1;
    if (maxHRow > maxHeaderRow) {
      maxHeaderRow = maxHRow;
    }
  });

  const allColumns = [];
  validHeadersMap.forEach((grp) =>
    grp.forEach((h) => {
      const c = h.column_index;
      if (allColumns.indexOf(c) > -1) return;
      allColumns.push(c);
    })
  );

  /**
   * @param {Number} colIndex
   * @param {Number} preColIndex
   *
   * @returns {Boolean}
   */
  function _addToIsland_(colIndex, preColIndex) {
    if (colIndex - preColIndex <= 1) return true;
    for (let x = preColIndex + 1; x < colIndex; x++) {
      if (allColumns.indexOf(x) > -1) return false;
    }
    return true;
  }

  /**
   * @param {SheetColumnNamedClusterHeader[]} headers
   *
   * @returns {SheetColumnNamedClusterHeader[][]} islands
   */
  function _getIslands_(headers) {
    const sortedHeaders = headers.sort(
      (a, b) => a.column_index - b.column_index
    );
    const islands = [];
    let isl = [sortedHeaders[0]];
    let preColIndex = sortedHeaders[0].column_index;
    for (let i = 1; i < sortedHeaders.length; i++) {
      const h = sortedHeaders[i];
      const colIndex = h.column_index;

      if (_addToIsland_(colIndex, preColIndex)) {
        isl.push(h);
      } else {
        islands.push(isl);
        isl = [h];
      }

      preColIndex = colIndex;
    }

    islands.push(isl);
    return islands;
  }

  const knownIndexes = {};
  /**
   * @param {Number} rowIndex
   */
  function _getMatchingHeaders_(rowIndex) {
    if (rowIndex > maxHeaderRow) return;
    if (knownIndexes["" + rowIndex]) return;
    const res = [];
    validHeadersMap.forEach((cls) =>
      cls.forEach((h) => {
        if (h.row_index === rowIndex) res.push(h);
      })
    );
    knownIndexes["" + rowIndex] = true;
    const islands = _getIslands_(res);
    result.push(islands);
  }

  validHeadersMap.forEach((cls) =>
    cls.forEach((h) => {
      const i = h.row_index;
      _getMatchingHeaders_(i);
    })
  );

  const deduped = result.map((coll) => {
    return coll.map((subColl) => {
      const r = [];
      const m = {};
      subColl.forEach((v) => {
        const key = v.row_index + "_" + v.column_index;
        if (m[key]) return;
        m[key] = true;
        r.push(v);
      });
      return r;
    });
  });

  return deduped;
}
