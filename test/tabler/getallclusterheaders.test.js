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

const reduced = reduceFittingClustersByMaxColumnGap_(fitting, bestCluster1, 1);

const withHeaders = getAllMatchedColumnValueClutersHeaders_(reduced, info);

test(`Some valid headers are found`, () => {
  expect(withHeaders.valid_headers_map.length).toBeGreaterThan(0);
});

// console.log(JSON.stringify(withHeaders));
