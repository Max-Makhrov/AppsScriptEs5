/** @typedef {import("../clusterstoschema/fitheaders/fullclusterheadersinfo").SchemaValuesCluster} SchemaValuesCluster */
/** @typedef {import("../cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/

/**
 * DEDUPE
 *   1. More none-dupe matches
 *   2. Top clusters
 *
 * @param {SchemaValuesCluster[]} bestFullInfo
 *
 * @returns {SchemaValuesCluster[]}
 */
export function getDedupedColumnsValuesClusterFullInfo_(bestFullInfo) {
  if (!bestFullInfo) return [];
  if (!bestFullInfo.length) return [];
  if (!bestFullInfo[0].cluster) return [];
  if (!bestFullInfo[0].header) return [];
  if (!bestFullInfo[0].possible_rows_start) return [];

  const clusters = bestFullInfo.map((nf) => nf.cluster);
  const headers = bestFullInfo.map((nf) => nf.header);
  const rowHeader = headers[0].row_index;
  let possibleRowsStart = bestFullInfo.map((nf) =>
    nf.possible_rows_start.filter((r) => r > rowHeader)
  );

  /**
   *
   * @param {SheetsValuesColumnCluster[]} clstrs
   * @param {SheetColumnNamedClusterHeader[]} hdrs
   * @param {Number[][]} rws
   *
   * @returns {SchemaValuesCluster[]}
   */
  function _res_(clstrs, hdrs, rws) {
    /** @type {SchemaValuesCluster[]} */
    const res = [];
    clstrs.forEach((c, i) => {
      res.push({
        cluster: c,
        header: hdrs[i],
        possible_rows_start: rws[i],
      });
    });
    return res;
  }

  /**
   * @typedef {Object} SingleColumnValuesClusterDupeInfo
   * @prop {Number} column_index
   * @prop {SheetsValuesColumnCluster[]} clusters
   * @prop {Number[][]} rows_start
   * @prop {SheetColumnNamedClusterHeader[]} headers
   */

  let dupesCount = 0;
  /** @type {SingleColumnValuesClusterDupeInfo[]} */
  const allGroups = [];
  /** @type {SheetsValuesColumnCluster[]} */
  const nondupes = [];
  /** @type {Number[][]} */
  const nonDupeRowsStart = [];
  const dupesCheck = {};

  /**
   * @param {SingleColumnValuesClusterDupeInfo[]} grp
   * @param {SheetsValuesColumnCluster} c
   * @param {Number} index
   */
  function _addToGroup_(grp, c, index) {
    const rw = possibleRowsStart[index];
    const hh = headers[index];
    const dp = grp.find((d) => d.column_index == c.column_index);
    if (dp) {
      dp.clusters.push(c);
      dp.rows_start.push(rw);
      dp.headers.push(hh);
      return;
    }
    grp.push({
      clusters: [c],
      column_index: c.column_index,
      rows_start: [rw],
      headers: [hh],
    });
  }

  clusters.forEach((c, i) => {
    _addToGroup_(allGroups, c, i);
    const key = "" + c.column_index;
    if (dupesCheck[key]) {
      dupesCount++;
      return;
    }
    nondupes.push(c);
    nonDupeRowsStart.push(possibleRowsStart[i]);
    dupesCheck[key] = true;
  });
  if (dupesCount === 0) {
    return _res_(clusters, headers, possibleRowsStart);
  }

  /**
   * @param {SheetsValuesColumnCluster} c1
   * @param {SheetsValuesColumnCluster} c2
   *
   * @param {Number[]} rw1
   * @param {Number[]} rw2
   *
   * @returns {Boolean}
   */
  function _2ClustersMatch_(c1, c2, rw1, rw2) {
    if (c1.column_index === c2.column_index) return false;
    let commonRowStart = rw1.findIndex((r) => rw2.includes(r));
    if (commonRowStart === -1) return false;
    return true;
  }

  /**
   * @typedef {Object} DedupedColumnValuasCluatersResponse
   * @prop {SheetsValuesColumnCluster} cluster
   * @prop {Number[]} headers
   * @prop {SheetColumnNamedClusterHeader} headerObj
   */
  /**
   * @param {SingleColumnValuesClusterDupeInfo} grp
   *
   * @returns {DedupedColumnValuasCluatersResponse}
   */
  function _add_(grp) {
    if (grp.clusters.length === 1) {
      return {
        cluster: grp.clusters[0],
        headers: grp.rows_start[0],
        headerObj: grp.headers[0],
      };
    }
    const numMatchesForClusters = [];
    let minRowStart = undefined;
    let maxMatches = 0;
    grp.clusters.forEach((c1, i1) => {
      const rw1 = grp.rows_start[i1];
      let numMatches = 0;
      nondupes.forEach((c2, i2) => {
        const rw2 = nonDupeRowsStart[i2];
        const matches = _2ClustersMatch_(c1, c2, rw1, rw2);
        if (matches) numMatches++;
      });
      numMatchesForClusters.push(numMatches);
      if (numMatches > maxMatches) {
        maxMatches = numMatches;
      }
      if (minRowStart === undefined) {
        minRowStart = c1.start_index;
      } else if (minRowStart > c1.start_index) {
        minRowStart = c1.start_index;
      }
    });

    let indexesFound = [];

    const clustersWithMaxMathces = grp.clusters.filter((c, i) => {
      const matches = numMatchesForClusters[i];
      const match = matches === maxMatches;
      if (match) {
        indexesFound.push(i);
        return true;
      }
      return false;
    });

    if (clustersWithMaxMathces.length === 1) {
      return {
        cluster: clustersWithMaxMathces[0],
        headers: grp.rows_start[indexesFound[0]],
        headerObj: grp.headers[indexesFound[0]],
      };
    }

    indexesFound = [];
    const topClusters = grp.clusters.filter((c, i) => {
      const match = minRowStart === c.start_index;
      if (match) {
        indexesFound.push(i);
        return true;
      }
      return false;
    });

    return {
      cluster: topClusters[0],
      headers: grp.rows_start[indexesFound[0]],
      headerObj: grp.headers[indexesFound[0]],
    };
  }

  /** @type {SheetsValuesColumnCluster[]} */
  const dedupedClusters = [];
  /** @type {Number[][]} */
  const numFinalRowsStart = [];
  /** @type {SheetColumnNamedClusterHeader[]} */
  const finalHeaders = [];
  allGroups.forEach((grp) => {
    const clsGrp = _add_(grp);
    dedupedClusters.push(clsGrp.cluster);
    numFinalRowsStart.push(clsGrp.headers);
    finalHeaders.push(clsGrp.headerObj);
  });

  return _res_(dedupedClusters, finalHeaders, numFinalRowsStart);
}
