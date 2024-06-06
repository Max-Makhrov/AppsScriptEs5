import { expect, test } from "vitest";
import { valueTableSamples } from "./tablesamples";
import { getAllFitClustersInfo_ } from "@/tablers/columntypecluster/getallfitclusters";
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
import { getValuesClustersFirstDataRow_ } from "@/tablers/columntypecluster/clusterstoschema/clustersrowstarts";
import { getDedupedFitColumnValuesCluaters_ } from "@/tablers/columntypecluster/fits/dedupefitclusters";
import { getDedupedColumnsValuesClusterFullInfo_ } from "@/tablers/columntypecluster/fits/dedupeclusters";

const values = valueTableSamples.Smoke;

const clustersMap = getAllValuesClusters_(values);
const bestFit1 = findNextBestFitValuesCluster_(clustersMap, null);
const bestCluster1 = bestFit1.best_cluster;
const info = getInitialFitColumnValuesClustersInfo_(
  bestCluster1,
  values,
  clustersMap
);
// const allFitting = getColumnValueClustersRowFit_(info);
// const fitting = getDedupedFitColumnValuesCluaters_(allFitting);
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

const dedupedBestFullInfo =
  getDedupedColumnsValuesClusterFullInfo_(bestFullInfo);

console.log("👀iiiiii", JSON.stringify(dedupedBestFullInfo)); //+

const firstRow = getValuesClustersFirstDataRow_(
  bestFullInfo.map((el) => el.possible_rows_start),
  bestFullInfo[0].header.row_index
);

test("Header cannot be below data", () => {
  console.log("👀", firstRow, bestFullInfo[0].header.row_index); //
  expect(firstRow).toBeGreaterThan(bestFullInfo[0].header.row_index);
  expect(firstRow).not.toBeNull();
  expect(firstRow).not.toBe(Infinity);
});
