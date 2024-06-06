import { valueTableSamples } from "./tablesamples";

import { expect, test } from "vitest";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";
import { findNextBestFitValuesCluster_ } from "@/tablers/columntypecluster/getnextbestcluster";
import { getInitialFitColumnValuesClustersInfo_ } from "@/tablers/columntypecluster/fits/getfitclustersoptions";
import { getColumnValueClustersRowFit_ } from "@/tablers/columntypecluster/fits/getclustersrowfit";
import { reduceFittingClustersByMaxColumnGap_ } from "@/tablers/columntypecluster/fits/notfitclustersbycolumngaps";
import { getAllMatchedColumnValueClutersHeaders_ } from "@/tablers/columntypecluster/fits/getmatchedclustersheaders";
import { getColumnValueClusterHeaderIslands_ } from "@/tablers/columntypecluster/fits/clusterheaderislands";
import { getBiggerClusterHeadersByIslands_ } from "@/tablers/columntypecluster/fits/biggerheaderisland";
import { getFullValuesClusterHeaderInfoMap_ } from "@/tablers/columntypecluster/clusterstoschema/fitheaders/fullclusterheadersinfo";
import { getBestValueClustersFullInfoForSchema_ } from "@/tablers/columntypecluster/fits/bestschemaclusters";

const values = valueTableSamples.err5;

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

console.log(JSON.stringify(bestFullInfo)); //

test("Header for all strings is in the right place...", () => {
  expect(bestFullInfo[0].header.row_index).toBe(0);
});
