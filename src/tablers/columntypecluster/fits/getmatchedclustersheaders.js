import { getPossibleColumnClusterHeaders_ } from "../getclusterheaders";
/** @typedef {import("./getclustersrowfit").ClustersRowStartsFitCheckResponse} ClustersRowStartsFitCheckResponse */
/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/
/** @typedef {import("./getfitclustersoptions").FitColumnValuesClustersInfo} FitColumnValuesClustersInfo */

/**
 * @typedef {Object} AllClustersHeadersResponse
 * @prop {SheetColumnNamedClusterHeader[][]} headers_map
 * @prop {SheetColumnNamedClusterHeader[][]} valid_headers_map
 */

/**
 * @typedef {ClustersRowStartsFitCheckResponse & AllClustersHeadersResponse} PossibleSchemaClustersInfo
 */

/**
 * Adds master cluster to the list
 * @param {ClustersRowStartsFitCheckResponse} fitInfo
 * @param {FitColumnValuesClustersInfo} info
 *
 * @returns {PossibleSchemaClustersInfo}
 */
export function getAllMatchedColumnValueClutersHeaders_(fitInfo, info) {
  if (!fitInfo) return null;
  const headersMap = [];
  const validHeadersMap = [];

  const clustersRowFit = fitInfo.clusters_rows_fit.concat(info.master_cluster);
  const possibleRowsMap = fitInfo.possible_rows_map.concat([
    info.master_rows_possible_start,
  ]);

  const foundHeaderColumns = [];
  for (let i = 0; i < clustersRowFit.length; i++) {
    const headers = getPossibleColumnClusterHeaders_(
      info.values,
      clustersRowFit[i]
    );
    const validHaders = headers.filter(
      (header) => header.header_response.is_valid
    );

    headersMap.push(headers);
    if (validHaders.length) {
      validHeadersMap.push(validHaders);
      foundHeaderColumns.push(validHaders[0].column_index);
    }
  }

  const headerClusters = [];
  const startingRowsFit = [];

  clustersRowFit.forEach((cls, i) => {
    const column = cls.column_index;
    if (foundHeaderColumns.indexOf(column) === -1) {
      return;
    }
    headerClusters.push(cls);
    startingRowsFit.push(possibleRowsMap[i]);
  });

  return {
    clusters_rows_fit: headerClusters,
    possible_rows_map: startingRowsFit,
    headers_map: headersMap,
    valid_headers_map: validHeadersMap,
  };
}
