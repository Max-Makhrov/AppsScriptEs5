/** @typedef {import("./fullclusterheadersinfo").SchemaValuesCluster} SchemaValuesCluster */
import { _checkAllGroupsHasCommonRows_ } from "./checkcommonts";

/**
 * @param {SchemaValuesCluster[][]} collection
 *
 * @returns {SchemaValuesCluster[][]}
 */
export function _getReducedColumnValuesClusterCollection_(collection) {
  /** @type {Number[][][]} */
  const allPossibleRowsStart = collection.map((c) => {
    return c.map((e) => e.possible_rows_start);
  });

  /** @type {SchemaValuesCluster[][]} */
  let reducedCollection = [];

  collection.forEach((clustersToReduce, clustersToReduceIndex) => {
    /** @type {Number[][]} */
    const possibleRowsStartsToReduce =
      allPossibleRowsStart[clustersToReduceIndex];
    /** @type {SchemaValuesCluster[]} */
    const clustersToAdd = [];
    clustersToReduce.forEach((cls, clsIndex) => {
      const rowsToCheck = cls.possible_rows_start;
      const hasCommons = _checkAllGroupsHasCommonRows_(
        rowsToCheck,
        clustersToReduceIndex,
        allPossibleRowsStart
      );
      if (!hasCommons) return;
      clustersToAdd.push(cls);
    });
    if (clustersToAdd.length === 0) return;
    reducedCollection.push(clustersToAdd);
  });

  /** @type {Number[][][]} */
  const allReducedRowsStart = reducedCollection.map((c) => {
    return c.map((e) => e.possible_rows_start);
  });

  /**
   * @param {Number} num
   * @param {Number[][][]} allReducedRowsStart
   * @param {Number} groupIndex
   *
   * @returns {Boolean}
   */
  function _isCorrectNumber_(num, allReducedRowsStart, groupIndex) {
    const groupsCheck = allReducedRowsStart.filter((g, i) => i !== groupIndex);
    for (let i = 0; i < groupsCheck.length; i++) {
      const grp = groupsCheck[i];
      const found = grp.find((rws) => {
        return rws.indexOf(num) > -1;
      });
      if (!found) return false;
    }
    return true;
  }

  // reduce rows if not all groups have this row
  reducedCollection = reducedCollection.map((el, groupIndex) => {
    const newEl = [];
    /** @type {Number[][]} */
    el.forEach((e) => {
      const numbers = e.possible_rows_start;
      const fixedNumbers = [];
      numbers.forEach((num) => {
        const isCorrect = _isCorrectNumber_(
          num,
          allReducedRowsStart,
          groupIndex
        );
        if (!isCorrect) return;
        fixedNumbers.push(num);
      });
      if (fixedNumbers.length === 0) return;
      e.possible_rows_start = fixedNumbers;
      newEl.push(e);
    });
    return newEl;
  });

  return reducedCollection;
}
