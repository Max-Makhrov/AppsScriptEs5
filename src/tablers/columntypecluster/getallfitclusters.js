import { getBestValueClustersFullInfoForSchema_ } from "@/tablers/columntypecluster/fits/bestschemaclusters";
import { getFullValuesClusterHeaderInfoMap_ } from "@/tablers/columntypecluster/clusterstoschema/fitheaders/fullclusterheadersinfo";
import { getBiggerClusterHeadersByIslands_ } from "@/tablers/columntypecluster/fits/biggerheaderisland";
import { getColumnValueClusterHeaderIslands_ } from "@/tablers/columntypecluster/fits/clusterheaderislands";
import { getAllMatchedColumnValueClutersHeaders_ } from "@/tablers/columntypecluster/fits/getmatchedclustersheaders";
import { reduceFittingClustersByMaxColumnGap_ } from "@/tablers/columntypecluster/fits/notfitclustersbycolumngaps";
import { getColumnValueClustersRowFit_ } from "@/tablers/columntypecluster/fits/getclustersrowfit";
import { getInitialFitColumnValuesClustersInfo_ } from "@/tablers/columntypecluster/fits/getfitclustersoptions";
import { findNextBestFitValuesCluster_ } from "@/tablers/columntypecluster/getnextbestcluster";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";
import { getValuesClustersFirstDataRow_ } from "./clusterstoschema/clustersrowstarts";
import { getValuesClustersLastDataRow_ } from "./clusterstoschema/clustersrowend";
import { getCommonColumnValuesClustersMissingColumns_ } from "./fits/commonmissingrows";
import { getDataValuesClustersMissingColumns_ } from "./fits/missingcolumns";
import { getRichColumnValuesClustersHeaders_ } from "./fits/richheaders";
import { getDedupedColumnsValuesClusterFullInfo_ } from "./fits/dedupeclusters";

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/** @typedef {import("@/talbler").RangeValues} RangeValues */
/** @typedef {import("./fits/richheaders").RichColumnValuesHeader} RichColumnValuesHeader */

/**
 * @typedef {Object} BestFitClustersInfo
 * @prop {SheetsValuesColumnCluster[]} clusters
 * @prop {Number} row_data_starts
 * @prop {Number} row_data_ends
 * @prop {Number[]} missing_rows
 * @prop {Number[]} missing_columns
 * @prop {RichColumnValuesHeader[]} headers
 */

/**
 * @param {RangeValues} values
 *
 * @returns {BestFitClustersInfo}
 */
export function getAllFitClustersInfo_(values) {
  const clustersMap = getAllValuesClusters_(values);
  const bestFit1 = findNextBestFitValuesCluster_(clustersMap, null);
  const bestCluster1 = bestFit1.best_cluster;
  const info = getInitialFitColumnValuesClustersInfo_(
    bestCluster1,
    values,
    clustersMap
  );
  const fitting = getColumnValueClustersRowFit_(info);

  const reduced = reduceFittingClustersByMaxColumnGap_(
    fitting,
    bestCluster1,
    info.options.max_skipped_columns
  );
  const withHeaders = getAllMatchedColumnValueClutersHeaders_(reduced, info);
  if (!withHeaders) return null;
  const islands = getColumnValueClusterHeaderIslands_(
    withHeaders.valid_headers_map,
    withHeaders.possible_rows_map
  );
  const biggestIslands = getBiggerClusterHeadersByIslands_(islands);
  const fullInfo = getFullValuesClusterHeaderInfoMap_(
    biggestIslands,
    withHeaders
  );
  const bestFullInfoDuped = getBestValueClustersFullInfoForSchema_(fullInfo);
  if (bestFullInfoDuped.length === 0) {
    return null;
  }
  const bestFullInfo =
    getDedupedColumnsValuesClusterFullInfo_(bestFullInfoDuped);

  const firstRow = getValuesClustersFirstDataRow_(
    bestFullInfo.map((el) => el.possible_rows_start),
    bestFullInfo[0].header.row_index
  );

  const bestClusters = bestFullInfo.map((el) => el.cluster);

  const lastRowResponse = getValuesClustersLastDataRow_(bestClusters, info);

  const missingRows = getCommonColumnValuesClustersMissingColumns_(
    lastRowResponse.matching_clusters.map((e) => e.indexes_null)
  );

  const missingColumns = getDataValuesClustersMissingColumns_(
    lastRowResponse.matching_clusters.map((c) => c.column_index)
  );

  const iniHeaders = bestFullInfo.map((e) => e.header);
  const richHeaders = getRichColumnValuesClustersHeaders_(
    iniHeaders,
    info.options.max_header_lenght
  );

  return {
    clusters: lastRowResponse.matching_clusters,
    row_data_starts: firstRow,
    row_data_ends: lastRowResponse.last_row,
    missing_rows: missingRows,
    missing_columns: missingColumns,
    headers: richHeaders,
  };
}
