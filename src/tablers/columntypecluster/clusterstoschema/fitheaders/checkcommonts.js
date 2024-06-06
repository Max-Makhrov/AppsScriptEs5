/**
 *
 * @param {Number[]} rowsToCheck
 * @param {Number} clustersToReduceIndex
 * @param {Number[][][]} allPossibleRowsStart
 *
 * @returns {Boolean}
 */
export function _checkAllGroupsHasCommonRows_(
  rowsToCheck,
  clustersToReduceIndex,
  allPossibleRowsStart
) {
  /**
   *
   * @param {Number[]} inCommonRows
   * @param {Number[]} rowsAgainst
   *
   * @returns {Number[]}
   */
  function _getInCommons_(inCommonRows, rowsAgainst) {
    const inCommon = [];
    inCommonRows.forEach((r) => {
      if (rowsAgainst.indexOf(r) === -1) return;
      inCommon.push(r);
    });
    return inCommon;
  }

  const groupsToCheck = allPossibleRowsStart.filter(
    (el, i) => i !== clustersToReduceIndex
  );
  if (groupsToCheck.length === 0) return true;
  /** @type {Number[][]} */
  let inCommon = [rowsToCheck]; // all rows from the start
  for (let i = 0; i < groupsToCheck.length; i++) {
    /** @type {Number[][]} */
    const rowsAgainsCollection = groupsToCheck[i]; // number[][]
    /** @type {Number[][]} */
    const nextInCommon = [];
    rowsAgainsCollection.forEach((rowsAgainst) => {
      inCommon.forEach((inCommonRows) => {
        const common = _getInCommons_(inCommonRows, rowsAgainst);
        if (common.length === 0) return;
        nextInCommon.push(common);
      });
    });
    inCommon = nextInCommon;
    if (inCommon.length === 0) return false;
  }
  return true;
}
