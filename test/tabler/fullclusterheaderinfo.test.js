import { getFullValuesClusterHeaderInfoMap_ } from "@/tablers/columntypecluster/clusterstoschema/fitheaders/fullclusterheadersinfo";

import { getBiggerClusterHeadersByIslands_ } from "@/tablers/columntypecluster/fits/biggerheaderisland";
import { getColumnValueClusterHeaderIslands_ } from "@/tablers/columntypecluster/fits/clusterheaderislands";
import { getAllMatchedColumnValueClutersHeaders_ } from "@/tablers/columntypecluster/fits/getmatchedclustersheaders";
import { reduceFittingClustersByMaxColumnGap_ } from "@/tablers/columntypecluster/fits/notfitclustersbycolumngaps";
import { getColumnValueClustersRowFit_ } from "@/tablers/columntypecluster/fits/getclustersrowfit";
import { getInitialFitColumnValuesClustersInfo_ } from "@/tablers/columntypecluster/fits/getfitclustersoptions";
import { findNextBestFitValuesCluster_ } from "@/tablers/columntypecluster/getnextbestcluster";
import { valueTableSamples } from "./tablesamples";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";

import { expect, test } from "vitest";

const testRectangle = valueTableSamples.MyMy;
const clustersMap = getAllValuesClusters_(testRectangle);
const bestFit1 = findNextBestFitValuesCluster_(clustersMap);
const bestCluster1 = bestFit1.best_cluster;

const info = getInitialFitColumnValuesClustersInfo_(
  bestCluster1,
  testRectangle,
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

test(`Test full info was given once`, () => {
  expect(fullInfo.length).toBeGreaterThan(0);
});

const dummyIslands = JSON.parse(JSON.stringify(islands));
dummyIslands.push(biggestIslands);
const res2 = getBiggerClusterHeadersByIslands_(dummyIslands);
const fullInfo2 = getFullValuesClusterHeaderInfoMap_(res2, withHeaders);

test(`Test full info was given again`, () => {
  expect(fullInfo2.length - fullInfo.length).toBe(1);
});

// console.log(JSON.stringify(fullInfo));
