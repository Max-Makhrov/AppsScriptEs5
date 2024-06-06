import { expect, test } from "vitest";

import { valueTableSamples } from "./tablesamples";
import { getAllFitClustersInfo_ } from "@/tablers/columntypecluster/getallfitclusters";
import { getValuesheaderHeadersRangeGrids_ } from "@/tablers/columntypecluster/grids/headergrids";
import { getValuesClustersRangeGrids_ } from "@/tablers/columntypecluster/grids/clustergrids";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";
import { findNextBestFitValuesCluster_ } from "@/tablers/columntypecluster/getnextbestcluster";
import { getInitialFitColumnValuesClustersInfo_ } from "@/tablers/columntypecluster/fits/getfitclustersoptions";
import { getColumnValueClustersRowFit_ } from "@/tablers/columntypecluster/fits/getclustersrowfit";
import { getDedupedFitColumnValuesCluaters_ } from "@/tablers/columntypecluster/fits/dedupefitclusters";
import { reduceFittingClustersByMaxColumnGap_ } from "@/tablers/columntypecluster/fits/notfitclustersbycolumngaps";
import { getAllMatchedColumnValueClutersHeaders_ } from "@/tablers/columntypecluster/fits/getmatchedclustersheaders";
import { getColumnValueClusterHeaderIslands_ } from "@/tablers/columntypecluster/fits/clusterheaderislands";
import { getBiggerClusterHeadersByIslands_ } from "@/tablers/columntypecluster/fits/biggerheaderisland";
import { getFullValuesClusterHeaderInfoMap_ } from "@/tablers/columntypecluster/clusterstoschema/fitheaders/fullclusterheadersinfo";
import { getBestValueClustersFullInfoForSchema_ } from "@/tablers/columntypecluster/fits/bestschemaclusters";
import { getValuesClustersFirstDataRow_ } from "@/tablers/columntypecluster/clusterstoschema/clustersrowstarts";
import { getValuesClustersLastDataRow_ } from "@/tablers/columntypecluster/clusterstoschema/clustersrowend";
import { getCommonColumnValuesClustersMissingColumns_ } from "@/tablers/columntypecluster/fits/commonmissingrows";
import { getDataValuesClustersMissingColumns_ } from "@/tablers/columntypecluster/fits/missingcolumns";
import { getRichColumnValuesClustersHeaders_ } from "@/tablers/columntypecluster/fits/richheaders";

const values = valueTableSamples.err3;

const clustersMap = getAllValuesClusters_(values);
const bestFit1 = findNextBestFitValuesCluster_(clustersMap, null);
const bestCluster1 = bestFit1.best_cluster;
const info = getInitialFitColumnValuesClustersInfo_(
  bestCluster1,
  values,
  clustersMap
);
const allFitting = getColumnValueClustersRowFit_(info);
const fitting = getDedupedFitColumnValuesCluaters_(allFitting);
const reduced = reduceFittingClustersByMaxColumnGap_(
  fitting,
  bestCluster1,
  info.options.max_skipped_columns
);

const withHeaders = getAllMatchedColumnValueClutersHeaders_(reduced, info);

const islands = getColumnValueClusterHeaderIslands_(
  withHeaders.valid_headers_map,
  withHeaders.possible_rows_map
);
const biggestIslands = getBiggerClusterHeadersByIslands_(islands);
const fullInfo = getFullValuesClusterHeaderInfoMap_(
  biggestIslands,
  withHeaders
);
const bestFullInfo = getBestValueClustersFullInfoForSchema_(fullInfo);

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

const fitResults = {
  clusters: lastRowResponse.matching_clusters,
  row_data_starts: firstRow,
  row_data_ends: lastRowResponse.last_row,
  missing_rows: missingRows,
  missing_columns: missingColumns,
  headers: richHeaders,
};

const headerGrids = getValuesheaderHeadersRangeGrids_(fitResults.headers);

const dataGrids = getValuesClustersRangeGrids_(
  fitResults.clusters,
  fitResults.row_data_starts,
  fitResults.row_data_ends,
  fitResults.missing_rows
);

console.log(JSON.stringify(dataGrids));
console.log(JSON.stringify(headerGrids)); //

test("One column header cluster has detected range A1 header and data", () => {
  expect(headerGrids.length).toBeGreaterThan(0);
  expect(dataGrids.length).toBeGreaterThan(0);
});
