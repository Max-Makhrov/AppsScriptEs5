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

const result = getColumnValueClustersRowFit_(info);
test(`Test some results matching row clusters are found`, () => {
  expect(result.clusters_rows_fit.length).toBeGreaterThan(0);
  expect(result.possible_rows_map.length).toBeGreaterThan(0);
});
